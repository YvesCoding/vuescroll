/**
 * Augment the typings of Vue.js
 */

import Vue from 'vue';
import Config from './Config';

declare module 'vue/types/vue' {
  interface Vue {
    $vuescrollConfig: Config;
  }
}
