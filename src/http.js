import axios from 'axios';
import qs from 'qs';
import router from './router'
axios.defaults.timeout = 5000;//响应时间
axios.defaults.headers.post['Content-Type'] = "application/json";
axios.defaults.baseUrl = 'http://192.168.3.58:9990/manxi-reinforce';//配置接口地址
//每次跳转路由,判断localStorage中有无token,没有就跳转到登录页面,有则跳转到对应路由页面,每次调用后端接口
//都要在请求头中加token,若验证失败(token失效)就返回状态码05,若拿到状态码为05,就清除token并跳转到登录页面
//添加请求拦截器,在请求头中加token
axios.interceptors.request.use(config => {
    if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization')
    }
    return config;
}, error => { return Promise.reject(error) })
//测试
axios.interceptors.response.use(response => {
    if (response.data.code === "05") {
        console.log(this, "token过期")
        localStorage.removeItem('Authorization');
        this.$confirm("会话过期,请重新登录", '系统提示', {
            confirmButtonText: "确定",
            type: "warning"
        }).then(() => {
            router.push({ name: "Login" })
        })
    }
    return response
})

//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            resolve(res);
        }, err => {
            reject(err)
        }).catch((error) => {
            reject(error)
        })
    })
}
//返回一个Promise(发送get请求)
export function fetchGet(url, params, responseType) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params }, responseType).then(res => {
            resolve(res);
        }, err => {
            reject(err)
        }).catch((error) => {
            reject(error)
        })
    })
}
export default {
    fetchGet, fetchPost
}