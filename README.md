
<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
</p>
<p align="center">A reactive virtual scrollbar based on vue.js 2.X</p>

[中文README](https://github.com/wangyi7099/vuescroll/blob/dev/README-ZH.md)

## Introduction

 vuescroll is a virtual scrollbar based on [vue.js 2.X](https://github.com/vuejs/vue) which can both support PC and mobile phone.You can customize the scrollbar you like instead of using native in browser.Here is the offical [website](https://wangyi7099.github.io/VuescrollDocs).
 
 ## Who use vitural scrollbar?
 [element](http://element-cn.eleme.io/#/zh-CN/component/installation),[slimScroll](https://github.com/rochal/jQuery-slimScroll) and [CodePen(Code edit box)](https://codepen.io/wangyi7099/) are using it. Here is the offical [website](https://wangyi7099.github.io/VuescrollDocs) of vuescroll.

## Vuescroll Features
### Two modes you can choose, slide mode or native mode
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-mode.gif?raw=true)
### Smooth
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-smooth.gif?raw=true)
BTW, [Here](https://github.com/wangyi7099/vuescroll/blob/5f81713b5a741684cdaded0e647390d61a14fa46/src/util/index.js#L182) are many scroll animations you can choose. 

### Pull-Refresh supported(Only for slide mode)
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-pull-refresh.gif?raw=true)
## Get Started
### Direct Download / CDN

In browser,you need not to  manually use it , and vuescroll will automatically detect vue and install itself.
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
```
### npm
```bash
npm install vuescroll -S
```
And in nodejs, you should import `Vue` and  `vuescroll` and  manually use it.
```javascript
import Vue from 'vue'
import vuescroll from 'vuescroll'
Vue.use(vuescroll)
```
### Bind your own options in HTML
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
### Write your own options and that's all. For the detail options please visit [vuescrll Get Started](https://wangyi7099.github.io/VuescrollDocs/getStarted/)
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
### This is the preview of vuescroll.
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll.gif?raw=true)

## Todo List

* Integrate with the future releases of Vue.js
## Inspire

jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll)  and  [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src).

## Liscence

**MIT** 
