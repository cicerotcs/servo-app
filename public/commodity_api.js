// set endpoint and your access key
let endpoint = 'latest'
console.log(`alert`);
// let access_key = process.env.COMODITIES_API_KEY;
let access_key = `08zb5r4yug0pvxo5v1qxkshsyr9muwjt936a6r76so7844w5uadl09x45260`

// `https://commodities-api.com/api/latest?access_key=08zb5r4yug0pvxo5v1qxkshsyr9muwjt936a6r76so7844w5uadl09x45260&symbols=WTIOIL,BRENTOIL,NG&base=AUD&unit=perbarrelforOil,PerMMBtuforNaturalgas`

const latestSection = document.querySelector(`.latest-prices`)

// // get the most recent exchange rates via the "latest" endpoint:
// $.ajax({
// url: `https://commodities-api.com/api/${endpoint}?access_key=${access_key}&symbols=WTIOIL,BRENTOIL,NG`,   
// dataType: 'jsonp',
// success: function(json) {
//     alert(json.data)
//     // console.log(json.data);

//     // // base currency is stored in json.base
//     // alert(json.base);

//     // // timestamp can be accessed in json.timestamp
//     // alert(json.timestamp);

//     }
// });

// axios.get(`/api/notes`).then(res => res.data)



async function fetchCommodity() {
    let key = await fetchKey()
    let oil = await fetchOil(key.commodityKey);
    let gas = await fetchGas(key.commodityKey);
    // console.log(`oil = ${oil.BRENTOIL}, ${oil.WTIOIL}`);
    // console.log(`gas = ${gas.NG}`);
    let object = {oil, gas}
    renderCommodity(object)

}

function fetchKey() {
    return axios.get(`/keys/commodity`)
    .then(res => res.data)
}

function fetchOil(key){
    let params = {
        symbols:`WTIOIL,BRENTOIL`,
    }
    let url = `https://commodities-api.com/api/${endpoint}?access_key=${key}`
    return axios.get(url, {params})
        .then(res => res.data.data.rates)
        
}

function fetchGas(key){
    let params = {
        symbols:`NG`,
    }

    let url = `https://commodities-api.com/api/${endpoint}?access_key=${key}`
    return axios.get(url, {params})
        .then(res => {return res.data.data.rates})
}


function renderCommodity(object) {
    latestSection.innerHTML = `
    <h2>latest prices</h2>
    <small>2023-03-08</small>
    <div class="latest-prices_info">
      <span>WTI oil ${toUSD(object.oil.WTIOIL)} USD per barrel</span>
      <span>img</span>
    </div>
    <div class="latest-prices_info">
      <span>Brent oil ${toUSD(object.oil.BRENTOIL)} USD per barrel</span>
      <span>img</span>
    </div>
    <div class="latest-prices_info">
      <span>Natural gas ${toUSD(object.gas.NG)} USD per MMBtu</span>
      <span>img</span>
    </div>
    `
}

function  toUSD(value) {
    return (1/Number(value)).toFixed(2)
}

// export function fetchQuote() {
//     axios.get(`https://thesimpsonsquoteapi.glitch.me/quotes`)
//         .then(res => renderSimpson(res.data[0]))
//         .then(() => {return true})
// }

// // WTI oil price (WTIOIL), Brent oil (BRENTOIL) price and Natural gas price (NG)

// // Australian dollar (AUD)

// // module.exports = fetchCommodity

fetchCommodity()