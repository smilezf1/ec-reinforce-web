const baseUrl = "http://192.168.3.58:9990/manxi-reinforce",
    websocketUrl = "http://192.168.3.58:9990/manxi-reinforce/websocket"
import { fetchGet, fetchPost, uploadFile } from './http'
let userService = {
    //登录
    login(params) {
        return fetchPost('/api/system/login/login', params).then(res => res.data)
    },
    //退出登录
    logout(params) {
        return fetchGet("/api/system/login/logout", params).then(res => res.data)
    },
    //slideBar
    getUserMenuTree(params) {
        return fetchGet("/api/system/user/userMenuTree", params).then(res => res.data)
    }

}
//加固项
let reinforceService = {
    reinforceList(params) {
        return fetchPost("/api/reinforce/info/page", params).then(res => res.data)
    },
    //保存加固任务
    saveReinforce(params) {
        return fetchPost("/api/reinforce/info/saveReinforceInfoOrUpdate", params).then(res => res.data)
    },
    //通过appPath得到原始数据
    getParseApkInfoByFileKey(params) {
        return fetchGet("/api/reinforce/info/parseApkInfoByFileKey/" + params).then(res => res.data)
    },
    //通过包名得到加固策略列表
    getStrategyByPackageName(params) {
        return fetchGet("/api/reinforce/strategy/findStrategyByPackageName", params).then(res => res.data)
    },
    //查询加固项tree
    getReinforceItemTree(params) {
        return fetchPost("/api/reinforce/item/findReinforceItemTree", params).then(res =>
            res.data
        )
    },
    //删除加固项
    deleteReinforceById(params) {
        return fetchGet("/api/reinforce/info/deleteReinforceInfoById/" + params,).then(res => res.data)
    },
    //加固详细
    getReinforceDetail(params) {
        return fetchGet("/api/reinforce/info/findReinforceDetailById", params).then(res => res.data)
    },
    //加固日志
    getReinforceLog(params) {
        return fetchGet("/api/reinforce/info/findLogoByReinforceId/" + params).then(res => res.data)
    },
    //加固策略详细
    getStrategyDetail(params) {
        return fetchGet("/api/reinforce/strategy/getStrategyDetail", params).then(res => res.data)
    },
    //通过包名得到多渠道列表
    getChannelByPackageName(params) {
        return fetchGet("/api/channel/strategy/findChannelStrategyByPackageName", params).then(res => res.data)
    },
    //得到签名列表
    getSignatureList(params) {
        return fetchPost("/api/reinforce/sign/page", params).then(res => res.data)
    },
    //加固项 reinforceItem
    getReinforceItem(params) {
        return fetchPost("/api/reinforce/item/page", params).then(res => res.data)
    },
    //检查策略名
    checkStrategyName(params) {
        return fetchGet("/api/reinforce/strategy/checkStrategyName", params).then(res => res.data)
    },
    //保存创建的策略
    saveStrategy(params) {
        return fetchPost("/api/reinforce/strategy/saveOrUpdateStrategy", params).then(res => res.data)
    },
    //删除策略
    deleteStrategy(params) {
        return fetchGet("/api/reinforce/strategy/deleteReinforceStrategyById/" + params).then(res => res.data)
    }

}
//系统管理
let systemManageService = {
    //用户管理开始----
    userManageCheckUserName(params) {
        return fetchGet("/api/system/user/checkUserName", params).then(res => res.data)
    },
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
    //角色详情
    roleManageDetail(params) {
        return fetchGet("/api/system/role/detail", params).then(res => res.data)
    },
    //保存编辑
    roleManageSaveEdit(params) {
        return fetchPost("/api/system/role/save", params).then(res => res.data)
    },
    //设置菜单
    roleManageSettingMenu(params) {
        return fetchGet("/api/system/menu/menuTree", params).then(res => res.data)
    },
    //保存更新的菜单
    roleManageSettingMenuSave(params) {
        return fetchPost("/api/system/role/saveRoleItem", params).then(res => res.data)
    },
    //停用菜单
    roleManageBlockUp(params) {
        return fetchGet("/api/system/role/invalid", params).then(res => res.data)
    },
    //启用菜单
    roleManageLaunch(params) {
        return fetchGet("/api/system/role/active", params).then(res => res.data)
    },
    //角色管理结束---

    //菜单管理开始---
    menuManageList(params) {
        return fetchGet("/api/system/menu/list").then(res => res.data)
    },
    //菜单详情
    menuManageEdit(params) {
        return fetchGet("/api/system/menu/detail", params).then(res => res.data)
    },
    //菜单保存编辑
    menuManageEditSave(params) {
        return fetchPost("/api/system/menu/save", params).then(res => res.data)
    },
    menuManageSaveAddCatalogue(params) {
        return fetchPost("/api/system/menu/save", params).then(res => res.data)
    },
    menuManageSaveAddLink(params) {
        return fetchPost("/api/system/menu/save", params).then(res => res.data)
    },
    //停用
    menuManageBlockUp(params) {
        return fetchGet("/api/system/menu/invalid", params).then(res => res.data)
    },
    //启用
    menuManageLaunch(params) {
        return fetchGet("/api/system/menu/active", params).then(res => res.data)
    },
    //菜单管理结束--
}
//签名服务
let signatureService = {
    //删除签名
    deleteSignature(params) {
        return fetchGet('/api/reinforce/sign/deleteReinforceSignById/' + params).then(res => res.data)
    },
    //获取签名别名
    getSignatureAlias(params) {
        return fetchPost("/api/reinforce/sign/findSignAliasNameList", params).then(res => res.data)
    },
    //检查签名名称是否重复
    checkSignName(params) {
        return fetchGet("/api/reinforce/sign/checkSignName", params).then(res => res.data)
    },
    //保存上传的签名
    saveSignature(params) {
        return fetchPost("/api/reinforce/sign/addReinforceSign", params).then(res => res.data)
    },
    //签名列表数据
    getSignatureList(params) {
        return fetchPost("/api/reinforce/strategy/page", params).then(res => res.data)
    },
}
//应用渠道策略
let multipleChannelService = {
    //列表数据
    getChannelList(params) {
        return fetchPost("/api/channel/strategy/findChannelStrategyByPage", params).then(res => res.data)
    },
    //获取渠道策略具体的内容
    getChannelStrategyDetail(params) {
        return fetchGet("/api/channel/strategy/findChannelStrategyDetail/" + params).then(res => res.data)
    },
    //通过包名解析资源
    getChannelKeyList(params) {
        return fetchGet("/api/channel/strategy/parseApkMateInfoByFileKey/" + params).then(res => res.data)
    },
    //删除渠道策略
    deleteChannelStrategy(params) {
        return fetchGet("/api/channel/strategy/deleteChannelStrategyByStrategyId/" + params).then(res => res.data)
    },
    //检查渠道值类型
    checkChannelValueType(channelKey, channelValue, appPath) {
        return fetchGet("/api/channel/strategy/checkChannelValueType?channelKey=" + channelKey + "&channelValue=" + channelValue + "&fileKey=" + appPath).then(res => res.data)
    },
    //检查渠道策略名称
    checkChannelStrategyName(params) {
        return fetchGet("/api/channel/strategy/checkChannelStrategyName", params).then(res => res.data)
    },
    //保存创建的渠道策略
    saveChannelStrategy(params) {
        return fetchPost("/api/channel/strategy/saveOrUpdateChannelStrategy", params).then(res => res.data)
    }



}
//上传
let uploadService = {
    //加固上传
    uploadFile(params, config) {
        return uploadFile("/api/reinforce/info/uploadReinforceFile", params, config).then(res => res.data)
    },
    uploadSignatureFile(params, config) {
        return uploadFile("/api/reinforce/sign/uploadReinforceSignFile", params, config).then(res => res.data)
    },
    //上传授权文件
    uploadAuthorizeFile(params, config) {
        return uploadFile("/api/system/auth/uploadAuthFile", params, config).then(res => res.data)
    }
}
//授权管理
let authorizeService = {
    //生成userCode
    authorizeManageList() {
        return fetchGet("/api/system/auth/findAuthInfo").then(res => res.data)
    },
    getUserCode() {
        return fetchGet("/api/system/auth/generateUserCode").then(res => res.data)
    },
    //更新授权信息
    updateAuthorizeInfo(params) {
        return fetchPost("/api/system/auth/updateAuthInfo", params).then(res => res.data)
    }
}
//关于系统
let systemService = {
    aboutSystem(params) {
        return fetchGet("/api/system/about/findAbout", params).then(res => res.data)
    }
}
export default {
    baseUrl, websocketUrl, userService, reinforceService, systemService, systemManageService, uploadService, signatureService, multipleChannelService, authorizeService
}