var UglifyJS = require("uglify-es");
var fs = require('fs');

fs.writeFileSync("vuescroll.min.js", UglifyJS.minify({
    "vuescroll.js": fs.readFileSync("vuescroll.js", "utf8"),
}, {
    output:{
        comments: "some"
    }
}).code, "utf8");
// console.log(3+7);