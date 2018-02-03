    import Vue from 'vue';
/**
 * @description return the computed value of a dom
 * @author wangyi7099
 * @param {any} dom 
 * @param {any} property 
 */
    export function getComputed(dom, property) {
        return window.getComputedStyle(dom).getPropertyValue(property);
    }

    /**
     * @description deepCopy a object.
     * 
     * @param {any} source 
     * @returns 
     */
    export function deepCopy(source, target) {
        target = typeof target === 'object'&&target || {};
        for (var key in source) {
            target[key] = typeof source[key] === 'object' ? deepCopy(source[key], target[key] = {}) : source[key];
        }
        return target;
    }
    
    /**
     * 
     * @description deepMerge a object.
     * @param {any} from 
     * @param {any} to 
     */
    export function deepMerge(from, to) {
        to = to || {};
        for (var key in from) {
            if (typeof from[key] === 'object') {
                if (!to[key]) {
                    to[key] = {};
                    deepCopy(from[key], to[key])
                } else {
                    deepMerge(from[key], to[key]);
                }
            } else {
                if(!to[key])
                to[key] = from[key]
            }
        }
        return to;
    }
    /**
     * @description define a object reactive
     * @author wangyi
     * @export
     * @param {any} target 
     * @param {any} key 
     * @param {any} source 
     */
    export function defineReactive(target, key, source, souceKey) {
        souceKey = souceKey || key;
        Object.defineProperty(target, key, {
            get: function() {
                return source[souceKey];
            }
        })
    }



let scrollBarWidth;

export function getGutter() {
  if (Vue.prototype.$isServer) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement('div');
  outer.className = 'el-scrollbar__wrap';
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};