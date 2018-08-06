// require all test files
const testsContext = require.context('./', true, /\.spec$/);
testsContext.keys().forEach(testsContext);
