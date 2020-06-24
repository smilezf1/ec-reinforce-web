import axios from 'axios';
import qs from 'qs';
axios.defaults.timeout = 5000;//响应时间
axios.defaults.headers.post['Content-Type'] = "application/x-www-form-urlencoded;charset=UTF-8"  //配置请求头 
axios.defaults.baseUrl = 'http://192.168.3.58:9990/manxi-reinforce';//配置接口地址
//POST 传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前判断下
    if (config.method === "post") {
        config.data = qs.stringify(config.data)
    }
    console.log(config.data);
    return config
}, (error) => {
    console.log("错误的传参");
    return Promise.reject(error);
})
//返回判断状态(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做的事情
    if (!res.data.success) {
        return Promise.resolve(res);
    }
    return res;
}, (error) => {
    console.log("网络异常");
    return Promise.reject(error);
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