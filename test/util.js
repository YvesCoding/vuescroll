import Vue from 'vue';
import vuescroll from 'src/index';

Vue.use(vuescroll);

// https://github.com/ElemeFE/element/blob/dev/test/unit/util.js#L60

let id = 0;

const createElm = function() {
  const elm = document.createElement('div');

  elm.id = 'app' + ++id;
  document.body.appendChild(elm);

  return elm;
};

/**
 * Crate a vue instance
 * 
 * @export
 * @param {any} Compo 
 * @param {boolean} [mounted=false] 
 * @returns 
 */
export  function createVue(Compo, mounted = false) {
  if (Object.prototype.toString.call(Compo) === '[object String]') {
    Compo = { template: Compo };
  }
  return new Vue(Compo).$mount(mounted === false ? null : createElm());
}
/**
 * mount a component instance
 * 
 * @export
 * @param {any} Compo 
 * @param {any} [propsData={}] 
 * @param {boolean} [mounted=false] 
 * @returns 
 */
export function createTest (Compo, propsData = {}, mounted = false) {
  if (propsData === true || propsData === false) {
    mounted = propsData;
    propsData = {};
  }
  const elm = createElm();
  const Ctor = Vue.extend(Compo);
  return new Ctor({ propsData }).$mount(mounted === false ? null : elm);
}

export function destroyVM (vm) {
  vm.$destroy && vm.$destroy();
  vm.$el &&
  vm.$el.parentNode &&
  vm.$el.parentNode.removeChild(vm.$el);
}

/**
 * trigger an event
 */
export function trigger(elm, name, ...opts) {
  let evt = null;
  if (/^mouse|click/.test(name)) {
    evt = new MouseEvent(name, ...opts);
  } else if (/^key/.test(name)) {
    evt = new KeyboardEvent(name, ...opts);
  } else {
    evt = new Event(name, ...opts);
  }
  elm.dispatchEvent
    ? elm.dispatchEvent(evt)
    : elm.fireEvent('on' + name, evt);
  return elm;
}