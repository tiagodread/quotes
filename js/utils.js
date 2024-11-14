async function fetchBTCPrice(ticker) {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${ticker}`);
    const data = await response.json();
    return parseFloat(data.price);
}

async function getBTCQuote(amount, ticker) {
    try {
        const btcPrice = await fetchBTCPrice(ticker);
        const satoshisPorReal = (amount / btcPrice) * 100000000;

        return Math.round(satoshisPorReal);
    } catch (error) {
        console.error('Error while fetching quote:', error);
        return null;
    }
}

async function getSatoshiQuote(amount, ticker, currency) {
    const quote = await getBTCQuote(amount, ticker);
    const satsPerReal = amount / quote;
    return satsPerReal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    })
}

async function atualizarCotacao() {
    const btcPriceElement = document.getElementById('btc-price');
    btcPriceElement.textContent = 'Atualizando...'

    const satsBrlElement = document.getElementById('sats-brl');
    satsBrlElement.textContent = 'Atualizando...';

    const brlSatsElement = document.getElementById('brl-sats');
    brlSatsElement.textContent = 'Atualizando...';

    const currency = 'BRL';
    const ticker = 'BTCBRL';
    const amount = 1;

    const btcPrice = await fetchBTCPrice(ticker);
    const btcQuote = await getBTCQuote(amount, ticker);
    const satsQuote = await getSatoshiQuote(amount, ticker, currency);

    if (btcQuote !== null) {
        btcPriceElement.textContent = btcPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        satsBrlElement.textContent = `1 Real ≈ ${btcQuote} Satoshis`;
        brlSatsElement.textContent = `1 Satoshi ≈ R$ ${satsQuote}`;
        satsBrlElement.classList.remove('loading');
    } else {
        satsBrlElement.textContent = 'Erro ao obter cotação';
        satsBrlElement.classList.add('loading');
    }
}

setInterval(atualizarCotacao, 15000);

atualizarCotacao();