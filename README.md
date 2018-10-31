 <p align="center"><a href="http://vuescrolljs.yvescoding.org/"><img width="100" src="http://vuescrolljs.yvescoding.org/logo.png" /></a></p>
<h1 align="center">Vuescroll</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev.png?style=shield" alt="Build Status"></a>
   <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

<p align="center">
  <a href="https://github.com/YvesCoding/vuescroll-issue-list-demo" target="_blank"><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/show1.gif?raw=true" width="400"  alt="Demo"/></a>
</p>

<p align="center">
  <a href="https://vuescroll-issue-list-demo-zbmlnzvgov.now.sh/">Online Demo(Recommend to use mobile)</a>
</p>

## Introduction

Vuescroll is a full customizable scrollbar based on Vue.js, which spports pull-to-refresh and push-to-load. - [vuescrolljs.yvescoding.org](http://vuescrolljs.yvescoding.org/)

It is compitable with both PC and mobile phone.

## Features

### Basic & native mode features

- Support [customize scrollbar](http://vuescrolljs.yvescoding.org/guide/configuration.html#bar), including setting rail/bar's `backgroundColor` , `opacity`,and setting bar's `keepShow or not`.

- Support smoothly scroll, you can set [easing](http://vuescrolljs.yvescoding.org/guide/configuration.html#detailed-options-2) to get different scroll animations.

- Support [detecting the size change](http://vuescrolljs.yvescoding.org/demo/#_3-detect-size-changes) of scrolled content.

- Support [typescript](http://vuescrolljs.yvescoding.org/guide/typescript.html).

- Support [SSR(Server-Side Rendering)](https://vuescroll-issue-list-demo-zbmlnzvgov.now.sh//).

### Slide mode(includes basic & slide mode features) features

- Support [pull to refresh and push to load](http://vuescrolljs.yvescoding.org/guide/configuration.html#pullrefresh), for detail, you can checkout this [demo](http://vuescrolljs.yvescoding.org/demo/#_4-pull-refresh-or-push-load-supported), and this [demo](https://vuescroll-issue-list-demo-zbmlnzvgov.now.sh//) of SSR version.

- Support **snapping**. **Snapping** means you can scroll same given distance in options at each timem. You can use it to make a [time-picker](http://vuescrolljs.yvescoding.org/demo/#_2-timepicker).

- Support **paging**. **Paging** means you can scroll a distance of container at each time. You can use it to make such a [Carousel](http://vuescrolljs.yvescoding.org/demo/#_1-carousel).

## Quick Start & Examples

### Example1: Browser environment(Basic Scroll)

```html
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
  <script src="https://unpkg.com/vuescroll@4.8.13/dist/vuescroll.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/vuescroll@4.8.13/dist/vuescroll.css">
  <style>
    html,
    body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    #app {
      width: 100%;
      height: 100%;
      text-align: center;
    }

    #parent {
      width: 400px;
      height: 400px;
      display: inline-block;
    }

    #child {
      width: 800px;
      height: 800px;
      background: -webkit-linear-gradient(left top, red, blue);
      /* Safari 5.1 to 6.0 */
      background: -o-linear-gradient(bottom right, red, blue);
      /* Opera 11.1 to 12.0 */
      background: -moz-linear-gradient(bottom right, red, blue);
      /* Firefox 3.6 to 15 */
      background: linear-gradient(to bottom right, red, blue);
      /* 标准语法 */
    }
  </style>
</head>

<body>
  <div id="app">
    <div id="parent">
      <vue-scroll :ops="ops">
        <div id="child">
        </div>
      </vue-scroll>
    </div>
  </div>
  <script>
    new Vue({
      el: "#app",
      data: {
        ops: {
          bar: {
            background: "rgb(24, 144, 255)"
          }
        }
      }
    })
  </script>
</body>

</html>
```

### Example2: Browser environment(Pull to refresh, push to load)

```html
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <script src="https://unpkg.com/vue@2.5.17/dist/vue.js"></script>
  <script src="https://unpkg.com/vuescroll@4.8.13/dist/vuescroll.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/vuescroll@4.8.13/dist/vuescroll.css">
  <style>
    html,
    body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    #app {
      width: 100%;
      height: 100%;
      text-align: center;
    }

    #parent {
      width: 400px;
      height: 400px;
      display: inline-block;
    }

    .child {
      width: 400px;
      height: 400px;
      background: -webkit-linear-gradient(left top, red, blue);
      /* Safari 5.1 to 6.0 */
      background: -o-linear-gradient(bottom right, red, blue);
      /* Opera 11.1 to 12.0 */
      background: -moz-linear-gradient(bottom right, red, blue);
      /* Firefox 3.6 to 15 */
      background: linear-gradient(to bottom right, red, blue);
      /* 标准语法 */
    }

    .child:not(:first-child) {
      margin-top: 10px;
    }
  </style>
</head>

<body>
  <div id="app">
    <div id="parent">
      <vue-scroll :ops="ops" @load-start="ls" @refresh-start="rs" @load-before-deactivate="lBD">
        <div class="child" v-for="i in dataNum" :key="i">
        </div>
      </vue-scroll>
    </div>
  </div>
  <script>
    new Vue({
      el: "#app",
      data: {
        dataNum: 1,
        ops: {
          vuescroll: {
            mode: 'slide',
            pullRefresh: {
              enable: true
            },
            pushLoad: {
              enable: true
            }
          },
          bar: {
            background: "rgb(24, 144, 255)"
          }
        }
      },
      methods: {
        ls(vs, refrehDom, done) {
          let vm = this;
          // fake fetching data...
          setTimeout(() => {
            // Must call done, to let vuescroll know
            // you have finished working.
            done();

            // Assume we have fetched the data, In order to
            // let user see the tip of the result. We don't
            // increase data immediately, instead, we put data
            // into a tempory variable.
            vm.receiveData = 1;
          }, 500);
        },
        lBD(vs, refrehDom, done) {
          const tipTime = 500;
          const vm = this;

          setTimeout(() => {
            vm.dataNum += (vm.receiveData || 0);
            // Must call done, to let vuescroll know
            // you have finished working.
            done();
          }, tipTime);
        },
        rs(vs, refrehDom, done) {
          this.refresh();
          done();
        },
        refresh() {
          this.dataNum = 1;
        }
      }
    })
  </script>
</body>

</html>
```

### Example3: Module system(Basic Scroll)

1. Import

In your entry file:

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);
```

In order to reduce the size of the bundle, you can also import modes separately

Only import the features of slide mode:

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll/dist/vuescroll-slide';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);
```

Only import the features of native mode:

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);
```

### Usage

3. Wrap the content you need to scroll by `vuescroll`

```html
  <template>
    <div class='your-container'>
        <!-- bind your configurations -->
        <vue-scroll :ops="ops">
            <div class='your-content'>
            </div>
        </vue-scroll>
    </div>
  </template>
  <script>
    export default {
      data() {
        return {
          ops: {
            // some configs....
          }
        }
      }
    }
  </script>
```

## For more detailed guides, please see:

- [Online Examples](http://vuescrolljs.yvescoding.org/demo/)
- [Get Started Guide](http://vuescrolljs.yvescoding.org/guide/getting-started.html)
- [Configurations](http://vuescrolljs.yvescoding.org/guide/configuration.html)
- [API Reference](http://vuescrolljs.yvescoding.org/guide/api.html)
- [Event Reference](http://vuescrolljs.yvescoding.org/guide/event.html)
- [Slot Reference](http://vuescrolljs.yvescoding.org/guide/slot.html)

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/YvesCoding/releases).

## Contribution

Please check out [CONTRIBUTING](.github/CONTRIBUTING.md).

## Communication

For bug report or feature request, you can raise an issue or twitter [@wangyi70991](https://twitter.com/wangyi70991?s=01)

> Scan the QR code to join the WeChat group

 <img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/wx.png?raw=true" width="400" alt="Demo" style="max-width:100%;">

## License

**MIT**
