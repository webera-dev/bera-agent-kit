const pkg = require('../package.json');

const distPkg = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  main: 'index.js',
  module: 'index.mjs',
  types: 'index.d.ts',
  exports: pkg.exports,
  dependencies: {
    openai: pkg.dependencies.openai,
    viem: pkg.dependencies.viem,
    '@langchain/core': pkg.dependencies['@langchain/core'],
    '@langchain/community': pkg.dependencies['@langchain/community'],
    '@langchain/langgraph': pkg.dependencies['@langchain/langgraph']
  },
  repository: pkg.repository,
  keywords: pkg.keywords,
  author: pkg.author,
  license: pkg.license,
  bugs: pkg.bugs,
  homepage: pkg.homepage
};

require('fs').writeFileSync('./dist/package.json', JSON.stringify(distPkg, null, 2)); 