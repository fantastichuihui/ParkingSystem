<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form ref="role" :model="role" :rules="rules">
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
              <el-input v-model="role.remark" style="width: 87%;float: left;" placeholder="请输入角色描述" rows="3" type="textarea" />
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
    return {
      role: {
        name: this.$route.params.role.name,
        code: this.$route.params.role.code,
        remark: this.$route.params.role.remark,
        id: this.$route.params.role.id,
        version: this.$route.params.role.version,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name
      },
      data1: [],
      data2: [],
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
  created() {
    this.initData()
  },
  methods: {
    initData: function() {
      axios.get('/api/a01auth/role/findAllPermission', {}).then((res) => {
        this.data1.push(...res.data)
        console.log(this.data1)
      })

      axios.get('/api/a02person/person/findPersonname', {}).then((res) => {
        this.data2.push(...res.data)
      })

      axios.post('/api/a01auth/role/selectPersonRole', {
        id: this.$route.params.role.id
      }).then(res => {
        axios.post('/api/a02person/person/  ', res.data.resultData).then(personData => {
          personData.data.resultData.forEach((item, index) => {
            this.userData.push(item.id)
          })
        })
      })

      axios.get(`/api/a01auth/permission/findPermissionByRoleId?id=${this.$route.params.role.id}`).then(res => {
        res.data.resultData.forEach((item, index) => {
          this.permissionData.push(item.id)
        })
      })
    },
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
        ids.roleId = this.permissionData[i]
        this.permissions[i] = ids
      }

      return {
        id: this.role.id,
        name: this.role.name,
        code: this.role.code,
        remark: this.role.remark,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        permissionData: this.permissionData,
        userData: this.userData,
        version: this.role.version,
        users: this.users,
        permissions: this.permissions

      }
    },
    handleYes(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.put('/api/a01auth/role/updateRole', this.getParamMap()).then((res) => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '修改成功!',
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
            message: '修改失败',
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
