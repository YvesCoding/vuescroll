  <p align="center"><a href="https://wangyi7099.github.io/vuescrolljs/zh/"><img width="100" src="https://wangyi7099.github.io/vuescrolljs/logo.png" /></a></p>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/wangyi7099/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>
<h4 align="center">Vuescroll - 美化和增强你的滚动条</h4>

## 介绍

Vuescroll 是一个基于 Vue.js 的虚拟滚动条，设计它的目的是用来美化和增强你的滚动条的。它有不同的模式适合不同的人群， 如果你喜欢原生滚动条， 你可以选择`pure-native`模式，如果你喜欢自定义滚动条，你可以选择`native`模式，如果你喜欢在手机端运行你的软件，你可以选择`slide`模式。

总的来说，Vuescroll 不仅仅只一个滚动条， 你可以用它制作一个轮播图、时间选择器、能够自动侦测内容发生变化的一个插件等等。

## Demo & 文档

* 你可以浏览这个 repo 的根目录下的 Demo 文件夹。
* 详细的 Demo, 文档: 请访问 [官方地址](https://wangyi7099.github.io/vuescrolljs/zh/).

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

1.  在你的入口文件进行配置

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

2.  使用 vuescroll 把需要滚动的内容包裹起来

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

## 变更日志

每个版本的详细记录在[发行日志](https://github.com/wangyi7099/vuescroll/releases)里面。

## 贡献

1.  把这个项目 fork 下来。
2.  把你的 fork 的项目克隆下来

```base
   git clone git@github.com:<Your Usernmae>/vuescroll.git
```

3.  在你的本地修改代码然后 push 到你的远程仓库
4.  在 vuescroll 项目地址点击`New pull request`，如下图所示:<br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" />
5.  等我点击同意， 你的代码就会被 merge 到`dev`分支了！

## 灵感来源

* [slimscroll](https://github.com/rochal/jQuery-slimScroll)
* [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src)
* [scroller](https://github.com/pbakaus/scroller)

## 协议

**MIT**
