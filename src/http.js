import axios from 'axios';
import qs from 'qs';
import router from './router'
import Vue from 'vue';//引入vue
import { reduce } from 'xe-utils/methods';
let v = new Vue();
axios.defaults.timeout = 200000;//响应时间
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
}, error => {
    return Promise.reject(error)
})
axios.interceptors.response.use(response => {
    if (response.data.code === "05") {
        localStorage.removeItem('Authorization');
        v.$alert('会话过期,请重新登录', '系统提示', {
            confirmButtonText: '确定',
            type: "warning",
            callback: action => {
                router.push({ name: 'Login' });
                location.reload(true);
            }
        })
    }
    if (response.data.code === '500' || response.data.code === '01' || response.data.code === '99') {
        v.$notify({
            title: "警告",
            message: response.data.message,
            type: "warning",
            duration: 2000
        });
    }
    return response;
}, error => {
    v.$alert('请求超时', '系统提示', {
        confirmButtonText: '确定',
        type: "warning",
        callback: action => {
            router.push({ name: 'Login' });
            location.reload(true);
        }
    })
})
//返回一个Promise(发送post请求)
export function fetchPost(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(res => {
            resolve(res);
        }, err => {
            reject(err);

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

//上传进度条
export function uploadFile(url, param, config) {
    console.log(url, param, config)
    let axiosConfig = {
        url: url,
        method: 'post',
        data: param,
    }
    if (config instanceof Object) {
        for (let key in config) {
            axiosConfig[key] = config[key]
        }
    }
    return axios(axiosConfig)
}
export default {
    fetchGet, fetchPost, uploadFile
}