<template>
  <div g_container>
    <div class="g_inputForm">
      <el-row style="margin-left:20px">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          线索名称：
          <el-input v-model="searchClues" placeholder="请输入内容" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          客户公司：
          <el-select v-model="searchCname" class="g_input" placeholder="请选择资源名称">
            <el-option v-for="item in customerData" :key="item.id" :label="item.customer_name" :value="item.customer_name" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          客户地址：
          <el-input v-model="searchAddress" placeholder="请输入内容" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          所属省份：
          <el-select v-model="searchprovince_name" class="g_input">
            <el-option v-for="item in proviceData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          所属城市：
          <el-select v-model="searchcity_name" class="g_input">
            <el-option v-for="item in cityData" :key="item.id" :label="item.cnValue" :value="item.cnValue" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系座机：
          <el-input v-model="searchLandline" placeholder="请输入内容" class="g_input" clearable />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系人姓名：
          <el-select v-model="searchName" placeholder="请输入内容" class="g_input">
            <el-option v-for="item in nameData" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系人电话：
          <el-input v-model="searchTelephone" placeholder="请输入内容" class="g_input" clearable />
        </el-col>
      </el-row>
      <el-row style="margin-left:20px">
        备注：
        <el-input v-model="switchTextarea" type="textarea" placeholder="请输入内容" style="width:500px" />
      </el-row>
    </div>
    <br>
    <div class="g_button">
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
      id: this.$route.params.business.id,
      searchClues: this.$route.params.business.leads_name,
      searchCname: this.$route.params.business.customer_name,
      searchName: this.$route.params.business.conName,
      searchTelephone: this.$route.params.business.telephone,
      searchLandline: this.$route.params.business.mobile,
      searchAddress: this.$route.params.business.address,
      searchprovince_name: this.$route.params.business.province_name,
      searchcity_name: this.$route.params.business.city_name,
      switchTextarea: this.$route.params.business.remark,
      EC00003: '商务线索表修改出错（后台错误）！',
      proviceData: [],
      customerData: [],
      cityData: [],
      nameData: []
    }
  },
  watch: {
    searchCname: function() {
      this.customerData.forEach((item, index) => {
        if (item.customer_name === this.searchCname) {
          this.id = item.id
          this.searchLandline = item.telephone
          this.searchAddress = item.detail_address
          this.searchprovince_name = item.province_name
          this.searchcity_name = item.city_name
        }
      })
    },
    searchName: function() {
      this.nameData.forEach(item => {
        if (item.name === this.searchName) {
          this.searchTelephone = item.telephone
        }
      })
    },
    searchprovince_name: function() {
      this.searchcity_name = ''
      this.cityData = ''
      this.proviceData.forEach((item, index) => {
        if (item.cnValue === this.searchprovince_name) {
          this.cityData = item.children
        }
      })
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
      this.searchClues = this.$route.params.business.leads_name
      this.searchCname = this.$route.params.business.customer_name
      this.searchName = this.$route.params.business.conName
      this.searchTelephone = this.$route.params.business.telephone
      this.searchLandline = this.$route.params.business.mobile
      this.searchAddress = this.$route.params.business.address
      this.searchprovince_name = this.$route.params.business.province_name
      this.searchcity_name = this.$route.params.business.city_name
      this.switchTextarea = this.$route.params.business.remark
    },
    handleCancel() {
      this.$router.push('business')
    },
    getProvince() {
      axios.get('/api/a04ds/datastandard/findProviceTree').then((province) => {
        for (let i = 0; i < province.data.resultData.children.length; i++) {
          this.proviceData[i] = province.data.resultData.children[i]
          this.proviceData.forEach((item, index) => {
            if (item.cnValue === this.searchprovince_name) {
              this.cityData = item.children
            }
          })
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
    getParamMap: function() {
      return {
        leads_id: this.$route.params.business.leads_id,
        customer_id: this.id,
        customer_name: this.searchCname,
        is_transform: 0,
        leads_name: this.searchClues,
        conName: this.searchName,
        telephone: this.searchTelephone,
        mobile: this.searchLandline,
        address: this.searchAddress,
        remark: this.switchTextarea,
        version: 0,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        modifyTime: this.currentTime,
        contactList: this.counter
      }
    },
    handleSave() {
      if (this.searchCname === undefined && this.searchClues === undefined) {
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
        axios.post('/api/b01crm/leads/updateleads', this.getParamMap()).then((customer) => {
          if (customer.data.status === 1) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '更新成功!',
              position: 'bottom-right'
            })
            this.$router.push('business')
          } else {
            this.msg = customer.data.msg
            if (this.msg === 'EC00003') {
              this.open2(this.EC00003)
            }
          }
        })
      }
    }
  }
}
</script>
