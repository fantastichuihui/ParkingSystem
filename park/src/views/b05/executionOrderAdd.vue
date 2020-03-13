<template>
  <div class="g_container">
    <el-form
      ref="exeOrderAdd"
      :model="exeOrderAdd"
      :rules="rules"
      class="g_elForm"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="执行单号：" prop="execOrderNo">
            <el-input
              v-model.trim="exeOrderAdd.execOrderNo"
              class="g_elFormInput_other"
              placeholder="请输入执行单号"
              clearable
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="配送单位：" prop="deliveryId">
            <el-select
              v-model.trim="exeOrderAdd.deliveryId"
              class="g_elFormSelect_other"
              placeholder="请选择单位名称"
              clearable
              @change="inputChange"
            >
              <el-option
                v-for="item in deliveryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="联系人姓名：" prop="contactsName">
            <el-input
              v-model.trim="exeOrderAdd.contactsName"
              class="g_elFormInput_other"
              placeholder="请输入联系人姓名"
              clearable
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="联系电话：" prop="contactsPhone">
            <el-input
              v-model.trim="exeOrderAdd.contactsPhone"
              class="g_elFormInput_other"
              placeholder="请输入联系电话"
              clearable
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="开始日期：" prop="planStartTime">
            <el-date-picker
              v-model.trim="exeOrderAdd.planStartTime"
              type="datetime"
              placeholder="选择开始日期"
              style="width:60%;float: left;"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="startTime"
              @change="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="结束日期：" prop="planFinishTime">
            <el-date-picker
              v-model.trim="exeOrderAdd.planFinishTime"
              type="datetime"
              placeholder="选择结束日期"
              style="width:60%;float: left;"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="endTime"
              @change="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="备注：" prop="remark">
            <el-input
              v-model.trim="exeOrderAdd.remark"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              class="g_elFormTextarea_other"
              placeholder="请输入备注"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="lfet">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="是否配送：" prop="status">
            <el-switch
              v-model.trim="exeOrderAdd.status"
              style="float:left;margin-top:8px"
              @input="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
        <el-button type="primary" plain style="float:left;" icon="el-icon-refresh" @click="handleReset()">重置</el-button>
        <el-button type="primary" plain style="float:left;" icon="el-icon-back" @click="handleNo()">取消</el-button>
        <el-button type="primary" plain style="float:left;" icon="el-icon-plus" :disabled="add" @click="handleYes('exeOrderAdd')">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
</style>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 确定添加按钮初始值为禁用状态
      add: true,
      // 添加表单
      exeOrderAdd: {
        execOrderNo: '',
        deliveryId: '',
        contactsName: '',
        contactsPhone: '',
        planStartTime: '',
        planFinishTime: '',
        status: false
      },
      // 配送单位列表
      deliveryOptions: [],
      // 校验
      rules: {
        execOrderNo: [
          { required: true, message: '请输入执行单号' },
          { max: 50, message: '长度在50个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z0-9]+$/, message: '执行单号只能为中英文或数字，不包含特殊字符及空格！' }
        ],
        contactsName: [
          { required: true, message: '请输入联系人姓名' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符及空格！' }
        ],
        contactsPhone: [
          { required: true, message: '请输入联系电话' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '请输入正确的11位电话号码或者正确的固定电话号码！' }
        ],
        planStartTime: [{ required: true, message: '请选择开始日期' }],
        planFinishTime: [{ required: true, message: '请选择结束日期' }],
        remark: [{ max: 500, message: '长度在500个字符以内!' }]

      },
      // 开始时间
      startTime: {
        disabledDate: time => {
          if (this.endtime) {
            return (
              time.getTime() < new Date(this.endtime).getTime()
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      // 结束时间
      endTime: {
        disabledDate: time => {
          if (this.exeOrderAdd.planStartTime) {
            return (
              time.getTime() < Date.now() - 8.64e7 ||
              time.getTime() < new Date(this.exeOrderAdd.planStartTime).getTime()
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      }
    }
  },
  created() {
    axios.get('/api/b05lms/deliverycompany/findAllDeliveryCompany').then((response) => {
      this.deliveryOptions = response.data.resultData
    })
  },
  methods: {
    // 用户不输入时确定按钮为禁用
    inputChange() {
      if (this.exeOrderAdd.execOrderNo === '' &&
        (this.exeOrderAdd.deliveryId === '' || this.exeOrderAdd.deliveryId === null) &&
        this.exeOrderAdd.contactsName === '' &&
        this.exeOrderAdd.contactsPhone === '' &&
        this.exeOrderAdd.status === false &&
        (this.exeOrderAdd.planStartTime === '' || this.exeOrderAdd.planStartTime === null) &&
        (this.exeOrderAdd.planFinishTime === '' || this.exeOrderAdd.planFinishTime === null)) {
        this.add = true
      } else {
        this.add = false
      }
    },
    // 重置执行单查询输入框
    handleReset() {
      this.exeOrderAdd.deliveryId = ''
      this.exeOrderAdd.execOrderNo = ''
      this.exeOrderAdd.contactsName = ''
      this.exeOrderAdd.contactsPhone = ''
      this.exeOrderAdd.planStartTime = ''
      this.exeOrderAdd.planFinishTime = ''
      this.exeOrderAdd.remark = ''
      this.exeOrderAdd.status = false
      this.add = true
    },
    // 点击确定添加
    handleYes(exeOrderAdd) {
      this.$refs[exeOrderAdd].validate((valid) => {
        if (valid) {
          if (this.exeOrderAdd.status === false) {
            this.exeOrderAdd.delType = 0
          } else {
            this.exeOrderAdd.delType = 1
          }
          // 添加时的下发状态均为0（未配送）
          this.exeOrderAdd.sendState = 0
          // 不选择配送单位时,将配送id置为Null
          if (this.exeOrderAdd.deliveryId === '') {
            this.exeOrderAdd.deliveryId = null
          }
          this.exeOrderAdd.orgCode = this.$store.state.userInfo.orgCode
          this.exeOrderAdd.modifierCode = this.$store.state.userInfo.code
          this.exeOrderAdd.modifierName = this.$store.state.userInfo.name
          this.exeOrderAdd.createUserCode = this.$store.state.userInfo.code
          this.exeOrderAdd.createUserName = this.$store.state.userInfo.name
          axios.post('/api/b05lms/ExecutionOrder/saveExecutionOrder', this.exeOrderAdd).then((res) => {
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
        this.$router.push('executionOrder')
      })
    },
    handleNo() {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        message: '已取消更新',
        type: 'info',
        position: 'bottom-right'
      })
      this.$router.push('executionOrder')
    }
  }
}
</script>
