let endpoint = "latest";
const latestSection = document.querySelector(`.latest-prices`);

async function fetchCommodity() {
  let key = await fetchKey();
  let oil = await fetchOil(key.commodityKey);
  let gas = await fetchGas(key.commodityKey);
  let object = { oil, gas };
  renderCommodity(object);
}

function fetchKey() {
  return axios.get(`/keys/commodity`).then((res) => res.data);
}

function fetchOil(key) {
  let params = {
    symbols: `WTIOIL,BRENTOIL`,
  };
  let url = `https://commodities-api.com/api/${endpoint}?access_key=${key}`;
  return axios.get(url, { params }).then((res) => res.data.data.rates);
}

function fetchGas(key) {
  let params = {
    symbols: `NG`,
  };

  let url = `https://commodities-api.com/api/${endpoint}?access_key=${key}`;
  return axios.get(url, { params }).then((res) => {
    return res.data.data.rates;
  });
}

function renderCommodity(object) {
  latestSection.innerHTML = `
    <h2>latest prices</h2>
    <small>2023-03-08</small>
    <div class="latest-prices_info">
    <p>WTI oil ${toUSD(object.oil.WTIOIL)} USD per barrel &nbsp;</p>
    <img src="./assets/petroleum.png" alt="" class ="petroleum-icon">
    </div>
    <div class="latest-prices_info">
    <span>Brent oil ${toUSD(object.oil.BRENTOIL)} USD per barrel &nbsp;</span>
    <img src="./assets/petroleum.png" alt="" class ="petroleum-icon">
    </div>
    <div class="latest-prices_info">
    <span>Natural gas ${toUSD(object.gas.NG)} USD per MMBtu</span>
    </div>
    `;
}

function toUSD(value) {
  return (1 / Number(value)).toFixed(2);
}

fetchCommodity();
