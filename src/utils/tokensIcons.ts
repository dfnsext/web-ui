export async function getTokenIcon(contractAddress: string, blockchain: string): Promise<string | null> {
    try {
        const baseUrl = 'https://smart-chain-fr.github.io/trust-assets/blockchains/';
        let logoUrl = '';
        if (contractAddress === undefined || null) logoUrl = `${baseUrl}${blockchain}/info/logo.png`;
        else logoUrl = `${baseUrl}${blockchain}/assets/${contractAddress}/logo.png`;

        const response = await fetch(logoUrl);
        if (response.ok) {
            return logoUrl;
        } else {
            //generic token icon
            return `${baseUrl}${blockchain}/info/logo.png`;
        }
    } catch (error) {
        console.error('Error fetching token icon:', error);
        return null;
    }
}
