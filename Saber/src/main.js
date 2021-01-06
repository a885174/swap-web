import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import {
    iconfontUrl,
    iconfontVersion
} from '@/config/env';
import i18n from './lang' // Internationalization
import './styles/common.scss';
import VueCropper from 'vue-cropper'
import basicContainer from './components/basic-container/main'
import TinymceEditor from './components/tinymce-editor/tinymce-editor'

import mapbox from './components/mapbox/mapbox'

import VueMapbox from "vue-mapbox";
import Mapbox from "mapbox-gl";
import AvueMap from 'avue-plugin-map'
import AvueUeditor from 'avue-plugin-ueditor'
import global_ from './Global.vue'
import * as VueGoogleMaps from 'vue2-google-maps'


Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyBFhdyjOq_mAY67fbNpgkADkb3fXXOHIdU',
      libraries: 'places' // This is required if you use the Autocomplete plugin
    }
  })

Vue.use(VueCropper)
Vue.use(VueMapbox, { mapboxgl: Mapbox });
Vue.use(AvueUeditor);
Vue.use(AvueMap);

Vue.use(router)
Vue.use(VueAxios, axios)

Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
})
Vue.use(window.AVUE, {
    i18n: (key, value) => i18n.t(key, value)
})

// Vue.prototype.GLOBAL = global_;
// axios.defaults.baseURL=global_.BASE_URL;
// axios.defaults.timeout=1800;
// axios.defaults.withCredentials=true;
Vue.prototype.$t = (key, value) => i18n.t(key, value);




Vue.use(window.AVUE, {
    ali: {
      region: 'oss-ap-southeast-5.aliyuncs.com',
      endpoint: 'swap-project.oss-ap-southeast-5.aliyuncs.com',
      accessKeyId:'LTAI4FgKnWMoBGEPH9v69Rem',
      accessKeySecret: '0yXCfAArIzqoQkXbfYwTCS5pjg69ID ',
      bucket: 'swap-project'
    }
})
//注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('mapbox-map', mapbox)

Vue.component('TinymceEditor', TinymceEditor)

// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele));
})                                                                                                                                                                                                                                                                          

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app')