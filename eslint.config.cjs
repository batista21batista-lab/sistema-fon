// Bridge config so ESLint finds the existing .eslintrc.json
const fs = require('fs');
const path = require('path');
const configPath = path.resolve(__dirname, '.eslintrc.json');
module.exports = JSON.parse(fs.readFileSync(configPath, 'utf8'));
