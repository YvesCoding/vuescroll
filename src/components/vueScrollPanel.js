import {getGutter} from '../util'

// vueScrollPanel
export default   {
    name: 'scrollPanel',
    methods: {
        extractScrollDistance(distance, scroll) {
            let number;
            if(!(number = /(\d+)%$/.exec(distance))) {
                number = distance;
            } else {
                number = number[1];
                number = this.$el[scroll] * number / 100;
            }
            return number;
        },
        updateInitialScroll() {
            if(this.ops.initialScrollX) {
                const scroll = 'scrollWidth';
                const number = this.extractScrollDistance(this.ops.initialScrollX, scroll);
                this.$el['scrollLeft'] = number;
            }
            if(this.ops.initialScrollY) {
                const scroll = 'scrollHeight';
                const number = this.extractScrollDistance(this.ops.initialScrollY, scroll);
                this.$el['scrollTop'] = number;
            }
        }
    },
    mounted() {
        this.updateInitialScroll();
    },
    updated() {
        this.updateInitialScroll();
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
            style: style
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