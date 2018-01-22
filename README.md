# vuescroll - A virtual scrollbar based on [vue.js](https://github.com/vuejs/vue) 2.X

- [What Is Vuescroll](#what-is-vuescroll)
- [Inspire](#inspire)
- [Demo](#demo)
- [UseAge](#useage)
    - [Install](#install)
	- [HTML](#html)
	- [JavaScript](#javascript)
	- [Css](#css)
	- [Running Result](#running-result)
- [Options](#options)
    - [Vuescroll Options](#vuescroll-options)
    - [Scrollbar Options](#scrollbar-options)
    - [Event](#event)
- [Liscence](#liscence)
## What Is Vuescroll

vuescroll is a virtual scrollbar , that you can substitute vuescroll for native scrollbar, a virtual scrollbar is beautiful and easily controlled , it can make you website is unique , which compares with others that use the native scrollbar :).

## Inspire

It's inpired by jquery [slimscroll](https://github.com/rochal/jQuery-slimScroll).

## Demo

There are 15 demos on the website that can absolutely meet your daily need on developing website: [demo](https://wangyi7099.github.io/vuescroll/)

## Useage

If you are in a browser envoriment. Include vuescroll.js and vue.js by script tag:
### Install
```html
 <script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
 <script src="js/vuescroll.js" type="text/javascript" charset="utf-8"></script>
```
Or if you are in a nodejs envoriment:
**try to install it by npm**
```bash
npm i vuescroll -S
```
And then, `import` it in js. 
```javascript
import Vue from 'vue'
import vuesrcoll  from 'vuesroll';
Vue.use(vuesrcoll); // install the plugin
```
What you all need to do is warpping the **content** you want to be scrolled inside its parent dom, and needn't write any other configrations, vuescroll has its default config. And the below is the detailed config(**You definitely can omit all the conifigs.**)

### HTML
```html
<div id="scroll" >
	<div class="scroll">
	<vue-scroll  
	:scroll-content-style="{height:'100%'}" 
	:ops="ops"
	@hscroll="detectHBar"
	@vscroll="detectVBar"
	>
		<div class="content">
		</div>
	</vue-scroll>
</div>
</div> 
```
### JavaScript
```javascript
var vm = new Vue({
	el:'#scroll',
	data:{
		ops:{
			vBar:{
				background:"#cecece",
				width:'5px',
				deltaY:'100'
			},
			hBar:{
				background:"#000",
				width:'5px',
				deltaY:'100'
			}	
		}
	},
	methods: {
		// detect the scrollbar scrolling
		detectVBar(bar, content, process) { 
			console.log(bar ,content,  process);
		},
		detectHBar(bar, content,  process) {
			console.log(bar ,content,  process);
		}
	}
});
```
### Css
```css
<style>
		#scroll{
			display: flex;
			flex-direction: column;
			width: 100%;
		}
		.scroll{
			width: 200px;
			height: 200px;
			overflow: hidden;
		}
		.content{
			width: 3155px;
			height: 3155px;
			background: linear-gradient(to top right, #000, #f00 50%, #090);
		}
	</style>
```

### Running Result

![pic](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/vuescroll.gif?raw=true)

## Options

### Vuescroll Options

option|defaultValue|description
-----|------------|----
ops|`{vBar:{},hBar:{}}`| **The configs of vBar and hBar**
scrollContentStyle|`{}`| **The style config object of scrollContent e.g. {height:'100%'}**
accuracy|`5`| **The accuracy determins that the scrollbar will show or not. e.g. If the scrollPanel and scrollContent has a difference of less than 5 px,the scrollbar will not show.**

### Scrollbar Options

vBar/hBar|defaultValue|description
-----|------------|----
background|`hsla(220,4%,58%,.3)`|**The scrollbar background**
width|`5px`|**The scrollbar width**
pos|`left(vBar)/bottom/(hBar)`|**The position of vBar or hBar**
deltaY/deltaX|`35`|**The distance you scroll the scrollbar each time**
keepShow|false|**Whether the scrollbar is keep show or not**
opacity|1|**The scrollbar's opacity when it is showing**

### Event

event|params|description
-----|------------|----
vscroll/hscroll|`bar,content,process`|bar is the information about scrollbar, and content the the information about the scrollcontent, and the process show the progress of the scrolling.

## Liscence

**vuescroll is under MIT liscence , pr or issue is welcome**
