<template>
  <div g_container>
    <el-form class="demo-form-inline">
      <div class="g_inputForm">
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            合同名称：
            <el-input v-model="searchname" :disabled="true" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            客户名称：
            <el-input v-model="searchcustomer_name" :disabled="true" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            商务线索名称：
            <el-input v-model="searchleads_name" :disabled="true" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            计划开始日期：
            <el-input v-model="searchplan_start_time" :disabled="true" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            计划结束日期：
            <el-input v-model="searchplan_end_time" :disabled="true" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            合同金额：
            <el-input v-model="searchmoney" :disabled="true" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            支付方式：
            <el-input v-model="searchpayment_type" :disabled="true" class="g_input" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            是否配送：
            <el-switch v-model="switchValue" :disabled="true">状态</el-switch>
          </el-col>
        </el-row>
        <br>
        <br>
        <div v-for="(item,index) in confiles" :key="index.confiles">
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              附件名称：
              <el-input v-model="item.fileName" :disabled="true" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              附件类型：
              <el-input v-model="item.typeName" :disabled="true" class="g_input" clearable />
              <el-input v-if="showing" v-model="item.typeId" :disabled="true" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              <el-input v-model="item.name" :disabled="true" class="g_input" clearable />
              <el-button type="primary" plain icon="el-icon-view" @click="dialogVisible = true,handlefileview(index)" />
            </el-col>
          </el-row>
        </div>
        <br>
        <br>
        <div v-for="(item,index) in returnPlans" :key="index.returnPlans">
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款金额：
              <el-input v-model="item.money" :disabled="true" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款日期：
              <el-date-picker v-model="item.returnDate" :disabled="true" class="g_input" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款方式：
              <el-input v-model="item.returnType" :disabled="true" class="g_input" clearable />
            </el-col>
          </el-row>
        </div>
        <br>
        <br>
        <div v-for="(item,index) in childitems" :key="index.childitems">
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              子项号：
              <el-input v-model="item.childItemNumber" :disabled="true" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              收货单位：
              <el-input v-model="item.receiveCompany" :disabled="true" class="g_input" clearable />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              备注：
              <el-input v-model="item.remark" :disabled="true" class="g_input" clearable />
            </el-col>
          </el-row>
          <div v-for="(item1,index1) in item.meteTypeAndTotal" :key="index1">
            <el-row style="margin-left:20px">
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                品类：
                <el-input v-model="item1.meteType" :disabled="true" class="g_input" clearable />
              </el-col>
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                数量：
                <el-input v-model="item1.number" :disabled="true" class="g_input" clearable />
              </el-col>
            </el-row>
          </div>
        </div>
        <br>
        <br>
        <el-row style="margin-left:20px">
          审核意见：
          <el-input v-model="switchTextarea" type="textarea" placeholder="请输入内容" style="width:500px" />
        </el-row>
      </div>
      <br>
      <div class="g_button">
        <el-button type="primary" plain icon="el-icon-check" @click="handleSave">通过</el-button>
        <el-button type="primary" plain icon="el-icon-close" @click="handleRefresh">拒绝</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleCancel">取消</el-button>
      </div>
    </el-form>

    <!-- 预览对话框 -->
    <el-dialog
      title="文件预览"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <span><img width="700px" :src="url"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      showing: false,
      url: '',
      dialogVisible: false,
      EC00001: '出错（后台错误）！',
      switchValue: 0,
      id: this.$route.params.permission.contractId,
      searchname: this.$route.params.permission.name,
      searchcustomer_name: this.$route.params.permission.customer_name,
      searchleads_name: this.$route.params.permission.leads_name,
      searchplan_start_time: this.$route.params.permission.plan_start_time,
      searchplan_end_time: this.$route.params.permission.plan_end_time,
      searchmoney: this.$route.params.permission.money,
      searchpayment_type: this.$route.params.permission.payment_type,
      confiles: this.$route.params.permission.confiles,
      returnPlans: this.$route.params.permission.plan,
      childitems: this.$route.params.permission.item,
      switchTextarea: ''
    }
  },
  created() {
    this.seeTypename()
  },
  methods: {
    seeTypename() {
      for (let i = 0; i < this.confiles.length; i++) {
        if (this.confiles[i].typeId === 1) {
          this.confiles[i].typeName = '合同协议'
        } else if (this.confiles[i].typeId === 2) {
          this.confiles[i].typeName = '备忘录'
        } else {
          this.confiles[i].typeName = '草案'
        }
      }
    },
    getParamMap: function() {
      return {
        checkStatus: 1,
        contractId: this.$route.params.permission.contractId,
        remark: this.switchTextarea
      }
    },
    getParamMap1: function() {
      return {
        checkStatus: 0,
        contractId: this.$route.params.permission.contractId,
        remark: this.switchTextarea
      }
    },
    handleSave() {
      axios.post('/api/b01crm/contract/checkContract', this.getParamMap()).then((auditing) => {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          type: 'success',
          message: '审核通过!',
          position: 'bottom-right'
        })
        this.$router.push('agreement')
      })
    },
    handleRefresh() {
      axios.post('/api/b01crm/contract/checkContract', this.getParamMap1()).then((auditing) => {
        if (auditing.data.status === 1) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '审核拒绝!',
            position: 'bottom-right'
          })
          this.$router.push('agreement')
        } else {
          this.msg = auditing.data.msg
          if (this.msg === 'EC00001') {
            this.open2(this.EC00001)
          }
        }
      })
    },
    handleCancel() {
      this.$router.push('agreement')
    },
    handlefileview(index) {
      axios.post('/api/b01crm/confile/findPicture', this.nameSelect(index)).then((result) => {
        this.url = result.data.url
      })
    },
    nameSelect(index) {
      return {
        name: this.confiles[index].name
      }
    }
  }
}
</script>
