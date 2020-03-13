<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form
        ref="deliveryCompanyAdd"
        :model="deliveryCompanyAdd"
        :rules="rules"
        label-width="120px"
      >
        <fieldset>
          <legend style="text-align:left; margin-left:0">单位信息</legend>
          <el-row>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="单位名称：" prop="name">
                <el-input
                  v-model.trim="deliveryCompanyAdd.name"
                  class="deliveryCompany_input"
                  placeholder="请输入单位名称"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="单位编号：" prop="companyNo">
                <el-input
                  v-model.trim="deliveryCompanyAdd.companyNo"
                  class="deliveryCompany_input"
                  placeholder="请输入单位编号"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="联系电话：" prop="telephone">
                <el-input
                  v-model.trim="deliveryCompanyAdd.telephone"
                  class="deliveryCompany_input"
                  placeholder="请输入联系电话"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="联系地址：" prop="detail_address">
                <el-input
                  v-model.trim="deliveryCompanyAdd.detail_address"
                  class="deliveryCompany_input"
                  placeholder="请输入联系地址"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item
                label="所属省份："
                prop="address"
              >
                <el-select
                  v-model.trim="deliveryCompanyAdd.address"
                  class="deliveryCompany_select"
                  placeholder="请选择省份"
                  clearable
                  @change="inputChange"
                >
                  <el-option
                    v-for="item in deliveryProvinces"
                    :key="item.id"
                    :label="item.cnValue"
                    :value="item.lCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="所属城市：" prop="Column_16">
                <el-select
                  v-model.trim="deliveryCompanyAdd.Column_16"
                  class="deliveryCompany_select"
                  placeholder="请选择城市"
                  clearable
                  @change="inputChange"
                >
                  <el-option
                    v-for="item in deliveryCitys"
                    :key="item.id"
                    :label="item.cnValue"
                    :value="item.lCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="地图经度：" prop="lng">
                <el-input
                  v-model.trim="deliveryCompanyAdd.lng"
                  class="deliveryCompany_input"
                  placeholder="请输入地图经度"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="地图纬度：" prop="lat">
                <el-input
                  v-model.trim="deliveryCompanyAdd.lat"
                  class="deliveryCompany_input"
                  placeholder="请输入地图纬度"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="公司网站：" prop="website">
                <el-input
                  v-model.trim="deliveryCompanyAdd.website"
                  class="deliveryCompany_input"
                  placeholder="请输入公司网站"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="锁定状态：" prop="status">
                <el-switch
                  v-model.trim="deliveryCompanyAdd.status"
                  on-value="1"
                  off-value="0"
                  @change="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="23" :xl="24">
              <el-form-item label="备注：" prop="remark">
                <el-input
                  v-model.trim="deliveryCompanyAdd.remark"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  class="deliveryCompany_textarea"
                  placeholder="请输入备注"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
        <fieldset style="margin-top:30px;">
          <legend style="text-align:left;margin-left:0px;">联系人信息</legend>
          <el-row>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="联系人姓名：" prop="concateName">
                <el-input
                  v-model.trim="deliveryCompanyAdd.concateName"
                  placeholder="请输入联系人姓名"
                  class="deliveryCompany_input"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="联系人邮箱：" prop="concateEmail">
                <el-input
                  v-model.trim="deliveryCompanyAdd.concateEmail"
                  placeholder="请输入联系人邮箱"
                  class="deliveryCompany_input"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="联系人电话：" prop="concatePhone">
                <el-input
                  v-model.trim="deliveryCompanyAdd.concatePhone"
                  placeholder="请输入联系人电话"
                  class="deliveryCompany_input"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="联系人邮编：" prop="concateZipCode">
                <el-input
                  v-model.trim="deliveryCompanyAdd.concateZipCode"
                  placeholder="请输入联系人邮编"
                  class="deliveryCompany_input"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="23" :xl="24">
              <el-form-item label="联系人备注：" prop="concateRemark">
                <el-input
                  v-model.trim="deliveryCompanyAdd.concateRemark"
                  placeholder="请输入联系人备注"
                  class="deliveryCompany_textarea"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6}"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>

    </div>
    <div style="margin-top:20px;">
      <el-button type="primary" plain icon="el-icon-search" @click="handleReset()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-back" @click="handleNo()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-plus" :disabled="add" @click="handleYes('deliveryCompanyAdd')">确定</el-button>
    </div>
  </div>
</template>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
.deliveryCompany_input {
    width:65%;
}
.deliveryCompany_select {
    width:65%;
}

.deliveryCompany_textarea {
  width:93%;
}
</style>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 确定初始状态为禁用
      add: true,
      is_lock: 0,
      // 添加配送单位的表单
      deliveryCompanyAdd: {
        name: '',
        companyNo: '',
        telephone: '',
        detail_address: '',
        website: '',
        remark: '',
        address: '',
        Column_16: '',
        lng: '',
        lat: '',
        status: false,
        concateName: '',
        concateEmail: '',
        concatePhone: '',
        concateZipCode: '',
        concateRemark: ''
      },
      organization: {
        code: '',
        pcode: 6,
        name: '',
        orgLevel: 4,
        sort: 4
      },
      // address: '',
      deliveryProvinces: [],
      deliveryCitys: [],
      rules: {
        name: [
          { required: true, message: '单位名称不能为空！', trigger: 'blur' },
          { pattern: /^[\u0391-\uFFE5A-Za-z0-9]+$/, message: '名称只能为中英文或数字，不包含特殊字符及空格！' }
        ],
        companyNo: [
          { required: true, message: '单位编号不能为空！', trigger: 'blur' },
          { pattern: /^[\u0391-\uFFE5A-Za-z0-9]+$/, message: '单位编号只能为中英文或数字，不包含特殊字符及空格！' }
        ],
        telephone: [
          { required: true, message: '联系电话不能为空！', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '请输入正确的11位电话号码或者正确的固定电话号码！' }
        ],
        detail_address: [
          { required: true, message: '联系地址不能为空！', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '省份不能为空！', trigger: 'change' }
        ],
        Column_16: [
          { required: true, message: '城市不能为空！', trigger: 'change' }
        ],
        website: [
          { required: true, message: '公司网站不能为空！', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '锁定状态不能为空！', trigger: 'blur' }
        ],
        concateName: [
          { required: true, message: '联系人姓名不能为空！', trigger: 'blur' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符及空格！' }
        ],
        concateEmail: [
          { required: true, message: '联系人邮箱不能为空！', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式输入有误,请重新输入！' }
        ],
        concatePhone: [
          { required: true, message: '联系人电话不能为空！', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '请输入正确的11位电话号码或者正确的固定电话号码！' }
        ],
        concateZipCode: [
          { required: true, message: '联系人邮编不能为空！', trigger: 'blur' },
          { pattern: /^[0-9]{6}$/, message: '邮编格式不正确，请重新输入！' }
        ]
      }
    }
  },
  computed: { useInfo() { return this.$store.state.userInfo } },
  watch: {
    'deliveryCompanyAdd.address': function(data) {
      this.deliveryCompanyAdd.Column_16 = ''
      this.deliveryCitys = []
      this.deliveryProvinces.forEach((item, index) => {
        if (item.lCode === this.deliveryCompanyAdd.address) {
          this.deliveryCitys = item.children
        }
      })
    }
  },
  created() {
    axios.get('/api/a04ds/datastandard/findProviceTree').then((province) => {
      for (let i = 0; i < province.data.resultData.children.length; i++) {
        this.deliveryProvinces[i] = province.data.resultData.children[i]
        this.deliveryCitys = []
      }
    })
  },
  methods: {
    // 用户不输入时确定按钮为禁用
    inputChange() {
      if (
        this.deliveryCompanyAdd.name === '' &&
        this.deliveryCompanyAdd.companyNo === '' &&
        this.deliveryCompanyAdd.telephone === '' &&
        this.deliveryCompanyAdd.detail_address === '' &&
        this.deliveryCompanyAdd.website === '' &&
        this.deliveryCompanyAdd.remark === '' &&
        (this.deliveryCompanyAdd.address === '' || this.deliveryCompanyAdd.address === null) &&
        (this.deliveryCompanyAdd.Column_16 === '' || this.deliveryCompanyAdd.Column_16 === null) &&
        this.deliveryCompanyAdd.lng === '' &&
        this.deliveryCompanyAdd.lat === '' &&
        this.deliveryCompanyAdd.status === false &&
        this.deliveryCompanyAdd.concateName === '' &&
        this.deliveryCompanyAdd.concateEmail === '' &&
        this.deliveryCompanyAdd.concatePhone === '' &&
        this.deliveryCompanyAdd.concateZipCode === '' &&
        this.deliveryCompanyAdd.concateRemark === ''
      ) {
        this.add = true
      } else {
        this.add = false
      }
    },
    // 重置执行单查询输入框
    handleReset() {
      this.deliveryCompanyAdd.name = ''
      this.deliveryCompanyAdd.companyNo = ''
      this.deliveryCompanyAdd.telephone = ''
      this.deliveryCompanyAdd.detail_address = ''
      this.deliveryCompanyAdd.website = ''
      this.deliveryCompanyAdd.address = ''
      this.deliveryCompanyAdd.Column_16 = ''
      this.deliveryCompanyAdd.remark = ''
      this.deliveryCompanyAdd.lng = ''
      this.deliveryCompanyAdd.lat = ''
      this.deliveryCompanyAdd.status = false
      this.deliveryCompanyAdd.lng = ''
      this.deliveryCompanyAdd.concateName = ''
      this.deliveryCompanyAdd.concateEmail = ''
      this.deliveryCompanyAdd.concatePhone = ''
      this.deliveryCompanyAdd.concateZipCode = ''
      this.deliveryCompanyAdd.concateRemark = ''
      this.add = true
    },
    // 点击确定添加
    handleYes(deliveryCompanyAdd) {
      // 省名称
      let Column_15 = ''
      // 市名称
      let Column_17 = ''
      // 通过省编码获得相应的省名称
      this.deliveryProvinces.forEach((item, index) => {
        if (item.lCode === this.deliveryCompanyAdd.address) {
          Column_15 = item.cnValue
        }
      })
      // 通过市编码获得相应的市名称
      this.deliveryCitys.forEach((item, index) => {
        if (item.lCode === this.deliveryCompanyAdd.Column_16) {
          Column_17 = item.cnValue
        }
      })
      // 判断按钮状态，关闭状态使is_lock为0，否则为1
      if (this.deliveryCompanyAdd.status === false) {
        this.deliveryCompanyAdd.is_lock = 0
      } else {
        this.deliveryCompanyAdd.is_lock = 1
      }
      console.log(this.deliveryCompanyAdd)
      this.$refs[deliveryCompanyAdd].validate((valid) => {
        if (valid) {
          this.deliveryCompanyAdd.Column_15 = Column_15
          this.deliveryCompanyAdd.Column_17 = Column_17
          this.deliveryCompanyAdd.modifierCode = this.$store.state.userInfo.code
          this.deliveryCompanyAdd.modifierName = this.$store.state.userInfo.name
          this.deliveryCompanyAdd.createUserCode = this.$store.state.userInfo.code
          this.deliveryCompanyAdd.createUserName = this.$store.state.userInfo.name
          console.log(this.deliveryCompanyAdd)

          this.organization.code = this.deliveryCompanyAdd.companyNo
          this.organization.name = this.deliveryCompanyAdd.name
          this.organization.modifierCode = this.$store.state.userInfo.code
          this.organization.modifierName = this.$store.state.userInfo.name
          this.organization.createUserCode = this.$store.state.userInfo.code
          this.organization.createUserName = this.$store.state.userInfo.name
          axios.post('/api/b05lms/deliverycompany/insertDeliveryCompany', this.deliveryCompanyAdd).then((res) => {
            axios.post('/api/a02person/organization/insertorg', this.organization).then((res) => {})

            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '添加成功!',
              position: 'bottom-right'
            })
          }).catch(() => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: '添加失败',
              type: 'error',
              position: 'bottom-right'
            })
          })
        } else {
          return false
        }
        this.$router.push('deliveryCompany')
      })
    },
    handleNo() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        message: '已取消添加',
        type: 'info',
        position: 'bottom-right'
      })
      this.$router.push('deliveryCompany')
    }
  }
}
</script>
