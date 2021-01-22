import axios from 'axios';
import router from '../router'
import Vue from 'vue';
let v = new Vue();
//环境的切换
axios.defaults.baseURL = "http://192.168.3.58:9990/manxi-reinforce"
axios.defaults.timeout = 200000;//设置超时时间
axios.interceptors.request.use(config => {//请求拦截器
    if (localStorage.getItem('Authorization')) {
        config.headers.Authorization = localStorage.getItem('Authorization')
    }
    return config;
}, error => {
    return Promise.reject(error)
})
let dialog = null;
axios.interceptors.response.use(response => {//响应拦截器
    if (response.data.code === "05") {
        localStorage.removeItem('Authorization');
        if (!dialog) {
            dialog = v.$alert('会话过期,请重新登录', '系统提示', {
                confirmButtonText: '确定',
                type: "warning",
                callback: action => {
                    router.push({ name: 'Login' })
                }
            })
        }
    }
    if (router.currentRoute.name != 'Login') {
        if (response.data.code === '500' || response.data.code === '01' || response.data.code === '99') {
            v.$notify({
                title: "警告",
                message: response.data.message,
                type: "warning",
                duration: 2000
            });
        }
    }
    return response;
}, error => {
    localStorage.removeItem('Authorization');
    if (!dialog) {
        dialog = v.$alert('请求超时', '系统提示', {
            confirmButtonText: '确定',
            type: "warning",
            callback: action => {
                router.push({ name: 'Login' })
            }
        })
    }
})
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
//上传进度条
export function uploadFile(url, param, config) {
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