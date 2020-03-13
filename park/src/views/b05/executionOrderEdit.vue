<template>
  <div class="g_container">
    <el-form
      ref="exeOrderEdit"
      :model="exeOrderEdit"
      :rules="rules"
      class="g_elForm"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="执行单号：" prop="execOrderNo">
            <el-input
              v-model.trim="exeOrderEdit.execOrderNo"
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
              v-model.trim="exeOrderEdit.deliveryId"
              class="g_elFormSelect_other"
              placeholder="请选择单位名称"
              :disabled="true"
              clearable
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
              v-model.trim="exeOrderEdit.contactsName"
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
          <el-form-item label="开始日期：" prop="planStartTime">
            <el-date-picker
              v-model.trim="exeOrderEdit.planStartTime"
              class="exeOrder_datePicker"
              type="datetime"
              placeholder="选择开始日期"
              style="width:60%;float: left;"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="startTime"
              :disabled="planStart"
              @change="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="结束日期：" prop="planFinishTime">
            <el-date-picker
              v-model.trim="exeOrderEdit.planFinishTime"
              class="exeOrder_datePicker"
              type="datetime"
              placeholder="选择结束日期"
              style="width:60%;float: left;"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="endTime"
              :disabled="planEnd"
              @change="inputChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="备注：" prop="remark">
            <el-input
              v-model.trim="exeOrderEdit.remark"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 6}"
              style="width:30%;float:left"
              class="g_elFormTextarea_other"
              placeholder="请输入备注"
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
              v-model.trim="exeOrderEdit.contactsPhone"
              class="g_elFormInput_other"
              placeholder="请输入联系电话"
              clearable
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
        <el-button type="primary" plain style="float:left;" icon="el-icon-plus" :disabled="edit" @click="handleYes('exeOrderEdit')">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style>
.exeOrder_input {
    width: 30%;
    float: left;
}
.exeOrder_select {
    width: 30%;
    float: left;
}

.exeOrder_datePicker {
    float: left;
}

.exeOrder_textarea {
    width: 30%;
    float: left;
}
</style>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 确定修改按钮初始状态为禁用
      edit: true,
      // 默认状态不可修改
      planStart: true,
      planEnd: true,
      // 实际开始时间
      actStartTime: this.$route.params.executionOrders.actStartTime,
      // 修改表单
      exeOrderEdit: {
        id: this.$route.params.executionOrders.id,
        execOrderNo: this.$route.params.executionOrders.execOrderNo,
        deliveryId: this.$route.params.executionOrders.deliveryId,
        contactsName: this.$route.params.executionOrders.contactsName,
        planStartTime: this.$route.params.executionOrders.planStartTime,
        planFinishTime: this.$route.params.executionOrders.planFinishTime,
        remark: this.$route.params.executionOrders.remark,
        contactsPhone: this.$route.params.executionOrders.contactsPhone,
        isDel: this.$route.params.executionOrders.isDel
      },
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
      endTime: {
        disabledDate: time => {
          if (this.exeOrderEdit.planStartTime) {
            return (
              time.getTime() < Date.now() - 8.64e7 ||
              time.getTime() < new Date(this.exeOrderEdit.planStartTime).getTime()
            )
          } else {
            return time.getTime() < Date.now() - 8.64e7
          }
        }
      },
      deliveryOptions: [],
      rules: {
        execOrderNo: [
          { required: true, message: '请输入执行单号', trigger: 'blur' },
          { max: 50, message: '长度在50个字符以内!' },
          { pattern: /^[\u0391-\uFFE5A-Za-z0-9]+$/, message: '执行单号只能为中英文或数字，不包含特殊字符及空格！' }
        ],
        contactsName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { pattern: /^[\u0391-\uFFE5A-Za-z]+$/, message: '名称只能为中文或英文，不包含特殊字符及空格！' }
        ],
        planStartTime: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        planFinishTime: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
        contactsPhone: [
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/, message: '请输入正确的11位电话号码或者正确的固定电话号码！' }
        ],
        remark: [{ max: 500, message: '长度在500个字符以内!' }]
      }
    }
  },
  computed: { useInfo() { return this.$store.state.userInfo } },
  created() {
    axios.get('/api/b05lms/deliverycompany/findAllDeliveryCompany').then((response) => {
      this.deliveryOptions = response.data.resultData
    })
    // 若已存在实际开始时间,则计划开始和计划结束时间不允许修改
    if (this.actStartTime != null) {
      this.planStart = true
      this.planEnd = true
    } else {
      this.planStart = false
      this.planEnd = false
    }
  },
  methods: {
    // 用户不修改时确定按钮为禁用
    inputChange() {
      if (this.exeOrderEdit.execOrderNo === this.$route.params.executionOrders.execOrderNo &&
      this.exeOrderEdit.deliveryId === this.$route.params.executionOrders.deliveryId &&
      this.exeOrderEdit.contactsName === this.$route.params.executionOrders.contactsName &&
      this.exeOrderEdit.planStartTime === this.$route.params.executionOrders.planStartTime &&
      this.exeOrderEdit.planFinishTime === this.$route.params.executionOrders.planFinishTime &&
      (this.exeOrderEdit.remark === this.$route.params.executionOrders.remark || this.exeOrderEdit.remark === undefined) &&
      this.exeOrderEdit.contactsPhone === this.$route.params.executionOrders.contactsPhone) {
        this.edit = true
      } else {
        this.edit = false
      }
    },
    // 重置执行单修改表单
    handleReset() {
      this.exeOrderEdit.execOrderNo = this.$route.params.executionOrders.execOrderNo
      this.exeOrderEdit.deliveryId = this.$route.params.executionOrders.deliveryId
      this.exeOrderEdit.contactsName = this.$route.params.executionOrders.contactsName
      this.exeOrderEdit.planStartTime = this.$route.params.executionOrders.planStartTime
      this.exeOrderEdit.planFinishTime = this.$route.params.executionOrders.planFinishTime
      this.exeOrderEdit.remark = this.$route.params.executionOrders.remark
      this.exeOrderEdit.contactsPhone = this.$route.params.executionOrders.contactsPhone
    },
    // 点击确定修改
    handleYes(exeOrderEdit) {
      this.$refs[exeOrderEdit].validate((valid) => {
        if (valid) {
          this.exeOrderEdit.modifierCode = this.$store.state.userInfo.code
          this.exeOrderEdit.modifierName = this.$store.state.userInfo.name
          axios.put('/api/b05lms/ExecutionOrder/updateExecutionOrder', this.exeOrderEdit).then((res) => {
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
