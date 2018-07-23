 <p align="center"><a href="http://vuescrolljs.yvescoding.org/"><img width="100" src="http://vuescrolljs.yvescoding.org/logo.png" /></a></p>
<h1 align="center">Vuescroll</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/YvesCoding/vuescroll/dev.svg" alt="Build Status"></a>
   <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

English Version | [中文版](https://github.com/YvesCoding/vuescroll/blob/dev/README-ZH.md)

A powerful, customizable scrollbar plugin based on Vue.js. - [vuescrolljs.yvescoding.org](http://vuescrolljs.yvescoding.org/)

## Demo

<p align="center">
  <a href="https://github.com/YvesCoding/vuescroll-issue-list-demo" target="_blank"><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/show1.gif?raw=true" width="400"  alt="Demo"/></a>
</p>

## Features

- Support mobile and pc by changing [mode](http://vuescrolljs.yvescoding.org/guide/configuration.html#vuescroll)
- Support smooth scroll by choosing [easing](http://vuescrolljs.yvescoding.org/guide/configuration.html#detailed-options-2)
- Support [customize scrollbar](http://vuescrolljs.yvescoding.org/guide/configuration.html#bar)
- Support [customize scroll container](http://vuescrolljs.yvescoding.org/guide/slot.html#customize-container-panel-content)
- Support [pull to refresh and push to load](http://vuescrolljs.yvescoding.org/guide/configuration.html#explanation)
- Support [typescript](http://vuescrolljs.yvescoding.org/guide/typescript.html)
- Support SSR
- And [more](http://vuescrolljs.yvescoding.org/guide/#features) !

## Quick Start

### Import

In your entry file:

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll';
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

## Guide List

- [Online Demo](http://vuescrolljs.yvescoding.org/demo/)
- [Get Started Guide](http://vuescrolljs.yvescoding.org/guide/getting-started.html)
- [Configurations](http://vuescrolljs.yvescoding.org/guide/configuration.html)
- [API Reference](http://vuescrolljs.yvescoding.org/guide/api.html)
- [Event Reference](http://vuescrolljs.yvescoding.org/guide/event.html)
- [Slot Reference](http://vuescrolljs.yvescoding.org/guide/slot.html)

## Todo List

- Separate `vuescroll` into two parts : `Native mode` and `Slide mode`(WIP)

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/YvesCoding/releases).

## Contribution

Please check out [CONTRIBUTING](.github/CONTRIBUTING.md).

## License

**MIT**
