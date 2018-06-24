const fs = require('fs');
const aliases = require('./alias');
const path = require('path');
const { build, blue } = require('./build');
let builds = require('./config').getAllBuilds();

const filePath = `${aliases.src}`;
let timeout;

print('Start building in debug mode....\n');

fs.watch(path.resolve('./', filePath), { recursive: true }, function(
  event,
  filename
) {
  print('Detected  ' + event);
  if (filename) {
    print('Filename provided: ' + filename);
  } else {
    print('Filename not provided');
  }

  clearTimeout(timeout);
  timeout = setTimeout(() => {
    build(builds);
    timeout = null;
  }, 500);
});

function print(str) {
  console.log(blue(str));
}
