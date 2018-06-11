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

**Currently, there are 3 modes in configuration you can choose:**

- `native` mode: Like the native scrollbar, but has ability to costumize styles of scrollbar, it is suitable for the users who use PC.
- `slide` mode: Allow you slide by finger or mouse pointer, has ability to slide out of bountry, it is suitable for the users who use mobile phone.
- `pure-native` mode: Use native scrollbar, it is suitable for PC and the users who like native scrollbar.

**You can also change the styles of the scroll bar by changing the configuration, including:**

- `Opacity`
- `Height/Width`
- `Position`
- `Background`
- `Keep show or not`

> To learn more, please visit the official website [guide page](http://vuescrolljs.yvescoding.org/guide/)

> If you do not satisfy the above characteristics and want to expand the features, consider to [contribution code](#contribution).

In general, vuescroll is more than a scrollbar, you can use it to make a carousel, a time picker, a plug-in that can automatically detect changes of content, and so on.The following is a part of the preview effect.

## Preview

### Pull-to-refresh and Push-to-load

![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p3.gif?raw=true)

### Carousel

![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p1.gif?raw=true)

### Picker

![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p2.gif?raw=true)

## Online Demo & Documentation

- You can find Demo under the root of this repo.
- For detailed demo and documentation: Please visit [Offical Website](http://vuescrolljs.yvescoding.org/demo/).

## Features

- Originally created virutal scrollbar + sliding scrolling for both being suitable for PC and mobile!
- Has multi modes and has ability to toggle them anytime, each modes has diffrernt features:
  - `native` mode: Like the native scrollbar, but has ability to costumize styles of scrollbar, it is suitable for the users who use PC.
  - `slide` mode: Allow you slide by finger or mouse pointer, has ability to slide out of bountry, it is suitable for the users who use mobile phone.
  - `pure-native` mode: Use native scrollbar, it is suitable for PC and the users who like native scrollbar.
- Ability to detect the size change of the content and automatically update scrollbar.
- Ability to scroll smoothly by using [different animations](http://vuescrolljs.yvescoding.org/guide/configuration.html#scrollpanel).
- Pull-to-Refresh (Pull top out of the boundaries to start refreshing list)
- Push-to-Load (Push bottom out of the boundaries to start loading list)
- Ability to zoom in or zoom out the scroll content.
- Paging (Slide a whole page each time)
- Snapping (Slide a user-defined distance each time)
- Ability to disable scrollingX or scrollingY
- Keep Bar showing or not.
- Set bar/rail opacity or background.
- Set bar/rail's position.
- Customize the tag of content. (That is you can set the tag of content to a component tag)

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

### All configuration references

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
    showDelay: 500,
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
};
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
