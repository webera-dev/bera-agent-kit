const path = require('path');

module.exports = {
  createViemWalletClient: require('./dist/utils/createViemWalletClient').createViemWalletClient,
  BeraAgent: require('./dist/index').BeraAgent,
  createTools: require('./dist/tools/allTools').createTools,
  log: require('./dist/utils/logger').log,
}; 