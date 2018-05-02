
 
<p align="center"><a href="https://wangyi7099.github.io/vuescrolljs/"><img width="100" src="https://wangyi7099.github.io/vuescrolljs/logo.png" /></a></p>

[中文README](https://github.com/wangyi7099/vuescroll/blob/dev/README-ZH.md)

**Vuescroll** is a reactive, muli-modes, virtual scrollbar based on [vue.js 2.X](https://github.com/vuejs/vue) ，and it  currently has 3  modes:
* `slide` mode: Allow you slide by finger or mouse pointer, can slide out of bountry. It is suitable for mobile phone.
* `native` mode:  Seem to be native scrollbar, but can costumize styles of scrollbars. It is suitable for PC.
* `pure-native`mode: Use native scrollbars. It is suitable for the users who like native scrollbar.

It also supports customizing styles of scrollbar，detecting size change of content、paging、pull-refresh，push-load and so on.

> For those who use 3.X and want to upgrade to 4.X, please use the following usage ,or might upgrade fail:
```bash
   npm i vuescroll@latest
   # yarn add vuescroll@latest
```

  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a><a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>

## Features
* Has the basic behavior of the native scrollbar.
* Be able to customize styles of scrollbar(includes color, size, position, opacity, keep showing or not and so on).
* Switch among modes in runtime.
* Be able to smooth-scroll by setting the scroll animations, see [easing](https://wangyi7099.github.io/vuescrolljs/guide/Configuration.html#explanation-2).
* Support pull-refresh and push-load.
* Support paging(Slide a pull page each time).
* Support snapping(Slide a user-defined distance each time).
* Be able to detect the size change of the content.

## Demo
There are two ways to view demo:
1. Open the `demo` folder in the root of repo and go to view.
2. Go to - [Offical Website](https://wangyi7099.github.io/vuescrolljs/guide/) to view.

## Get Started
### Install
### Install by npm or yarn
> Recommend yarn, why? Yarn will cache every modules you have installed, and won't download again next time when you use it.
```bash
npm install vuescroll -S
# yarn add vuescroll
```
### Usage
1. Configure in your entry file

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
2. Wrap the content you want to scroll by vuescroll.
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

> For the detailed apis、events、configurations, please go to our [Offiacl Website](https://wangyi7099.github.io/vuescrolljs/).

## How to contribute

Firstly, thank you for being interested in vuescroll!! And then, please only follow these steps below to contribute code:
1. Fork this repo.
2. Clone the repo you have just forked.
```base
   git clone git@github.com:<Your Usernmae>/vuescroll.git
```
3. Modify the code in your local and push the code to your repo.
3. Click `New pull request` in vuescroll repo and that's all, like the picture below:<br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" /> 

## Inspired

* [slimscroll](https://github.com/rochal/jQuery-slimScroll)    
* [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src)
* [scroller](https://github.com/pbakaus/scroller)

## License

**MIT** 

by wangyi7099