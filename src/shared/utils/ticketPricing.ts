export type TicketPriceTier = {
    amount: number;
    price: number | string | { toString(): string };
    currency: string;
};

export type TicketPriceCalculation = {
    total: number;
    unitPrice: number;
    currency: string;
    bundles: Array<{ amount: number; count: number; price: number }>;
};

/**
 * Calculates the cheapest exact combination of bundle prices for a quantity.
 * A tier price is the total price for its `amount`, not a per-ticket price.
 */
export function calculateTicketPrice(
    prices: TicketPriceTier[],
    quantity: number,
): TicketPriceCalculation | null {
    if (!Number.isInteger(quantity) || quantity <= 0) return null;

    const currency = prices[0]?.currency;
    const tiers = prices
        .filter((tier) => tier.currency === currency && tier.amount > 0)
        .map((tier) => ({
            amount: tier.amount,
            price: Number(tier.price),
            cents: Math.round(Number(tier.price) * 100),
        }))
        .filter((tier) => Number.isFinite(tier.price) && tier.price >= 0)
        .sort((a, b) => a.amount - b.amount);

    if (!currency || tiers.length === 0) return null;

    const totals = Array<number>(quantity + 1).fill(Number.POSITIVE_INFINITY);
    const choices = Array<number>(quantity + 1).fill(-1);
    totals[0] = 0;

    for (let current = 1; current <= quantity; current += 1) {
        tiers.forEach((tier, tierIndex) => {
            if (tier.amount <= current && Number.isFinite(totals[current - tier.amount])) {
                const candidate = totals[current - tier.amount] + tier.cents;
                if (candidate < totals[current]) {
                    totals[current] = candidate;
                    choices[current] = tierIndex;
                }
            }
        });
    }

    if (!Number.isFinite(totals[quantity])) return null;

    const bundleCounts = new Map<number, number>();
    let remaining = quantity;
    while (remaining > 0) {
        const tierIndex = choices[remaining];
        if (tierIndex < 0) return null;
        bundleCounts.set(tierIndex, (bundleCounts.get(tierIndex) ?? 0) + 1);
        remaining -= tiers[tierIndex].amount;
    }

    const total = totals[quantity] / 100;
    return {
        total,
        // Bundle totals do not always divide into a finite decimal (for example
        // 38 / 3). Never leak that floating-point value into cart/API output.
        unitPrice: Math.round((total / quantity) * 100) / 100,
        currency,
        bundles: [...bundleCounts.entries()]
            .map(([tierIndex, count]) => ({
                amount: tiers[tierIndex].amount,
                count,
                price: tiers[tierIndex].price,
            }))
            .sort((a, b) => b.amount - a.amount),
    };
}

export function formatTicketMoney(value: number, currency: string) {
    return new Intl.NumberFormat("de-AT", {
        style: "currency",
        currency,
    }).format(value);
}

