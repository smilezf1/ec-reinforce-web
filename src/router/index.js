import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/page/Login.vue'
import Home from '@/components/common/Home.vue'
import dashboard from '@/components/page/dashboard'
import menuManagement from '@/components/page/menuManagement'
import reinforceItem from '@/components/page/reinforceItem'
import reinforceStrategy from '@/components/page/reinforceStrategy'
import reinforce from '@/components/page/reinforce'
import channelStrategy from '@/components/page/channelStrategy'
import roleManagement from '@/components/page/roleManagement'
import signature from '@/components/page/signature'
import recommend from '@/components/page/recommend'
import userManagement from '@/components/page/userManagement'
import VueRouter from 'vue-router'
import xx from '@/components/common/xx.vue'
import yy from '@/components/common/yy.vue'
import index from '@/components/treeTable/index.vue'
Vue.use(Router);
//解决 Element UI 导航栏重复点击菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}
const router = new Router({
    routes: [
        {
            path: "/",
            name: "Login",
            component: Login
        },
        {
            path: "/Home",
            component: Home,
            meta: { requireAuth: true },//判断是否需要登录
            children: [
                { path: "/dashboard", name: "dashboard", component: dashboard, meta: { requireAuth: true } },
                {
                    path: "/menuManagement",
                    name: "menuManagement",
                    component: menuManagement,
                    meta: { requireAuth: true }
                },
                {
                    path: "/reinforceItem",
                    name: "reinforceItem",
                    component: reinforceItem,
                    meta: { requireAuth: true }
                },
                {
                    path: "/reinforceStrategy",
                    name: "reinforceStrategy",
                    component: reinforceStrategy,
                    meta: { requireAuth: true }
                },
                {
                    path: "/channelStrategy",
                    name: "channelStrategy",
                    component: channelStrategy,
                    meta: { requireAuth: true }
                },
                {
                    path: "/reinforce",
                    name: "reinforce",
                    component: reinforce,
                    meta: { requireAuth: true }
                },
                {
                    path: "/roleManagement",
                    name: "roleManagement",
                    component: roleManagement,
                    meta: { requireAuth: true }
                },
                {
                    path: "/signature",
                    name: "signature",
                    component: signature,
                    meta: { requireAuth: true }
                },
                {
                    path: "/recommend",
                    name: "recommend",
                    component: recommend,
                    meta: { requireAuth: true }
                },
                {
                    path: "/userManagement",
                    name: "userManagement",
                    component: userManagement,
                    meta: { requireAuth: true }
                }
            ]
        },
        {
            path: "/Login",
            name: "Login",
            component: Login
        },
    ]
})
export default router;

