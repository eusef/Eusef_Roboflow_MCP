import { getApiEndpoint } from "./endpoints.js";
import { getAuthHeaders } from "./auth.js";
import { RoboflowApiError, ErrorCodes } from "./errors.js";

export interface RateLimitInfo {
  remaining: number | null;
  limit: number | null;
  resetAt: string | null;
}

export interface ClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export class RoboflowClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private _rateLimit: RateLimitInfo = {
    remaining: null,
    limit: null,
    resetAt: null,
  };

  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? getApiEndpoint();
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  /** Most recent rate limit info parsed from response headers. */
  get rateLimit(): Readonly<RateLimitInfo> {
    return this._rateLimit;
  }

  /**
   * Send a GET request to the Roboflow API.
   */
  async get<T = unknown>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = this.buildUrl(path, {
      ...params,
      api_key: this.apiKey,
    });
    return this.request<T>(url, { method: "GET" });
  }

  /**
   * Send a POST request to the Roboflow API.
   */
  async post<T = unknown>(
    path: string,
    body: unknown,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = this.buildUrl(path, {
      ...params,
      api_key: this.apiKey,
    });
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * Send a request to an arbitrary URL (e.g. inference endpoints on different hosts).
   */
  async requestUrl<T = unknown>(
    url: string,
    options: { method: "GET" | "POST"; body?: string }
  ): Promise<T> {
    const separator = url.includes("?") ? "&" : "?";
    const fullUrl = `${url}${separator}api_key=${encodeURIComponent(this.apiKey)}`;
    return this.request<T>(fullUrl, options);
  }

  // ---- Private ----

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const url = new URL(path, this.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    url: string,
    init: { method: string; body?: string }
  ): Promise<T> {
    const headers = getAuthHeaders(this.apiKey);

    let response: Response;
    try {
      response = await fetch(url, {
        method: init.method,
        headers,
        body: init.body,
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        throw new RoboflowApiError(
          `Request timed out after ${this.timeoutMs}ms: ${init.method} ${url}`,
          ErrorCodes.NETWORK_TIMEOUT
        );
      }
      throw new RoboflowApiError(
        `Network error: ${err instanceof Error ? err.message : String(err)}`,
        ErrorCodes.NETWORK_UNREACHABLE
      );
    }

    this.parseRateLimitHeaders(response.headers);

    if (response.status === 401) {
      throw new RoboflowApiError(
        "Invalid API key.",
        ErrorCodes.AUTH_INVALID_KEY
      );
    }

    if (response.status === 404) {
      throw new RoboflowApiError(
        `Resource not found: ${url}`,
        ErrorCodes.MODEL_NOT_FOUND
      );
    }

    if (response.status === 429) {
      throw new RoboflowApiError(
        "Rate limit exceeded.",
        ErrorCodes.QUOTA_RATE_LIMITED
      );
    }

    if (response.status === 402) {
      throw new RoboflowApiError(
        "Quota exceeded for this billing period.",
        ErrorCodes.QUOTA_EXCEEDED
      );
    }

    if (!response.ok) {
      let detail = "";
      try {
        const body = await response.text();
        detail = body.slice(0, 500);
      } catch {
        // ignore
      }
      throw new RoboflowApiError(
        `Roboflow API error (HTTP ${response.status}): ${detail}`,
        ErrorCodes.NETWORK_UNREACHABLE
      );
    }

    return (await response.json()) as T;
  }

  private parseRateLimitHeaders(headers: Headers): void {
    const remaining = headers.get("X-RateLimit-Remaining");
    const limit = headers.get("X-RateLimit-Limit");
    const reset = headers.get("X-RateLimit-Reset");

    this._rateLimit = {
      remaining: remaining !== null ? parseInt(remaining, 10) : null,
      limit: limit !== null ? parseInt(limit, 10) : null,
      resetAt: reset,
    };
  }
}
