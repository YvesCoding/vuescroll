# vuescroll V2.5.0
> 1.Controduction

vuescroll is a very easy virtuall scrollBar based on [vue.js](https://github.com/vuejs/vue),whichi is supporting **vertical** scroll and horizontal **scroll** ,  and now, let me introduce how to use it.

> UseAge

If you are in a browser envoriment. You shoule include vuescroll.js and vue.js by script:
```html
 <script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
 <script src="js/vuescroll.js" type="text/javascript" charset="utf-8"></script>

```
And if you are in the nodejs envoriment:
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

> HTML
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
>JavaScript
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
		detectVBar(bar, content) {
			console.log(bar ,content);
		},
		detectHBar(bar, content) {
			console.log(bar ,content);
		}
	}
});
```
> CSS
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
That's all! It is so easy , isn't it?
> The picture

![pic](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/others/vuescroll.gif?raw=true)

> End

If you like this, please give me a star, or if you have and suggestion, please give me a pr or an issue. <br/>

**vuescroll under MIT by wangyi7099**
