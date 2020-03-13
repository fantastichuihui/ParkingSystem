<template>
  <div g_container>
    <div v-for="(index1,index) in counter" :key="index">
      <div class="g_inputForm">
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            线索名称：
            <el-input v-model="index1.searchClues" placeholder="请输入内容" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            客户公司：
            <el-select v-model="index1.searchCname" class="g_input" placeholder="请选择客户公司" @change="cnameValue($event)">
              <el-option v-for="item in customerData" :key="item.id" :label="item.customer_name" :value="item.customer_name" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            客户地址：
            <el-input v-model="index1.searchAddress" placeholder="请输入内容" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            所属省份：
            <el-select v-model="index1.searchprovince_name" class="g_input" placeholder="请选择省份" @change="provinceValue($event)">
              <el-option v-for="item in proviceData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            所属城市：
            <el-select v-model="index1.searchcity_name" class="g_input" placeholder="请选择城市">
              <el-option v-for="item in cityData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            联系人座机：
            <el-input v-model="index1.searchLandline" placeholder="请输入内容" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            联系人姓名：
            <el-select v-model="index1.searchName" placeholder="请输入内容" class="g_input" @change="nameValue($event)">
              <el-option v-for="item in nameData" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            联系人电话：
            <el-input v-model="index1.searchTelephone" placeholder="请输入内容" class="g_input" clearable />
          </el-col>
        </el-row>
        <el-row style="margin-left:20px">
          备注：
          <el-input v-model="index1.switchTextarea" type="textarea" placeholder="请输入内容" style="width:500px" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="danger" plain @click="handleRemove(index)">删除</el-button>
        </el-row>
      </div>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button type="primary" plain icon="el-icon-check" @click="handleSave">保存</el-button>
      <el-button type="primary" plain icon="el-icon-close" @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      proviceData: [],
      customerData: [],
      cityData: [],
      nameData: [],
      EC00001: '商务线索表添加出错（后台错误）！',
      counter: [{}]
    }
  },
  created() {
    this.getTime()
    this.getcustomerData()
    this.getnameData()
    this.getProvince()
  },
  methods: {
    handleRefresh() {
      this.counter.splice(1)
      this.counter[0].searchCname = ''
      this.counter[0].searchClues = ''
      this.counter[0].searchLandline = ''
      this.counter[0].searchprovince_name = ''
      this.counter[0].searchcity_name = ''
      this.counter[0].searchAddress = ''
      this.counter[0].searchName = ''
      this.counter[0].searchTelephone = ''
      this.counter[0].switchTextarea = ''
    },
    handleCancel() {
      this.$router.push('business')
    },
    handleAdd() {
      this.counter.push({})
    },
    handleRemove(index) {
      this.counter.splice(index, 1)
    },
    cnameValue(event) {
      this.customerData.forEach((item, index) => {
        for (let i = 0; i < this.counter.length; i++) {
          if (item.customer_name === this.counter[i].searchCname) {
            this.counter[i].id = item.id
            this.counter[i].searchLandline = item.telephone
            this.counter[i].searchprovince_name = item.province_name
            this.counter[i].searchcity_name = item.city_name
            this.counter[i].searchAddress = item.detail_address
          }
        }
      })
    },
    nameValue(event) {
      this.nameData.forEach((item, index) => {
        for (let i = 0; i < this.counter.length; i++) {
          if (item.name === this.counter[i].searchName) {
            this.counter[i].searchTelephone = item.telephone
          }
        }
      })
    },
    provinceValue(event) {
      this.cityData = ''
      this.proviceData.forEach((item, index) => {
        if (item.cnValue === event) {
          this.cityData = item.children
        }
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
    getcustomerData() {
      axios.post('/api/b01crm/customer/selectcustomer', this.getParamMap1()).then((customer) => {
        this.customerData = customer.data.resultData.rows
      })
    },
    getnameData() {
      axios.post('/api/b01crm/contact/selectContact', this.getParamMap1()).then((customer) => {
        this.nameData = customer.data.resultData.rows
      })
    },
    getParamMap1: function() {
      return {
        page: 1,
        rows: 100,
        name: '',
        customer_name: '',
        province_name: '',
        city_name: '',
        is_lock: false
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
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    handleSave() {
      if (this.counter[0].searchCname === '' && this.counter[0].searchClues === '') {
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
        for (let i = 0; i < length; i++) {
          const ids = {}
          ids.modifierCode = this.$store.state.userInfo.code
          ids.modifierName = this.$store.state.userInfo.name
          ids.modifyTime = this.currentTime
          ids.createUserCode = this.$store.state.userInfo.code
          ids.createUserName = this.$store.state.userInfo.name
          ids.createTime = this.currentTime
          ids.isDel = 0
          ids.version = 0
          ids.is_transform = 0
          ids.id = this.counter[i].id
          ids.customer_name = this.counter[i].searchCname
          ids.leads_name = this.counter[i].searchClues
          ids.conName = this.counter[i].searchName
          ids.telephone = this.counter[i].searchTelephone
          ids.mobile = this.counter[i].searchLandline
          ids.address = this.counter[i].searchAddress
          ids.remark = this.counter[i].switchTextarea
          ParamMap[i] = ids
        }
        axios.post('/api/b01crm/leads/addleads', ParamMap).then((customer) => {
          if (customer.data.status === 1) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '添加成功!',
              position: 'bottom-right'
            })
            this.$router.push('business')
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
