<template>
  <div g_container>

    <!-- 用户组编码：
    <el-input
      v-model="code"
      placeholder="请输入用户组名称"
      class="g_input"
      clearable
    /><br> -->
    用户组名称：
    <el-input
      v-model="name"
      style="    width: 20%;margin: 0 auto;"
      label="    用户组名称："
      placeholder="请输入用户组名称"
      class="g_input"
      clearable
    /><br><br>
    上级用户组名称：
    <el-select v-model="pName" class="g_input" style="width: 20%;margin: 0 auto;">
      <el-option v-for="item in data5" :key="item.id" :label="item.name" :value="item.name" />
      <!-- </el-select> -->
    </el-select><br><br>
    <!-- 权限类型：
    <el-select v-model="type" class="g_input">
      <el-option label="1" value="1" />
      <el-option label="0" value="0" />
    </el-select><br> -->
    ----------------------------------角色分配--------------------------------

    <el-transfer
      v-model="value1"
      :props="{
        key: 'id',
        label: 'name'
      }"
      :data="data1"
    />

    <div><br>
      -------------------------------------选择用户-----------------------------------
      <el-transfer
        v-model="value2"
        :props="{
          key: 'id',
          label: 'name'
        }"
        :data="data2"
      />
    </div><br>
    <!-- 备注:
    <el-input
      v-model="remark"
      type="textarea"
      label="备注 ："
      placeholder="请备注..."
      class="g_input"
      clearable
    /><br> -->

    备注:

    <el-input v-model="remark" type="textarea" style="    width: 27%;" />

    <div>
      <el-button type="primary" plain icon="el-icon-search" style="margin-top:15px;margin-right:80px;" @click="handleNo()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleYes()">修改</el-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    const generateData1 = _ => {
      const data = []
      axios.get('/api/a01auth/role/findAllRole', {}).then((res) => {
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
    const generateData3 = _ => {
      const data = []
      axios.post('/api/a01auth/usergroup/selectRoleNameAndId', { id: this.$route.params.group.id }).then(res => {
        for (let i = 0; i < res.data.resultData.length; i++) {
          data.push(res.data.resultData[i].id)
        }
      })
      return data
    }
    const generateData4 = _ => {
      const data = []
      axios.get('/api/a01auth/personAccount/findAllAccount', { id: this.$route.params.group.id }).then(res => {
        const account = res.data.resultData
        const listmap = []
        for (let i = 0; i < account.length; i++) {
          const ids = {}
          ids.id = account[i].accountId
          listmap[i] = ids
        }

        // console.log(res.data.resultData)
        // axios.get('/api/a02person/person/findPernameAndPerAcc', listmap).then(res => {
        //   for (let i = 0; i < res.data.length; i++) {
        //     data.push(res.data[i].id)
        //   }
        // })
      })
      return data
    }
	const generateData5 = _ => {
	  const data = []
	  axios.get('/api/a01auth/usergroup/selectGroupNameAndId').then((res) => {
	    this.data5 = res.data.resultData
	  })
	}
    return {
	  data5: generateData5(),	
      data1: generateData1(),
      value1: generateData3(),
      data2: generateData2(),
      value2: generateData4(),
      /* code: undefined, */
      pName: this.$route.params.group.pName,
      name: this.$route.params.group.name,
      type: undefined,
      remark: undefined,
      users: [],
      roles: [],
      id: this.$route.params.group.id,
      version: this.$route.params.group.version
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    /*    axios.post('/a01/usergroup/updateGroup', this.getParamMap()).then((res) => {
    }) */
  },
  methods: {
    getParamMap: function() {
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
      return {
        pName: this.pName,
        name: this.name,
        type: this.type,
        remark: this.remark,
        value1: this.value1,
        value2: this.value2,
        users: this.users,
        roles: this.roles,
        id: this.id,
        version: this.version,
        modifierName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code
      }
    },
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
    editData() {
	  if(this.getParamMap().pName===undefined){
		this.$notify({
		  title: '警告',
		  message: '请选择上级用户信息',
		  type: 'warning',
		  position: 'bottom-right'
		})
		return
	  }
      if (this.getParamMap().users.length === 0) {
        this.$notify({
          title: '警告',
          message: '请分配好用户和角色信息',
          type: 'warning',
          position: 'bottom-right'
        })
        return
      }
      if (this.getParamMap().roles.length === 0) {
        this.$notify({
          title: '警告',
          message: '请分配用户和角色信息',
          type: 'warning',
          position: 'bottom-right'
        })
        return;
      }
      axios.put('/api/a01auth/usergroup/updateGroup', this.getParamMap()).then((res) => {
        if (res.data.status === 1) {
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '修改成功',
            position: 'bottom-right'
          })
          this.$router.push('group')
        } else {
          // 修改失败，给出提示
          this.msg = res.data.msg
          if (this.msg === 'EC00003') {
            this.open2('修改数据失败')
          }
        }
      })
    },
    handleYes() {
		console.log(this.pName)
      this.editData()
    },
    handleNo() {
      this.$router.push('group')
    }

  }
}
</script>
