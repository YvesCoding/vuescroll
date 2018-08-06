// require all test files
const testsContext = require.context('./', true, /scroll-panel\.spec$/);
testsContext.keys().forEach(testsContext);
