<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="10" :xl="14">
            <el-form-item label="用户组名称：" label-width="150px" prop="name">
              <el-input
                v-model.trim="name"
                style="width: 75%;float: left;"
                placeholder="请输入用户组名称"

                clearable
                :rules="[
                  { required: true, message: '请输入用户组名称', trigger: 'blur' }
                ]"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="10" :xl="12">
            <el-form-item label="上级用户组名称：" label-width="150px" prop="pName">
              <el-select v-model="pName" style="width: 75%;float: left;">
                <el-option v-for="item in data3" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="分配角色：" style="width: 40%;margin: 0 auto 22px auto;">
          <el-transfer
            v-model="value1"
            :props="{
              key: 'id',
              label: 'name'
            }"
            :data="data1"
          />
        </el-form-item>
        <el-form-item label="分配用户：" style="width: 40%;margin: 0 auto 22px auto;">
          <el-transfer
            v-model="value2"
            :props="{
              key:'id',
              label: 'name'
            }"
            :data="data2"
          />
        </el-form-item>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="9" :xl="12">
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model="remark"
                rows="3"
                type="textarea"
                style="width: 87%;float: left;"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <el-button type="primary" plain icon="el-icon-search" style="margin-top:15px;margin-right:40px;" @click="handleNo()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleYes()">添加</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
// import { getUserInfo } from '@/utils/userInfo'
export default {
  data() {
    const generateData1 = _ => {
      const data = []
      axios.get('/api/a01auth/role/findAllRole', {}).then((res) => {
        // console.log(res)
        // const list = res.data
        // console.log(list)
        // for (let i = 0; i < list.length; i++) {
        // // console.log(list[i].name)
        //   data.push({
        //     value: list[i].name,
        //     desc: ` ${list[i].name}`
        //   /* disabled: list[i].name */
        //   })
        // }
        data.push(...res.data)
      })
      return data
    }
    const generateData2 = _ => {
      const data = []
      axios.post('/api/a02person/person/findPersonname', {}).then((res) => {
        data.push(...res.data)
      })
      return data
    }
    const generateData3 = _ => {
      const data = []
      axios.get('/api/a01auth/usergroup/selectGroupNameAndId').then((res) => {
        this.data3 = res.data.resultData
      })

      return data
    }

    return {
      data1: generateData1(),
      value1: [],
      data2: generateData2(),
      data3: generateData3(),
      value2: [],
      pName: undefined,
      code: undefined,
      name: undefined,
      remark: undefined,
      /* type: undefined, */
      users: [],
      roles: [],
      EC00001: '接口表添加出错（后台错误）！'

    }
  },
  created() {
    this.getTime()
  },
  methods: {
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    getParamMap: function() {
      /* const vu = this.generateData2() */
      /* this.users = this.value2 */
      for (let i = 0; i < this.value2.length; i++) {
        const ids = {}
        ids.personId = this.value2[i]
        this.users[i] = ids
      }
      for (let i = 0; i < this.value1.length; i++) {
        const ids = {}
        ids.roleId = this.value1[i]
        this.roles[i] = ids
      }

      /* const roles = []
      const users = []

      for (var i = 0; i < userli.length; i++) {
        users.push({ 'id': userli[i].id })
      } */
      return {

        /* code: this.code, */
        pName: this.pName,
        name: this.name,
        type: this.type,
        remark: this.remark,
        value1: this.value1,
        value2: this.value2,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        modifyTime: this.currentTime,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        createTime: this.currentTime,
        version: 0,
        isDel: 0,
        users: this.users,
        roles: this.roles

      }
    },

    addData() {
      axios.post('/api/a01auth/usergroup/addGroup', this.getParamMap()).then((res) => {
        if (res.data.status === 1) {
          this.$router.push('group')
          this.$notify({
            message: '添加成功！',
            type: 'success',
            position: 'bottom-right'
          })
        } else {
          this.msg = res.data.msg
          if (this.msg === 'EC00001') {
            // this.open2('添加失败！')
            this.$notify({
              message: '添加失败！',
              type: 'error',
              position: 'bottom-right'
            })
          }
        }
      })
    },
    handleYes() {
      if (this.name === undefined) {
        // if (this.notifyInstance) {
        //   this.notifyInstance.close()
        // }
        this.notifyInstance = this.$notify({
          message: '请输入用户组名称！',
          type: 'error',
          position: 'bottom-right'
        })
        return
      }
      if (this.getParamMap().roles.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请分配角色',
          type: 'error',
          position: 'bottom-right'
        })
        return
      }
      if (this.getParamMap().users.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请分配用户',
          type: 'error',
          position: 'bottom-right'
        })
        return
      }
      this.addData()
      // if (this.notifyInstance) {
      //   this.notifyInstance.close()
      // }
      // this.notifyInstance = this.$message({
      //   type: 'success',
      //   message: '添加成功!',
      //   position: 'bottom-right'
      // })
    },
    handleNo() {
      this.$router.push('group')
    }

  }
}
</script>
