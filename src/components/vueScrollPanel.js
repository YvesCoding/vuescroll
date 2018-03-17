import {getGutter} from '../util'

// vueScrollPanel
export default   {
    name: 'scrollPanel',
    methods: {
        updateInitialScroll() {
            let x = 0;
            let y = 0;
            if(this.ops.initialScrollX) {
                x = this.ops.initialScrollX;
            }
            if(this.ops.initialScrollY) {
                y = this.ops.initialScrollY;
            }
            this.$parent.scrollTo({
                x,
                y
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            if(!this._isDestroyed) {
                this.updateInitialScroll();
            };
        })
    },
    render(h) {
        let gutter = getGutter();
        let style = {
            overflow: 'scroll'
        }
        if(gutter) {
            style.marginRight = -gutter + 'px';
            style.height = `calc(100% + ${gutter}px)`;
            style.marginBottom = -gutter + 'px';
        } else /* istanbul ignore next */{
            style.height = '100%';
            if(!getGutter.isUsed) {
                getGutter.isUsed = true;
                // for macOs user, the gutter will be 0,
                // so, we hide the system scrollbar
                let styleDom = document.createElement('style');
                styleDom.type = 'text/css';
                styleDom.innerHTML=".vueScrollPanel::-webkit-scrollbar{width:0;height:0}";
                document.getElementsByTagName('HEAD').item(0).appendChild(styleDom);
            }
        }
        let data = {
            style: style,
            class: ['scrollPanel']
        }
        return (
            <div
                {...data}
            >
                {[this.$slots.default]}
            </div>
        );
    },
    props: {
        ops: {
            default() {
                /* istanbul ignore next */
                return {

                }
            },
            validator: function (ops) {
                ops = ops || {};
                let rtn = true;
                const initialScrollY = ops['initialScrollY'];
                const initialScrollX = ops['initialScrollX'];
                if(initialScrollY && !String(initialScrollY).match(/^\d+(\.\d+)?(%)?$/)) {
                    console.error('[vuescroll]: The prop `initialScrollY` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.')
                    rtn = false;
                }
                if(initialScrollX && !String(initialScrollX).match(/^\d+(\.\d+)?(%)?$/)) {
                    console.error('[vuescroll]: The prop `initialScrollX` should be a percent number like 10% or an exact number that greater than or equal to 0 like 100.')
                    rtn = false;
                }
                return rtn;
            }
        }
    }
}