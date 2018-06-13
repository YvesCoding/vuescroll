  <p align="center"><a href="http://vuescrolljs.yvescoding.org/zh/"><img width="100" src="http://vuescrolljs.yvescoding.org/logo.png" /></a></p>
  <h3 align="center">Vuescroll</h4>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/YvesCoding/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

[English Version](https://github.com/YvesCoding/vuescroll/blob/dev/README.md) | 中文版

## 介绍

Vuescroll 一个上手简单，配置丰富的一个 vue 滚动组件。

它的原理是创建一些 div 用于包裹要滚动的内容，充当滚动条，然后通过操作 div 的 `scrollTop`，`scrollLeft` 来完成被创建的 div 完成滚动。

设计它的目的是用来美化和增强你的滚动条。

<p align="center">
<img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p3.gif?raw=true" style="max-width:100%"/>
</p>
<p align="center">
<img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p1.gif?raw=true" style="max-width:100%"/>
</p>
<p align="center">
<img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/p2.gif?raw=true" style="max-width:100%"/>
</p>

## 在线 Demo & 文档

- 你可以浏览这个 repo 的根目录下的 Demo 文件夹。
- 详细的 Demo, 文档: 请访问 [官方地址](http://vuescrolljs.yvescoding.org/zh/demo/).

## 特点

- 支持移动端和 PC
- 平滑滚动
- 可定制的
- 上拉刷新和下拉加载
- ...

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
      // 下面的配置分别对应Vuescroll的不同部位
      vuescroll: {},
      scrollPanel: {},
      rail: {},
      bar: {}
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

### API 参考

[Vuescroll API](http://vuescrolljs.yvescoding.org/zh/guide/api.html)

### Event 参考

[Vuescroll Event](http://vuescrolljs.yvescoding.org/zh/guide/event.html)

## 常见问题及解答

1.  内容已经超出比父元素打了，为什么 vuescroll 的滚动条不出现？
    - 首先，请确认是否升级到 vuescroll 的最新版本。
    - 其次，如果你的父元素大小不是一个固定的值，比如百分比，或者 max-height 之类的值(如#29)，请将`sizeStrategy`设置为`number`,否则 vuescroll 将不能侦测到父元素的大小，进而控制是否显示滚动条！如下配置即可：
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

每个版本的详细记录在[发行日志](https://github.com/YvesCoding/releases)里面。

## 贡献

请查看[CONTRIBUTING](.github/CONTRIBUTING.md)。

## 灵感来源

- [slimscroll](http://rocha.la/jQuery-slimScroll)
- [element-ui](http://element.eleme.io/#/zh-CN/component/installation)
- [scroller](http://zynga.github.io/scroller/)
- [CodePen](https://codepen.io/wangyi7099/pen/YLVBNe)
- [better-scroll](https://github.com/ustbhuangyi/better-scroll)

## 许可证

**MIT**

## 微信交流讨论群

扫一个扫加入群里面讨论

<p align="center">
  <img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/wx.png?raw=true" width="400">
</p>
