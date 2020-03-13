<template>
  <div class="g_container">

    <el-form
      ref="apiAdd"
      :model="apiAdd"
      label-width="150px"
      class="g_elForm"
      :rules="rules"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="接口方法：" prop="addApiMethod">

            <el-input
              v-model.trim="apiAdd.addApiMethod"
              placeholder="请输入接口方法"
              class="g_elFormTextarea_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="接口名称：" prop="addApiName">

            <el-input
              v-model.trim="apiAdd.addApiName"
              placeholder="请输入接口名称"
              class="g_elFormTextarea_other"
              clearable
            />

          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="接口路径：" prop="addApiPath">

            <el-input
              v-model.trim="apiAdd.addApiPath"
              placeholder="请输入接口路径"
              class="g_elFormTextarea_other"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="资源名称：" prop="addResID">

            <el-select v-model="apiAdd.addResID" class="g_elFormTextarea_other" placeholder="请选择资源名称">
              <el-option v-for="item in resData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="权限名称：" prop="ids">

            <el-select v-model="apiAdd.ids" class="g_elFormTextarea_other" multiple placeholder="请选择权限名称">
              <el-option v-for="item in permissionData" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
        <el-button type="primary" plain icon="el-icon-back" style="float: left;margin-left:45px" @click="handleCancel()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-plus" style="float: left;margin-left:45px" @click="handleAdd()">确认</el-button>
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
// 系统登陆人信息
// import { getUserInfo } from '@/utils/userInfo'
export default {
  name: 'ApiAdd',
  data() {
    return {
      currentTime: '',
      resData: [],
      apiAdd: {
        addApiMethod: '',
        addApiName: '',
        addApiPath: '',
        addResID: undefined,
        ids: []
      },
      EC00001: '接口表添加出错（后台错误）！',
      permissionData: [],
      permissionIds: [],
      // 表单校验
      rules: {
        addApiMethod: [
          { required: true, message: '请输入接口方法', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内!', trigger: 'blur' }
        ],
        addApiName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' },
          { max: 20, message: '长度在20个字符以内!', trigger: 'blur' }
        ],
        addApiPath: [
          { required: true, message: '请输入接口路径', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在255个字符以内!' },
          { pattern: /^\//, message: '路径只能以/开头！' }
        ],
        addResID: [
          { required: true, message: '请选择资源名称', trigger: 'change' }
        ],
        ids: [
          { required: true, message: '请至少选择一个权限名称', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getResName()
    this.getTime()
    this.getPermissionData()
  },
  methods: {
    selectPermiIds() {
      // console.log(this.ids)
      this.permissionIds = []
      for (let i = 0; i < this.apiAdd.ids.length; i++) {
        this.permissionIds[i] = { id: this.apiAdd.ids[i] }
      }
      return this.permissionIds
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
    getPermissionData() {
      axios.get('/api/a01auth/role/findAllPermission').then((res) => {
        this.permissionData = res.data
      })
    },
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
      // console.log(this.currentTime)
    },
    addApiData() {
      axios.post('/api/a01auth/api/insertApi', this.getParam()).then((res) => {
        if (res.data.status === 1) {
          // console.log(res)
          this.$router.push('api')
        } else {
          this.msg = res.data.msg
          if (this.msg === 'EC00001') {
            this.open2(this.EC00001)
          }
        }
      })
    },
    getResName: function() {
      axios.get('/api/a01auth/res/findAllRes').then((res) => {
        this.resData = res.data
      })
    },
    getParam: function() {
      return {
        resId: this.apiAdd.addResID,
        apiMethod: this.apiAdd.addApiMethod,
        apiName: this.apiAdd.addApiName,
        apiPath: this.apiAdd.addApiPath,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        modifyTime: this.currentTime,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        createTime: this.currentTime,
        // version: 0,
        // isDel: 0,
        permissionIds: this.selectPermiIds()
      }
    },
    handleAdd() {
      if (!this.apiAdd.addApiMethod ||
      !this.apiAdd.addApiName ||
      !this.apiAdd.addApiPath ||
      !this.apiAdd.addResID ||
     !this.apiAdd.ids
      ) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请输入数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.addApiData()
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          type: 'success',
          message: '添加成功!',
          position: 'bottom-right'
        })
      }
    },
    handleCancel() {
      this.$router.push('api')
    }
  }
}

</script>
