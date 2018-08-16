const STATUS_CODES = require('http').STATUS_CODES;

const httpStatusCodes = {};
for (let code in STATUS_CODES) {
	let key = STATUS_CODES[code].replace("'", '').replace(/[- ]/g, '_').toUpperCase();
	httpStatusCodes[key] = parseInt(code);
    httpStatusCodes[code] = STATUS_CODES[code];
}

module.exports = httpStatusCodes;