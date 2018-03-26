<p align="center"><a href="https://wangyi7099.github.io/vuescrollDemo/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/logo.png?raw=true" alt="vuescroll logo"></a></p>
<p align="center">
    <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/v/vuescroll.svg" alt="Version"></a>
               <a href="https://circleci.com/gh/wangyi7099/vuescroll/tree/dev"><img src="https://img.shields.io/circleci/project/wangyi7099/vuescroll/dev.svg" alt="Build Status"></a>
  <a href="https://codecov.io/github/wangyi7099/vuescroll?branch=dev"><img src="https://img.shields.io/codecov/c/github/wangyi7099/vuescroll/dev.svg" alt="Coverage Status"></a>
           <a href="https://www.npmjs.com/package/vuescroll"><img src="https://img.shields.io/npm/l/vuescroll.svg" alt="License"></a>
</p>

## What is vuescroll?

 vuescroll is a virtual scrollbar based on [vue.js](https://github.com/vuejs/vue) 2.X , it can transform a div into a scrollable area, the experience of using it just like using native scrollbar. It can both support PC and Mobile Phone. Here is the offical [website](https://wangyi7099.github.io/VuescrollDocs).


## Get Started

### Install

Browser:
```html
    <script src="https://unpkg.com/vue"></script>
    <script src="https://unpkg.com/vuescroll"></script>
```
NodeJs:
```bash
   npm install vuescroll -S
```
```javascript
	import Vue from 'vue'
	import vuescroll from 'vuescroll'

	Vue.use(vuescroll)
```
Wrap the content you want to scroll.
```html
<div class="container">
    <vue-scroll :ops="ops">
        <div class="content">
        </div>
    </vue-scroll>
</div>
```
JS:
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

jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll)  and  [element-ui](https://github.com/ElemeFE/element/tree/dev/packages/scrollbar/src).

## Liscence

**MIT** 
