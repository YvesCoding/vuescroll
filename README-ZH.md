
<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
</p>
<p align="center">vuescroll-基于vue.js 2.x的响应式虚拟滚动条</p>

## 介绍

 vuescroll 是一个基于 [vue.js 2.X](https://github.com/vuejs/vue) 并且同时支持PC端和移动端的虚拟滚动条.你能够在浏览器环境中定制你喜欢的样式而不是用原生的滚动条.[这里是官方网站](https://wangyi7099.github.io/vuescrolljs/)。

## 特点
* [scrollor](https://github.com/pbakaus/scroller)的完整特性.
* [强大的配置](https://wangyi7099.github.io/vuescrolljs/zh/guide/Configuration.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)能使你定制自己的滚动条。
* 能够[侦测内容尺寸发生变化](https://wangyi7099.github.io/vuescrolljs/zh/guide/event.html#handle-resize)， 并且自动更新。
* 整合[smooth-scroll](https://github.com/cferdinandi/smooth-scroll).
* Vue-驱动.

## 开始上手

### 安装

#### 直接下载 / CDN
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
```
#### 用 npm 或 yarn
```bash
npm install vuescroll -S
# yarn add vuescroll
```

### app.js
```javascript

// 在模块系统中， 你需要手动地安装它
// 但是在浏览器环境中不用。
import Vue from 'vue'
import vuescroll from 'vuescroll'

Vue.use(vuescroll)

// 声明Vue实例然后绑定你的配置
const vm = new Vue({
    el: "#app",
    data: {
        ops: {
            // 写你自己的配置在ops里
            vuescroll: {

            },
            scrollPanel: {
                
            }
            // ...
        }
    }
})
```

### index.html
```html
<div id="app" >
    <!-- 绑定ops -->
    <vue-scroll :ops="ops">
        <!-- 你想滚动的内容 -->
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

### 预览
### 在两种模式之间切换
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-toggle-mode.gif?raw=true)
### 平滑滚动
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-smooth-scroll.gif?raw=true)
对了, [这里](https://github.com/wangyi7099/vuescroll/blob/5f81713b5a741684cdaded0e647390d61a14fa46/src/util/index.js#L182) 有许多滚动动画供你选择。 
### 拉取刷新和推动加载
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-refresh-load.gif?raw=true)

## 受以下的项目启发

[slimscroll](https://github.com/rochal/jQuery-slimScroll)    [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src) [scroller](https://github.com/pbakaus/scroller)

## 协议

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present, wangyi7099(yi wang)
