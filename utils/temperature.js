/**
 * Convert temperature from Celsius to the specified unit
 * @param {number} tempC - Temperature in Celsius
 * @param {string} unit - Target unit ('celsius' or 'fahrenheit')
 * @returns {number} - Converted temperature (rounded)
 */
export function convertTemperature(tempC, unit) {
  if (unit === "fahrenheit") {
    return Math.round((tempC * 9) / 5 + 32);
  }
  return Math.round(tempC);
}

export function getUnitSymbol(unit) {
  return unit === "celsius" ? "°C" : "°F";
}

export function formatTemperature(tempC, unit) {
  return `${convertTemperature(tempC, unit)}${getUnitSymbol(unit)}`;
}