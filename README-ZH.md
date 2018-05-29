  <p align="center"><a href="https://wangyi7099.github.io/vuescrolljs/zh/"><img width="100" src="https://wangyi7099.github.io/vuescrolljs/logo.png" /></a></p>
  <h3 align="center">Vuescroll</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/wangyi7099/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

[English Version](https://github.com/wangyi7099/vuescroll) | 中文版

* [介绍](#介绍)
* [预览](#预览)
* [在线 Demo & 文档](#在线-demo--文档)
* [特点](#特点)
* [快速入门](#快速入门)
* [常见问题及解答](#常见问题及解答)
* [变更日志](#变更日志)
* [贡献](#贡献)
* [灵感来源](#灵感来源)
* [协议](#协议)

## 介绍

Vuescroll 是一个基于配置的 Vue.js 虚拟滚动条。你可以通过修改配置来查看不同的效果。

它的原理是创造 div 用于包裹要滚动的内容，充当滚动条，然后通过操作 div 的 `scrollTop`，`scrollLeft` 来完成滚动。

设计它的目的是用来美化和增强你的滚动条的。

你可以通过更改配置来选择不同的模式:

* `native` 模式: 类似于原生的滚动条，但是可以自定义滚动条样式，使用于 PC 端用户。
* `slide` 模式: 允许你用手指或鼠标滑动内容， 可以滑动超出边界范围，适用于移动端端用户。
* `pure-native`模式: 滚动条使用原生的滚动条，适用于喜欢原生滚动条的用户。

你也可以通过更改配置滚动条的样式，包括：

* `透明度`
* `高度/宽度`
* `位置`
* `背景色`
* `是否保持显示`

> 想了解更多请访问官方网站[指南页面](https://wangyi7099.github.io/vuescrolljs/zh/)

> 如果你不满足上述特性，想要扩展特性的话，请考虑[贡献代码](#贡献)。

总的来说，Vuescroll 不仅仅只一个滚动条， 你可以用它制作一个轮播图、时间选择器、能够自动侦测内容发生变化的一个插件等等。

## 预览

![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p1.gif?raw=true)
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p2.gif?raw=true)
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p3.gif?raw=true)

## 在线 Demo & 文档

* 你可以浏览这个 repo 的根目录下的 Demo 文件夹。
* 详细的 Demo, 文档: 请访问 [官方地址](https://wangyi7099.github.io/vuescrolljs/zh/Demo/Basic/).

## 特点

* 独创虚拟滚动条+滑动滚动，可以同时适配 PC 端和手机端！
* 拥有多个模式随时切换，每个模式都有不同的特点:
  * `native` 模式: 类似于原生的滚动条，但是可以自定义滚动条样式，使用于 PC 端用户。
  * `slide` 模式: 允许你用手指或鼠标滑动内容， 可以滑动超出边界范围，适用于移动端端用户。
  * `pure-native`模式: 滚动条使用原生的滚动条，适用于喜欢原生滚动条的用户。
* 检测滚动内容发生尺寸变化并自动更新滚动条。
* 通过使用 [不同的滚动动画](https://wangyi7099.github.io/vuescrolljs/zh/guide/Configuration.html#scrollpanel)来平滑滚动。
* 下拉-刷新 (拉倒顶部并拉出边界开始刷新列表)
* 上推-加载 (推到底部并且退出边界开始加载列表)
* 能够放大或者缩小滚动的内容.
* 分页 (每次滑动整个页面)
* 截断 (每次滑动一个用户定义的距离)
* 能够禁止 X 或 Y 方向上的滚动。
* 能够设置滚动条是否保持显示。
* 能够设置滚动条，轨道的颜色和透明度。
* 能够设置滚动条，轨道的位置。
* 能够自定义内容的标签 (也就是说你能够设置内容的标签为一个组件)

## 快速入门

### 安装

用 npm 或者是 yarn 安装

```bash
npm install vuescroll -S
# yarn add vuescroll
```

### 升级

```bash
   npm i vuescroll@latest
   # yarn add vuescroll@latest
```

### 用法

1.  首先在你的入口文件安装 Vuescroll

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

2.  然后使用 vuescroll 把需要滚动的内容包裹起来即可。

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

### 详细的配置如下:

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

### API 参考

[Vuescroll API](https://wangyi7099.github.io/vuescrolljs/zh/guide/api.html)

### Event 参考

[Vuescroll Event](https://wangyi7099.github.io/vuescrolljs/zh/guide/event.html)

## 常见问题及解答

1.  内容已经超出比父元素打了，为什么 vuescroll 的滚动条不出现？
    * 首先，请确认是否升级到 vuescroll 的最新版本。
    * 其次，如果你的父元素大小不是一个固定的值，比如百分比，或者 max-height 之类的值(如#29)，请将`sizeStrategy`设置为`number`,否则 vuescroll 将不能侦测到父元素的大小，进而控制是否显示滚动条！如下配置即可：
      ```javascript
      ops: {
        vuescroll: {
          sizeStrategy: 'number';
        }
      }
      ```
2.  为什么我的内容宽度不足，总是留下一部分空间？
    > 因为 vuescroll 要检测元素尺寸的变化，所以设置的包裹内容的元素`.scroll-content`的宽度样式是`width: fit-content`,所以， 如果你要想让内容的宽度为正常显示，请在 CSS 里加如下样式`.vuescroll-content{ width: 100%!important}`即可。

## 变更日志

每个版本的详细记录在[发行日志](https://github.com/wangyi7099/vuescroll/releases)里面。

## 贡献

请查看[CONTRIBUTING](.github/CONTRIBUTING.md)。

## 灵感来源

* [slimscroll](http://rocha.la/jQuery-slimScroll)
* [element-ui](http://element.eleme.io/#/zh-CN/component/installation)
* [scroller](http://zynga.github.io/scroller/)
* [CodePen](https://codepen.io/wangyi7099/pen/YLVBNe)
* [better-scroll](https://github.com/ustbhuangyi/better-scroll)

## 协议

**MIT**
