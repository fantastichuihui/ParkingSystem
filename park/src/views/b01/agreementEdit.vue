<template>
  <div g_container>
    <div class="g_inputForm">
      <el-form style="border-style: inset">
        <el-row style="margin-left:20px">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            合同名称：
            <el-input v-model="contractName" class="g_input" placeholder="请输入内容" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            客户名称：
            <el-select v-model="seachCustomername" class="g_input" placeholder="请选择服务">
              <el-option v-for="item in permission" :key="item.customerId" :label="item.customerName" :value="item.customerName" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            商务线索名称：
            <el-select v-model="seachLeadsname" class="g_input" placeholder="请选择服务">
              <el-option v-for="item in resData" :key="item.leads_id" :label="item.leadsName" :value="item.leadsName" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            合同金额：
            <el-input v-model="money" class="g_input" placeholder="请输入内容" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            计划开始日期：
            <el-date-picker v-model="planStartTime" class="g_input" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            计划结束日期：
            <el-date-picker v-model="planEndTime" class="g_input" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            支付方式：
            <el-select v-model="paymentType" class="g_input" placeholder="请选择服务">
              <el-option v-for="item in typesOptions" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            是否配送：
            <el-switch
              v-model="value1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 插入附件组件 -->
    <div style="border-style: inset " class="g_inputForm">
      <p>附件：</p>
      <!-- 循环插入附件 -->
      <div v-for="(item,index) in confiles" :key="index">
        <el-form>
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              附件名称：
              <el-input v-model="item.name" class="g_input" placeholder="请输入内容" />
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              附件类型：
              <el-select v-model="item.typeName" class="g_input" placeholder="请选择类型" @change="changeType($event)">
                <el-option v-for="item1 in attcahOptions" :key="item1.value" :label="item1.label" :value="item1.value" />
              </el-select>
              <el-input v-if="showing" v-model="item.typeId" class="g_input" placeholder="请输入内容" />
            </el-col>
          </el-row>
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              选择文件：
              <el-input v-model="item.name" :disabled="true" class="g_input" placeholder="请输入内容" />
              <el-button type="primary" plain icon="el-icon-view" @click="dialogVisible = true,find(index)" />
            </el-col>
            <el-upload
              ref="upload"
              class="upload-demo"
              action="/api/a03-oss/file/upload"
              :data="files"
              :on-success="handleSuccess"
              :on-change="handleChange"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
            >
              <el-button size="small" type="primary">选择文件</el-button>
            </el-upload>
          </el-row>
          <el-button type="primary" plain icon="el-icon-delete" @click="attachDelete(index)" />
        </el-form>
      </div>
      <el-button type="primary" plain icon="el-icon-plus" @click="attachmentAdd" />
    </div>

    <!-- 插入回款组件 -->
    <div style="border-style: inset" class="g_inputForm">
      <!-- 循环插入组件 -->
      <div v-for="(item,index) in returnPlans" :key="index">
        <el-form>
          <p>回款{{ index + 1 }}期</p>
          <el-row style="margin-left:20px">
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款金额：
              <el-input v-model="item.money" class="g_input" placeholder="请输入内容" />
            </el-col>
            计划回款日期：
            <el-date-picker v-model="item.returnDate" class="g_input" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" />
            <br>
            <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
              计划回款方式：
              <el-select v-model="item.returnType" class="g_input" placeholder="请选择服务">
                <el-option v-for="item1 in typesOptions" :key="item1.value" :label="item1.label" :value="item1.label" />
              </el-select>
              <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete(index)" />
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-button type="primary" plain icon="el-icon-plus" @click="returnMoneyAdd" />
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button type="primary" plain icon="el-icon-back" @click="handleBack">返回</el-button>
      <el-button type="primary" plain icon="el-icon-right" @click="next">下一步</el-button>
    </div>
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
      paymentType: this.$route.params.permission.payment_type,
      typesOptions: [{
        value: '选项1',
        label: '现金'
      }, {
        value: '选项2',
        label: '电汇'
      }, {
        value: '选项3',
        label: '转帐'
      }, {
        value: '选项4',
        label: '期票'
      }],
      attcahOptions: [{
        value: '1',
        label: '合同协议'
      }, {
        value: '2',
        label: '备忘录'
      }, {
        value: '3',
        label: '草案'
      }],
      files: {
        fileType: 'attachment'
      },
      dialogVisible: false,
      url: '',
      contractName: this.$route.params.permission.name,
      customerId: this.$route.params.permission.customerId,
      leads_id: this.$route.params.permission.businessId,
      money: this.$route.params.permission.money,
      types: '1',
      permission: [],
      seachCustomername: this.$route.params.permission.customer_name,
      seachLeadsname: this.$route.params.permission.leads_name,
      resData: [],
      planStartTime: this.$route.params.permission.plan_start_time,
      planEndTime: this.$route.params.permission.plan_end_time,
      value: '',
      options: [],
      value1: true,
      confiles: this.$route.params.permission.confiles,
      returnPlans: this.$route.params.permission.plan,
      datavalue1: '',
      showing: false
    }
  },
  watch: {
    seachCustomername: function() {
      this.seachLeadsname = ''
      this.permission.forEach((item, index) => {
        if (item.customerName === this.seachCustomername) {
          this.customerId = item.customerId
          this.resData = item.leadInfo
        }
      })
    },
    seachLeadsname: function() {
      this.resData.forEach((item, index) => {
        if (item.leadsName === this.seachLeadsname) {
          this.leads_id = item.leads_id
        }
      })
    },
    value1: function() {
      if (this.value1 === false) {
        this.types = '0'
      } else {
        this.types = '1'
      }
    }

  },
  /* 向后台发送数据 */
  created() {
    this.handleSearch()
    this.seeTypename()
  },
  methods: {
    // 添加页面的所有数据
    editParams() {
      return {
        version: this.$route.params.permission.version,
        contractId: this.$route.params.permission.contractId,
        contractName: this.contractName,
        customerName: this.seachCustomername,
        leadsName: this.seachLeadsname,
        value1: this.value1,
        customerId: this.customerId,
        businessId: this.leads_id,
        planStartTime: this.planStartTime,
        planEndTime: this.planEndTime,
        money: this.money,
        types: this.types,
        paymentType: this.paymentType,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        createTime: '2019-01-02',
        confiles: this.confiles,
        returnPlans: this.returnPlans,
        childitems: this.$route.params.permission.item
      }
    },
    // 数据类型换成数据id
    changeType(event) {
      for (let i = 0; i < this.confiles.length; i++) {
        this.confiles[i].typeId = event
      }
    },
    // 进页面显示数据name
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
    // 控制台测试
    find(index) {
      axios.post('/api/b01crm-xyt/confile/findPicture', this.nameSelect(index)).then((result) => {
        this.url = result.data
      })
    },
    // 查询
    handleSearch() {
      axios.get('/api/b01crm-xyt/contract/getUnlockAndLeads').then((result) => {
        this.permission = result.data.resultData
        this.permission.forEach((item, index) => {
          if (item.customerName === this.seachCustomername) {
            this.customerId = item.customerId
            this.resData = item.leadInfo
          }
        })
      })
    },
    // 重置
    handleRefresh() {
      this.contractName = this.$route.params.permission.name
      this.seachLeadsname = this.$route.params.permission.leads_name
      this.seachCustomername = this.$route.params.permission.customer_name
      this.money = this.$route.params.permission.money
      this.planStartTime = this.$route.params.permission.plan_start_time
      this.planEndTime = this.$route.params.permission.plan_end_time
      this.paymentType = this.$route.params.permission.payment_type
      this.value1 = true
    },
    // 添加附件
    attachmentAdd() {
      this.confiles.push({})
    },
    // 添加回款
    returnMoneyAdd() {
      this.returnPlans.push({})
    },
    // 删除附件
    attachDelete(index) {
      this.confiles.splice(index, 1)
    },
    // 删除回款
    readyDelete(index) {
      this.returnPlans.splice(index, 1)
    },
    // 下一步
    next() {
      for (let i = 0; i < this.returnPlans.length; i++) {
        this.returnPlans[i].num = i + 1 + ''
      }
      this.$router.push({ name: 'agreementEditSon', params: { editParams: this.editParams() }})
    },
    // 返回
    handleBack() {
      this.$router.push('agreement')
    },
    handleRemove(file, fileList) {
    },
    handleChange(file) {
      this.confiles[this.confiles.length - 1].name = file.name
    },
    handleSuccess(response) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    nameSelect(index) {
      return {
        name: this.confiles[index].name
      }
    }

  }
}
</script>
