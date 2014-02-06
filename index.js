var messages = require('http').STATUS_CODES;

for (var code in messages) {
	var key = messages[code].replace("'", '').replace(/[- ]/g, '_').toUpperCase();
	exports[key] = parseInt(code);
}