module.exports = {
    //axios域代理,解决axios跨域问题
    baseUrl: "/",
    devSever: {
        proxy: {
            '': {
                target: "http://192.168.3.58:9990",
                changeOrigin: true,
                ws: true,
                pathRewrite: {}
            }
        }
    }
}