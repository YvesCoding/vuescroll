  <p align="center"><a href="http://vuescrolljs.yvescoding.org/zh/"><img width="100" src="http://vuescrolljs.yvescoding.org/logo.png" /></a></p>
  <h1 align="center" width="100">Vuescroll</h1>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/YvesCoding/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/YvesCoding/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/YvesCoding/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/YvesCoding/vuescroll/dev.svg" alt="Coverage"></a>
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
<a href="https://github.com/YvesCoding/vuescroll"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

[English Version](https://github.com/YvesCoding/vuescroll/blob/dev/README.md) | 中文版

一个可定制的基于 Vue.js 的虚拟滚动条 - [vuescrolljs.yvescoding.org](http://vuescrolljs.yvescoding.org/zh)

## Demo

<p align="center">
   <a href="https://github.com/YvesCoding/vuescroll-issue-list-demo" target="_blank"><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/show1.gif?raw=true" width="400"  alt="Demo"/></a>
</p>

## 特点

- 支持 通过改变[mode](http://vuescrolljs.yvescoding.org/zh/guide/configuration.html#vuescroll)来支持 Pc 和移动端
- 支持通过改变[easing](http://vuescrolljs.yvescoding.org/zh/guide/configuration.html#bar)来平滑地滚动
- 支持[自定义滚动条](http://vuescrolljs.yvescoding.org/zh/guide/configuration.html#bar)
- 支持[下拉刷新和上推加载](http://vuescrolljs.yvescoding.org/zh/guide/configuration.html#explanation)
- 支持 [typescript](http://vuescrolljs.yvescoding.org/zh/guide/typescript.html)
- 还有[更多](http://vuescrolljs.yvescoding.org/zh/guide/#features)！

## 快速开始

### 引入

在你的入口文件处：

```javascript
import Vue from 'vue';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';

Vue.use(vuescroll);
```

### 用法

把你需要滚动的内容用`vuescroll`包裹起来

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

## 指南列表

- [在线 demo](http://vuescrolljs.yvescoding.org/zh/demo/)
- [上手指南](http://vuescrolljs.yvescoding.org/zh/guide/getting-started.html)
- [配置项](http://vuescrolljs.yvescoding.org/zh/guide/configuration.html)
- [API](http://vuescrolljs.yvescoding.org/zh/guide/api.html)
- [Event](http://vuescrolljs.yvescoding.org/zh/guide/event.html)
- [Slot](http://vuescrolljs.yvescoding.org/zh/guide/slot.html)

## 变更日志

详细的变更日志在[发行日志里](https://github.com/YvesCoding/releases).

## 贡献

请看[CONTRIBUTING](.github/CONTRIBUTING.md).

## 许可证

**MIT**
