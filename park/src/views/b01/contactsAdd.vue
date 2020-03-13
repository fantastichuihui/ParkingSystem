<template>
  <div g_container>
    <el-form class="demo-form-inline">
      <div class="g_inputForm">
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="客户名称：">
              <el-input v-model="searchCname" class="g_input" :disabled="true" placeholder="请输入内容" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="联系电话：">
              <el-input v-model="searchTelephone" :disabled="true" placeholder="请输入内容" class="g_input" clearable />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="联系地址：">
              <el-input v-model="searchAddress" :disabled="true" placeholder="请输入内容" class="g_input" clearable />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="公司网站：">
              <el-input v-model="searchWebsite" :disabled="true" placeholder="请输入内容" class="g_input" clearable />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="所属省份：">
              <el-input v-model="searchprovince_name" :disabled="true" class="g_input" />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="所属城市：">
              <el-input v-model="searchcity_name" :disabled="true" class="g_input" />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="地图经度：">
              <el-input v-model="searchLng" :disabled="true" placeholder="请输入内容" class="g_input" clearable />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="地图纬度：">
              <el-input v-model="searchLat" :disabled="true" placeholder="请输入内容" class="g_input" clearable />
            </el-form-item></el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="锁定状态：">
              <el-switch v-model="switchValue" :disabled="true">状态</el-switch>
            </el-form-item></el-col>
        </el-row>
        <el-row style="margin-left:20px">
          <el-form-item label="备注：">
            <el-input v-model="switchTextarea" type="textarea" :disabled="true" placeholder="请输入内容" style="width:500px" />
          </el-form-item></el-row>
      </div>
      <br>
      <el-form-item v-for="(index1,index) in counter" :key="index" style="margin-left: 20px">
        <el-form-item
          prop="name"
          label="联系人姓名："
          style="float: left"
        >
          <el-input v-model="index1.name" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="email"
          label="邮箱地址："
          style="float: left"
        >
          <el-input v-model="index1.email" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="telephone"
          label="联系人电话："
          style="float: left"
        >
          <el-input v-model="index1.telephone" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="post"
          label="联系人邮编："
          style="float: left"
        >
          <el-input v-model="index1.post" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="remark"
          label="联系人备注："
          style="float: left"
        >
          <el-input v-model="index1.remark" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-button type="danger" plain @click="handleRemove(index)">删除</el-button>
      </el-form-item>
      <div style="font-size: 16px;border-radius: 10px;float: right">
        <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
        <el-button type="primary" plain icon="el-icon-check" @click="handleSave">保存</el-button>
        <el-button type="primary" plain icon="el-icon-close" @click="handleCancel">取消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      switchValue: false,
      id: this.$route.params.customer.id,
      searchCname: this.$route.params.customer.customer_name,
      searchTelephone: this.$route.params.customer.telephone,
      searchAddress: this.$route.params.customer.detail_address,
      searchWebsite: this.$route.params.customer.website,
      searchprovince_name: this.$route.params.customer.province_name,
      searchcity_name: this.$route.params.customer.city_name,
      searchLng: this.$route.params.customer.lng,
      searchLat: this.$route.params.customer.lat,
      switchTextarea: this.$route.params.customer.remark,
      version: this.$route.params.customer.version,
      EC00001: '联系人表添加出错（后台错误）！',
      counter: [this.$route.params.customer]
    }
  },
  created() {
    this.getTime()
  },
  methods: {
    handleRefresh() {
      this.searchCname = ''
    },
    handleRemove(index) {
      this.counter.splice(index, 1)
    },
    handleAdd() {
      this.counter.push({})
    },
    handleCancel() {
      this.$router.push('contacts')
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
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    handleSave() {
      if (this.searchCname === '') {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '错误提示',
          message: '请输入添加数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        const length = this.counter.length
        const ParamMap = []
        for (let i = 1; i < length; i++) {
          const ids = {}
          ids.customer_id = this.$route.params.customer.customer_id
          ids.modifierCode = this.$store.state.userInfo.code
          ids.modifierName = this.$store.state.userInfo.name
          ids.modifyTime = this.currentTime
          ids.createUserCode = this.$store.state.userInfo.code
          ids.createUserName = this.$store.state.userInfo.name
          ids.createTime = this.currentTime
          ids.isDel = 0
          ids.version = 0
          ids.name = this.counter[i].name
          ids.post = this.counter[i].post
          ids.telephone = this.counter[i].telephone
          ids.email = this.counter[i].email
          ids.remark = this.counter[i].remark
          ParamMap[i - 1] = ids
        }
        axios.post('/api/b01crm/contact/addcontact', ParamMap).then((customer) => {
          if (customer.data.status === 1) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '添加成功!',
              position: 'bottom-right'
            })
            this.$router.push('contacts')
          } else {
            this.msg = customer.data.msg
            if (this.msg === 'EC00001') {
              this.open2(this.EC00001)
            }
          }
        })
      }
    }
  }
}
</script>
