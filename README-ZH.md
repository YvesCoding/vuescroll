
 
  <p align="center"><a href="https://wangyi7099.github.io/vuescrolljs/zh/"><img width="100" src="https://wangyi7099.github.io/vuescrolljs/logo.png" /></a></p>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a><a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
</p>
<h4 align="center">Vuescroll - 美化和加强你的滚动条</h4>

## 介绍 
Vuescroll 是一个基于 [vue.js 2.X](https://github.com/vuejs/vue)的多功能虚拟滚动条,可以美化和加强你的滚动条, 同时适用于PC端he移动端！它不仅实现了 [scroller](https://github.com/pbakaus/scroller)的所有特性，还拥有更多的特性：
- 与`Vue`契合度100%
- 多种模式
    - `native` 模式:  有点想原生的滚动，可以自定义滚动条样式，使用于PC端用户。 
    - `slide` 模式: 允许你用手指或鼠标滑动内容， 可以滑动超出边界范围，适用于移动端端用户。
    - `pure-native`模式: 滚动条使用原生的滚动条，适用于喜欢原生滚动条的用户。
- 自动检测滚动内容发生变化并自动更新滚动条。
- 扩展了scroller
    - 支持上推-加载功能
    - 在上推加载/下拉刷新的3个阶段中增加一个`beforeDeactivate`阶段用于告诉用户上推加载/下拉结果。
    - 新增`goToPage`， `getCurrentPage` 等函数用于在分页情况下操作页面。

总的来说，Vuescroll不仅仅只一个滚动条， 你可以用它制作一个轮播图、时间选择器、能够自动侦测内容发生变化的一个插件。

> 重要提示！ 对于那些使用3.X的用户想升级到4.X 请使用如下命令,否则可能会导致升级失败！:
```bash
   npm i vuescroll@latest
   # yarn add vuescroll@latest
```
## Demo
所有的上述特性都可以在Demo里查看。有两种方式查看Demo:
1. 打开项目根目录下的[demo](https://github.com/wangyi7099/vuescroll/tree/dev/demo)文件夹进行查看
2. 去[官网](https://wangyi7099.github.io/vuescrolljs/zh/guide/)的[Demo](https://wangyi7099.github.io/vuescrolljs/zh/Demo/)页面进行查看

## 快速入门
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
3. 这就完了！ 如此简单！ 是不是？
详细的文档，请访问[官网](https://wangyi7099.github.io/vuescrolljs/zh)。


## 如何贡献

哈哈， 非常感谢你想对vuescroll贡献！只需要做到以下几步即可：
1. 把这个项目fork下来。
2. 把你的fork的项目克隆下来
```base
   git clone git@github.com:<Your Usernmae>/vuescroll.git
```
3. 在你的本地修改代码然后push到你的远程仓库
3. 在vuescroll项目地址点击`New pull request`，如下图所示:<br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" /> 
4. 等我点击同意， 你的代码就会被merge到`dev`分支了！
## 启发

* [slimscroll](https://github.com/rochal/jQuery-slimScroll)
* [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src)
* [scroller](https://github.com/pbakaus/scroller)

## 协议

**MIT** 