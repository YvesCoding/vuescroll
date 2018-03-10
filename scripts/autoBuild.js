
const fs = require('fs');
const aliases = require('./alias')
const filePath = `${aliases.root}`;
const path = require('path');
const { exec } = require('child_process');
const build = require('./build');
let timeout;
fs.watch(path.resolve('./', filePath),{recursive:true}, function (event, filename) {
      console.log('event is: ' + event);
      if (filename) {
         console.log('filename provided: ' + filename);
      } else {
        console.log('filename not provided');
      }
      if(!timeout) {
        timeout = 500;
        setTimeout(() => {
          build();
          timeout = null;
        }, timeout);
      }
});