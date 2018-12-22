// require all test files
const testsContext = require.context('./', true, /vuescroll\.spec$/);
testsContext.keys().forEach(testsContext);
