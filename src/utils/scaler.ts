import { IngredientItem } from '../types/recipe';

/**
 * Format a number into clean culinary fractions or rounded decimals.
 */
export function formatAmount(val: number): string {
  if (val <= 0) return '';
  const rounded = Math.round(val * 100) / 100;

  // Check for common culinary fractions
  const whole = Math.floor(rounded);
  const frac = Math.round((rounded - whole) * 100) / 100;

  let fractionStr = '';
  if (Math.abs(frac - 0.25) < 0.05) fractionStr = '¼';
  else if (Math.abs(frac - 0.33) < 0.05) fractionStr = '⅓';
  else if (Math.abs(frac - 0.5) < 0.05) fractionStr = '½';
  else if (Math.abs(frac - 0.66) < 0.05) fractionStr = '⅔';
  else if (Math.abs(frac - 0.75) < 0.05) fractionStr = '¾';

  if (fractionStr) {
    return whole > 0 ? `${whole} ${fractionStr}` : fractionStr;
  }

  // If whole number
  if (Number.isInteger(rounded)) {
    return rounded.toString();
  }

  // Otherwise 1 decimal point if < 10, or rounded whole if >= 10
  return rounded < 10 ? rounded.toFixed(1) : Math.round(rounded).toString();
}

/**
 * Scale an ingredient amount based on serving ratios
 */
export function scaleIngredient(
  item: IngredientItem,
  baseServings: number,
  targetServings: number,
  targetUnitSystem: 'metric' | 'us' = 'metric'
): { displayAmount: string; displayUnit: string; fullText: string } {
  const ratio = baseServings > 0 ? targetServings / baseServings : 1;
  const rawAmount = item.amount != null ? item.amount * ratio : undefined;

  let unit = item.unit || '';
  let amount = rawAmount;

  // Convert unit systems if requested and feasible
  if (amount != null && unit) {
    const u = unit.toLowerCase().trim();
    if (targetUnitSystem === 'us') {
      if (u === 'g' && amount >= 450) {
        amount = amount / 453.59;
        unit = 'lbs';
      } else if (u === 'g') {
        amount = amount / 28.35;
        unit = 'oz';
      } else if (u === 'ml' && amount >= 200) {
        amount = amount / 240;
        unit = 'cups';
      } else if (u === 'ml' && amount >= 15) {
        amount = amount / 15;
        unit = 'tbsp';
      } else if (u === 'ml') {
        amount = amount / 5;
        unit = 'tsp';
      }
    } else {
      // Metric system
      if (u === 'lbs' || u === 'lb') {
        amount = amount * 453.59;
        unit = 'g';
      } else if (u === 'oz') {
        amount = amount * 28.35;
        unit = 'g';
      } else if (u === 'cup' || u === 'cups') {
        amount = amount * 240;
        unit = 'ml';
      }
    }
  }

  const formattedAmount = amount != null ? formatAmount(amount) : '';
  const displayUnit = unit;

  let fullText = '';
  if (formattedAmount) {
    fullText = `${formattedAmount}${displayUnit ? ` ${displayUnit}` : ''} — ${item.name}${
      item.notes ? ` (${item.notes})` : ''
    }`;
  } else {
    // Fallback to raw text if no numerical amount
    fullText = item.raw;
  }

  return {
    displayAmount: formattedAmount,
    displayUnit,
    fullText,
  };
}
