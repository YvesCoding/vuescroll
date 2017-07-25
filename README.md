# vuescroll V1.3
## 1.Controduction


This plugin is based on  [`vue.js`](https://github.com/vuejs/vue) <br> 

If you want to substitute vuescroll for raw browser scroll, so just use it !

## 2.UseAge

1.Include vuescroll.js and vue.js
```
 <script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
 <script src="js/vuescroll.js" type="text/javascript" charset="utf-8"></script>

```
2.warp the div you want to scroll whit vuescroll components

```
<div id="scroll1">
            <div class="scroll" style="position: relative;">
				<vue-scrollPanel>
					<vue-scroll-con>
						<div class="content2">

						</div>
					</vue-scroll-con>
				</vue-scrollPanel>
				<vue-scroll :ops="ops" @scroll="lookscroll">

				</vue-scroll>
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
				lookscroll: function(bar, content) {
					console.log(bar);
					console.log(content);
				}
			}
		});

```
4.ok.that'all,you can run and look the result.

The complete content you can see the demo.
