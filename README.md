 <p align="center"><a href="http://vuescrolljs.yvescoding.me/"><img width="100" src="http://vuescrolljs.yvescoding.me/logo.png" /></a></p>
<h1 align="center">Vuescroll</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev.png?style=shield" alt="Build Status"></a>
   <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

<p align="center">
  <img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/show.gif?raw=true" width="800"  alt="Demo"/> 
</p>
 
## Introduction

Vuescroll is a scrollbar plugin based on Vue.js 2.X, it is very easy to use, no complex options and each option has its default value(It means you don't even have to write any configuration). Just wrap the content by `<vue-scroll>` and a custom scrollbar will show. It supports:

- Customizable scrollbar
- Pull-to-refresh, push-to-load
- Carousel

_Vuescroll's compatibility is the same as `Vue.js 2.X`._

## Demo

- You can find demo under examples folder of repo.
- You can see the full features of vuescroll at [Live Demo](https://vuescrolljs.yvescoding.me/demo) section of the website.

## Install

```bash
npm i vuescroll -S

# OR

yarn add vuescroll

```

## Usage

### Import and registry

```js
import vuescroll from 'vuescroll';
import Vue from 'vue';

Vue.use(vuescroll);

// OR

Vue.component('vue-scroll', vuescroll);
```

### Wrap the content by vue-scroll

```html
<div class="container">
  <vue-scroll>
    <div class="content"></div>
  </vue-scroll>
</div>
```

## Documentation

For detailed docs, please see [Guide](https://vuescrolljs.yvescoding.me/guide) section on the website.

## Communication

- Wechat

 <img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/wx.png?raw=true" width="400" alt="Demo" style="max-width:100%;">

- Twitter

[@wangyi70991](https://twitter.com/wangyi70991)

## License

**MIT** By Yves Wang(Wangyi Yi)
