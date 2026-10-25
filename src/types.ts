export type ViewKey = 'dashboard' | 'building' | 'planner' | 'analysis' | 'report';

export type Obstacle = {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ModelState = {
  fileName: string;
  format: string;
  sizeMb: number;
  loading: boolean;
  ready: boolean;
  error: string | null;
  dimensions: { width: number; height: number; depth: number } | null;
  unitStatus: 'unknown' | 'meters' | 'user-confirmed';
  metadata: string[];
};

export type FinancialInputs = {
  panelCost: number;
  inverterCost: number;
  installCost: number;
  otherCost: number;
  tariff: number;
  selfConsumption: number;
  maintenance: number;
  currency: string;
};

export type AssessmentState = {
  projectName: string;
  buildingType: string;
  emirate: string;
  location: string;
  createdAt: string;
  roofLength: number;
  roofWidth: number;
  roofAzimuth: number;
  annualDemand: number;
  notes: string;
  model: ModelState;
  roofPlan: {
    zoneX: number;
    zoneY: number;
    zoneWidth: number;
    zoneHeight: number;
    obstacles: Obstacle[];
  };
  panel: {
    moduleArea: number;
    ratedPowerW: number;
    spacing: number;
    yieldKwhPerKw: number;
  };
  financial: FinancialInputs;
};
