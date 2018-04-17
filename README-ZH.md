
<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
</p>
<p align="center">vuescroll-基于vue.js 2.x的响应式虚拟滚动条</p>

## 介绍

 vuescroll 是一个基于 [vue.js 2.X](https://github.com/vuejs/vue) 并且同时支持PC端和移动端的虚拟滚动条.你能够在浏览器环境中定制你喜欢的样式而不是用原生的滚动条.[这里是官方网站](https://wangyi7099.github.io/VuescrollDocs)。

 
 ## 谁在用虚拟滚动条?
 [element](http://element-cn.eleme.io/#/zh-CN/component/installation),[slimScroll](https://github.com/rochal/jQuery-slimScroll) and [CodePen(Code edit box)](https://codepen.io/wangyi7099/) 正在用. 

## Vuescroll 特性

### 多种模式
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-mode.gif?raw=true)
### 平滑滚动
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-smooth.gif?raw=true)
好吧, [这里](https://github.com/wangyi7099/vuescroll/blob/5f81713b5a741684cdaded0e647390d61a14fa46/src/util/index.js#L182) 有很多滚动动画可以供你选择~

### 支持下拉刷新和上拉加载（只在slide模式下有效）
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-pull-refresh.gif?raw=true)

## 开始上手
### 浏览器 -> 直接下载 / CDN
```html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vuescroll"></script>
```
### node -> 用npm/yarn
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
## 修改日志

## Change Logs
---
### v4.2.2
 #### Features
 * Allow to change global options **root** property #8
---
### V4.1
#### Features
 * Push-Load has been supported
 ##### Usage:
 ```javascript
    ops: {
      vuescroll: {
          pushLoad: {
              enable: true
          }
      }  
    }
 ```
 * Allow to diable scrollingX or scrollingY #11

 ##### Usage:
  ```javascript
    ops: {
      scrollPanel: {
        scrollingX: true,// false to diable
        scrollingY: true // false to diable
      }  
    }
 ```

#### Sweaks
* Redefine pull-refresh tips from `Array` to `Object`
##### Before
```javascript
  ops: {
      vuescroll: {
          pushRefreshTips: ['XX', 'XX']
      }
  }
```
###### Now
```javascript
  ops: {
      vuescroll: {
          pushRefresh: {
              tips: {
                  start: "",
                  active: "",
                  deActive: "",
                  beforeActive: ""
              }
          }
      }
  }
```
---
### V4.0
#### Features
  * Add a **vuescroll** option in ops. Now, you can choose two modes for vuescroll. **slide**mode or **native** mode.
  ```javascript
   ops: {
    vuescroll: [
     mode: 'native' // native or slide
    }
    // other options...
  }
 ```
 * Pull-refresh supported (Only for slide mode)
![](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/vuescroll/vuescroll-pull-refresh.gif?raw=true)

#### Bug Fix
   * Can't hide native scrollbar in FireFox.#10 

## 受以下的项目启发

jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll)    [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src) [scroller](https://github.com/pbakaus/scroller)

## 协议

**MIT** 
