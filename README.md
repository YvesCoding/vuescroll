<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
</p>
  
> User Guide
- [Demo](#demo)
- [Runnig Pictures](#pictures)
- [UseAge](#useage)
    - [Install](#install)
	- [DemoCode](#democode)
- [Options](#options)
    - [Vuescroll Options](#vuescroll-options)
    - [ScrollPanel Options](#scrollpanel-options)
    - [ScrollContent Options](#scrollcontent-options)
    - [Scrollbar Options](#scrollbar-options)
    - [Rail Options](#rail-options)
    - [Event](#event)
    - [Global Configuartion](#global-configuartion)
- [Inspire](#inspire)
- [Liscence](#liscence)

## Demo

 vuescroll is A virtual scrollbar based on [vue.js](https://github.com/wangyi7099/vuescroll) 2.X , The experience of using it just like using native scrollbar. It both support PC and Mobile Phone. Here is a living [demo](https://wangyi7099.github.io/vuescrollDemo).

## Pictures

### PC

![Pc](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/PC-V3.1.gif?raw=true)

### Moblie

![Mobile](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/MOBILE-V3.1.gif?raw=true)

## Useage

### Install

If you are in a browser envoriment. Include vuescroll.js and vue.js by script tag:
```html
    <script src="https://unpkg.com/vue"></script>
    <script src="https://unpkg.com/vuescroll"></script>
```
Or if you are in the nodejs environment, install it by npm, and use it:
```bash
   npm install vuescroll -S
```
```javascript
	import Vue from 'vue'
	import vuescroll from 'vuescroll'

	Vue.use(vuescroll)
```
And then, wrap the content you want to scroll.
```html
<div class="container">
    <vue-scroll :ops="ops">
        <div class="content">
        </div>
    </vue-scroll>
</div>
```
Finally, set the options in the data property, go to the [Options](#options) section to look through the detailed configs.
```javascript
    new Vue({
        data: {
            ops: {
                vRail: {
                    // ...
                },
                vBar: {
                    // ...
                },
                scrollContent: {
                    // ...
                }
                // ...
            }
        }
    })
```
## Options

### Vuescroll Options

option|defaultValue|description
-----|------------|----
ops|`{vBar:{},hBar:{}, scrollContent:{}}`| The configs of vBar and hBar, see detail below.
accuracy|`5`| The accuracy of scroll.
### ScrollPanel Options
option|defaultValue|description
-----|------------|----
initialScrollY|`false`|The vertical distance  that will scroll while component has mounted.e.g.**100** or **10%**
initialScrollX|`false`|The horizontal distance  that will scroll while component has mounted.e.g.**100** or **10%**

### ScrollContent Options
option|defaultValue|description
-----|------------|----
padding|`false`|Set false to get rid of the padding of scroll content, otherwise, scroll content will have a padding of rail's width of height
height|`100%`| Set the scrollContent's height.
tag|`div`|Setting tag means you can treat scrollcontent as other third-party component, e.g. **{tag: 'v-layout'}**, treat it as vuetify component `v-layout`.
props|`{}`|If you want to pass props to third party component, use the props, e.g. **props:{someProp: true}**
attrs|`{}`|The attrs opation is the same as props optioin.


### Scrollbar Options

vBar/hBar|defaultValue|description
-----|------------|----
background|`#4caf50`|**Set the scrollbar's background
keepShow|false|Set whether the scrollbars will keep showing or not.
opacity|1|Set the scrollbar's  opacity when it shows.


### Rail Options

vRail/hRail|defaultValue|description
-----|------------|-
background|`#a5d6a7`|Set the rail's background
width|`5px`|Set the scrollbar and the rail's width
pos|`right(vBar,vRail)/bottom/(hBar, hRail)`|Set the position of vBar and vRail or hBar and hRail
opacity|0|Set the rail's  opacity


### Event

event|params|description
-----|------------|----
handleScroll|`vertical, horizontal`|Pass two params to you, vertical includes information about vertical bar and process of vertical bar scrolls, the value is from 0 to 1.0 , and so does horizontal scroll bar.

### Api

Api|params|description
-----|------------|----
scrollTo|`{x:number, y:number}`|ScrollTo a concrete place
forceUpdate||update the vuescroll's all components.

### Global Configuartion

> To set all the scrollbars style , you can change the global vuescroll configs `Vue.prototype.$vuescrollConfig`, the priority of global config is the lowest. If you set the exact style for a vuescroll component, the global config will be overwrote.

```javascript
// The global config settings. Bar's widht/height or pos depend on the corresponding rail.
export default {
    // vuescroll
    vuescroll: {
        style: {
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden'
        },
        class: ['vueScroll']
    },
    scrollPanel: {
        initialScrollY: false,
        initialScrollX: false
    },
    // 
    scrollContent: {
        tag: 'div',
        padding: true,
        height: '100%',
        props: {
        },
        attrs: {
        }
    },
    // 
    vRail: {
        width: '5px',
        pos: 'right',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    vBar: {
        width: '5px',
        pos: 'right',
        background: '#4caf50',
        deltaY: 100,
        keepShow: false,
        opacity: 1,
    },
    // 
    hRail: {
        height: '5px',
        pos: 'bottom',
        background: "#a5d6a7",
        opacity: 0 //'0.5'
    },
    // 
    hBar: {
        height: '5px',
        pos: 'bottom',
        background: '#4caf50',
        keepShow: false,
        opacity: 1
    } 
}
```
## Inspire

It's inpired by jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll)  and  [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src).

## Liscence

**MIT** 
