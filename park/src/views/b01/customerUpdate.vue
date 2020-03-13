<template>
  <div g_container>
    <el-form ref="validatefrom" :model="validatefrom" class="demo-form-inline">
      <el-form-item class="g_inputForm">
        <el-form-item
          prop="searchCname"
          style="float: left"
          label="客户名称："
          :rules="[
            { required: true, message: '请输入客户名称', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5_a-zA-Z]+$/, message: '请输入正确的客户名称', trigger: 'blur' }
          ]"
        >
          <el-input v-model="validatefrom.searchCname" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="searchTelephone"
          style="float: left"
          label="联系电话："
          :rules="[
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { pattern: /^1[34578]\d{9}$/, message: '请输入正确的电话号码', trigger: 'blur' }
          ]"
        >
          <el-input v-model="validatefrom.searchTelephone" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="searchAddress"
          style="float: left"
          label="联系地址："
          :rules="[
            { required: true, message: '请输入联系地址', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/, message: '请输入正确的联系地址', trigger: 'blur' }
          ]"
        >
          <el-input v-model="validatefrom.searchAddress" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="searchWebsite"
          style="float: left"
          label="公司网站："
          :rules="[
            { required: true, message: '请输入公司网站', trigger: 'blur' },
            { pattern: /^(www).[a-zA-Z0-9\-\.]+\.(com)/, message: '请输入正确的网址', trigger: 'blur' }
          ]"
        >
          <el-input v-model="validatefrom.searchWebsite" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item
          prop="searchprovince_name"
          style="float: left"
          label="所属省份："
          :rules="[
            { required: true, message: '请输入所属省份', trigger: 'change' }
          ]"
        >
          <el-select v-model="validatefrom.searchprovince_name" style="width: 90%;margin-right:100px">
            <el-option v-for="item in proviceData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="searchcity_name"
          style="float: left"
          label="所属城市："
          :rules="[
            { required: true, message: '请输入所属城市', trigger: 'change' }
          ]"
        >
          <el-select v-model="validatefrom.searchcity_name" style="width: 90%;margin-right:100px">
            <el-option v-for="item in cityData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
          </el-select>
        </el-form-item>
        <el-form-item prop="searchLng" label="地图经度：" style="float: left">
          <el-input v-model="validatefrom.searchLng" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="searchLat" label="地图纬度：" style="float: left">
          <el-input v-model="validatefrom.searchLat" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="switchValue" label="锁定状态：" style="float: left">
          <el-switch v-model="validatefrom.switchValue" :disabled="true" />
        </el-form-item>
        <el-form-item prop="switchTextarea" label="备注：" style="float: left">
          <el-input v-model="validatefrom.switchTextarea" type="textarea" placeholder="请输入内容" style="width:870px" />
        </el-form-item>
      </el-form-item>
      <el-form-item v-for="(index1,index) in counter" :key="index" style="margin-left: 20px">
        <el-form-item prop="contactsName" label="联系人姓名：" style="float: left">
          <el-input v-model="index1.name" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsEmail" label="联系人邮箱：" style="float: left">
          <el-input v-model="index1.email" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsPhone" label="联系人电话：" style="float: left">
          <el-input v-model="index1.telephone" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsPost" label="联系人邮编：" style="float: left">
          <el-input v-model="index1.post" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsRemark" label="联系人备注：" style="float: left">
          <el-input v-model="index1.remark" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-button type="danger" plain @click="handleRemove(index)">删除</el-button>
      </el-form-item>
      <div style="font-size: 16px;border-radius: 10px;float: right">
        <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh('validatefrom')">重置</el-button>
        <el-button type="primary" plain icon="el-icon-check" @click="handleEdit">保存</el-button>
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
      validatefrom: {
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
        switchValue: this.$route.params.customer.is_lock,
        version: this.$route.params.customer.version
      },
      EC00003: '客户表修改出错（后台错误）！',
      proviceData: [],
      cityData: [],
      counter: this.$route.params.customer.contactList
    }
  },
  watch: {
    'validatefrom.searchprovince_name': function() {
      this.validatefrom.searchcity_name = ''
      this.cityData = ''
      this.proviceData.forEach((item, index) => {
        if (item.cnValue === this.validatefrom.searchprovince_name) {
          this.cityData = item.children
        }
      })
    }
  },
  created() {
    this.getTime()
    this.getProvince()
  },
  methods: {
    getParamMap1: function() {
      return {
        page: 1,
        rows: 100,
        customer_name: '',
        province_name: '',
        city_name: '',
        is_lock: false
      }
    },
    getProvince() {
      axios.get('/api/a04ds/datastandard/findProviceTree').then((province) => {
        for (let i = 0; i < province.data.resultData.children.length; i++) {
          this.proviceData[i] = province.data.resultData.children[i]
          this.proviceData.forEach((item, index) => {
            if (item.cnValue === this.validatefrom.searchprovince_name) {
              this.cityData = item.children
            }
          })
        }
      })
    },
    handleRefresh(formName) {
      this.$refs[formName].resetFields()
      this.counter.splice({})
    },
    handleRemove(index) {
      this.counter.splice(index, 1)
    },
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    editData: function() {
      axios.post('/api/b01crm/customer/updatecustomer', this.getParamMap()).then((customer) => {
        if (customer.data.status === 1) {
          this.$router.push('customer')
        } else {
          // 修改失败，给出提示
          this.msg = customer.data.msg
          if (this.msg === 'EC00003') {
            this.open2(this.EC00003)
          }
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
    getParamMap: function() {
      return {
        id: this.$route.params.customer.id,
        customer_name: this.validatefrom.searchCname,
        telephone: this.validatefrom.searchTelephone,
        detail_address: this.validatefrom.searchAddress,
        website: this.validatefrom.searchWebsite,
        province_name: this.validatefrom.searchprovince_name,
        city_name: this.validatefrom.searchcity_name,
        lng: this.validatefrom.searchLng,
        lat: this.validatefrom.searchLat,
        remark: this.validatefrom.switchTextarea,
        is_lock: this.$route.params.customer.is_lock,
        version: 0,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        modifyTime: this.currentTime,
        contactList: this.counter
      }
    },
    handleEdit(action) {
      if (this.validatefrom.searchCname === '' &&
      this.validatefrom.searchTelephone === '' &&
      this.validatefrom.searchAddress === '' &&
      this.validatefrom.searchWebsite === '' &&
      this.validatefrom.searchprovince_name === '' &&
      this.validatefrom.searchcity_name === '' &&
      this.validatefrom.searchLng === '' &&
      this.validatefrom.searchLat === '' &&
      this.validatefrom.switchTextarea === '') {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '您未输入修改数据，无法修改',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.editData()
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          type: 'success',
          message: '修改成功',
          position: 'bottom-right'
        })
        this.$router.push('customer')
      }
    },
    handleCancel() {
      this.$router.push('customer')
    },
    handleAdd() {
      this.counter.push({})
    }
  }
}
</script>
