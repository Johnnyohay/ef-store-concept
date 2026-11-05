/** Round prices only, shown with no decimals: $20, $25, $30. */
export const usd = (n: number) => `$${Math.round(n)}`;
