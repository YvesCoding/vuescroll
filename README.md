  <p align="center"><a href="http://vuescrolljs.yvescoding.org/"><img width="100" src="http://vuescrolljs.yvescoding.org/logo.png" /></a></p>
<h3 align="center">Vuescroll</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/YvesCoding/vuescroll/dev.svg" alt="Build Status"></a>
   <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

English Version | [中文版](https://github.com/YvesCoding/vuescroll/blob/dev/README-ZH.md)

- [Introduction](#introduction)
- [Preview](#preview)
- [Online Demo & Documentation](#online-demo--documentation)
- [Features](#features)
- [Quick Start](#quick-start)
- [General FAQ](#general-faq)
- [Changelog](#changelog)
- [Contribution](#contribution)
- [Inspired By](#inspired-by)
- [License](#license)

## Introduction

Vuescroll is a vue-scrolling-component with a easy getting-start and full configuration.

Its theory is to create some divs to wrap the contents to be scrolled, act as scroll bars, and complete the scrolling by manipulating the `scrollTop` and `scrollLeft` of created div.

The purpose of the design is to beautify and enhance your native scrollbar.

<p align="center">
<img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p3.gif?raw=true" style="max-width:100%"/>
</p>
<p align="center">
<img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p1.gif?raw=true" style="max-width:100%"/>
</p>
<p align="center">
<img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p2.gif?raw=true" style="max-width:100%"/>
</p>

## Online Demo & Documentation

- You can find Demo under the root of this repo.
- For detailed demo and documentation: Please visit [Offical Website](http://vuescrolljs.yvescoding.org/demo/).

## Features

- Support mobile and phone
- Smooth scroll
- Customizable
- Pull to refresh and push to load
- ...

## Quick Start

### Installation

#### Install by npm or yarn

```bash
npm install vuescroll -S
# yarn add vuescroll
```

#### Or Upgrade

```bash
   npm i vuescroll@latest
   # yarn add vuescroll@latest
```

### Usage

1.  First, install `Vuescroll` in your entry file

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll';

Vue.use(vuescroll);

const vm = new Vue({
  el: '#app',
  data: {
    ops: {
      // The following configurations correspond to different parts of Vuescroll.
      vuescroll: {},
      scrollPanel: {},
      rail: {},
      bar: {}
    }
  }
});
```

2.  Then use vuescroll to wrap the contents that need to be scrolled.

```html
<div id="app" >
    <vue-scroll :ops="ops">
        <div
        class="content"
        v-for= "item in 100"
        :key="item"
        >
        <span>{{item}}</span>
        </div>
    </vue-scroll>
</div>
```

### API Reference

[Vuescroll API](http://vuescrolljs.yvescoding.org/guide/api.html)

### Event Reference

[Vuescroll Event](http://vuescrolljs.yvescoding.org/guide/event.html)

## General FAQ

1.  The content has gone beyond the parent element. Why don't the vuescroll scrollbars appear?

    - Firstly, please confirm to upgrade to the latest version of vuescroll
    - Secondly, if your parent element size is not a fixed value, such as a percentage, or a value such as max-height (#29), please set the `sizeStrategy` to `number`, otherwise vuescroll will not detect the size of the parent element and show the scrollbars! The configuration can be:
      ```javascript
      ops: {
        vuescroll: {
          sizeStrategy: 'number';
        }
      }
      ```

2.  Why is my content inconsistent with the width of my expectation, and there is always a small surplus？
    > Because vuescroll wants to detect changes of element size, the width style of the element `.vuescroll-content` is `width: fit-content`, so if you want the width of the content to be displayed normally, add the following style `.vuescroll-content{width: 100%! Important}` in the CSS.

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/YvesCoding/releases).

## Contribution

Please check out [CONTRIBUTING](.github/CONTRIBUTING.md).

## Inspired By

- [slimscroll](http://rocha.la/jQuery-slimScroll)
- [element-ui](http://element.eleme.io/#/zh-CN/component/installation)
- [scroller](http://zynga.github.io/scroller/)
- [CodePen](https://codepen.io/wangyi7099/pen/YLVBNe)
- [better-scroll](https://github.com/ustbhuangyi/better-scroll)

## License

**MIT**
