<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form ref="role" :model="role" :rules="rules" :label-position="right">
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="10" :xl="14">
            <el-form-item label="角色code：" prop="code">
              <el-input v-model="role.code" style="width: 60%;float: left;" placeholder="请输入角色code" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="10" :xl="12">
            <el-form-item label="角色名称：" prop="name">
              <el-input v-model="role.name" style="width: 60%;float: left;" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="分配权限：" style="width: 40%;margin: 0 auto 22px auto;">
          <el-transfer
            v-model="permissionData"
            :props="{
              key: 'id',
              label: 'name'
            }"
            :data="data1"
          />
        </el-form-item>
        <el-form-item label="分配用户：" style="width: 40%;margin: 0 auto 22px auto;">
          <el-transfer
            v-model="userData"
            :props="{
              key: 'id',
              label: 'name'
            }"
            :data="data2"
          />
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="9" :xl="12">
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model="role.remark"
                style="width: 87%;float: left;"
                placeholder="请输入角色描述"
                rows="3"
                type="textarea"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-button type="primary" plain icon="el-icon-search" style="margin-top:15px;margin-right:40px;" @click="handleNo()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleYes('role')">确定</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    const generateData1 = _ => {
      const data = []
      axios.get('/api/a01auth/role/findAllPermission', {}).then((res) => {
        data.push(...res.data)
      })
      return data
    }
    const generateData2 = _ => {
      const data = []
      axios.get('/api/a02person/person/findPersonname', {}).then((res) => {
        data.push(...res.data)
      })
      return data
    }
    return {
      role: {
        name: '',
        code: '',
        remark: '',
        version: 0,
        isDel: 0,
        createUserCode: '',
        createUserName: '',
        modifierCode: '',
        modifierName: '',
        permissionData: ''
      },
      data1: generateData1(),
      data2: generateData2(),
      permissionData: [],
      userData: [],
      users: [],
      permissions: [],
      rules: {
        name: [{
          max: 20,
          type: 'string',
          required: true,
          message: '请输入角色名称,长度在20个字符以内',
          trigger: 'blur'
        }],
        code: [{
          max: 20,
          type: 'string',
          required: true,
          message: '请输入角色code,长度在20个字符以内',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {},
  methods: {
    getParamMap: function() {
      console.log(this.userData)
      for (let i = 0; i < this.userData.length; i++) {
        const ids = {}
        ids.personId = this.userData[i]
        this.users[i] = ids
      }
      console.log(this.users)
      for (let i = 0; i < this.permissionData.length; i++) {
        const ids = {}
        ids.permissionId = this.permissionData[i]
        this.permissions[i] = ids
      }

      return {
        name: this.role.name,
        code: this.role.code,
        remark: this.role.remark,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        permissionData: this.permissionData,
        userData: this.userData,
        version: 0,
        isDel: 0,
        users: this.users,
        permissions: this.permissions

      }
    },
    handleYes(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('/api/a01auth/role/insertRole', this.getParamMap()).then((res) => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '添加成功!',
              position: 'bottom-right'
            })
            this.$router.push('role')
          }).catch(() => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'info',
              message: '已取消',
              position: 'bottom-right'
            })
          }) // 捕捉异常,取消操作
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            type: 'error',
            message: '添加失败',
            position: 'bottom-right'
          })
          return false
        }
      })
    },
    handleNo() {
      this.$router.push('role')
    }
  }
}
</script>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
</style>
