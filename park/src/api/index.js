//包含n个接口请求函数的模块
import {ajax, postjson} from './ajex'

// //查询所有
// export const reqAll = (data) => postjson('/api/a05schedule/schuled/selectschuled',data,'POST')

// //删除
// export const reqdelete = (data) => postjson('/api/a05schedule/schuled/delectschuled',data,'POST')

// //添加
// export const reqAdd = (url,cron,state,createUserCode,createUserName,createTime,remark,version,isDel,taskTimeParam,requestMode,taskName) => postjson('/api/a05schedule/schuled/addschuled',{url,cron,state,createUserCode,createUserName,createTime,remark,version,isDel,taskTimeParam,requestMode,taskName},'POST')

// export const reqAddJson = (url, data) => postjson('/api/a05schedule/schuled/addschuled', data, 'POST')
// //条件查询
// export const reqCondition = (data) => postjson('/api/a05schedule/schuled/updateschuled', data, 'POST')
// //修改
// export const reqchanges = (data) => postjson('/api/a05schedule/schuled/addschuled',data,'POST')


// //立即重启
// export const reqQuick = (data) => postjson('/api/a05schedule/schuled/immediate',data,'POST')
//查询所有
export const reqAll = (data) => postjson('/api/a05schedule/schuled/selectschuled',data,'POST')

//删除
export const reqdelete = (data) => postjson('/api/a05schedule/schuled/delectschuled',data,'POST')

//添加
export const reqAdd = (url,cron,state,createUserCode,createUserName,createTime,remark,version,isDel,taskTimeParam,requestMode,taskName) => postjson('/api/a05schedule/schuled/addschuled',{url,cron,state,createUserCode,createUserName,createTime,remark,version,isDel,taskTimeParam,requestMode,taskName},'POST')

export const reqAddJson = (url, data) => postjson('/api/a05schedule/schuled/addschuled', data, 'POST')
//条件查询
export const reqCondition = (data) => postjson('/api/a05schedule/schuled/updateschuled', data, 'POST')
//修改
export const reqchanges = (data) => postjson('/api/a05schedule/schuled/addschuled',data,'POST')
//暂停
export const reqStop = (data) => postjson('/api/a05schedule/schuled/stoptask',data,'POST')
//立即重启
export const reqQuick = (data) => postjson('/api/a05schedule/schuled/immediate',data,'POST')
//重新启动
export const reqRestart = (data) => postjson('/api/a05schedule/schuled/starttask',data,'POST')
