<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
</p>

## 什么是vuescroll?

 vuescroll 是一个基于 [vue.js 2.X](https://github.com/vuejs/vue) 的虚拟滚动条,同时支持PC和手机端, 它能把一个div变成可滚动的, [element](http://element-cn.eleme.io/#/zh-CN/component/installation),[slimScroll](https://github.com/rochal/jQuery-slimScroll) 和 [CodePen(Code edit box)](https://codepen.io/wangyi7099/) 和 都在用虚拟滚动条. 这里是[官方地址](https://wangyi7099.github.io/VuescrollDocs).

## 特性

### 比原生的滚动更加流畅
你可以选择很多滚动动画。
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/smooth-scroll.gif?raw=true)
### 自动侦测内容发动变动
vuescroll 能侦测到内容的变动并且把变动的信息反馈给用户。
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/handle-resize.gif?raw=true)

## 快速上手
### 直接下载 / CDN

在浏览器中引入所需的文件， vuescroll会自动进行安装。
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
```
### npm
```bash
npm install vuescroll -S
```
引入vue和vuescroll， 然后手动地安装(use)一下即可。
```javascript
import Vue from 'vue'
import vuescroll from 'vuescroll'
Vue.use(vuescroll)
```
### 绑定你的配置项
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
### 编写你的配置项即可。
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
### 预览
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll.gif?raw=true)

## 待办列表

* 准备整合 Vue.js的未来版本。
* ...
## 灵感来源

jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll)  和  [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src).

## 协议

**MIT** 
