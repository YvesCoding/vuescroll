
<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
</p>
<p align="center">vuescroll-基于vue.js 2.x的虚拟滚动条</p>

## 介绍

 vuescroll 是一个基于 [vue.js 2.X](https://github.com/vuejs/vue) 并且同时支持PC端和移动端的虚拟滚动条.你能够在浏览器环境中定制你喜欢的样式而不是用原生的滚动条.[这里是官方网站](https://wangyi7099.github.io/VuescrollDocs)。

 
 ## 谁在用虚拟滚动条?
 [element](http://element-cn.eleme.io/#/zh-CN/component/installation),[slimScroll](https://github.com/rochal/jQuery-slimScroll) and [CodePen(Code edit box)](https://codepen.io/wangyi7099/) 正在用. 

## Vuescroll 亮点

### 比原生滑动的更加流畅
[这里](https://github.com/wangyi7099/vuescroll/blob/5f81713b5a741684cdaded0e647390d61a14fa46/src/util/index.js#L182)有很多滚动的动画可供你选择
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/smooth-scroll.gif?raw=true)
### 自动侦测内容的尺寸发生变化
vuescroll 能自动侦测滚动内容的尺寸发生了变化， 并将这些变化反馈给用户
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/handle-resize.gif?raw=true)

## 开始上手
### 直接下载 / CDN

在浏览器环境下， 你不需要手动引入这个滚动条， vuescroll会自动安装它自己。
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
```
### npm
```bash
npm install vuescroll -S
```
但是在node环境中， 你就需要手动 import `Vue` 和  `vuescroll` 然后手动的`use`一下。
```javascript
import Vue from 'vue'
import vuescroll from 'vuescroll'
Vue.use(vuescroll)
```
### 在html中绑定你的配置
```html
<div id="app" >
    <!--  在 data 里绑定你的配置 -->
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
### 在data里面写你的配置然后就大功告成了！ 详细的配置请访问 [vuescrll Get Started](https://wangyi7099.github.io/VuescrollDocs/getStarted/)
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
### 这里是vuescroll的预览.
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll.gif?raw=true)

## 代办列表。

* Integrate with the future releases of Vue.js

## 受以下的项目启发

jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll)  and  [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src).

## 协议

**MIT** 
