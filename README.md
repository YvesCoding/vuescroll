<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
</p>

## What is vuescroll?

 vuescroll is a virtual scrollbar based on [vue.js 2.X](https://github.com/vuejs/vue) ,both supports PC and mobile phone, it can transform a div into a scrollable area, [element](http://element-cn.eleme.io/#/zh-CN/component/installation),[slimScroll](https://github.com/rochal/jQuery-slimScroll) and [CodePen(Code edit box)](https://codepen.io/wangyi7099/) are using it. Here is the offical [website](https://wangyi7099.github.io/VuescrollDocs) of vuescroll.[中文版README.MD](https://github.com/wangyi7099/vuescroll/blob/dev/README-ZH.md)

## Feature

### More smoothly than native
There many scroll animates you can chooes. 
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/smooth-scroll.gif?raw=true)
### Auto detect content size changes
vuescroll can auto detect the changes of the contents you scroll. And react to the users.
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/handle-resize.gif?raw=true)

## Get Started
### Direct Download / CDN

You need not to  manually use it ,vuescroll will automatically detect vue and use it.
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
```
### npm
```bash
npm install vuescroll -S
```
And you should import `Vue` and  `vuescroll` and then manually use it.
```javascript
import Vue from 'vue'
import vuescroll from 'vuescroll'
Vue.use(vuescroll)
```
### Bind it by ops
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
### Write your own options and that's all.
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
### Preview
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll.gif?raw=true)
## Todo List

* Integrate with the future releases of Vue.js
* ...
## Inspire

jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll)  and  [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src).

## Liscence

**MIT** 
