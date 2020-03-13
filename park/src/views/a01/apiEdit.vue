<template>
  <div class="g_container">
    <el-form
      ref="apiEdit"
      :model="apiEdit"
      label-width="150px"
      class="g_elForm"
      :rules="rules"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 接口方法：" prop="editApiMethod">

            <el-input
              v-model.trim="apiEdit.editApiMethod"
              placeholder="请输入接口方法"
              class="g_elFormTextarea_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 接口名称：" prop="editApiName">

            <el-input
              v-model.trim="apiEdit.editApiName"
              placeholder="请输入接口名称"
              class="g_elFormTextarea_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="接口路径：" prop="editApiPath">

            <el-input
              v-model.trim="apiEdit.editApiPath"
              placeholder="请输入接口路径"
              class="g_elFormTextarea_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="资源名称：" prop="editResID">
            <el-select v-model="apiEdit.editResID" class="g_elFormTextarea_other" placeholder="请选择资源名称">
              <el-option v-for="item in resData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 权限名称：" prop="ids">
            <el-select v-model="apiEdit.ids" class="g_elFormTextarea_other" multiple placeholder="请选择权限名称">
              <el-option v-for="item in permissionData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
        <el-button type="primary" plain icon="el-icon-back" style="float: left;margin-left:45px" @click="handleCancel()">返回</el-button>
        <el-button type="primary" plain icon="el-icon-plus" style="float: left;margin-left:45px" :disabled="parkSave" @click="handleEditApi()">确认</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
</style>

<script>
import axios from 'axios'
import { open1 } from '@/utils/systemTips'
// 系统登陆人信息
// import { getUserInfo } from '@/utils/userInfo'
export default {
  data() {
    return {
      currentTime: '',
      resData: [],
      // currentPage: 1,
      id: '',
      apiId: this.$route.params.api.apiId,
      apiEdit: {
        editApiMethod: this.$route.params.api.aMethod,
        editApiName: this.$route.params.api.aName,
        editApiPath: this.$route.params.api.aPath,
        editResID: this.$route.params.api.resId,
        ids: []
      },
      a: 1,
      modifierCode: this.$route.params.api.aModCode,
      modifierName: this.$route.params.api.aMoName,
      modifyTime: this.$route.params.api.aMoTime,
      EC00003: '接口表表修改出错（后台错误）！',
      permissionData: [],
      permissionIds: [],
      // idss: []
      // 表单校验
      rules: {
        editApiMethod: [
          { required: true, message: '请输入接口方法', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内!', trigger: 'blur' }
        ],
        editApiName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内!', trigger: 'blur' }
        ],
        editApiPath: [
          { required: true, message: '请输入接口路径', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在255个字符以内!' },
          { pattern: /^\//, message: '路径只能以/开头！' }
        ],
        editResID: [
          { required: true, message: '请选择资源名称', trigger: 'change' }
        ],
        ids: [
          { required: true, message: '请至少选择一个权限名称', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    parkSave: function() {
      if (this.$route.params.api.permissionlist.length === this.apiEdit.ids.length) {
        for (let i = 0; i < this.$route.params.api.permissionlist.length; i++) {
          if (!this.apiEdit.ids.includes(this.$route.params.api.permissionlist[i].permissionId)) {
            return false
          }
        }
      } else {
        return false
      }

      if (this.apiEdit.editApiMethod === this.$route.params.api.aMethod &&
      this.apiEdit.editApiName === this.$route.params.api.aName &&
      this.apiEdit.editApiPath === this.$route.params.api.aPath &&
      this.apiEdit.editResID === this.$route.params.api.resId
      ) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.getResName()
    this.getTime()
    this.getPermissionData()
    // this.getPerRefData()
    // console.log(this.getPerRefData())
    this.$route.params.api.permissionlist.forEach((item, index) => {
      this.apiEdit.ids.push(item.permissionId)
    })
  },
  methods: {
    // 当前选择的permission数据
    selectPermiIds() {
      for (let i = 0; i < this.apiEdit.ids.length; i++) {
        this.permissionIds[i] = { id: this.apiEdit.ids[i] }
      }
      return this.permissionIds
      // console.log(this.ids)
      // console.log(this.permissionIds)
    },
    // 获取当前api对应的权限id给select中ids
    // 没有使用的地方
    // getPerRefData() {
    //   axios.get('/api/a01auth/api/selectApiPerRef', this.getPeRRefParam()).then((res) => {
    //     console.log(res)
    //     for (var a of res) {
    //       this.ids.push(a.permissionId)
    //       // this.idss.push(a.permissionId)
    //     }
    //   })
    // },
    // 获取接口权限关联关系表数据
    getPeRRefParam() {
      return {
        apiId: this.$route.params.api.apiId
      }
    },
    getPermissionData() {
      axios.get('/api/a01auth/role/findAllPermission').then((res) => {
        this.permissionData = res.data
        // console.log(res.data)
      })
    },
    // 获取系统当前时间
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    apiEditData: function() {
      axios.put('/api/a01auth/api/updateApi', this.getParamMap()).then((res) => {
        // console.log(res.data)
        if (res.data.status === 1) {
          this.$router.push('api')
          open1()
        } else if (res.data.status === 0) {
          // 修改失败，给出提示
          this.msg = res.data.msg
          this.open2(this.EC00003)
        }
      })
    },
    // 错误消息过滤
    open2: function(msg) {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告',
        message: msg,
        type: 'warning',
        position: 'bottom-right'
      })
    },
    getResName: function() {
      axios.get('/api/a01auth/res/findAllRes').then((res) => {
        this.resData = res.data
      })
    },
    getParamMap: function() {
      return {
        id: this.$route.params.api.apiId,
        resId: this.apiEdit.editResID,
        apiMethod: this.apiEdit.editApiMethod,
        apiName: this.apiEdit.editApiName,
        apiPath: this.apiEdit.editApiPath,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        modifyTime: this.currentTime,
        permissionIds: this.selectPermiIds()
        // permissionIds: this.ids
      }
    },
    handleEditApi(api) {
      this.apiEditData()
    },
    handleCancel() {
      this.$router.push('api')
    }
  }
}
</script>
