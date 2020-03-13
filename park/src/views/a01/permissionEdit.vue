<template>
  <div g_container>
    <div>
      <el-form
        ref="permission"
        :model="permission"
        :rules="rules"
        class="g_elForm"
        label-width="150px"
      >
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="权限名称：" prop="name">
              <el-input v-model="permission.name" placeholder="请输入权限名称" class="g_elFormInput_other" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="权限对象：" prop="objId">
              <el-select v-model="permission.objId" placeholder="请选择权限" class="g_elFormInput_other">
                <el-option v-for="item in resData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="动作：" prop="actionId">
              <el-select v-model="permission.actionId" placeholder="请选择动作" class="g_elFormInput_other">
                <el-option v-for="item in actionData" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="权限描述：" prop="description">
              <el-input v-model="permission.description" placeholder="请输入描述" class="g_elFormInput_other" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
        <el-button type="primary" plain icon="el-icon-search" style="float:left;" @click="handleNo()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" style="float:left;margin-left:50px;" @click="handleYes('permission')">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      permission: {
        id: this.$route.params.permission.id,
        name: this.$route.params.permission.name,
        objId: this.$route.params.permission.objId,
        actionId: this.$route.params.permission.actionId,
        description: this.$route.params.permission.description,
        version: this.$route.params.permission.version,
        isDel: this.$route.params.permission.isDel,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name
      },
      resData: [],
      actionData: [],
      rules: {
        name: [{
          max: 20,
          type: 'string',
          required: true,
          message: '请输入资源名称,长度在20个字符以内',
          trigger: 'blur'
        }],
        objId: [{
          maxlength: 11,
          type: 'number',
          required: true,
          message: '请输入资源objId,长度在11个字符以内',
          trigger: 'change'
        }],
        actionId: [{
          maxlength: 11,
          type: 'number',
          required: true,
          message: '请输入动作id,长度在11个字符以内',
          trigger: 'change'
        }],
        description: [{
          max: 10,
          type: 'string',
          required: true,
          message: '请输入权限描述,长度在10个字符以内',
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
    axios.get('/api/a01auth/res/findAllRes').then((result) => {
      this.resData = result.data
    })
    axios.get('/api/a01auth/action/findAllAction').then((result) => {
      this.actionData = result.data
    })
  },
  methods: {
    handleYes(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.put('/api/a01auth/permission/updatePermission', this.permission).then((res) => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: '更新成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.$router.push('permission')
          }).catch(() => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: '已取消',
              type: 'info',
              position: 'bottom-right'
            })
          })
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '添加失败',
            type: 'error',
            position: 'bottom-right'
          })
          return false
        }
      })
    },
    handleNo() {
      this.$router.push('permission')
    }
  }
}
</script>
