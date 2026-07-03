import { UsageSummary } from './QueryEngine';

// Pricing for claude-3-5-sonnet-20240620 (per 1M tokens)
const COST_PER_1M_INPUT = 3.00;
const COST_PER_1M_OUTPUT = 15.00;

export class CostTracker {
  /**
   * Calculates the total cost in USD based on input and output tokens.
   */
  static calculateUSDCost(usage: UsageSummary): number {
    const inputCost = (usage.inputTokens / 1_000_000) * COST_PER_1M_INPUT;
    const outputCost = (usage.outputTokens / 1_000_000) * COST_PER_1M_OUTPUT;
    return inputCost + outputCost;
  }

  /**
   * Formats a cost amount into a human-readable USD string
   */
  static formatCost(costUSD: number): string {
    if (costUSD < 0.01) {
      return `$${costUSD.toFixed(4)}`; // e.g. $0.0015
    }
    return `$${costUSD.toFixed(2)}`; // e.g. $1.50
  }
}
