<template>
  <div>
    <div id="schUrl">
      <!-- 条件查询 -->
      <el-form :model="condition" class="demo-form-inline">
        <div class="g_inputForm">
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              URL：
              <el-input v-model="condition.URL" placeholder="URL" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              任务状态：
              <el-input v-model="condition.state" placeholder="状态" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              请求方式：
              <el-input v-model="condition.requestMode" placeholder="请求方式" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              任务名称：
              <el-input v-model="condition.taskName" placeholder="任务名称" class="g_input" clearable />
            </el-col>
          </el-row>
        </div>
        <div class="g_button">
          <el-button type="primary" plain icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button type="primary" plain icon="el-icon-plus" @click="dialogFormVisible = true">新建</el-button>
          <el-button type="primary" plain icon="el-icon-caret-right" @click="quick">立即执行</el-button>
          <el-button plain type="primary" icon="el-icon-caret-right" @click="restart">重新启动</el-button>
          <el-button plain type="primary" icon="el-icon-caret-right" @click="stop">暂停</el-button>
          <el-button type="primary" plain icon="el-icon-edit" @click="changeForm">修改</el-button>
          <el-button type="primary" plain icon="el-icon-delete" @click="deletes">删除</el-button>
        </div>
      </el-form>
      <el-table id="mytable" :data="tableData" border style="width: 98%" :header-cell-style="{background:'#ecf5ff',fontSize:'14px', color:'#606266'}" @selection-change="changeFun">
        <el-table-column type="selection" align="center" />
        <el-table-column fixed prop="id" label="序号" align="center" width="60px" />
        <el-table-column
          fixed
          prop="url"
          label="URL"
          align="center"
        />
        <el-table-column
          prop="taskName"
          label="任务名称"
          align="center"
        />
        <el-table-column
          prop="requestMode"
          label="请求方式"
          align="center"
        />
        <el-table-column
          prop="cron"
          label="计划任务"
          align="center"
        />
        <el-table-column
          prop="lasttime"
          label="任务上次执行时间"
          align="center"
          width="200px"
        />
        <el-table-column
          prop="state"
          label="任务状态"
          align="center"
        />
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
        />
      </el-table>
      <div style="float: right;">
        <el-pagination
          :page-size="10"
          :pager-count="7"
          layout="prev, pager, next"
          :total="totalsum"
        />
      </div>
      <!-- 新建定时任务对话框 -->
      <el-dialog title="新建定时任务：" :visible.sync="dialogFormVisible" height="700px" class="my_modal">
        <el-form :model="form">
          <el-form-item label=" 请求方式：" label-width="120px">
            <el-select v-model="form.requestMode" placeholder="RequestMethod" style="float: left; width: 100%">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="计划任务：" label-width="120px">
            <el-input v-model="form.CRON" autocomplete="off" style="float: left" placeholder="请正确输入Cron表达式" /><a href="http://cron.qqe2.com/">请参考这里</a>
          </el-form-item>
          <el-form-item label="URL：" label-width="120px">
            <el-input v-model="form.URL" autocomplete="off" />
          </el-form-item>
          <el-form-item label="任务名称：" label-width="120px">
            <el-input
              v-model="form.taskName"
              placeholder="输入的任务名称不能超过30个字符"
              type="text"
              maxlength="30"
              show-word-limit
            />
            <!--  <el-input v-model="form.taskName" autocomplete="off" @input="submitForm()"></el-input> -->
          </el-form-item>
          <el-form-item label="post参数：" label-width="120px" label-height="300px">
            <el-input v-model="form.POSTPARAM" type="textarea" placeholder="请以json格式输入参数" />
          </el-form-item>
          <el-form-item label="备注：" label-width="120px">
            <el-input v-model="form.REMARK" autocomplete="off" placeholder="输入的备注不能超过60个字符" maxlength="60" show-word-limit />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="adds()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改定时任务对话框 -->
      <el-dialog title="修改定时任务：" :visible.sync="dialogChangeVisible" class="my_modal">
        <el-form :model="change">
          <el-form-item label="请求方式：" label-width="120px">
            <el-select v-model="change.requestMode" placeholder="RequestMethod">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="ID：" label-width="120px" hidden="true">
            <el-input v-model="change.ID" autocomplete="off" />
          </el-form-item>
          <el-form-item label="URL：" label-width="120px">
            <el-input v-model="change.URL" autocomplete="off" />
          </el-form-item>
          <el-form-item label="CRON：" label-width="120px">
            <el-input v-model="change.CRON" autocomplete="off" />
          </el-form-item>
          <el-form-item label="请求参数：" label-width="120px">
            <el-input v-model="change.taskTimeParam" autocomplete="off" />
          </el-form-item>
          <el-form-item label="备注：" label-width="120px">
            <el-input v-model="change.REMARK" autocomplete="off" placeholder="输入的备注不能超过60个字符" maxlength="60" show-word-limit />
          </el-form-item>
          <el-form-item label="任务名称：" label-width="120px">
            <el-input
              v-model="change.TASKNAME"
              type="text"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogChangeVisible=false">取 消</el-button>
          <el-button type="primary" @click="changes(),dialogChangeVisible=false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqAll, reqdelete, reqQuick, reqAddJson, reqCondition, reqStop, reqRestart } from '../../api'
let result
export default {
  data() {
    return {
      totalsum: 50,
      checkBoxData: [],
      filterText: '',
      paramData: [],
      tableData: [],
      dialogFormVisible: false,
      dialogChangeVisible: false,
      condition: {
        URL: '',
        requestMode: '',
        state: '',
        taskName: '',
        page: 1,
        rows: 100
      },
      form: {
        URL: '',
        CRON: '',
        REMARK: '',
        POSTPARAM: '',
        taskName: '',
        state: '启动',
        requestMode: '',
        paramstate: 'start',
        version: 0,
        isDel: 0,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        createTime: this.timeFormat(new Date()),
        taskTimeParam: ''
      },
      globalVersion: '',

      change: {
        ID: '',
        URL: '',
        CRON: '',
        REMARK: '',
        TASKNAME: '',
        requestMode: '',
        taskTimeParam: ''
      },
      readytosendmessage: [],
      options: [{
        value: 'post',
        label: 'post'
      }, {
        value: 'get',
        label: 'get'
      }, {
        value: 'delete',
        label: 'delete'
      }, {
        value: 'put',
        label: 'put'
      }],
      options2: [{
        value: 'post',
        label: 'post'
      }, {
        value: 'get',
        label: 'get'
      }, {
        value: 'delete',
        label: 'delete'
      }, {
        value: 'put',
        label: 'put'
      }]
    }
  },
  async mounted() {
    var paramStr = JSON.stringify({ 'page': 1, 'rows': 10 })
    var param = JSON.parse(paramStr)
    const result = await reqAll(param)
    this.totalsum = result.resultData.total
    this.tableData = result.resultData.rows
  },
  methods: {
    async search() {
      var paramStr = JSON.stringify({ 'page': 1, 'rows': 10 })
      var param = JSON.parse(paramStr)
      const result = await reqAll(param)
      this.totalsum = result.resultData.total
      this.tableData = result.resultData.rows
    },
    changeFun(val) {
      this.checkBoxData = val
    },
    submitForm() {
      if (this.form.taskName.length > 30) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '任务名称不能超过30个',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    async deletes() {
      if (this.checkBoxData.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        for (var i = 0; i < this.checkBoxData.length; i++) {
          const paramStr = JSON.stringify({ 'modifierName': this.$store.state.userInfo.name, 'modifierCode': this.$store.state.userInfo.code, 'modifyTime': this.timeFormat(new Date()), 'version': this.checkBoxData[i].version, 'id': this.checkBoxData[i].id, 'taskTimeParam': this.checkBoxData[i].taskTimeParam })
          const param = JSON.parse(paramStr)
          this.readytosendmessage.push(param)
        }
        const a = await reqdelete(this.readytosendmessage)
        console.log(a)
        const paramStr = JSON.stringify({ 'page': 1, 'rows': 10 })
        const param = JSON.parse(paramStr)
        const result = await reqAll(param)
        this.totalsum = result.resultData.total
        this.tableData = result.resultData.rows
      }
    },
    async onSubmit() {
      if (this.condition.URL === '' && this.condition.taskName === '' && this.condition.requestMode === '' && this.condition.state === '') {
        var paramStr = JSON.stringify({ 'page': 1, 'rows': 10 })
        var param = JSON.parse(paramStr)
        const result = await reqAll(param)
        this.totalsum = result.resultData.total
        this.tableData = result.resultData.rows
      } else {
        const paramStr = JSON.stringify({ 'page': 1, 'rows': 10, 'requestMode': this.condition.requestMode, 'URL': this.condition.URL, 'state': this.condition.state, 'taskName': this.condition.taskName })
        const param = JSON.parse(paramStr)
        const result = await reqAll(param)
        this.totalsum = result.resultData.total
        this.tableData = result.resultData.rows
      }
    },
    async stop() {
      if (this.checkBoxData.length === 0) {
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        for (var i = 0; i < this.checkBoxData.length; i++) {
          if (this.checkBoxData[i].state === '暂停') {
            this.notifyInstance = this.$notify({
              title: '警告信息',
              message: '所选任务已经暂停请重新选择',
              type: 'error',
              position: 'bottom-right'
            })
            return
          }
          var paramstr = JSON.stringify({ 'id': this.checkBoxData[i].id, 'modifierName': this.$store.state.userInfo.name, 'modifierCode': this.$store.state.userInfo.code, 'version': this.checkBoxData[i].version })
          var param = JSON.parse(paramstr)
          this.readytosendmessage.push(param)
        }
        var result = await reqStop(this.readytosendmessage)
        if (result.states === 1) {
          this.notifyInstance = this.$notify({
            message: '暂停成功！',
            type: 'success',
            position: 'bottom-right'
          })
          this.search()
          this.readytosendmessage = []
        } else {
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '暂停失败请重试！',
            type: 'error',
            position: 'bottom-right'
          })
        }
      }
    },
    async restart() {
      if (this.checkBoxData.length === 0) {
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        for (var i = 0; i < this.checkBoxData.length; i++) {
          if (this.checkBoxData[i].state === '启动') {
            this.notifyInstance = this.$notify({
              title: '警告信息',
              message: '所选任务已经启动，请重新选择',
              type: 'error',
              position: 'bottom-right'
            })
            return
          }
          var paramstr = JSON.stringify({ 'id': this.checkBoxData[i].id, 'url': this.checkBoxData[i].url, 'cron': this.checkBoxData[i].cron, 'requestMode': this.checkBoxData[i].requestMode,
            'taskTimeParam': this.checkBoxData[i].taskTimeParam, 'version': this.checkBoxData[i].version, 'modifierName': this.$store.state.userInfo.name, 'modifierCode': this.$store.state.userInfo.code })
          var param = JSON.parse(paramstr)
          this.readytosendmessage.push(param)
        }
        var res = await reqRestart(this.readytosendmessage)
        if (res.states === 1) {
          this.notifyInstance = this.$notify({
            message: '重新启动成功！',
            type: 'success',
            position: 'bottom-right'
          })
          this.search()
          this.readytosendmessage = []
        } else {
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '重新启动失败请重试',
            type: 'error',
            position: 'bottom-right'
          })
        }
      }
    },
    async adds() {
      if (this.form.URL !== '' && this.form.CRON !== '' && this.form.POSTPARAM !== '' && this.form.requestMode !== '') {
        var paramStr
        var param
        try {
          var httprex = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/
          const str = this.form.URL
          const urlflag = httprex.test(str)
          if (urlflag !== true) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '警告信息',
              message: 'url格式不正确',
              type: 'error',
              position: 'bottom-right'
            })
          }
          // 验证cron
          /*  var cronrex = this.form.CRON
          if (cronrex.length !== 11 && cronrex.length !== 12) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '警告信息',
              message: 'cron表达式格式不正确，参考在线生成器http://cron.qqe2.com/',
              type: 'error',
              position: 'bottom-right'
            })
          }
          var j = 0// 记录空格的数量
          for (var i = 0; i < cronrex.length; i++) {
            if (cronrex[i] === ' ') {
              j++
            }
          }
          if (j !== 5 && j !== 6) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '警告信息',
              message: 'cron表达式格式不正确，参考在线生成器http://cron.qqe2.com/',
              type: 'error',
              position: 'bottom-right'
            })
          } */
          // var jsonformat = JSON.parse(this.form.POSTPARAM)
          this.form.taskTimeParam = this.form.POSTPARAM
          paramStr = JSON.stringify(this.form)
          param = JSON.parse(paramStr)

          this.dialogFormVisible = false
          this.form.URL = ''
          this.form.CRON = ''
          this.form.POSTPARAM = ''
          this.form.requestMode = ''
          this.form.REMARK = ''
          this.form.taskName = ''
        } catch (e) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '请求参数格式不正确，形如{"name":"runoob" , "url":"www.runoob.com" }',
            type: 'error',
            position: 'bottom-right'
          })
        }
        const a = await reqAddJson(encodeURI(this.form.URL), param)
        console.log(a)
        this.dialogFormVisible = false
        if (a.states === 1) {
          this.search();
          return;
        } else {
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '新增失败请重试！',
            type: 'error',
            position: 'bottom-right'
          })
        }
       this.notifyInstance = this.$notify({
         title: '警告信息',
         message: '新增失败请重试！',
         type: 'error',
         position: 'bottom-right'
       }) 
      } else {
        var s = ''
        if (this.form.URL === '') {
          s += 'url，'
        }
        if (this.form.CRON === '') {
          s += 'cron，'
        }
        if (this.form.POSTPARAM === '') {
          s += '请求参数，'
        }
        if (this.form.requestMode === '') {
          s += '请求方式'
        }
        this.$alert(s + '不能为空', '注意', {
          confirmButtonText: '确定'
        })
      }
    },
    changeForm() {
      if (this.checkBoxData.length === 1) {
        this.dialogChangeVisible = true
        this.change.ID = this.checkBoxData[0].id
        this.change.URL = this.checkBoxData[0].url
        this.change.CRON = this.checkBoxData[0].cron
        this.change.REMARK = this.checkBoxData[0].remark
        this.change.requestMode = this.checkBoxData[0].requestMode
        this.change.TASKNAME = this.checkBoxData[0].taskName
        this.globalVersion = this.checkBoxData[0].version
        this.change.taskTimeParam = JSON.stringify(this.checkBoxData[0].taskTimeParam)
        this.change.taskTimeParam = this.checkBoxData[0].taskTimeParam
      } else if (this.checkBoxData.length > 1) {
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '只能选择一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    cancel() {
      this.dialogFormVisible = false
      this.form.URL = ''
      this.form.CRON = ''
      this.form.POSTPARAM = ''
      this.form.requestMode = ''
      this.form.REMARK = ''
      this.form.taskName = ''
    },
    async changes() {
      if (this.change.URL !== '' && this.change.CRON !== '' && this.change.taskTimeParam !== '' && this.change.requestMode !== '') {
        var httprex = /(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-\.\?\,\'\/\\\+&amp;%\$#_]*)?/
        const str = this.change.URL
        const urlflag = httprex.test(str)
        if (urlflag !== true) {
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: 'url格式不正确',
            type: 'error',
            position: 'bottom-right'
          })
          return
        }
        // 验证cron
        // var cronrex = this.change.CRON
        // if (cronrex.length !== 11 && cronrex.length !== 12) {
        //   if (this.notifyInstance) {
        //     this.notifyInstance.close()
        //   }
        //   this.notifyInstance = this.$notify({
        //     title: '警告信息',
        //     message: 'cron表达式格式不正确，参考在线生成器http://cron.qqe2.com/',
        //     type: 'error',
        //     position: 'bottom-right'
        //   })
        // }
        // var j = 0// 记录空格的数量
        // for (var i = 0; i < cronrex.length; i++) {
        //   if (cronrex[i] === ' ') {
        //     j++
        //   }
        // }
        // if (j !== 5 && j !== 6) {
        //   if (this.notifyInstance) {
        //     this.notifyInstance.close()
        //   }
        //   this.notifyInstance = this.$notify({
        //     title: '警告信息',
        //     message: 'cron表达式格式不正确，参考在线生成器http://cron.qqe2.com/',
        //     type: 'error',
        //     position: 'bottom-right'
        //   })
        // }
        try {
          const jsonMap = JSON.parse(this.change.taskTimeParam)
          console.log(jsonMap)
          const paramStr = JSON.stringify({ 'id': this.change.ID, 'url': encodeURI(this.change.URL), 'cron': encodeURI(this.change.CRON), 'modifierName': this.$store.state.userInfo.name,
            'modifierCode': this.$store.state.userInfo.code, 'modifiyTime': this.timeFormat(new Date()), 'version': this.globalVersion, 'taskName': this.change.TASKNAME, 'requestMode': this.change.requestMode,
            'remark': this.change.REMARK, 'taskTimeParam': this.change.taskTimeParam })
          var param1 = JSON.parse(paramStr)
        } catch (e) {
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '请求参数格式不正确，形如{"name":"runoob" , "url":"www.runoob.com" }',
            type: 'error',
            position: 'bottom-right'
          })
          return
        }
        const result = await reqCondition(param1)
        this.dialogChangeVisible = false
        if (result.states === 1) {
          this.notifyInstance = this.$notify({
            message: '修改成功！',
            type: 'success',
            position: 'bottom-right'
          })
          this.search()
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '修改失败请重试！',
            type: 'error',
            position: 'bottom-right'
          })
        }
        // var paramStr = JSON.stringify({ 'page': 1, 'rows': 10 })
        // var param = JSON.parse(paramStr)
        // const result2 = await reqAll(param)
        // this.checkBoxData = result2.resultData.total
        // this.tableData = result2.resultData.rows
      } else {
        var s = ''
        if (this.change.URL === '') {
          s += 'url，'
        }
        if (this.change.CRON === '') {
          s += 'cron，'
        }
        if (this.change.taskTimeParam === '') {
          s += '请求参数，'
        }
        if (this.change.requestMode === '') {
          s += '请求方式'
        }
        this.$alert(s + '不能为空', '注意', {
          confirmButtonText: '确定'
        })
      }
    },
    // 立即启用方法
    async quick() {
      if (this.checkBoxData.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        for (var i = 0; i < this.checkBoxData.length; i++) {
          if (this.checkBoxData[i].state === '暂停') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '警告信息',
              message: '所选择的任务已经暂停，请先启动',
              type: 'error',
              position: 'bottom-right'
            })
            return
          }
          var paramstr = JSON.stringify({ 'id': this.checkBoxData[i].id, 'requestMode': this.checkBoxData[i].requestMode, 'url': this.checkBoxData[i].url, 'taskTimeParam': this.checkBoxData[i].taskTimeParam })
          var param = JSON.parse(paramstr)
          this.readytosendmessage.push(param)
        }
        await reqQuick(this.readytosendmessage)
        // if (result.states === 1) {
        //  this.notifyInstance = this.$notify({
        //    message: '立即启动成功',
        //    type: 'success',
        //    position: 'bottom-right'
        //  })
        this.search()
        this.readytosendmessage = []
        this.notifyInstance = this.$notify({
          message: '立即启动成功',
          type: 'success',
          position: 'bottom-right'
        })
        //     } else {
        //       this.notifyInstance = this.$notify({
        //         title: '警告信息',
        //         message: '立即启动失败请重试！',
        //         type: 'error',
        //         position: 'bottom-right'
        //       })
        //     }
      }
    },
    // 获取系统时间函数
    timeFormat(timeStamp) {
      const year = new Date(timeStamp).getFullYear()
      const month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
      const date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
      const hh = new Date(timeStamp).getHours() < 10 ? '0' + new Date(timeStamp).getHours() : new Date(timeStamp).getHours()
      const mm = new Date(timeStamp).getMinutes() < 10 ? '0' + new Date(timeStamp).getMinutes() : new Date(timeStamp).getMinutes()
      const ss = new Date(timeStamp).getSeconds() < 10 ? '0' + new Date(timeStamp).getSeconds() : new Date(timeStamp).getSeconds()
      return year + '-' + month + '-' + date + ' ' + hh + ':' + mm + ':' + ss
    }
  }

}
</script>
<style>
  #mytable{
    table-layout:fixed;

  }
  #mytable td{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .my_modal{
      z-index: 3000;
  }
</style>
