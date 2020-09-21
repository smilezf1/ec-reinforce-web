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
            path: "/Home",
            component: () => import("../components/common/Home.vue"),
            meta: { requireAuth: true },
            children: [
                { path: "/dashboard", name: "dashboard", component: () => import("../components/page/dashboard"), meta: { requireAuth: true, KeepAlive: false } },
                {
                    path: "/menuManagement",
                    name: "menuManagement",
                    component: () =>
                        import("../components/systemManagement/menuManagement"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/reinforceItem",
                    name: "reinforceItem",
                    component: () => import("../components/reinforceConfiguration/reinforceItem"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/reinforceStrategy",
                    name: "reinforceStrategy",
                    component: () => import("../components/reinforceConfiguration/reinforceStrategy"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/channelStrategy",
                    name: "channelStrategy",
                    component: () => import("../components/reinforceConfiguration/channelStrategy"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/reinforce",
                    name: "reinforce",
                    component: () => import("../components/taskManagement/reinforce"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/signature",
                    name: "signature",
                    component: () => import("../components/reinforceConfiguration/signature"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/detail:id",
                    name: 'detail',
                    component: () => import("../components/taskManagement/detail.vue"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/log:id",
                    name: "log",
                    component: () => import("../components/taskManagement/log.vue"),
                    meta: { requireAuth: true, KeepAlive: false }
                },

                {
                    path: "/roleManagement",
                    name: "roleManagement",
                    component: () => import("../components/systemManagement/roleManagement"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/recommend",
                    name: "recommend",
                    component: () => import("../components/page/recommend"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/userManagement",
                    name: "userManagement",
                    component: () => import("../components/systemManagement/userManagement"),
                    meta: { requireAuth: true, KeepAlive: false }
                },
                {
                    path: "/authorizeManagement",
                    name: "authorizeManagement",
                    component: () => import("../components/systemManagement/authorizeManagement"),
                    meta: { requireAuth: true, KeepAlive: false }
                }
            ]
        },
        {
            path: "/Login",
            name: "Login",
            component: () => import("../components/page/login.vue")
        },
    ]
})
export default router;

