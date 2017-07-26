const fs              = require('fs');
const httpStatusCodes = require('./http-status-codes');

const filePath = `${__dirname}/build`;

// create folder if it doesn't exist
if (!fs.existsSync(filePath)){
    fs.mkdirSync(filePath);
}

fs.writeFileSync(filePath + '/http-status-codes.json', JSON.stringify(httpStatusCodes, null, 4) , 'utf-8');
