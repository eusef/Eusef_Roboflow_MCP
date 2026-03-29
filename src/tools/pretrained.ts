import type { PretrainedListInput } from "../schemas/index.js";

interface PretrainedModelEntry {
  id: string;
  name: string;
  task_type: "ocr" | "detection" | "classification" | "segmentation";
  description: string;
  classes: string[];
  docs_url: string;
  example_use_cases: string[];
}

const PRETRAINED_CATALOG: PretrainedModelEntry[] = [
  {
    id: "ocr",
    name: "OCR / Text Extraction",
    task_type: "ocr",
    description:
      "Extract text from images including documents, signs, labels, and screens.",
    classes: ["text"],
    docs_url: "https://docs.roboflow.com/api-reference/ocr",
    example_use_cases: [
      "Reading text from product labels",
      "Extracting data from forms or receipts",
      "Reading license plates",
      "Digitizing handwritten notes",
    ],
  },
  {
    id: "people-detection",
    name: "People Detection",
    task_type: "detection",
    description:
      "Detect and locate people in images. Works across various poses, clothing, and environments.",
    classes: ["person"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Counting people in a space",
      "Monitoring occupancy",
      "Safety zone monitoring",
      "Retail analytics",
    ],
  },
  {
    id: "license-plate-detection",
    name: "License Plate Detection",
    task_type: "detection",
    description:
      "Detect and locate license plates on vehicles. Pair with OCR for text extraction.",
    classes: ["license-plate"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Parking lot management",
      "Toll booth automation",
      "Vehicle identification",
      "Traffic monitoring",
    ],
  },
  {
    id: "ppe-detection",
    name: "PPE Detection",
    task_type: "detection",
    description:
      "Detect personal protective equipment including hard hats, safety vests, and safety glasses.",
    classes: ["hard-hat", "safety-vest", "safety-glasses", "no-hard-hat", "no-safety-vest"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Construction site safety compliance",
      "Manufacturing floor monitoring",
      "Workplace safety audits",
      "Automated PPE checks at entry points",
    ],
  },
  {
    id: "bird-detection",
    name: "Bird Detection",
    task_type: "detection",
    description: "Detect and locate birds in images. Useful for wildlife monitoring and conservation.",
    classes: ["bird"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Wildlife population monitoring",
      "Bird strike prevention at airports",
      "Ecological research",
      "Birdwatching assistance",
    ],
  },
  {
    id: "fish-detection",
    name: "Fish Detection",
    task_type: "detection",
    description: "Detect and locate fish in underwater or surface images.",
    classes: ["fish"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Aquaculture monitoring",
      "Fish counting in streams",
      "Marine research",
      "Fishing industry automation",
    ],
  },
  {
    id: "barcode-detection",
    name: "Barcode Detection",
    task_type: "detection",
    description: "Detect and locate barcodes and QR codes in images.",
    classes: ["barcode", "qr-code"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Inventory management",
      "Package sorting",
      "Retail checkout automation",
      "Asset tracking",
    ],
  },
  {
    id: "blur-people",
    name: "Blur People (Privacy)",
    task_type: "segmentation",
    description:
      "Detect and blur people in images for privacy compliance (GDPR, CCPA).",
    classes: ["person"],
    docs_url: "https://docs.roboflow.com/api-reference/segmentation",
    example_use_cases: [
      "Street-view imagery anonymization",
      "Security footage privacy",
      "Real estate listing photos",
      "Public dataset anonymization",
    ],
  },
  {
    id: "logistics-package-detection",
    name: "Logistics Package Detection",
    task_type: "detection",
    description: "Detect packages, boxes, and parcels in logistics environments.",
    classes: ["package", "box", "pallet"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Warehouse automation",
      "Package counting on conveyor belts",
      "Loading dock monitoring",
      "Last-mile delivery verification",
    ],
  },
  {
    id: "ceramic-defect-detection",
    name: "Ceramic Defect Detection",
    task_type: "detection",
    description: "Detect surface defects on ceramic products including cracks, chips, and discoloration.",
    classes: ["crack", "chip", "discoloration", "scratch"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Quality control on production lines",
      "Tile manufacturing inspection",
      "Pottery quality assessment",
    ],
  },
  {
    id: "metal-defect-detection",
    name: "Metal Defect Detection",
    task_type: "detection",
    description: "Detect surface defects on metal parts including scratches, dents, corrosion, and weld defects.",
    classes: ["scratch", "dent", "corrosion", "weld-defect", "pit"],
    docs_url: "https://docs.roboflow.com/api-reference/detection",
    example_use_cases: [
      "Automotive parts inspection",
      "Steel manufacturing QC",
      "Weld quality verification",
      "Aerospace component inspection",
    ],
  },
];

export function pretrainedList(input: PretrainedListInput) {
  const task = input.task ?? "all";

  const filtered =
    task === "all"
      ? PRETRAINED_CATALOG
      : PRETRAINED_CATALOG.filter((m) => m.task_type === task);

  return {
    models: filtered,
    message:
      filtered.length > 0
        ? `Found ${filtered.length} pre-trained model(s). These are production-ready and require no training. Use roboflow_inference_run with the model ID to test.`
        : `No pre-trained models found for task type '${task}'.`,
  };
}
