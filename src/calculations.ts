import type { AssessmentState } from './types';

export type ScenarioResult = {
  label: string;
  usableArea: number;
  moduleCount: number;
  capacityKwp: number;
  annualGeneration: number;
  generationToDemandRatio: number;
  costEstimate: number;
  netSavings: number;
};

export function calculateScenario(base: AssessmentState, mode: 'baseline' | 'scenarioA' | 'scenarioB'): ScenarioResult {
  const grossRoofArea = base.roofLength * base.roofWidth;
  const blocked = base.roofPlan.obstacles.reduce((sum, item) => sum + item.width * item.height, 0);
  const usableArea = Math.max(0, grossRoofArea - blocked - 40);
  const zoneArea = Math.max(0, base.roofPlan.zoneWidth * base.roofPlan.zoneHeight);
  const effectiveArea = Math.max(0, Math.min(usableArea, zoneArea));

  const areaFactor = mode === 'baseline' ? 0.05 : mode === 'scenarioA' ? 0.75 : 0.9;
  const moduleArea = mode === 'baseline' ? base.panel.moduleArea : base.panel.moduleArea;
  const ratedPower = mode === 'baseline' ? 0 : mode === 'scenarioA' ? base.panel.ratedPowerW : 420;
  const energyYield = mode === 'baseline' ? 0 : mode === 'scenarioA' ? base.panel.yieldKwhPerKw : 1540;

  const adjustedArea = effectiveArea * areaFactor;
  const moduleCount = Math.max(0, Math.floor(adjustedArea / moduleArea));
  const capacityKwp = (moduleCount * ratedPower) / 1000;
  const annualGeneration = capacityKwp * energyYield;
  const generationToDemandRatio = base.annualDemand > 0 ? (annualGeneration / base.annualDemand) * 100 : 0;

  const costEstimate =
    base.financial.panelCost * moduleCount +
    base.financial.inverterCost +
    base.financial.installCost +
    base.financial.otherCost;

  const annualBillSavings = (annualGeneration * (base.financial.selfConsumption / 100)) * (base.financial.tariff / 1000);
  const annualNetSavings = annualBillSavings - base.financial.maintenance;

  return {
    label: mode === 'baseline' ? 'Baseline' : mode === 'scenarioA' ? 'Scenario A' : 'Scenario B',
    usableArea: adjustedArea,
    moduleCount,
    capacityKwp,
    annualGeneration,
    generationToDemandRatio,
    costEstimate,
    netSavings: annualNetSavings,
  };
}

export function getDashboardMetrics(assessment: AssessmentState) {
  const grossRoofArea = assessment.roofLength * assessment.roofWidth;
  const blockedArea = assessment.roofPlan.obstacles.reduce((sum, item) => sum + item.width * item.height, 0);
  const candidate = Math.max(0, grossRoofArea - blockedArea);
  const scenarioA = calculateScenario(assessment, 'scenarioA');
  const scenarioB = calculateScenario(assessment, 'scenarioB');
  const moduleCount = Math.max(scenarioA.moduleCount, scenarioB.moduleCount);

  return {
    grossRoofArea,
    candidateArea: candidate,
    bestModuleCount: moduleCount,
    bestCapacity: Math.max(scenarioA.capacityKwp, scenarioB.capacityKwp),
    annualGeneration: Math.max(scenarioA.annualGeneration, scenarioB.annualGeneration),
  };
}
