// vueScrollPanel
export default   {
    name: 'scrollPanel',
    methods: {
        // trigger scrollPanel options initialScrollX, 
        // initialScrollY
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
        let data = {
            class: ['vuescroll-panel']
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
        },
        state: {

        }
    }
}