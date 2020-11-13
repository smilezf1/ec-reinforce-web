import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'
Vue.use(Router);
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}
const router = new Router({
    routes: [
        {
            path: "/",
            name: "Login",
            component: () => import("../components/page/Login.vue")
        },
        {
            path: "/home",
            component: () => import("../components/common/Home.vue"),
            meta: { requireAuth: true },
            children: [
                { path: '/404', name: 'notFound', component: () => import("../components/error/404.vue") },
                { path: "dashboard", name: "dashboard", component: () => import("../components/page/dashboard"), meta: { requireAuth: true, KeepAlive: false } },
                {
                    path: "reinforceItem",
                    name: "reinforceItem",
                    component: () => import("../components/reinforceConfiguration/reinforceItem"),
                    meta: { requireAuth: true }
                },
                {
                    path: "reinforceStrategy",
                    name: "reinforceStrategy",
                    component: () => import("../components/reinforceConfiguration/reinforceStrategy"),
                    meta: { requireAuth: true }
                },
                {
                    path: "channelStrategy",
                    name: "channelStrategy",
                    component: () => import("../components/reinforceConfiguration/channelStrategy"),
                    meta: { requireAuth: true }
                },
                {
                    path: "reinforce/list",
                    name: "reinforce",
                    component: () => import("../components/reinforce/list")
                },
                { path: 'reinforce/detail', name: 'detail', component: () => import("../components/reinforce/detail.vue") },
                {
                    path: "reinforce/log",
                    name: "log",
                    component: () => import("../components/reinforce/log.vue"),
                    meta: { requireAuth: true }
                },
                {
                    path: "signature",
                    name: "signature",
                    component: () => import("../components/reinforceConfiguration/signature"),
                    meta: { requireAuth: true }
                },
                {
                    path: "system/role/list",
                    name: "roleManagement",
                    component: () => import("../components/systemManagement/roleManagement"),
                    meta: { requireAuth: true }
                },
                {
                    path: "system/menu/list",
                    name: "menuManagement",
                    component: () =>
                        import("../components/systemManagement/menuManagement"),
                    meta: { requireAuth: true }
                },
                {
                    path: "system/user/list",
                    name: "userManagement",
                    component: () => import("../components/systemManagement/userManagement"),
                    meta: { requireAuth: true }
                },
                {
                    path: "system/authorize/list",
                    name: "authorizeManagement",
                    component: () => import("../components/systemManagement/authorizeManagement"),
                    meta: { requireAuth: true }
                },
                {
                    path: "system/recommend/list",
                    name: "recommend",
                    component: () => import("../components/systemManagement/recommend.vue"),
                    meta: { requireAuth: true }
                },
            ]
        },
        {
            path: "/Login",
            name: "Login",
            component: () => import("../components/page/login.vue")
        },
        {
            path: '*',
            redirect: '/404',
            name: 'notFound',
            hidden: true

        }
    ]
})
export default router;

