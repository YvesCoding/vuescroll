
 
  <p align="center"><a href="https://wangyi7099.github.io/vuescrolljs/zh/"><img width="100" src="https://wangyi7099.github.io/vuescrolljs/logo.png" /></a></p>
<p align="center">
  <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a><a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a><a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
<a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/dm/vuescroll.svg" alt="Download"></a>
</p>
<p align="center">Vuescroll.js</p>

[中文版README](https://github.com/wangyi7099/vuescroll/blob/dev/README-ZH.md)

Vuescroll is a virtual, multi function scrollbar based on [vue.js 2.X](https://github.com/vuejs/vue),  it is suitable for both PC and mobile, it implements from [scroller](https://github.com/pbakaus/scroller)，besides scroller's features, it has more features：
- Specially design for Vue, is suitable to Vue.
- Multi Modes
    - `native` mode:  Seem to be native scrollbar, but can costumize styles of scrollbars, it is suitable for PC. 
    - `slide` mode: Allow you slide by finger or mouse pointer, can slide out of bountry, it is suitable for mobile.
    - `pure-native`mode: Use native scrollbars， it is suitable for PC and the users who like native scrollbar.
- Automatically detect size change of the content and update scrollbar.
- Expanded `scroller`
    - Support push-load.
    - Add `beforeDeactivate` stage in the 3 stages of pullrefresh/pushload to tell user the result of refreshing/loading.  
    - Add `goToPage`， `getCurrentPage` api to manipulate page when `paging` is enable.

In a word, Vuescroll is not only a scrollbar, but you can make a carousel, time picker, a plugin that can automatically detect the size change of content and soon.

> Important Tip! For the users who use 3.X and want to upgrade to 4.X, please use the following command ,or may upgrade fail::
```bash
   npm i vuescroll@latest
   # yarn add vuescroll@latest
```
## Demo
All the features above you can find in Demo. There are two ways to view Demo:
1. Open the [demo](https://github.com/wangyi7099/vuescroll/tree/dev/demo) folder under the root of repo.
2. Go to [Demo](https://wangyi7099.github.io/vuescrolljs/Demo/) page of the [Offical Website](https://wangyi7099.github.io/vuescrolljs/).
## Get Started
### Installation
#### Install by npm or yarn
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
3. That's all! So easy! Isn't it?

> For the detailed apis, events, configurations, please go to our [Offiacl Website](https://wangyi7099.github.io/vuescrolljs/).


## How to contribute

Hmmm, thank you very much for wanting to contribute to vuescroll！What you need are some steps bellow：
1. Fork this repo.
2. Clone the repo you have just forked.
```base
   git clone git@github.com:<Your Usernmae>/vuescroll.git
```
3. Modify the code in your local and push the code to your remote repo.
3. Click `New pull request` in vuescroll repo and that's all, like the picture below:<br /><img src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/pr.jpg?raw=true" /> 
4. Wait for my agreement, and your code will be merged into the `dev` branch !

## Inspired

* [slimscroll](https://github.com/rochal/jQuery-slimScroll)
* [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src)
* [scroller](https://github.com/pbakaus/scroller)

## License

**MIT** 