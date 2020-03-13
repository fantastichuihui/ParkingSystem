import axios from 'axios';
import { Promise } from 'q';
import qs from 'qs';

export function ajax(url,data={},type='GET'){
    return new Promise(function(resolve,reject){
        //执行异步请求AJAX请求
        let promise
        if(type ==='GET'){
            let dataStr = ''
            Object.keys(data).forEach(key => {
                dataStr += key ='=' +data[key] + '&'
            })
            if(dataStr !== ''){
                dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'))
                url = url +'?' +dataStr
            }
            promise = axios.get(url)
        }else{
            promise = axios.post(url,qs.stringify(data))
        console.log(qs.stringify(data))
        }
        promise.then(function(response){
            resolve(response.data)
        }).catch(function(){
            reject(error)
        })
        //成功了调用resolve请求
    })
}

export function postjson(url,data={},type="POST"){
 return new Promise(function(resolve,reject){
     //执行异步请求AJAX请求
     let promise=axios.post(url,data);

      console.log("===========================");
      console.log(data)

     promise.then(function(response){
         resolve(response.data)
     }).catch(function(){
         reject(error)
     })
     //成功了调用resolve请求
 })
}
