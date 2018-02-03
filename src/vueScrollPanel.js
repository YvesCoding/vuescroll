import {getGutter} from './util'

// vueScrollPanel
export default   {
    name: 'scrollPanel',
    render(_c) {
        let vm = this;
        let getter = getGutter();
        let style = {
            overflow: 'scroll'
        }
        if(getter) {
            style.marginRight = -getter + 'px';
            style.height = `calc(100% + ${getter}px)`
        } else {
            style.height = '100%';
            if(!getGutter.isUsed) {
                getGutter.isUsed = true;
                // add style
                let styleDom = document.createElement('style');
                styleDom.type = 'text/css';
                styleDom.innerHTML=".vueScrollPanel::-webkit-scrollbar{width:0;height:0}";
                document.getElementsByTagName('HEAD').item(0).appendChild(styleDom);
            }
        }
        return _c('div', {
            style: style,
            class: "vueScrollPanel",
            on: {
                scroll(e) {
                    vm.$emit('scrolling', e);
                },
                wheel(e) {
                    vm.$emit('wheeling', e);
                }
            }
        }, this.$slots.default);
    }
}