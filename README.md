  <p align="center"><a href="https://wangyi7099.github.io/vuescrolljs/"><img width="100" src="https://wangyi7099.github.io/vuescrolljs/logo.png" /></a></p>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
   <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/wangyi7099/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>
<h3 align="center">Vuescroll</h4>
<h4  align="center">A customizable, cross platform virtual scrollbar based on Vue.js that can help you beautify and enhance your scrollbar on the web.</h4>

[中文版 README](https://github.com/wangyi7099/vuescroll/blob/dev/README-ZH.md)

## Introduction

Vuescroll is a virtual scrollbar based on Vue.js which is designed for beautifying and enhancing your native scrollbar on the web.

You can choose different models according to your own needs:

* `native` mode: Like thr native scrollbar, but can costumize styles of scrollbars, it is suitable for PC.
* `slide` mode: Allow you slide by finger or mouse pointer, can slide out of bountry, it is suitable for mobile.
* `pure-native` mode: Use native scrollbars， it is suitable for PC and the users who like native scrollbar.

You can also customize the style of the scrollbar, including:

* Opacity
* Height/Width
* Position
* Background
* Keep show or not

> To learn more, please visit the official website [guide page](https://wangyi7099.github.io/vuescrolljs/guide/)

> If you do not satisfy the above characteristics and want to expand the features, consider to [contribution code](#contribution).

In a word, Vuescroll is not only a scrollbar, but you can use to make a carousel, time picker, a plugin that can automatically detect the size change of content and so on.

## Demo & Documentation

* You can find Demo under the root of this repo.
* For detailed demo and documentation: Please visit [Offical Website](https://wangyi7099.github.io/vuescrolljs/).

## Features

* Originally created virutal scrollbar + sliding scrolling for both being suitable for PC and mobile!
* Has multi modes and has ability to toggle them anytime, each modes has diffrernt features:
  * `native` mode: Like thr native scrollbar, but can costumize styles of scrollbars, it is suitable for PC.
  * `slide` mode: Allow you slide by finger or mouse pointer, can slide out of bountry, it is suitable for mobile.
  * `pure-native` mode: Use native scrollbars， it is suitable for PC and the users who like native scrollbar.
* Ability to detect the size change of the content and automatically update scrollbar.
* Ability to scroll smoothly by using [different animations](https://wangyi7099.github.io/vuescrolljs/guide/Configuration.html#scrollpanel).
* Pull-to-Refresh (Pull top out of the boundaries to start refreshing list)
* Push-to-Load (Push bottom out of the boundaries to start loading list)
* Ability to zoom in or zoom out the scroll content.
* Paging (Slide a whole page each time)
* Snapping (Slide a user-defined distance each time)
* Ability to disable scrollingX or scrollingY
* Keep Bar showing or not.
* Set bar/rail opacity or background.
* Set bar/rail's position.
* Customize the tag of content. (That is you can set the tag of content to a component tag)

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

1.  Configure in your entry file

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll';

Vue.use(vuescroll);

const vm = new Vue({
  el: '#app',
  data: {
    ops: {
      vuescroll: {},
      scrollPanel: {}
      // ...
    }
  }
});
```

2.  Wrap the content you want to scroll by vuescroll.

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

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/wangyi7099/vuescroll/releases).

## Contribution

Contributing code from two aspects：

## Code level

Vuescroll is extremely easy to expand.You only have to do 2 steps

1.  To modify / add the corresponding features at the corresponding modules in the [global-config.js](https://github.com/wangyi7099/vuescroll/blob/dev/src/shared/global-config.js) file, for example, I want to add a feature that can configure the color of the scrolling panel, the default is red, as follows:
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s1.jpg?raw=true)
2.  Find the corresponding module file and modify it in the corresponding code of the module, as follows:
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s2.jpg?raw=true)
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s3.jpg?raw=true)

## Git level

1.  Fork this repo.
2.  Clone the repo you have just forked.

```base
   git clone git@github.com:<Your Username>/vuescroll.git
```

3.  Modify the code in your local and push the code to your remote repo.
4.  Click `New pull request` in vuescroll repo and that's all, like the picture below:<br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" />
5.  Wait for my agreement, and then your code will be merged into the `dev` branch !

## Inspired By

* [slimscroll](https://github.com/rochal/jQuery-slimScroll)
* [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src)
* [scroller](https://github.com/pbakaus/scroller)

## License

**MIT**
