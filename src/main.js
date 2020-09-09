
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './request/api';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import guid from './guid'
import VueRouter from 'vue-router';
import resetMessage from './resetMessage';//设置ElementUi中的消息提示每次只弹出一个
Vue.use(ElementUI);
Vue.prototype.$message = resetMessage
Vue.config.productionTip = false
Vue.prototype.api = api;
Vue.prototype.guid = guid;
Vue.prototype.$axios = axios;
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {//判断路由是否需要登录权限
    if (localStorage.getItem('Authorization')) {
      next()
    } else {
      if (to.path === '/Login') {
        next();
      } else {
        next({
          path: "/Login"
        })
      }
    }

  } else {
    next()
  }
  if (to.fullPath == "/Login") {
    if (localStorage.getItem("Authorization")) {
      next({
        path: from.fullPath
      })
    } else {
      next()
    }
  }
})
