'use strict';

const fetch = require('node-fetch');
const exchanges = [
    {
        exchange: 'Luno',
        locale: 'SA',
        currency: 'ZAR',
        path: 'https://api.mybitx.com/api/1/ticker?pair=XBTZAR',
        adapter: {
            apiPath: ['last_trade']
        }
    },
    {
        exchange: 'Bittylicious',
        locale: 'GB',
        currency: 'GBP',
        path: 'https://bittylicious.com/api/v1/quote/BTC/GB/GBP/BANK/1/BUY',
        adapter: {
            apiPath: ['totalPrice']
        }
    }/* ,
    {
        exchange: 'Coindesk',
        locale: 'US',
        currency: 'ZAR',
        path: 'https://api.coindesk.com/v1/bpi/currentprice/ZAR.json',
        adapter: {
            apiPath: ['bpi', 'ZAR', 'rate_float']
        }
    } */
],
    promises = [];

exchanges.forEach((exchangeSettings) => promises.push(getRate(exchangeSettings)));

Promise.all(promises).then((result) => {
    getZarRate(result[1], exchanges[1].currency).then((rate, exRate) => {
         // TODO - assumes [0]] is always the greater value        
         // do order of results in promise array change?
        const arbitrage = result[0] - rate;
        console.log(`${exchanges[0].exchange} ${exchanges[0].locale} => ${exchanges[1].locale} Arbitrage: ${arbitrage}`);
        console.log(exRate);
        logToFile({amount: arbitrage, rate: exRate});
    })
});

function getRate(settings) {
    return new Promise((resolve, rej) => {
        fetch(settings.path)
            .then(function (res) {
                return res.json();
            }).then(function (json) {
                const rate = navigateApiPath(json, settings.adapter.apiPath);

                console.log(`${settings.exchange} ${settings.locale} rate: ${rate}`);

                resolve(rate);
            }).catch(function (err) {
                console.log("-- API ERROR --");
                console.log(err);
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

function getZarRate(value, currency) {
    return new Promise((resolve, rej) => { 
    if(currency === 'ZAR') resolve(value);

    const path = `http://api.fixer.io/latest?symbols=${currency}ZAR`;
        fetch(path)
        .then(function (res) {
           res.json().then(json => {
               const rate = Math.round(value * json.rates.ZAR);
               console.log(`To ZAR @ ${json.rates.ZAR}: ${rate}`);
               resolve(rate, json.rates.ZAR);
            });
        })
    });
}


function logToFile(data) {
    var fs = require('fs');
    var dateMS = Date.now();
    var result = require('./data.json');

    // console.log(result);
    result[dateMS] = data;

    fs.writeFile("./data.json", JSON.stringify(result), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('Data saved at ' + new Date(dateMS));
    });
}

