import { Shipment } from "./models/shipment";
import { Driver } from "./models/driver";
import { readLinesFromFile } from "./utils/fileUtils";

function calculateSuitabilityScore(shipment: Shipment, driver: Driver): number {
  const shipmentNameLength = shipment.destination.length;
  const driverNameLength = driver.name.length;

  const baseSuitabilityScore =
    shipmentNameLength % 2 === 0
      ? driver.name.match(/[aeiou]/gi)?.length || 0 * 1.5
      : driver.name.match(/[bcdfghjklmnpqrstvwxyz]/gi)?.length || 0;

  const suitabilityScore = hasCommonFactors(
    shipmentNameLength,
    driverNameLength
  )
    ? baseSuitabilityScore * 1.5
    : baseSuitabilityScore;

  return suitabilityScore;
}

export const hasCommonFactors = (a: number, b: number): boolean => {
  for (let i = 2; i <= Math.min(a, b); i++) {
    if (a % i === 0 && b % i === 0) {
      return true;
    }
  }
  return false;
};

export async function assignShipmentsToDrivers(
  shipmentFilePath: string,
  driverFilePath: string
): Promise<void> {
  const shipmentLines = await readLinesFromFile(shipmentFilePath);
  const driverLines = await readLinesFromFile(driverFilePath);

  if (!shipmentLines || !driverLines) {
    throw new Error("Failed to read shipment and driver data.");
  }

  const shipments = shipmentLines.map((line) => new Shipment(line));
  const drivers = driverLines.map((line) => new Driver(line));

  const assignments: [Shipment, Driver][] = [];

  shipments.forEach((shipment) => {
    let maxScore = 0;
    let assignedDriver: Driver | undefined;

    drivers.forEach((driver) => {
      const suitabilityScore = calculateSuitabilityScore(shipment, driver);
      if (suitabilityScore > maxScore) {
        maxScore = suitabilityScore;
        assignedDriver = driver;
      }
    });

    if (assignedDriver) {
      assignments.push([shipment, assignedDriver]);
      drivers.splice(drivers.indexOf(assignedDriver), 1);
    }
  });

  // Print the assignments and total suitability score
  assignments.forEach(([shipment, driver]) => {
    console.log(`Shipment: ${shipment.destination} -> Driver: ${driver.name}`);
  });

  const totalSuitabilityScore = assignments.reduce(
    (score, [shipment, driver]) =>
      score + calculateSuitabilityScore(shipment, driver),
    0
  );

  console.log(`Total Suitability Score: ${totalSuitabilityScore}`);
}

assignShipmentsToDrivers("shipments.txt", "drivers.txt").catch(console.error);