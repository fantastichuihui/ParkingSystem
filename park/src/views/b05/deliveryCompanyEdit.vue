<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form
        ref="deliveryCompanyEdit"
        :model="deliveryCompanyEdit"
        :rules="rules"
        label-width="120px"
      >
        <fieldset>
          <legend style="text-align:left; margin-left:0">单位信息</legend>
          <el-row>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="单位名称：" prop="name">
                <el-input
                  v-model.trim="deliveryCompanyEdit.name"
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
                  v-model.trim="deliveryCompanyEdit.companyNo"
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
                  v-model.trim="deliveryCompanyEdit.telephone"
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
                  v-model.trim="deliveryCompanyEdit.detail_address"
                  class="deliveryCompany_input"
                  placeholder="请输入联系地址"
                  clearable
                  @input="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="所属省份：" prop="address">
                <el-select
                  v-model.trim="deliveryCompanyEdit.address"
                  class="deliveryCompany_select"
                  placeholder="请选择省份"
                  clearable
                  @change="inputChange"
                >
                  <el-option
                    v-for="item in deliveryProvinces"
                    :key="item.lCode"
                    :label="item.cnValue"
                    :value="item.lCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="所属城市：" prop="Column_16">
                <el-select
                  v-model.trim="deliveryCompanyEdit.Column_16"
                  class="deliveryCompany_select"
                  placeholder="请选择城市"
                  clearable
                  @change="inputChange"
                >
                  <el-option
                    v-for="item in deliveryCitys"
                    :key="item.lCode"
                    :label="item.cnValue"
                    :value="item.lCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="地图经度：" prop="lng">
                <el-input
                  v-model.trim="deliveryCompanyEdit.lng"
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
                  v-model.trim="deliveryCompanyEdit.lat"
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
                  v-model.trim="deliveryCompanyEdit.website"
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
                  v-model.trim="deliveryCompanyEdit.status"
                  on-value="1"
                  off-value="0"
                  @change="inputChange"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="23" :xl="24">
              <el-form-item label="备注：" prop="remark">
                <el-input
                  v-model.trim="deliveryCompanyEdit.remark"
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
        <fieldset style="margin-top:20px;">
          <el-row>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-form-item label="联系人姓名：" prop="concateName">
                <el-input
                  v-model.trim="deliveryCompanyEdit.concateName"
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
                  v-model.trim="deliveryCompanyEdit.concateEmail"
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
                  v-model.trim="deliveryCompanyEdit.concatePhone"
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
                  v-model.trim="deliveryCompanyEdit.concateZipCode"
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
                  v-model.trim="deliveryCompanyEdit.concateRemark"
                  placeholder="请输入联系人备注"
                  type="textarea"
                  class="deliveryCompany_textarea"
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
    <div style="margin-top:30px;">
      <el-button type="primary" plain icon="el-icon-search" @click="handleReset()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-search" @click="handleNo()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-edit" :disabled="edit" @click="handleYes('deliveryCompanyEdit')">确定</el-button>
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
      // 确定修改按钮初始状态为禁用
      edit: true,
      // 修改配送单位的表单
      deliveryCompanyEdit: {
        id: this.$route.params.deliveryCompanys.id,
        name: this.$route.params.deliveryCompanys.name,
        companyNo: this.$route.params.deliveryCompanys.companyNo,
        telephone: this.$route.params.deliveryCompanys.telephone,
        detail_address: this.$route.params.deliveryCompanys.detail_address,
        website: this.$route.params.deliveryCompanys.website,
        remark: this.$route.params.deliveryCompanys.remark,
        address: this.$route.params.deliveryCompanys.address,
        Column_16: this.$route.params.deliveryCompanys.Column_16,
        lng: this.$route.params.deliveryCompanys.lng,
        lat: this.$route.params.deliveryCompanys.lat,
        status: this.$route.params.deliveryCompanys.is_lock,
        concateName: this.$route.params.deliveryCompanys.concateName,
        concateEmail: this.$route.params.deliveryCompanys.concateEmail,
        concatePhone: this.$route.params.deliveryCompanys.concatePhone,
        concateZipCode: this.$route.params.deliveryCompanys.concateZipCode,
        concateRemark: this.$route.params.deliveryCompanys.concateRemark
      },
      is_lock: 0,
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
        addres: [
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
    'deliveryCompanyEdit.address': function() {
      this.deliveryCompanyEdit.Column_16 = ''
      this.deliveryCitys = []
      this.deliveryProvinces.forEach((item, index) => {
        if (item.lCode === this.deliveryCompanyEdit.address) {
          this.deliveryCitys = item.children
          // item.children.forEach((itemc, indexc) => {
          //   if (itemc.lCode === this.$route.params.deliveryCompanys.Column_16) {
          //     this.deliveryCompanyEdit.Column_16 = itemc.lCode
          //   }
          // })
        }
      })
    }
  },
  created() {
    axios.get('/api/a04ds/datastandard/findProviceTree').then((province) => {
      for (let i = 0; i < province.data.resultData.children.length; i++) {
        this.deliveryProvinces[i] = province.data.resultData.children[i]
        this.deliveryCitys = []
        this.deliveryProvinces.forEach((item, index) => {
          if (item.lCode === this.deliveryCompanyEdit.address) {
            this.deliveryCitys = item.children
          }
        })
      }
    })
  },
  methods: {
    // 获取锁定状态
    inputChange() {
      if (
        this.deliveryCompanyEdit.name === this.$route.params.deliveryCompanys.name &&
      this.deliveryCompanyEdit.companyNo === this.$route.params.deliveryCompanys.companyNo &&
      this.deliveryCompanyEdit.telephone === this.$route.params.deliveryCompanys.telephone &&
      this.deliveryCompanyEdit.website === this.$route.params.deliveryCompanys.website &&
      this.deliveryCompanyEdit.detail_address === this.$route.params.deliveryCompanys.detail_address &&
      this.deliveryCompanyEdit.address === this.$route.params.deliveryCompanys.address &&
      this.deliveryCompanyEdit.Column_16 === this.$route.params.deliveryCompanys.Column_16 &&
      (this.deliveryCompanyEdit.remark === this.$route.params.deliveryCompanys.remark || this.deliveryCompanyEdit.remark === undefined) &&
      (this.deliveryCompanyEdit.lng === this.$route.params.deliveryCompanys.lng || this.deliveryCompanyEdit.lng === undefined) &&
      (this.deliveryCompanyEdit.lat === this.$route.params.deliveryCompanys.lat || this.deliveryCompanyEdit.lat === undefined) &&
      this.deliveryCompanyEdit.status === this.$route.params.deliveryCompanys.is_lock &&
      this.deliveryCompanyEdit.concateName === this.$route.params.deliveryCompanys.concateName &&
      this.deliveryCompanyEdit.concateEmail === this.$route.params.deliveryCompanys.concateEmail &&
      this.deliveryCompanyEdit.concatePhone === this.$route.params.deliveryCompanys.concatePhone &&
      this.deliveryCompanyEdit.concateZipCode === this.$route.params.deliveryCompanys.concateZipCode &&
      (this.deliveryCompanyEdit.concateRemark === this.$route.params.deliveryCompanys.concateRemark || this.deliveryCompanyEdit.concateRemark === undefined)
      ) {
        this.edit = true
      } else {
        this.edit = false
      }
    },
    // 重置执行单查询输入框
    handleReset() {
      this.deliveryCompanyEdit.name = this.$route.params.deliveryCompanys.name
      this.deliveryCompanyEdit.companyNo = this.$route.params.deliveryCompanys.companyNo
      this.deliveryCompanyEdit.telephone = this.$route.params.deliveryCompanys.telephone
      this.deliveryCompanyEdit.website = this.$route.params.deliveryCompanys.website
      this.deliveryCompanyEdit.detail_address = this.$route.params.deliveryCompanys.detail_address
      this.deliveryCompanyEdit.address = this.$route.params.deliveryCompanys.address
      this.deliveryCompanyEdit.remark = this.$route.params.deliveryCompanys.remark
      this.deliveryCompanyEdit.lng = this.$route.params.deliveryCompanys.lng
      this.deliveryCompanyEdit.lat = this.$route.params.deliveryCompanys.lat
      this.deliveryCompanyEdit.status = this.$route.params.deliveryCompanys.is_lock
      this.deliveryCompanyEdit.concateName = this.$route.params.deliveryCompanys.concateName
      this.deliveryCompanyEdit.concateEmail = this.$route.params.deliveryCompanys.concateEmail
      this.deliveryCompanyEdit.concatePhone = this.$route.params.deliveryCompanys.concatePhone
      this.deliveryCompanyEdit.concateZipCode = this.$route.params.deliveryCompanys.concateZipCode
      this.deliveryCompanyEdit.concateRemark = this.$route.params.deliveryCompanys.concateRemark
      this.edit = true
      setTimeout(() => {
        this.deliveryCompanyEdit.Column_16 = this.$route.params.deliveryCompanys.Column_16
      }, 50)
    },
    // 点击确定修改
    handleYes(deliveryCompanyEdit) {
      // 省名称
      let Column_15 = ''
      // 市名称
      let Column_17 = ''
      // 通过省编码获得相应的省名称
      this.deliveryProvinces.forEach((item, index) => {
        if (item.lCode === this.deliveryCompanyEdit.address) {
          Column_15 = item.cnValue
        }
      })
      // 通过市编码获得相应的市名称
      this.deliveryCitys.forEach((item, index) => {
        if (item.lCode === this.deliveryCompanyEdit.Column_16) {
          Column_17 = item.cnValue
        }
      })
      // 判断按钮状态，关闭状态使is_lock为0，否则为1
      if (this.deliveryCompanyEdit.status === false) {
        this.deliveryCompanyEdit.is_lock = 0
      } else {
        this.deliveryCompanyEdit.is_lock = 1
      }
      // 验证表单是否通过
      this.$refs[deliveryCompanyEdit].validate((valid) => {
        // 如果验证通过
        if (valid) {
          this.deliveryCompanyEdit.Column_15 = Column_15
          this.deliveryCompanyEdit.Column_17 = Column_17
          this.deliveryCompanyEdit.is_lock = this.is_lock
          this.deliveryCompanyEdit.modifierCode = this.$store.state.userInfo.code
          this.deliveryCompanyEdit.modifierName = this.$store.state.userInfo.name
          axios.put('/api/b05lms/deliverycompany/updateDeliveryCompany', this.deliveryCompanyEdit).then((res) => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: '更新成功！',
              type: 'success',
              position: 'bottom-right'
            })
          }).catch(() => {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              message: '更新失败',
              type: 'error',
              position: 'bottom-right'
            })
          })
        } else {
          // 验证不通过
          return false
        }
        this.$router.push('deliveryCompany')
      })
    },
    // 取消修改
    handleNo() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        message: '已取消更新',
        type: 'info',
        position: 'bottom-right'
      })
      this.$router.push('deliveryCompany')
    }
  }
}
</script>
