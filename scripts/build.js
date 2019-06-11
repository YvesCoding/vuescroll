const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const { uglify } = require('rollup-plugin-uglify');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

let builds = require('./config').getAllBuilds();

build(builds);

function build(builds) {
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built])
      .then(() => {
        built++;
        if (built < total) {
          next();
        } else {
          if (process.env.VS_ENV != 'DEBUG') {
            copyOtherFiles();
          }
        }
      })
      .catch(logError);
  };

  next();
}

function buildEntry(config) {
  const output = config.output;
  const { file } = output;
  const isProd = /min\.js$/.test(file);
  if (isProd) {
    (config.plugins || (config.plugins = [])).push(
      uglify({
        output: {
          comments: 'some'
        }
      })
    );
  }
  // eslint-disable-next-line
  return rollup.rollup(config).then(async bundle => {
    const { code } = await bundle.generate(output);
    const fileName = path.basename(output.file);
    await report(fileName, code);
    return bundle.write(output);
  });
}

async function report(fileName, code) {
  const size = await getSize(code);
  console.log(blue(path.relative(process.cwd(), fileName)) + ' ' + size);
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}

const resolve = dir => path.resolve(__dirname, '../', dir);
const copyFilesArr = [
  resolve('types/vuescroll-native.d.ts'),
  resolve('types/vuescroll-slide.d.ts')
];
function copyOtherFiles() {
  copyFilesArr.forEach(f => {
    const file = fs.readFileSync(f, 'utf8');
    report(f, file);
    fs.writeFileSync(resolve(`dist/${path.basename(f)}`), file, 'utf8');
  });
}

module.exports = {
  build,
  blue
};
