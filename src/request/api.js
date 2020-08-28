const baseUrl = "http://192.168.3.58:9990/manxi-reinforce";
import { fetchGet, fetchPost } from './http'
//登录
let loginService = {
    login(params) {
        return fetchPost('/api/system/login/login', params).then(res => res.data)
    }
}
//加固项
let reinforceService = {
    reinforceList(params) {
        return fetchPost("/api/reinforce/info/page", params).then(res => res.data)
    }
}
//系统管理
let systemManageService = {
    //用户管理开始----
    userManageList(params) {
        return fetchPost("/api/system/user/page", params).then(res => res.data)
    },
    userManageDetail(params) {
        return fetchGet("/api/system/user/detail", params).then(res => res.data)
    },
    userManageSave(params) {
        return fetchPost("/api/system/user/save", params).then(res => res.data)
    },
    userManageResetPwd(params) {
        return fetchPost('/api/system/user/resetPwd', params).then(res => res.data)
    },
    userManageSaveAdd(params) {
        return fetchPost('/api/system/user/save', params).then(res => res.data)
    },
    userManageSetRole(params) {
        return fetchGet('/api/system/role/roleTree', params).then(res => res.data)
    },
    userManageSaveUserRole(params) {
        return fetchPost("/api/system/user/saveUserRole", params).then(res => res.data)
    },
    userManageActive(params) {
        return fetchGet("/api/system/user/active", params).then(res => res.data)
    },
    userManageInvalid(params) {
        return fetchGet("/api/system/user/invalid", params).then(res => res.data)
    },
    //用户管理结束---
    //角色管理开始---
    roleManageList(params) {
        return fetchPost("/api/system/role/page", params).then(res => res.data)
    },
    roleManageSave(params) {
        return fetchPost("/api/system/role/save", params).then(res => res.data)
    },
    roleManageDetail(params) {
        return fetchGet("/api/system/role/detail", params).then(res => res.data)
    },
    roleManageSaveEdit(params) {
        return fetchPost("/api/system/role/save", params).then(res => res.data)
    }
    //角色管理结束---

    //菜单管理
}
//关于系统
let systemService = {
    aboutSystem(params) {
        return fetchGet("/api/system/about/findAbout", params).then(res => res.data)
    }
}
export default {
    baseUrl, loginService, reinforceService, systemService, systemManageService
}