
<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
            <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
</p>
<p align="center">A reactive virtual scrollbar based on vue.js 2.X</p>

[中文README](https://github.com/wangyi7099/vuescroll/blob/dev/README-ZH.md)

## Introduction

 vuescroll is a virtual scrollbar based on [vue.js 2.X](https://github.com/vuejs/vue) which can both support PC and mobile phone.You can customize the scrollbar how you like instead of using native in browser. Here is the offical [website](https://wangyi7099.github.io/VuescrollDocs).
 
## Use case of virtual scrollbar
 [element](http://element-cn.eleme.io/#/zh-CN/component/installation),[slimScroll](https://github.com/rochal/jQuery-slimScroll) and [CodePen(Code edit box)](https://codepen.io/wangyi7099/) are using it. Here is the offical [website](https://wangyi7099.github.io/VuescrollDocs) of vuescroll.

## Features
* Whole features of [scrollor](https://github.com/pbakaus/scroller).
* Ability to customize scrollbar by [powerful configurations](https://github.com/wangyi7099/vuescroll/blob/dev/src/config/GlobalConfig.js).
* Ability to [detect size change](https://wangyi7099.github.io/VuescrollDocs/getStarted/en/event/handle-resize.html) of content and automatically update.
* [smooth-scroll](https://github.com/cferdinandi/smooth-scroll) Integration.
* Vue-Powered.

## Get Started
### Browser -> Direct Download / CDN
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
```
### Node-> Use npm or yarn
```bash
npm install vuescroll -S
# yarn add vuescroll
```
```javascript
import Vue from 'vue'
import vuescroll from 'vuescroll'
Vue.use(vuescroll)
```
```html
<div id="app" >
    <!-- bind your own options in data -->
    <vue-scroll :ops="ops">
        <!-- the content you want to scroll -->
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

```javascript
var vm = new Vue({
    el: "#app",
    data: {
        ops: {
            // write your own options
            scrollContent: {

            },
            vRail: {
                
            }
            // ...
        }
    }
})
```

## Preview
### Toggle between two modes
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-mode.gif?raw=true)
### Smooth scroll
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-smooth.gif?raw=true)
BTW, [Here](https://github.com/wangyi7099/vuescroll/blob/5f81713b5a741684cdaded0e647390d61a14fa46/src/util/index.js#L182) are many scroll animations you can choose. 
### Pull-Refresh and Push-Load
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-refresh-load.gif?raw=true)

## Inspiration

[slimscroll](https://github.com/rochal/jQuery-slimScroll)    [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src) [scroller](https://github.com/pbakaus/scroller)

## Licence

**MIT** 
