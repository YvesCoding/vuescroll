var express = require('express');
var app = express();

app.use(express.static('./docs'));

module.exports = app.listen(8083, function (err) {
    if (err) {
      console.log(err)
      return
    }
})
