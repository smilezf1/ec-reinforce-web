// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './api';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
//qs是一个增加了一些安全性的查询字符串解析和序列化字符串的库
import QS from 'qs';
import guid from './guid'
import VueRouter from 'vue-router';
Vue.config.productionTip = false
Vue.prototype.api = api; //全局变量地址  this.api.baseUrl
Vue.prototype.guid = guid;
Vue.prototype.$axios = axios;//在其他组件中this.$http.post(get)发送请求
Vue.prototype.qs = QS;
Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
