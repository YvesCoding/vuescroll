import Vue from 'vue';
import vuescroll from 'src/mode/entry-mix';
export { vuescroll };

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
export function createVue(Compo, mounted = false) {
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
export function createTest(Compo, propsData = {}, mounted = false) {
  if (propsData === true || propsData === false) {
    mounted = propsData;
    propsData = {};
  }
  const elm = createElm();
  const Ctor = Vue.extend(Compo);
  return new Ctor({ propsData }).$mount(mounted === false ? null : elm);
}

export function destroyVM(vm) {
  vm.$destroy && vm.$destroy();
  vm.$el && vm.$el.parentNode && vm.$el.parentNode.removeChild(vm.$el);
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
  elm.dispatchEvent ? elm.dispatchEvent(evt) : elm.fireEvent('on' + name, evt);
  return elm;
}

export function makeTemplate(
  child,
  parent,
  templateAttribute = null,
  num = 1,
  extraTmpl = ''
) {
  return `
    <div style="width:${parent.w}px;height:${parent.h}px">
      <vue-scroll ref="vs" ${templateAttribute || ''} :ops="ops">
        <div 
        v-for="i in ${num}"
        :key="i"
        :id="'d' + i"
        style="width:${child.w}px;height:${child.h}px">
        </div>
        ${extraTmpl}
      </vue-scroll>
    </div>
  `;
}

export function startSchedule(time = 0) {
  let queue = [];
  function wait(time = 0) {
    queue.push({
      type: 'wait',
      value: time
    });
    return {
      then,
      wait
    };
  }
  function then(cb = () => {}) {
    queue.push({
      type: 'then',
      value: cb
    });
    return {
      then,
      wait
    };
  }
  function loopSchedule() {
    if (!queue.length) {
      return;
    }

    let current = queue.shift();
    if (current.type == 'wait') {
      setTimeout(() => {
        loopSchedule();
      }, current.value);
    } else if (current.type == 'then') {
      if (current.value.length > 0) {
        let timeId = setTimeout(() => {
          loopSchedule();
        }, 5000); // timeout 5s
        current.value(() => {
          clearTimeout(timeId);
          setTimeout(() => {
            loopSchedule();
          }, 0);
        });
      } else {
        current.value();
        setTimeout(() => {
          loopSchedule();
        }, 0);
      }
    }
  }

  queue.push({
    type: 'wait',
    value: time
  });

  loopSchedule();
  return {
    then,
    wait
  };
}

export { Vue };
