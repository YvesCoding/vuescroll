# vuescroll - A virtual scrollbar based on [vue.js](https://github.com/vuejs/vue) 2.X

- [What Is Vuescroll](#what-is-vuescroll)
- [Demo](#demo)
- [Running Result](#running-result)
- [UseAge](#useage)
    - [Install](#install)
	- [DemoCode](#democode)
- [Options](#options)
    - [Vuescroll Options](#vuescroll-options)
    - [Scrollbar Options](#scrollbar-options)
    - [Event](#event)
- [Inspire](#inspire)
- [Liscence](#liscence)
## What Is Vuescroll

vuescroll is a virtual scrollbar , that you can substitute vuescroll for native scrollbar, a virtual scrollbar is beautiful and easily controlled , it can make you website is unique , which compares with others that use the native scrollbar :).Vuescroll behaves just like native !

> note: V3.0 add the rail component that the component can reach where you click on the rail !

## Demo

There are 15 demos on the website that can absolutely meet your daily need on developing website: [demo](https://wangyi7099.github.io/vuescroll/)

### Running Result

> PC

![Pc](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/PC-V3.1.gif?raw=true)

> Moblie

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
### DemoCode
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
        <script src="https://unpkg.com/vue"></script>
        <script src="https://unpkg.com/vuescroll"></script>
        <style>
            #app {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
            }

            .scroll {
                width: 300px;
                height: 200px;
                overflow: hidden;
            }

            .content {
                width: 400px;
                height: 300px;
            }
        </style>
    </head>
    <body>
        <div id="app">
            <div class="scroll">
                <vue-scroll :ops="ops" @hscroll="detectHBar" @vscroll="detectVBar">
                    <div class="content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam sem, imperdiet at mollis vestibulum, bibendum id purus. Aliquam molestie, leo sed molestie condimentum, massa enim lobortis massa, in vulputate diam lorem quis justo. Nullam nec dignissim mi. In non varius nibh. Proin et eros nisi, eu vulputate libero. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis ultricies augue id risus dapibus blandit.</p>
                        <p>Integer malesuada molestie dolor sit amet viverra. Mauris nec urna lorem. Integer commodo feugiat ligula eget fermentum. In in tellus a risus convallis pellentesque. Cras non faucibus est. Morbi sagittis risus mollis nisl mollis ac mattis mi volutpat. Vivamus ac rutrum elit. Suspendisse semper orci vitae sapien sollicitudin mattis.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed diam sem, imperdiet at mollis vestibulum, bibendum id purus. Aliquam molestie, leo sed molestie condimentum, massa enim lobortis massa, in vulputate diam lorem quis justo. Nullam nec dignissim mi. In non varius nibh. Proin et eros nisi, eu vulputate libero. Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis ultricies augue id risus dapibus blandit.</p>
                    </div>
                </vue-scroll>
            </div>
        </div>
        <script>
            Vue.prototype.$vuescrollConfig.hBar.background = "#000";
            Vue.prototype.$vuescrollConfig.scrollContent.padding = true;
            var vm = new Vue({
                el: '#app',
                data: {
                    ops: {
                        vBar: {},
                        hBar: {
                        }
                    }
                },
                methods: {
                    // detect the scrollbar scrolling
                    detectVBar(bar, content, process) {
                        // console.log(bar, content, process);
                    },
                    detectHBar(bar, content, process) {
                        // console.log(bar, content, process);
                    }
                }
            });
        </script>
    </body>
</html>
``` 
## Options

### Vuescroll Options

option|defaultValue|description
-----|------------|----
ops|`{vBar:{},hBar:{}}`| **The configs of vBar and hBar**
scrollContentStyle|`{}`| **The style config object of scrollContent e.g. {height:'100%'} or {padding: false},get rid of the padding of the scrollContent**
accuracy|`5`| **The accuracy determins that the scrollbar will show or not. e.g. If the scrollPanel and scrollContent has a difference of less than 5 px,the scrollbar will not show.**

### Scrollbar Options

vBar/hBar|defaultValue|description
-----|------------|----
background|`#4caf50`|**Set the scrollbar's background**
railBackground|`#a5d6a7`|**Set the rail's background**
width|`5px`|**Set the scrollbar and the rail's width**
pos|`left(vBar,vRail)/bottom/(hBar, hRail)`|**Set the position of vBar and vRail or hBar and hRail**
deltaY|`35`|**Set the distance you scroll the vertical scrollbar each time**
keepShow|false|**Set whether the scrollbars  keep showing or not**
opacity|1|**Set the scrollbar's  opacity when it shows**
railOpacity|0.5|**Set the rail's  opacity**
### Event

event|params|description
-----|------------|----
vscroll/hscroll|`bar,content,process`|Bar is the information about scrollbar, and content the the information about the scrollcontent, and the process show the progress of the scrolling.

## Inspire

It's inpired by jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll).

## Liscence

**MIT** Hope you can enjoy of it.
