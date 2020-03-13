<template>
  <div g_container>
    <el-form ref="validatefrom" :model="validatefrom" class="demo-form-inline">
      <el-form-item class="g_inputForm">
        <el-form-item
          style="float: left"
          prop="searchCname"
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
          <el-input v-model="index1.contactsName" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsEmail" label="联系人邮箱：" style="float: left">
          <el-input v-model="index1.contactsEmail" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsPhone" label="联系人电话：" style="float: left">
          <el-input v-model="index1.contactsPhone" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsPost" label="联系人邮编：" style="float: left">
          <el-input v-model="index1.contactsPost" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-form-item prop="contactsRemark" label="联系人备注：" style="float: left">
          <el-input v-model="index1.contactsRemark" placeholder="请输入内容" style="width: 90%;margin-right:100px" clearable />
        </el-form-item>
        <el-button type="danger" plain @click="handleRemove(index)">删除</el-button>
      </el-form-item>
      <el-form-item style="font-size: 16px;border-radius: 10px;float: right">
        <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh('validatefrom')">重置</el-button>
        <el-button type="primary" plain icon="el-icon-check" @click="handleSave('validatefrom')">保存</el-button>
        <el-button type="primary" plain icon="el-icon-close" @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      validatefrom: {
        switchValue: 0,
        searchCname: '',
        searchTelephone: '',
        searchAddress: '',
        searchWebsite: '',
        searchprovince_name: '',
        searchcity_name: '',
        searchLng: '',
        searchLat: '',
        switchTextarea: ''
      },
      EC00001: '客户表添加出错（后台错误）！',
      proviceData: [],
      cityData: [],
      counter: []
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
    handleRefresh(formName) {
      this.$refs[formName].resetFields()
      this.counter.splice({})
    },
    handleCancel() {
      this.$router.push('customer')
    },
    handleAdd() {
      this.counter.push({})
    },
    handleRemove(index) {
      this.counter.splice(index, 1)
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
    getProvince() {
      axios.get('/api/a04ds/datastandard/findProviceTree').then((province) => {
        for (let i = 0; i < province.data.resultData.children.length; i++) {
          this.proviceData[i] = province.data.resultData.children[i]
          this.cityData = ''
        }
      })
    },
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    getParamMap: function() {
      return {
        customer_name: this.validatefrom.searchCname,
        telephone: this.validatefrom.searchTelephone,
        detail_address: this.validatefrom.searchAddress,
        website: this.validatefrom.searchWebsite,
        province_name: this.validatefrom.searchprovince_name,
        city_name: this.validatefrom.searchcity_name,
        lng: this.validatefrom.searchLng,
        lat: this.validatefrom.searchLat,
        remark: this.validatefrom.switchTextarea,
        is_lock: 0,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        modifyTime: this.currentTime,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        createTime: this.currentTime,
        version: 0,
        isDel: 0,
        contactsList: this.counter
      }
    },
    handleSave(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('/api/b01crm/customer/addcustomer', this.getParamMap()).then((customer) => {
            if (customer.data.status === 1) {
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '添加成功!',
                position: 'bottom-right'
              })
              this.$router.push('customer')
            } else {
              this.msg = customer.data.msg
              if (this.msg === 'EC00001') {
                this.open2(this.EC00001)
              }
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
