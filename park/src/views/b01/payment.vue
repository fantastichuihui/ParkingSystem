<template>
  <div g_container>
    <el-form class="demo-form-inline">
      <div class="g_inputForm">
        <div v-for="(item,index) in returnPlans" :key="index">
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款金额：
              <el-input v-model="item.money" :disabled="true" class="g_input" style="margin-right:5px" placeholder="请输入内容" />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款日期：
              <el-date-picker v-model="item.returnDate" :disabled="true" class="g_input" style="margin-right:5px" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款方式：
              <el-input v-model="item.returnType" :disabled="true" class="g_input" style="margin-right:5px" placeholder="请选择服务" />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-progress :percentage="per0" />
            </el-col>
          </el-row>
          <div v-for="(item1,index1) in item.realReturn" :key="index1">
            <el-row style="margin-left:20px">
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                实际回款金额：
                <el-input v-model="item1.money" class="g_input" :disabled="disa" style="margin-right:5px" placeholder="请输入内容" />
              </el-col>
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                实际回款日期：
                <el-date-picker v-model="item1.returnTime" :disabled="disa" class="g_input" style="margin-right:5px" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
              </el-col>
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                实际回款方式：
                <el-input v-model="item1.returnType" :disabled="disa" class="g_input" style="margin-right:5px" placeholder="请选择服务" />
              </el-col>
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                <el-progress :percentage="per" />
              </el-col>
              <el-button type="primary" plain icon="el-icon-plus" :disabled="disa" @click="handleRemove(index,index1)">删除</el-button>
            </el-row>
          </div>
          <el-form-item>
            <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd(index)">添加</el-button>
            <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh(index)">重置</el-button>
          </el-form-item>
          <br>
          <br>
          <br>
          <br>
        </div>
        <div class="g_button">
          <el-button type="primary" plain icon="el-icon-check" @click="handleSave">保存</el-button>
          <el-button type="primary" plain icon="el-icon-check" @click="handleCancel">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      disa: true,
      per: 0,
      per0: 0,
      returnPlans: this.$route.params.permission.plan,
      EC00001: '保存失败'
    }
  },
  created() {
    for (let i = 0; i < this.returnPlans.length; i++) {
      for (let j = 0; j < this.returnPlans[i].realReturn.length; j++) {
        this.per = this.returnPlans[i].realReturn[j].money / this.returnPlans[i].money * 100
        this.per0 = this.per
      }
    }
  },
  methods: {
    handleAdd(index) {
      this.returnPlans[index].realReturn.push({})
      this.disa = false
    },
    handleRemove(index, index1) {
      this.returnPlans[index].realReturn.splice(index1, 1)
    },
    handleRefresh(index) {
      this.returnPlans[index].realReturn.splice(1)
    },
    handleCancel() {
      this.$router.push('agreement')
    },
    getParamMap: function() {
      return {
        returnPlans: this.returnPlans
      }
    },
    handleSave() {
      axios.post('/api/b01crm/receviables/addReturn', this.getParamMap()).then((auditing) => {
        if (auditing.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '保存成功!'
          })
          this.$router.push('agreement')
        } else {
          this.msg = auditing.data.msg
          if (this.msg === 'EC00001') {
            this.open2(this.EC00001)
          }
        }
      })
    }
  }
}
</script>
