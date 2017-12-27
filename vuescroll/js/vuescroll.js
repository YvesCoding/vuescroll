/*
 * vuescroll 1.4.5 
 * @author:wangyi qq:724003548
 * @date 2017年7月19日12:16:41
 * 参照着基于jQuery的simscroll所做的基于vue的滚动条插件
 * referred to simscroll
 */
(function(global, factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    typeof module !=='undefined'?module.exports=factory():(global.Vue.use(factory()));
})(this, function() {
    var bus;
    //组件间通信的事件总线

    var scroll = {
        install: function(Vue) {
            bus = new Vue({
                data: {
                    id: "",
                    id1: "",
                    id2: ""
                }
            });
            Vue.component(scrollBar.name, scrollBar);
            Vue.component(vuePanel.name, vuePanel);
            Vue.component(vueScrollCon.name, vueScrollCon);
            //vueScroll
            Vue.component(vueScroll.name, vueScroll);            
        }
    };
     //scrollpanne
     var vuePanel = {
        name: 'vueScrollpanel',
        render: function(createElement) {
            var self = this;
            bus.id = self.id;
            return createElement('div', {
                style: {
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden'

                },
                attrs: {
                    id: self.id
                },
                on: {
                    mouseenter: function() {
                        bus.$emit('getbarHeight' + self.id);
                    }
                }
            }, this.$slots.default);
        },
        data: function() {
            return {
                id: "_ScrollPannel" + new Date().valueOf()
            };
        }
    }
    //scrollCon 高度和内容高度保持一致
    var vueScrollCon = {
        name: 'vueScrollCon',
        render: function(createElement) {
            var self = this;

            bus.id1 = self.id1;
          //  console.log(this)
            return createElement('div', {
                style: self.scrollContentStyle
                ,
                attrs: {
                    id: this.id1
                }
            }, this.$slots.default);
        },
        props:['scrollContentStyle'],
        data: function() {
            return {
                id1: "_ScrollCon" + new Date().valueOf()
            };
        }
    }
   
    //滚动条 样式等参数可自行配置。
    var scrollBar = {
        name: 'scrollBar',
        render: function(createElement) {
            var self = this;
            return createElement('div', {
                style: {
                    height: self.sHeight,
                    width: self.options.width,
                    // '5px',
                    position: 'absolute',
                    background: self.options.background,
                    //'#2c3a2c', 
                    top: '0px',
                    marginTop: self.sTop,
                    right: (self.options.float == 'right' ? '0px' : ''),
                    transition: 'opacity .5s',
                    cursor: 'pointer',
                    opacity:0
                },
                attrs: {
                    id: self.ids.id2
                },
                on: {
                    mouseover: function(e) {
                        self.showBar();
                    },
                    mouseleave: function(e) {
                        self.hideBar();
                    }
                }
            }, this.$slots.default);
        },
        data: function() {
            return {
                top: 0,
                height: 0,
                options: {
                    deltaY: 50,
                    background: '#2c3a2c',
                    width: '5px',
                    float: 'left'
                },
                ids: {
                    id: bus.id,
                    id1: bus.id1,
                    id2:"_ScrollBar" + new Date().valueOf()
                },
                innerdeltaY: 0,
                scrollPanel: "",
                scrollContent: "",
                scrollBar:"",
                scrollPanelHeight: "",
                scrollPanelScrollHeight: "",
                minBarHeight: 35,
                mousedown: false,
                listeners:[]
            }
            //deltal 每次滑动的距离
        },
        props: ['ops'],
        methods: {
            getBarHeight: function() {
                this.scrollPanelHeight = window.getComputedStyle(this.scrollPanel).getPropertyValue("height").replace('px', "");
                this.scrollPanelScrollHeight = this.scrollPanel.scrollHeight;
                //在每次滚动this.deltaY的情况下滚动完剩余部分所需要的次数
                var scrollTime = Math.ceil((this.scrollPanelScrollHeight - this.scrollPanelHeight) / Math.abs(this.options.deltaY));
                //选择合适的滚动条大小
                this.height = Math.max(this.scrollPanelHeight / (this.scrollPanelScrollHeight / this.scrollPanelHeight), this.minBarHeight);
                if(this.scrollPanelScrollHeight <= this.scrollPanelHeight){
                    this.height = 0;
                }
                //计算滚动条每次滚动的距离innerdeltaY
                this.innerdeltaY = (this.scrollPanelHeight - this.height) / scrollTime;
                //调整top的值
                this.resizeTop();
                this.showBar();
            },
            resizeTop: function() {
                //先求出con剩余的值
                var lastHeight = this.scrollPanelScrollHeight - this.scrollPanelHeight - this.scrollPanel.scrollTop;
                var time = Math.abs(Math.ceil(lastHeight / this.options.deltaY));
                this.top = this.scrollPanelHeight - (this.height + (time * this.innerdeltaY));
            },
            showBar: function() {
                if(this.scrollPanelHeight < this.scrollPanelScrollHeight){
                    var bar = this.scrollBar;
                    bar.style.opacity = 1;
                }
            },
            hideBar: function() {
                if (!this.mousedown) {
                    var bar = this.scrollBar
                    bar.style.opacity = 0;
                }
            },
            listenmouseout: function() {
                var self = this;
                function t() {
                    bus.$emit('hidebar');
                }
                this.listeners.push({
                    dom:self.$el.parentNode,
                    event:t,
                    type:"mouseleave"
                });
                self.$el.parentNode.addEventListener('mouseleave', t);
            },
            //监听滚轮事件
            listenwheel: function() {
                var self = this;
                function t(e) {
                    //console.log(e.deltaY);
                    self.getBarHeight();
                    //
                    self.scrollCon(e.deltaY > 0 ? 1 : -1, 1);
                }
                this.listeners.push({
                    dom:self.$el.parentNode,
                    event:t,
                    type:"wheel"
                });
                self.$el.parentNode.addEventListener('wheel',t);
            },
            //监听拖拽滚动条的事件
            listenDrag: function() {
                var self = this;
                var y;
                var _y;
                function move(e) {

                    _y = e.pageY;
                    var _delta = _y - y;
                    self.scrollCon(_delta > 0 ? 1 : -1, Math.abs(_delta / self.innerdeltaY));
                    y = _y;

                }
                function t(e) {
                    //console.log(e);
                    self.mousedown = true;
                    y = e.pageY;
                    self.showBar();
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        self.mousedown = false;
                        self.hideBar();
                        document.removeEventListener('mousemove', move);

                    });
                }
                this.listeners.push({
                    dom:self.$el,
                    event:t,
                    type:"mousedown"
                });
                self.$el.addEventListener('mousedown',t);
            },
            scrollCon: function(pos, time) {
                //pos：方向   1：向下滚动  0：向上滚动

                if (!((pos < 0 && this.top <= 0) || (this.scrollPanelHeight <= this.top + this.height && pos > 0))) {
                    var Top = this.top + pos * this.innerdeltaY * time;
                    var ScrollTop = this.scrollPanel.scrollTop + pos * this.options.deltaY * time;
                    if (pos < 0) {
                        //向上滚的
                        this.top = Math.max(0, Top);
                        this.scrollPanel.scrollTop = Math.max(0, ScrollTop);
                    } else if (pos > 0) {
                        //向下滚得
                        this.top = Math.min(this.scrollPanelHeight - this.height, Top);
                        this.scrollPanel.scrollTop = Math.min(this.scrollPanelScrollHeight - this.scrollPanelHeight, ScrollTop);
                    }
                }
                var content = {};
                var bar = {};
                content.lastScrolled = (this.scrollPanel.scrollHeight - this.scrollPanel.scrollTop) + 'px';
                content.hasScrolled = this.scrollPanel.scrollTop + 'px';
                bar.hasScrolled = this.sTop;
                bar.height = this.sHeight;
                bar.lastScrolled = this.barlastScrolled;
                bar.name = "bar";
                content.name = "content";
                this.$emit('scroll', bar, content);
            },
            merge: function(target, source) {
                for (key in source) {
                    if (source[key]) {
                        target[key] = source[key];
                    }
                }
                return source;
            }
        },
        computed: {
            sTop: function() {
                return this.top + 'px';
            },
            sHeight: function() {
                return this.height + 'px';
            },
            barlastScrolled: function() {
                return (this.scrollPanelHeight - this.top - this.height) + 'px';
            }

        },
        beforeCreate(){
            var self = this;
              
        },
        mounted: function() {
            var self = this;
            self.scrollPanel = document.getElementById(self.ids.id);
            self.scrollContent = document.getElementById(self.ids.id1);
            self.scrollBar = document.getElementById(self.ids.id2);
            bus.$on('getbarHeight' + self.ids.id, self.getBarHeight);
            bus.$on('hidebar', self.hideBar);
            self.merge(self.options, self.ops);
            self.listenwheel();
            self.listenDrag();
            self.listenmouseout();
            self.getBarHeight();
        },
        beforeDestroy(){
            //
            this.listeners.map((element) => {
                element.dom.removeEventListener(element.type,element.event);
            })
        }
    }
    var vueScroll = {
        name:"vueScroll",
        class: 'vueScroll',        
        render: function(createElement) {
            var self = this;
            return createElement('div', {
                style: {
                    position:'relative',
                    height:'100%'
                }
                ,
            }, [
                createElement('vueScrollpanel',{

                },[createElement('vueScrollCon',{
                    props:{
                        scrollContentStyle:self.scrollContentStyle
                    }
                },self.$slots.default)]),  
                createElement('scrollBar',{
                    props:{
                        ops:self.ops
                    },
                    on:{
                       scroll:self.scroll||noop 
                    }
                }),  
            ]);
        },
        props:{
            ops:{
                require:false
            } ,
            scroll:{
                require:false
            } ,
            scrollContentStyle:{
                require:false
            }  
        }  
    }
    function noop(){}
    return scroll;
});
