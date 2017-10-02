'use strict';

const fetch = require('node-fetch');
const exchanges = [
    {
        exchange: 'Coindesk',
        locale: 'US',
        path: 'https://api.coindesk.com/v1/bpi/currentprice/ZAR.json',
        adapter: {
            apiPath: ['bpi', 'ZAR', 'rate_float']
        }
    },
    {
        exchange: 'Luno',
        locale: 'SA',
        path: 'https://api.mybitx.com/api/1/ticker?pair=XBTZAR',
        adapter: {
            apiPath: ['last_trade']
        }
    }
],
    promises = [];

exchanges.forEach((exchangeSettings) => promises.push(getRate(exchangeSettings)));
Promise.all(promises).then((result) => console.log(`${exchanges[0].exchange} ${exchanges[0].locale} => ${exchanges[1].locale} Arbitrage: ${result[1] - result[0]}`));

function getRate(settings) {
    return new Promise((resolve, rej) => {
        fetch(settings.path)
            .then(function (res) {
                return res.json();
            }).then(function (json) {
                const rate = navigateApiPath(json, settings.adapter.apiPath);

                console.log(`${settings.exchange} ${settings.locale} rate: ${rate}`);

                resolve(rate);
            }).catch(function(err) {
                console.log("-- API ERROR --");
            });;
    });
}

function navigateApiPath(json, apiPath) {
    let location = json;

    apiPath.forEach((element) => {
        location = location[element]
    });

    return location;
}
