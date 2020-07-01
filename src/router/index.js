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
            /* component: index */
            component: yy
        },
        {
            path: "/",
            component: Home,
            children: [
                { path: "/dashboard", name: "dashboard", component: dashboard },
                {
                    path: "/menuManagement",
                    name: "menuManagement",
                    component: menuManagement
                },
                {
                    path: "/reinforceItem",
                    name: "reinforceItem",
                    component: reinforceItem
                },
                {
                    path: "/reinforceStrategy",
                    name: "reinforceStrategy",
                    component: reinforceStrategy
                },
                {
                    path: "/channelStrategy",
                    name: "channelStrategy",
                    component: channelStrategy
                },
                {
                    path: "/reinforce",
                    name: "reinforce",
                    component: reinforce
                },
                {
                    path: "/roleManagement",
                    name: "roleManagement",
                    component: roleManagement
                },
                {
                    path: "/signature",
                    name: "signature",
                    component: signature
                },
                {
                    path: "/recommend",
                    name: "recommend",
                    component: recommend
                },
                {
                    path: "/userManagement",
                    name: "userManagement",
                    component: userManagement
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
//导航守卫 使用router.beforeEach 注册一个全局前置守卫,判断用户是否登录
router.beforeEach((to, from, next) => {
    if (to.path === "/Login") {
        next()
    } else {
        let token = localStorage.getItem("Authorization");
        if (token === "null" || token === '') {
            console.log("111")
            next('/Login')
        } else {
            next()
        }
    }
})

export default router;

