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
import systemRecommend from '@/components/page/systemRecommend'
import userManagement from '@/components/page/userManagement'
import VueRouter from 'vue-router'
Vue.use(Router);
//解决 Element UI 导航栏重复点击菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}
export default new Router({
    routes: [
        {
            path: "/",
            redirect: '/dashboard'
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
                    component: systemRecommend
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
