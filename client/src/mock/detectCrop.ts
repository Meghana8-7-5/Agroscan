/* AgroScan / Field Notes: mock-only detection data keeps the UI demonstrable until the ML endpoint is available. */
export type DetectionResult = {
  disease: string;
  crop: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  organic: string[];
  chemical: string[];
  preventive: string[];
};

const samples: DetectionResult[] = [
  {
    disease: "Leaf blight",
    crop: "Tomato",
    confidence: 94,
    severity: "Moderate",
    organic: ["Remove the most affected leaves and keep them away from the field.", "Apply a neem-oil spray in the cooler evening hours."],
    chemical: ["Use a labelled copper-based fungicide at the recommended dilution.", "Do not mix products unless the label says they are compatible."],
    preventive: ["Water at the soil line instead of wetting the leaves.", "Leave enough space for air to move between plants."],
  },
  {
    disease: "Aphids",
    crop: "Chilli",
    confidence: 91,
    severity: "Low",
    organic: ["Wash the underside of leaves with a gentle water spray.", "Encourage ladybirds and other beneficial insects."],
    chemical: ["Use an approved insecticidal soap or labelled neem formulation.", "Follow the waiting period written on the product label."],
    preventive: ["Check new growth twice a week for clusters of small insects.", "Remove weeds that can carry aphids near the crop."],
  },
  {
    disease: "Powdery mildew",
    crop: "Maize",
    confidence: 87,
    severity: "Moderate",
    organic: ["Trim heavily affected leaves and improve the space between plants.", "A labelled bicarbonate or sulphur-based organic treatment may help."],
    chemical: ["Choose a locally approved fungicide labelled for powdery mildew.", "Rotate active ingredients to reduce resistance risk."],
    preventive: ["Avoid excess nitrogen where the crop already looks lush.", "Inspect shaded areas first; mildew likes still, humid air."],
  },
  {
    disease: "Stem borer",
    crop: "Paddy",
    confidence: 82,
    severity: "High",
    organic: ["Remove and destroy dead-hearted tillers where practical.", "Use pheromone traps and maintain clean bunds."],
    chemical: ["Use only a locally registered product for stem borer in paddy.", "Keep the label and protective equipment guidance beside the sprayer."],
    preventive: ["Plant at the recommended spacing and avoid excess nitrogen.", "Watch for dead hearts and white ears during the next field walk."],
  },
  {
    disease: "Nutrient stress",
    crop: "Paddy",
    confidence: 76,
    severity: "Low",
    organic: ["Add well-decomposed compost if soil tests show low organic matter.", "Keep irrigation even while the crop recovers."],
    chemical: ["Use a soil-test-led micronutrient input rather than a guess.", "Apply only the recommended dose for the crop stage."],
    preventive: ["Record leaf color changes in the crop plan.", "Test soil before the next major fertilizer application."],
  },
];

export function detectCrop(_image?: File): Promise<DetectionResult> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(samples[Math.floor(Math.random() * samples.length)]), 1500);
  });
}
