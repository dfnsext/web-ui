import { binanceApiUrl } from "../common/constant";

export async function convertCryptoToFiat(value: string, lang: string, symbol: string): Promise<string | null> {
    const currency = lang === 'en' ? 'usdt' : lang === 'fr' ? 'eur' : null;
    const chain = symbol === 'polygon' || symbol === 'polygonmumbai' ? 'matic' : symbol;

    if (!currency) {
        return null;
    }

    const tradingPair = `${chain}${currency}`.toUpperCase();
    const url = new URL(`${binanceApiUrl}/api/v3/ticker/price`);
    url.searchParams.append('symbol', tradingPair);

    try {
        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const priceData = await response.json();
        const price = parseFloat(priceData?.price);

        if (isNaN(price)) {
            return null; // Invalid numeric input
        }

        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            return null; // Invalid numeric input
        }

        const convertedPrice = price * numericValue;

        if (convertedPrice === 0) {
            return lang === 'en' ? '$0' : '0€';
        }

        return `${lang === 'en' ? '$' : '€'}${convertedPrice.toFixed(2)}`;
    } catch (err) {
        console.error("Error fetching data:", err);
        return null;
    }
}
