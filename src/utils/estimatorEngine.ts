/**
 * Rounds a number to two decimal places.
 * @param value The number to round.
 * @returns The rounded number.
 */
export const roundMoney = (value: number): number => {
  return Math.round((value + Number.EPSILON) * 100) / 100;
};

/**
 * Calculates the overhead cost per hour.
 * @param monthlyOverhead The total monthly overhead cost.
 * @param workingDays The number of working days in a month.
 * @param billableHoursPerDay The number of billable hours per day.
 * @returns The overhead cost per hour.
 */
export const calculateOverheadPerHour = (
  monthlyOverhead: number,
  workingDays: number,
  billableHoursPerDay: number
): number => {
  if (workingDays <= 0 || billableHoursPerDay <= 0) {
    return 0;
  }
  const overheadRate = monthlyOverhead / (workingDays * billableHoursPerDay);
  return roundMoney(overheadRate);
};

/**
 * Calculates the total cost of a service.
 * @param estHours The estimated hours for the service.
 * @param crewSize The number of people in the crew.
 * @param laborRate The labor rate per hour per person.
 * @param overheadRate The overhead rate per hour.
 * @param equipmentCostPerHour The equipment cost per hour.
 * @returns The total service cost.
 */
export const calculateServiceCost = (
  estHours: number,
  crewSize: number,
  laborRate: number,
  overheadRate: number,
  equipmentCostPerHour: number
): number => {
  const serviceCost =
    estHours * crewSize * (laborRate + overheadRate + equipmentCostPerHour);
  return roundMoney(serviceCost);
};

/**
 * Calculates the total cost of materials.
 * @param quantity The quantity of the material.
 * @param unitCost The cost per unit of the material.
 * @param markupPercent The markup percentage to apply.
 * @returns The total material cost.
 */
export const calculateMaterialCost = (
  quantity: number,
  unitCost: number,
  markupPercent: number
): number => {
  const materialCost = quantity * unitCost * (1 + markupPercent / 100);
  return roundMoney(materialCost);
};

/**
 * Calculates the total travel cost.
 * @param driveTimeHrs The drive time in hours for one trip.
 * @param milesPerTrip The miles for one trip.
 * @param numberOfTrips The total number of trips.
 * @param crewSize The number of people in the crew.
 * @param laborRate The labor rate per hour per person.
 * @param mileageRate The rate per mile.
 * @returns The total travel cost.
 */
export const calculateTotalTravelCost = (
  driveTimeHrs: number,
  milesPerTrip: number,
  numberOfTrips: number,
  crewSize: number,
  laborRate: number,
  mileageRate: number
): number => {
  const laborCost = driveTimeHrs * numberOfTrips * crewSize * laborRate;
  const mileageCost = milesPerTrip * mileageRate;
  const totalTravelCost = laborCost + mileageCost;
  return roundMoney(totalTravelCost);
};

/**
 * Calculates the final pricing for an estimate.
 * @param preProfitSubtotal The subtotal before profit is added.
 * @param profitPercentage The profit percentage to apply.
 * @param minimumCharge The minimum charge for a service.
 * @param salesTaxMultiplier The sales tax multiplier (e.g., 1.07 for 7% tax).
 * @returns The final grand total and its components.
 */
export const calculateFinalPricing = (
  preProfitSubtotal: number,
  profitPercentage: number,
  minimumCharge: number,
  salesTaxMultiplier: number
): {
  subtotalWithProfit: number;
  preTaxTotal: number;
  grandTotal: number;
  salesTax: number;
} => {
  const subtotalWithProfit = roundMoney(
    preProfitSubtotal * (1 + profitPercentage / 100)
  );
  const preTaxTotal = roundMoney(Math.max(subtotalWithProfit, minimumCharge));
  const grandTotal = roundMoney(preTaxTotal * salesTaxMultiplier);
  const salesTax = roundMoney(grandTotal - preTaxTotal);

  return {
    subtotalWithProfit,
    preTaxTotal,
    grandTotal,
    salesTax,
  };
};
