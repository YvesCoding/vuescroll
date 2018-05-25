  <p align="center"><a href="https://wangyi7099.github.io/vuescrolljs/"><img width="100" src="https://wangyi7099.github.io/vuescrolljs/logo.png" /></a></p>
<h3 align="center">Vuescroll</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
   <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/wangyi7099/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

[中文版 README](https://github.com/wangyi7099/vuescroll/blob/dev/README-ZH.md)

* [Introduction](#introduction)
* [Preview](#preview)
* [Online Demo & Documentation](#online-demo--documentation)
* [Features](#features)
* [Quick Start](#quick-start)
* [General FAQ](#general-faq)
* [Changelog](#changelog)
* [Contribution](#contribution)
* [Inspired By](#inspired-by)
* [License](#license)

## Introduction

Vuescroll is a configuration based Vue.js virtual scrollbar. It creates the div that used to wrap and scroll the content, acts as a scroll bar, and then operates div to complete scrolling.
The purpose of the design is to beautify and enhance your scrollbar.

You can choose different modes by changing the configuration:

* `native` mode: Like the native scrollbar, but has ability to costumize styles of scrollbar, it is suitable for the users who use PC.
* `slide` mode: Allow you slide by finger or mouse pointer, has ability to slide out of bountry, it is suitable for the users who use mobile phone.
* `pure-native` mode: Use native scrollbar, it is suitable for PC and the users who like native scrollbar.

You can also change the styles of the scroll bar by changing the configuration, including:

* Opacity
* Height/Width
* Position
* Background
* Keep show or not

> To learn more, please visit the official website [guide page](https://wangyi7099.github.io/vuescrolljs/guide/)

> If you do not satisfy the above characteristics and want to expand the features, consider to [contribution code](#contribution).

In a word, Vuescroll is not only a scrollbar, but you can use to make a carousel, time picker, a plugin that can automatically detect the size change of content and so on.

## Preview

![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p1.gif?raw=true)
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p2.gif?raw=true)
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p3.gif?raw=true)

## Online Demo & Documentation

* You can find Demo under the root of this repo.
* For detailed demo and documentation: Please visit [Offical Website](https://wangyi7099.github.io/vuescrolljs/Demo/Basic/).

## Features

* Originally created virutal scrollbar + sliding scrolling for both being suitable for PC and mobile!
* Has multi modes and has ability to toggle them anytime, each modes has diffrernt features:
  * `native` mode: Like the native scrollbar, but has ability to costumize styles of scrollbar, it is suitable for the users who use PC.
  * `slide` mode: Allow you slide by finger or mouse pointer, has ability to slide out of bountry, it is suitable for the users who use mobile phone.
  * `pure-native` mode: Use native scrollbar, it is suitable for PC and the users who like native scrollbar.
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

1.  First, install `Vuescroll` in your entry file

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

### The detailed configuration is as follows:

```javascript
  {
  // vuescroll
  vuescroll: {
    mode: 'native',
    // vuescroll's size(height/width) should be a percent(100%)
    // or be a number that is equal to its parentNode's width or
    // height ?
    sizeStrategy: 'percent',
    // pullRefresh or pushLoad is only for the slide mode...
    pullRefresh: {
      enable: false,
      tips: {
        deactive: 'Pull to Refresh',
        active: 'Release to Refresh',
        start: 'Refreshing...',
        beforeDeactive: 'Refresh Successfully!'
      }
    },
    pushLoad: {
      enable: false,
      tips: {
        deactive: 'Push to Load',
        active: 'Release to Load',
        start: 'Loading...',
        beforeDeactive: 'Load Successfully!'
      }
    },
    paging: false,
    zooming: true,
    snapping: {
      enable: false,
      width: 100,
      height: 100
    },
    // some scroller options
    scroller: {
      /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
      bouncing: true,
      /** Enable locking to the main axis if user moves only slightly on one of them at start */
      locking: true,
      /** Minimum zoom level */
      minZoom: 0.5,
      /** Maximum zoom level */
      maxZoom: 3,
      /** Multiply or decrease scrolling speed **/
      speedMultiplier: 1,
      /** This configures the amount of change applied to deceleration when reaching boundaries  **/
      penetrationDeceleration: 0.03,
      /** This configures the amount of change applied to acceleration when reaching boundaries  **/
      penetrationAcceleration: 0.08,
      /** Whether call e.preventDefault event when sliding the content or not */
      preventDefault: true
    }
  },
  scrollPanel: {
    // when component mounted.. it will automatically scrolls.
    initialScrollY: false,
    initialScrollX: false,
    // feat: #11
    scrollingX: true,
    scrollingY: true,
    speed: 300,
    easing: undefined
  },
  //
  scrollContent: {
    // customize tag of scrollContent
    tag: 'div',
    padding: false,
    props: {},
    attrs: {}
  },
  //
  rail: {
    vRail: {
      width: '6px',
      pos: 'right',
      background: '#01a99a',
      opacity: 0
    },
    //
    hRail: {
      height: '6px',
      pos: 'bottom',
      background: '#01a99a',
      opacity: 0
    }
  },
  bar: {
    //
    vBar: {
      background: '#00a650',
      keepShow: false,
      opacity: 1,
      hover: false
    },
    //
    hBar: {
      background: '#00a650',
      keepShow: false,
      opacity: 1,
      hover: false
    }
  }
}
```

### API Reference

[Vuescroll API](https://wangyi7099.github.io/vuescrolljs/guide/api.html)

### Event Reference

[Vuescroll Event](https://wangyi7099.github.io/vuescrolljs/guide/event.html)

## General FAQ

1.  The content has gone beyond the parent element. Why don't the vuescroll scrollbars appear?

    * Firstly, please confirm to upgrade to the latest version of vuescroll
    * Secondly, if your parent element size is not a fixed value, such as a percentage, or a value such as max-height (#29), please set the `sizeStrategy` to `number`, otherwise vuescroll will not detect the size of the parent element and show the scrollbars! The configuration can be:

    ```javascript
    ops: {
      vuescroll: {
        sizeStrategy: 'number';
      }
    }
    ```

## Changelog

Detailed changes for each release are documented in the [release notes](https://github.com/wangyi7099/vuescroll/releases).

## Contribution

Contributing code from two aspects：

### Code level

Vuescroll is extremely easy to expand.You only have to do 2 steps

1.  To modify / add the corresponding features at the corresponding modules in the [global-config.js](https://github.com/wangyi7099/vuescroll/blob/dev/src/shared/global-config.js) file, for example, I want to add a feature that can configure the color of the scrolling panel, the default is red, as follows:
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s1.jpg?raw=true)
2.  Find the corresponding module file and modify it in the corresponding code of the module, as follows:
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s2.jpg?raw=true)
    <br>
    ![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/s3.jpg?raw=true)

### Git level

1.  Fork this repo.
2.  Clone the repo you have just forked.

```base
   git clone git@github.com:<Your Username>/vuescroll.git
```

3.  Modify the code in your local and push the code to your remote repo.
4.  Click `New pull request` in vuescroll repo as follows:
    <br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" />
5.  When I agree, your code will merge into the `dev` branch!

## Inspired By

* [slimscroll](http://rocha.la/jQuery-slimScroll)
* [element-ui](http://element.eleme.io/#/zh-CN/component/installation)
* [scroller](http://zynga.github.io/scroller/)
* [CodePen](https://codepen.io/wangyi7099/pen/YLVBNe)
* [better-scroll](https://github.com/ustbhuangyi/better-scroll)

## License

**MIT**
