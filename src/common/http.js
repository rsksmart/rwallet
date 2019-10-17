import axios from 'axios';
import {common} from "./common";
import md5 from 'crypto-js/md5';
import {loading} from "../redux/actions";
import storage from "./storage";


const baseUrl = common.baseUrl;

const headers = {
    "Accept": 'application/json;charset=utf-8',
    'Content-Type': 'application/json;charset=utf-8',
    'Accept-Encoding': 'gzip, deflate',
};

const getTokenHeader = async () => {
    let timestamp: number = new Date().getTime();
    let assceetoken: string = "";
    try{
        assceetoken = await storage.getLocaItem("login","token");
    }catch (e) {
        console.log("未成功从storage中取得login-token");
    }
    let headers =  {
        assceetoken,
        timestamp
    };
    return headers;
};

axios.interceptors.request.use(
    async config => {
        config.headers = {
            ...headers,
            ...await getTokenHeader()
        };
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    response => {
        return new Promise((resolve, reject) => {
            resolve(response)
        });
    },
    err => {
        return Promise.reject(err)   // 返回接口返回的错误信息
    }
)

const get =  (url, params = {}) => {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}${url}`, {
            params: params
        }).then(response => {
            if(response){
                resolve(response);
            }else{
                resolve(undefined);
            }
        })
        .catch(err => {
            reject(err)
        })
    })
};

const asyncGet = (url, params = {}) => {
    loading(true);
    return new Promise<T>((resolve, reject) => {
        get(url,params).then(resp => {
            loading(false);
            resolve(resp);
        }).catch(err => {
            loading(false);
            reject(err);
        })
    })
};

const asyncPost = (url, data = {}) => {
    loading(true);
    return new Promise<T>((resolve, reject) => {
        post(url,data).then(resp=>{
            loading(false);
            resolve(resp as T);
        }).catch(err=>{
            loading(false);
            reject(err);
        })
    });
};

class FormDataBuffer {
    data:any = {};
    constructor(data = {}){
        this.data = data;
    }
    append(key : string, value: any){
        this.data[key] = value;
        return this;
    }
    appendImage(key : string, image : any){
        this.append(key,{
            uri: image.path,
            type: image.mime,
            size : image.size,
            name: image.path,
        });
        return this;
    }
    appendImages(key : string, images : any[]){
        images.forEach(((value, index, array) => {
            this.append(key,{
                uri: value.path,
                type: value.mime,
                size : value.size,
                name: value.path,
            });
        }));
        return this;
    }
    toFormData(){
        let formData = new FormData();
        for(let key of Object.keys(this.data)){
            let value = this.data[key];
            // @ts-ignore
            formData.append(key,value);
        }
        return formData;
    }
}