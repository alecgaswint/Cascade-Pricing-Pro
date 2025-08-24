
export interface AppSettings {
  monthlyOverhead: number;
  workingDaysPerMonth: number;
  billableHoursProject: number;
  billableHoursMaintenance: number;
  baseLaborRate: number;
  profitMaintenance: number;
  profitProject: number;
  minChargeMaintenance: number;
  minChargeProject: number;
  mileageRate: number;
}

export interface Service {
  id: string;
  category: string;
  serviceName: string;
  estimatedLaborTime: number;
  crewSize: number;
  equipmentEmbeddedCosts: number;
}

export interface Material {
  id: string;
  materialName: string;
  defaultUnitCost: number;
  defaultMarkupPercent: number;
}

export interface FrozenRates {
  laborRate: number;
  overheadMaintenance: number;
  overheadProject: number;
  mileageRate: number;
}

export interface Bid {
  id: string;
  bidId: string;
  clientName: string;
  address: string;
  jobType: 'Maintenance' | 'Project';
  status: 'Proposed' | 'Accepted' | 'Completed';
  salesTaxMultiplier: number;
  createdAt: Date; // Using Date for timestamp
  frozenRates: FrozenRates;
  lineItems: any[]; // Define a more specific interface for LineItem if needed
  travel: { [key: string]: any }; // Using a map type
  totals: { [key: string]: any }; // Using a map type
}
