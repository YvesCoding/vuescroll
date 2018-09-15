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

## Quick Start

### Import

In your entry file:

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);
```

### In order to reduce the size of the bundle, you can also import modes separately

#### Only import the features of slide mode:

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll/dist/vuescroll-slide';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);
```

#### Only import the features of native mode:

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll/dist/vuescroll-native';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);
```

### Usage

Wrap the content you need to scroll by `vuescroll`

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

## Detailed guides

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

## License

**MIT**
