import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/page/Login.vue'
import Home from '@/components/common/Home.vue'
import dashboard from '@/components/page/dashboard'
import menuManagement from '@/components/systemManagement/menuManagement'
import reinforceItem from '@/components/reinforceConfiguration/reinforceItem'
import reinforceStrategy from '@/components/reinforceConfiguration/reinforceStrategy'
import reinforce from '@/components/taskManagement/reinforce'
import channelStrategy from '@/components/reinforceConfiguration/channelStrategy'
import roleManagement from '@/components/systemManagement/roleManagement'
import signature from '@/components/reinforceConfiguration/signature'
import recommend from '@/components/page/recommend'
import userManagement from '@/components/systemManagement/userManagement'
import VueRouter from 'vue-router'
import index from '@/components/treeTable/index.vue'
//加固服务详情
import Detail from '@/components/taskManagement/Detail.vue'
import xx from '@/components/page/xx.vue'
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
                { path: "/dashboard", name: "dashboard", component: dashboard, meta: { requireAuth: true, KeepAlive: false } },
                {
                    path: "/menuManagement",
                    name: "menuManagement",
                    component: menuManagement,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/reinforceItem",
                    name: "reinforceItem",
                    component: reinforceItem,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/reinforceStrategy",
                    name: "reinforceStrategy",
                    component: reinforceStrategy,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/channelStrategy",
                    name: "channelStrategy",
                    component: channelStrategy,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/reinforce",
                    name: "xx",
                    component: xx,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/Detail:id",
                    name: 'Detail',
                    component: Detail,
                    meta: { requireAuth: true, KeepAlive: false }
                },

                {
                    path: "/roleManagement",
                    name: "roleManagement",
                    component: roleManagement,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/signature",
                    name: "signature",
                    component: signature,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/recommend",
                    name: "recommend",
                    component: recommend,
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/userManagement",
                    name: "userManagement",
                    component: userManagement,
                    meta: { requireAuth: true, KeepAlive: false }
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

