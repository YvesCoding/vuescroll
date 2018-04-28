
 
  <p align="center"><a href=""><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" /></a></p>

Vuescroll 是一个基于 [vue.js 2.X](https://github.com/vuejs/vue)的虚拟滚动条，它拥有多个模式可供你选择： `slide` 模式、`native` 模式和`pure-native`模式， 并且它还支持定制滚动条的样式，检测内容尺寸变化、能够使内容分页、支持上拉-刷新，下推加载等诸多功能。

  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a><a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>

## 特点
* 拥有原生滚动条的滚动行为
* 可以定制滚动条的样式(包括颜色、尺寸、位置、透明度、是否保持显示等)
* 可以在运行期间在模式之间自由切换
* 能够通过设置滚动动画来平滑地滚动， 请查看[easing](https://wangyi7099.github.io/vuescrolljs/guide/Configuration.html#explanation-2) 
* 拉取刷新和推动加载
* 支持分页模式(每次滑动整个页面)
* 支持快照模式(每次滑动滚动一个用户定义的距离)
* 可以检测内容尺寸发生变化

## Demo
有两种方式查看Demo:
1. 打开项目根目录下的demo文件夹进行查看
2. 去在线的demo-[官网](https://wangyi7099.github.io/vuescrolljs/zh/guide/)进行查看

## 开始上手
### 安装
  用npm或者是yarn安装
> 推荐用yarn, 为什么？ Yarn会对下载的每一个模块进行缓存， 当你下次再用的时候就不会重新下载了。
```bash
npm install vuescroll -S
# yarn add vuescroll
```
### 用法
1. 在你的入口文件进行配置

```javascript
import Vue from 'vue'
import vuescroll from 'vuescroll'

Vue.use(vuescroll)

const vm = new Vue({
    el: "#app",
    data: {
        ops: {
            vuescroll: {

            },
            scrollPanel: {
                
            }
            // ...
        }
    }
})
```
2. 使用vuescroll把需要滚动的内容包裹起来
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
完整的api、事件、配置请到[官网](https://wangyi7099.github.io/vuescrolljs/zh)进行查看。

## 如何贡献

首先感谢你对vuescroll感兴趣！只需要做到以下几步即可贡献代码。
1. 把这个项目fork下来。
2. 把你的fork的项目克隆下来
```base
   git clone git@github.com:<Your Usernmae>/vuescroll.git
```
3. 在你的本地修改代码然后push到你的仓库
3. 在vuescroll项目地址点击`New pull request`即可，如下图所示:<br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" /> 
## 受以下的项目启发

[slimscroll](https://github.com/rochal/jQuery-slimScroll)    [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src) [scroller](https://github.com/pbakaus/scroller)

## 协议

**MIT** 

by wangyi7099