/*
 * vuescroll 1.0 
 * @author:wangyi qq:724003548
 * @date 2017年7月19日12:16:41
 * 参照着基于jQuery的simscroll所做的基于vue的滚动条插件
 * referred to simscroll
 */
(function(global, factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    typeof module !=='undefined'?module.exports=factory():(global.Vue.use(factory()));
})(window, function() {
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
            Vue.component(vueScroll.name, vueScroll);
            Vue.component(vuePanel.name, vuePanel);
            Vue.component(vueScrollCon.name, vueScrollCon);
        }
    };

    //用来计算内容高度的wrap
    var vueScrollCon = {
        name: 'vueScrollCon',
        render: function(createElement) {
            var self = this;

            bus.id1 = self.id1;
            console.log(this)
            return createElement('div', {
                style: self.customStyle
                ,
                attrs: {
                    id: this.id1
                },
                on: {
                    mouseenter: function() {

                        bus.$emit('getbarHeight' + self.id1);
                    }
                }
            }, this.$slots.default);
        },
        props:['customStyle'],
        data: function() {
            return {
                id1: "_ScrollCon" + new Date().valueOf()
            };
        }
    }
    //所滚动的div
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
                }
            }, this.$slots.default);
        },
        data: function() {
            return {
                id: "_Scroll" + new Date().valueOf()
            };
        }
    }
    //滚动条的样式。 可自行配置。
    var vueScroll = {
        name: 'vueScroll',
        render: function(createElement) {
            var self = this;

            return createElement('div', {
                class: 'vuescroll',
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
                    cursor: 'default'
                },
                attrs: {
                    id: self.id2
                },
                on: {
                    mouseenter: function(e) {
                        self.showBar();
                    },
                    mouseout: function(e) {
                        self.hideBar();
                    }
                }
            }, this.$slots.default);
        },
        data: function() {
            return {
                id2: "_ScrollBar" + new Date().valueOf(),
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
                    id1: bus.id1

                },
                innerdeltaY: 0,
                scrollElement: "",
                scrollInner: "",
                scrollHeight: "",
                scrollInnerHeight: "",
                minBarHeight: 35,
                mousedown: false
            }
            //deltal 每次滑动的距离
        },
        props: ['ops'],
        methods: {
            getBarHeight: function() {
                this.scrollHeight = window.getComputedStyle(this.scrollElement).getPropertyValue("height").replace('px', "");
                this.scrollInnerHeight = this.scrollElement.scrollHeight;
                //在每次滚动this.deltaY的情况下滚动完剩余部分所需要的次数
                var scrollTime = Math.ceil((this.scrollInnerHeight - this.scrollHeight) / Math.abs(this.options.deltaY));
                //选择合适的滚动条大小
                this.height = Math.max(this.scrollHeight / (this.scrollInnerHeight / this.scrollHeight), this.minBarHeight);
                //计算滚动条每次滚动的距离innerdeltaY
                this.innerdeltaY = (this.scrollHeight - this.height) / scrollTime;
                //调整top的值
                this.resizeTop();
                this.showBar();
            },
            resizeTop: function() {
                //先求出con剩余的值
                var lastHeight = this.scrollInnerHeight - this.scrollHeight - this.scrollElement.scrollTop;
                var time = Math.abs(Math.ceil(lastHeight / this.options.deltaY));
                this.top = this.scrollHeight - (this.height + (time * this.innerdeltaY));
            },
            showBar: function() {
                var bar = document.getElementById(this.id2);
                bar.style.opacity = 1;
            },
            hideBar: function() {
                if (!this.mousedown) {
                    var bar = document.getElementById(this.id2);
                    bar.style.opacity = 0;
                }
            },
            listenmouseout: function() {
                var self = this;
                self.$el.parentNode.addEventListener('mouseout', function(e) {
                    bus.$emit('hidebar');
                });
            },
            //监听滚轮事件
            listenwheel: function() {
                var self = this;
                self.$el.parentNode.addEventListener('wheel', function(e) {
                    //console.log(e.deltaY);
                    self.getBarHeight();
                    //
                    self.scrollCon(e.deltaY > 0 ? 1 : -1, 1);
                });
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
                self.$el.addEventListener('mousedown', function(e) {
                    console.log(e);
                    self.mousedown = true;
                    y = e.pageY;
                    document.addEventListener('mousemove', move);
                    document.addEventListener('mouseup', function(e) {
                        self.mousedown = false;
                        self.hideBar();
                        document.removeEventListener('mousemove', move);

                    });
                });
            },
            scrollCon: function(pos, time) {
                //pos：方向   1：向下滚动  0：向上滚动

                if (!((pos < 0 && this.top <= 0) || (this.scrollHeight <= this.top + this.height && pos > 0))) {
                    var Top = this.top + pos * this.innerdeltaY * time;
                    var ScrollTop = this.scrollElement.scrollTop + pos * this.options.deltaY * time;
                    if (pos < 0) {
                        //向上滚的
                        this.top = Math.max(0, Top);
                        this.scrollElement.scrollTop = Math.max(0, ScrollTop);
                    } else if (pos > 0) {
                        //向下滚得
                        this.top = Math.min(this.scrollHeight - this.height, Top);
                        this.scrollElement.scrollTop = Math.min(this.scrollInnerHeight - this.scrollHeight, ScrollTop);
                    }
                }
                var content = {};
                var bar = {};
                content.lastScrolled = (this.scrollElement.scrollHeight - this.scrollElement.scrollTop) + 'px';
                content.hasScrolled = this.scrollElement.scrollTop + 'px';
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
                return (this.scrollHeight - this.top - this.height) + 'px';
            }

        },

        mounted: function() {
            var self = this;
            self.scrollElement = document.getElementById(self.ids.id);
            self.scrollInner = document.getElementById(self.ids.id1);
            bus.$on('getbarHeight' + self.ids.id1, self.getBarHeight);
            bus.$on('hidebar', self.hideBar);
            self.merge(self.options, self.ops);
            self.getBarHeight();
            self.listenwheel();
            self.listenDrag();
            self.listenmouseout();
        }
    }
    return scroll;
});
