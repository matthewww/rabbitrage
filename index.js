'use strict';

const fetch = require('node-fetch');
const host1 = 'https://bittrex.com/api/v1.1/public/getticker',
    host2 = 'https://api.coindesk.com/v1/bpi/currentprice/ZAR.json',
    host3 = 'https://api.mybitx.com/api/1/ticker?pair=BTCZAR';

fetch(host2)
    .then(function (res) {
        return res.json();
    }).then(function (json) {
        console.log(Object.keys(json));
        // console.log(json.result[0]);
        console.log(json);
    });