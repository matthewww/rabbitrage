'use strict';

const fetch = require('node-fetch');
const host = 'https://bittrex.com/api/v1.1/public/getcurrencies';

fetch(host)
    .then(function (res) {
        return res.json();
    }).then(function (json) {
        console.log(Object.keys(json));
        console.log(json.result[0]);
    });