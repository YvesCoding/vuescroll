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
            
        },
        state: {

        }
    }
}