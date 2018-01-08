/*
 * vuescroll 2.0 
 * @author:wangyi qq:724003548
 * @date 2018 1.4
 * inspired by simscroll
 */
(function(global, factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    typeof module !=='undefined'?module.exports=factory():(global.Vue.use(factory()));
})(this, function() {
  
    var scroll = {
        install: function(Vue) {
            Vue.component(vScrollBar.name, vScrollBar);
            Vue.component(vueScrollPanel.name, vueScrollPanel);
            Vue.component(vueScrollCon.name, vueScrollCon);
            //vueScroll
            Vue.component(vueScroll.name, vueScroll);            
        }
    };
     //scrollpanne
     var vueScrollPanel = {
        name: 'vueScrollPanel',
        render: function(createElement) {
            var vm = this;
            return createElement('div', {
                style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'
                },
                class:"vueScrollPanel",
                on: {
                    mouseenter: function() {
                        vm.$emit('showBar');
                    },
                    mouseleave:  function() {
                        vm.$emit('hideBar');
                    }
                }
            }, this.$slots.default);
        },
        props: {
            id:{
                require:true
            }
        }
    }
    var vueScrollCon = {
        name: 'vueScrollCon',
        render: function(createElement) {
            var vm = this;
          //  console.log(this)
            return createElement('div', {
                style:vm.scrollContentStyle,
                class:"vueScrollContent",
            }, this.$slots.default);
        },
        props:{
            scrollContentStyle:{
                require:false,
                default:{
                    height: '100%'
                }
            }
        }
    }
   
    var vScrollBar = {
        name: 'vScrollBar',
        render: function(createElement) {
            var vm = this;
            return createElement('div', {
                style: {
                    height: vm.state.height + 'px',
                    width: vm.ops.width,
                    position: 'absolute',
                    background: vm.ops.background,
                    marginTop: vm.state.top + 'px',
                    right: (vm.ops.float == 'right' ? '0px' : ''),
                    transition: 'opacity .5s',
                    cursor: 'pointer',
                    opacity:vm.state.opacity,
                    userSelect: 'none',
                    top: '0px'
                },
                class:"vScrollBar",
                on: {
                    mouseenter: function(e) {
                        vm.$emit('showVBar');
                    } 
                }
            }, this.$slots.default);
        },
        props: {
            ops: {
                require:false,
                default:{
                    background: 'hsla(220,4%,58%,.3)',
                    width: '5px',
                    float: 'left',
                    opacity: 0
                }    
            },
            state: {
                top: {
                    default: 0
                },
                height: {
                    default: 0
                },
                opacity: {
                    default: 0
                }
            }
        }
    }
    var vueScroll = {
        name:"vueScroll",
        class: 'vueScroll',
        data(){
            return {
                scrollPanel: {
                    el:"",
                    ops: {

                    }  
                },
                scrollContent: {
                    el: "",
                    ops: {
                        height:"",
                        background: '#fff'
                    } 
                },
                vScrollBar: {
                    el: "",
                    ops: {
                        background: 'hsla(220,4%,58%,.3)',
                        width: '5px',
                        float: 'left',
                        deltaY:35
                    },
                    state: {
                        top: 0,
                        height: 0,
                        opacity: 0
                    },
                    minBarHeight: 35,
                    innerDeltaY: 0
                },
                listeners: [],
                mousedown:false,
                isMouseLeavePanel:false
            }
        },
        render: function(createElement) {
            var vm = this;
            return createElement('div', {
                style: {
                    position:'relative',
                    height:'100%'
                },
                on: {
                    wheel: vm.wheel
                }
                ,
            }, [
                createElement('vueScrollPanel',{
                    ref:'vueScrollPanel',
                    on: {
                        showBar: vm.showBar,
                        hideBar: vm.hideBar
                    }
                },[createElement('vueScrollCon',{
                    props:{
                        scrollContentStyle:vm.scrollContent.ops
                    },
                    ref:'vueScrollCon'
                },vm.$slots.default)]),  
                createElement('vScrollBar',{
                    props:{
                        ops: vm.vScrollBar.ops,
                        state: vm.vScrollBar.state
                    },
                    ref:'vScrollBar',
                    on: {
                        showVBar: vm.showVBar,
                        hideVBar: vm.hideVBar
                    }
                }),  
            ]);
        },
        mounted(){
            var vm = this;
            vm.initEl();
            vm.mergeAll();
            vm.listenDrag();
        },
        methods:{
            initEl() {
                var vm = this;
                vm.scrollPanel.el = vm.$refs['vueScrollPanel'] && vm.$refs['vueScrollPanel'].$el;
                vm.scrollContent.el = vm.$refs['vueScrollCon'] && vm.$refs['vueScrollCon'].$el;
                vm.vScrollBar.el = vm.$refs['vScrollBar'] && vm.$refs['vScrollBar'].$el;
            },
            mergeAll() {
                this.merge(this.ops , this.vScrollBar.ops);
                this.merge(this.scrollContentStyle , this.scrollContent.ops);
            },
            merge(from , to) {
                for(key in from) {
                    if(Object.hasOwnProperty.call(to, key)) {
                        to[key] = from[key];
                    }
                }
            },
            // get the bar height
            getVBarHeight({deltaY}) {
                var scrollPanelHeight = window.getComputedStyle(this.scrollPanel.el).getPropertyValue("height").replace('px', "");
                var scrollPanelScrollHeight = this.scrollPanel.el.scrollHeight;
                // the last times that vertical scrollvar will scroll...
                var scrollTime = Math.ceil((scrollPanelScrollHeight - scrollPanelHeight) / Math.abs(deltaY));
                // choose the proper height for scrollbar
                var height = Math.max(scrollPanelHeight / (scrollPanelScrollHeight / scrollPanelHeight), this.vScrollBar.minBarHeight);
                if(scrollPanelScrollHeight <= scrollPanelHeight){
                    height = 0;
                    return height;
                }
                // the distance that scrollbar scrolls each time
                this.vScrollBar.innerDeltaY = (scrollPanelHeight - height) / scrollTime;
                return {
                    height,
                    scrollPanelHeight,
                    scrollPanelScrollHeight,
                    deltaY
                }
            },
            resizeVBarTop(
                {
                    height,
                    scrollPanelHeight,
                    scrollPanelScrollHeight,
                    deltaY
                }
            ) {
                 // cacl the last height first
                 var lastHeight = scrollPanelScrollHeight - scrollPanelHeight - this.scrollPanel.el.scrollTop;
                 var time = Math.abs(Math.ceil(lastHeight / deltaY));
                 var top = scrollPanelHeight - (height + (time * this.vScrollBar.innerDeltaY)); 
                 return top;
            },
            // show All bar
            showBar() {
                this.isMouseLeavePanel = false;
                this.showVBar();
            },
            // hide all bar
            hideBar() {
                this.isMouseLeavePanel = true;    
                this.hideVBar();
               
            },
            // showVbar
            showVBar() {
                var temp;
                var deltaY = {deltaY:this.vScrollBar.ops.deltaY};
                if((temp = this.getVBarHeight(deltaY))) {
                    this.vScrollBar.state.top = this.resizeVBarTop(temp);
                    this.vScrollBar.state.height = temp.height;
                    this.vScrollBar.state.opacity = 1;
                } 
            },
            // hideVbar
            hideVBar() {
                if(!this.mousedown && this.isMouseLeavePanel) {
                this.vScrollBar.state.opacity = 0;
                }
            },
            // listen wheel scrolling
            wheel(e) {
                var vm = this;
                vm.showVBar();
                vm.scrollVBar(e.deltaY > 0 ? 1 : -1, 1);
                e.stopPropagation();
            },
            scrollVBar: function(pos, time) {
                // 1ï¼šscroll to down  0ï¼šscroll to up
                var top = this.vScrollBar.state.top;
                var scrollPanelHeight = window.getComputedStyle(this.scrollPanel.el).getPropertyValue("height").replace('px', "");
                var scrollPanelScrollHeight = this.scrollPanel.el.scrollHeight;
                var scrollPanelScrollTop = this.scrollPanel.el.scrollTop;
                var height =  this.vScrollBar.state.height;
                var innerdeltaY = this.vScrollBar.innerDeltaY;
                var deltaY = this.vScrollBar.ops.deltaY;
                if (!((pos < 0 && top <= 0) || (scrollPanelHeight <= top + height && pos > 0))) {
                    var Top = top + pos * innerdeltaY * time;
                    var ScrollTop = scrollPanelScrollTop + pos * deltaY * time;
                    if (pos < 0) {
                        // scroll ip
                        this.vScrollBar.state.top = Math.max(0, Top);
                        this.scrollPanel.el.scrollTop = Math.max(0, ScrollTop);
                    } else if (pos > 0) {
                        // scroll down
                        this.vScrollBar.state.top = Math.min(scrollPanelHeight - height, Top);
                        this.scrollPanel.el.scrollTop = Math.min(scrollPanelScrollHeight - scrollPanelHeight, ScrollTop);
                    }
                }
                var content = {};
                var bar = {};
                content.lastScrolled = (scrollPanelScrollHeight - scrollPanelScrollTop) + 'px';
                content.hasScrolled = scrollPanelScrollTop + 'px';
                bar.hasScrolled = this.vScrollBar.state.top + 'px';
                bar.height = this.vScrollBar.state.height + 'px';
                bar.name = "bar";
                content.name = "content";
                this.$emit('scroll', bar, content);
            },
            listenDrag: function() {
                var vm = this;
                var y;
                var _y;
                function move(e) {
                    _y = e.pageY;
                    var _delta = _y - y;
                    vm.scrollVBar(_delta > 0 ? 1 : -1, Math.abs(_delta / vm.vScrollBar.innerDeltaY));
                    y = _y;
                }
                function t(e) {
                    //console.log(e);
                    vm.mousedown = true;
                    y = e.pageY;
                    vm.showVBar();
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        vm.mousedown = false;
                        vm.hideVBar();
                        document.removeEventListener('mousemove', move);
                    });
                }
                this.listeners.push({
                    dom:vm.vScrollBar.el,
                    event:t,
                    type:"mousedown"
                });
                vm.vScrollBar.el.addEventListener('mousedown',t);
            }
        },
        props:['ops', 'scrollContentStyle']
    }

    function noop(){}

    return scroll;
});
