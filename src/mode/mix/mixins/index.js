import api from './api';
import core from './core';

import slideMix from 'mode/slide/mixins/update-slide';
import nativeMix from 'mode/native/mixins/update-native';

let mixins = [api, core, slideMix, nativeMix];
export default mixins;
