import axios from 'axios';

// 响应拦截
axios.interceptors.response.use( response => {
    // endLoading()
    return response
}, error => {
    endLoading()
    Message.error(error.response.data)
    // 获取错误状态码，token失效
    const { status } = error.response
    if (status == 401) {
        Message.error('token失效，请重新登录')
        // 清除token
        localStorage.removeItem('token')

        // 重新跳转到login页面
        router.push('/login')
    }

    return Promise.reject(error)
})


// 登录请求方法
const loginreq = async (method, url, params) => {
    axios.post(url, params).then((res) => {
        // res = res.data
        console.log(res.data)
        return res.data;
    }).catch((error) => {
        console.warn(error)
    })
};
// 通用公用方法
const req = async (method, url, params) => {
    console.log("进入发生请求")
    console.log(localStorage.getItem('userId'))
    const username = localStorage.getItem('userId')
    const res = axios({
        method: method,
        url: url,
        headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded',
            token: localStorage.getItem('logintoken')
        },
        data: params
    }).then(function (response) {
       return response.data
    });
    return res;

    // const res = await axios({
    //     method: method,
    //     url: url,
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         token: localStorage.getItem('logintoken')
    //     },
    //     data: params,
    //     traditional: true,
    //     transformRequest: [
    //         function (data) {
    //             let ret = '';
    //             for (let it in data) {
    //                 ret +=
    //                     encodeURIComponent(it) +
    //                     '=' +
    //                     encodeURIComponent(data[it]) +
    //                     '&';
    //             }
    //             return ret;
    //         }
    //     ]
    // });
    // return res.data;
};

export {
    loginreq,
    req
}