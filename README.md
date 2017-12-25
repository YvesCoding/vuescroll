# vuescroll V1.4.5
## 1.Controduction


This plugin is based on  [`vue.js`](https://github.com/vuejs/vue) <br> 

If you want to substitute vuescroll for raw browser scroll, so just use it !

## 2.UseAge

1.
If you are in browser envoriment. Include vuescroll.js and vue.js
```
 <script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
 <script src="js/vuescroll.js" type="text/javascript" charset="utf-8"></script>

```
Else if you are in nodejs envoriment.
```
npm i vuescroll

import Vue from 'vue
import vuesrcoll  from 'vuesroll';
Vue.use(vuesrcoll);
```
2.warp the div you want to scroll whit vuescroll components

```
<div id="scroll1">
	<div id="scroll1">
		<vueScroll :scrollPanelHeight="{height:'100%'}" :ops="ops" :scroll="detectscroll">
			<div class="content2">

			</div>
		</vueScroll>
	</div>
</div>
```
3.bind options of vuescroll
```
var aa = new Vue({
	el: '#scroll1',
	data: {
		ops: {
			background: "#cecece",
			width: '5px',
			deltaY: '100',
			float: 'right'
		}
	},
	methods: {
		detectscroll: function (bar, content) {
			console.log(bar);
			console.log(content);
		}
	}
});

```
The sample html style 
```
#scroll1 {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.scroll {
	width: 100%;
	height: 200px;
	overflow: hidden;
	background: linear-gradient(to bottom, #ffffff, #000000);
}

.content2 {
	width: 100%;
}
```

4.ok,that's all ! enjoy yourself with scrolling!
The Effect pic
![effectPic](https://raw.githubusercontent.com/wangyi7099/vuescroll/master/vuescroll/img/pic.png)

