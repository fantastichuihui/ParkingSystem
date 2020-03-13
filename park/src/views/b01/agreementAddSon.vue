<template>
  <div class="g_inputForm">
    <el-form v-model="attachment">
      <el-row style="margin-left:20px">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          合同名称：
          <el-input v-model="contractName" :disabled="true" class="g_input" placeholder="请输入内容" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          合同金额：
          <el-input v-model="money" :disabled="true" class="g_input" placeholder="请输入内容" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          客户名称：
          <el-input v-model="customerName" :disabled="true" class="g_input" placeholder="请输入内容" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          是否配送：
          <el-switch v-model="value1" :disabled="true" active-color="#13ce66" inactive-color="#ff4949" />
        </el-col>
      </el-row>
      <!-- 合同子项组件 -->
      <div class="g_inputForm">
        <p>合同子项：</p>
        <!-- 循环插入组件 -->
        <div v-for="(item,index) in childitems" :key="index" style="border-style: inset">
          <el-form>
            <p>子项号：{{ '0'+(index+1) }}</p>
            <!-- <el-input v-model="item.itemId" class="g_input" placeholder="请输入内容">
            {{customerName + 1}}
        </el-input> -->
            <el-row style="margin-left:20px">
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                收货单位：
                <el-select v-model="item.receId" class="g_input" placeholder="请选择">
                  <el-option v-for="item2 in itemName" :key="item2.id" :label="item2.name" :value="item2.id" />
                </el-select>
              </el-col>
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                备注：
                <el-input v-model="item.remark" class="g_input" placeholder="请输入内容" />
              </el-col>
              <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete(index)" />
            </el-row>
            <!-- 循环插入品类 -->
            <div v-for="(item1, index1) in item.items" :key="index1">
              <el-row style="margin-left:20px">
                <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                  品类：
                  <el-select v-model="item1.meteType" class="g_input" placeholder="请选择" @change="changeSort($event)">
                    <el-option v-for="item2 in sort" :key="item2.id" :label="item2.meteType" :value="item2.meteType" />
                  </el-select>
                </el-col>
                <!-- 品类id -->
                <el-input v-if="showing" v-model="item.typeid" class="g_input" placeholder="请输入内容" />
                <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                  产品名称：
                  <el-select v-model="item1.portductName" class="g_input" placeholder="请选择">
                    <el-option v-for="item2 in portductName" :key="item2.id" :label="item2.proName" :value="item2.proId" />
                  </el-select>
                </el-col>
                <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                  数量：
                  <el-input v-model="item1.number" class="g_input" placeholder="请输入内容" />
                  <!-- 删除按钮 -->
                  <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete1(index,index1)" /><br>
                </el-col>
              </el-row>
            </div>
            <el-button type="primary" plain icon="el-icon-plus" @click="addSon(index)" />
          </el-form>

        </div>
      </div>
      <el-button type="primary" plain icon="el-icon-plus" @click="addAction" />
    </el-form>
    <div>
      <div class="g_button">
        <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
        <el-button type="primary" plain icon="el-icon-back" @click="handleBack()">返回</el-button>
        <el-button type="primary" plain icon="el-icon-right" @click="next">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      itemId: '01',
      showing: false,
      contractName: this.$route.params.addParams.contractName,
      money: this.$route.params.addParams.money,
      customerName: this.$route.params.addParams.customerName,
      value1: this.$route.params.addParams.value1,
      itemName: '',
      sort: '',
      portductName: '',
      attachment: '',
      input: '',
      value: '',
      options: [],
      childitems: [{
        items: [{}]
      }]
    }
  },
  created() {
    this.seach()
  },
  methods: {
    // 新增页面所有数据
    allData() {
      return {
        contractName: this.$route.params.addParams.contractName,
        customerId: this.$route.params.addParams.customerId,
        businessId: this.$route.params.addParams.businessId,
        planStartTime: this.$route.params.addParams.planStartTime,
        planEndTime: this.$route.params.addParams.planEndTime,
        money: this.$route.params.addParams.money,
        types: this.$route.params.addParams.types,
        paymentType: this.$route.params.addParams.paymentType,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        createTime: this.$route.params.addParams.createTime,
        confiles: this.$route.params.addParams.confiles,
        returnPlans: this.$route.params.addParams.returnPlans,
        childitems: this.childitems
      }
    },
    handleRefresh() {
      this.childitems[0].receId = ''
      this.childitems[0].remark = ''
      this.childitems.splice(1)
    },
    // 返回
    handleBack() {
      this.$router.push({ name: 'agreementAdd', params: { backParams: this.allData() }})
    },
    // 保存，传输数据给后台
    next() {
      for (let i = 0; i < this.childitems.length; i++) {
        this.childitems[i].num = i + 1 + ''
      }
      axios.post('/api/b01crm/contract/addContract', this.allData()).then((result) => {
        this.$router.push('agreement')
      })
    },
    // 品类改变产品名称
    changeSort(event) {
      this.sort.forEach((item, index) => {
        if (item.meteType === event) {
          this.portductName = item.products
        }
        for (let i = 0; i < this.childitems.length; i++) {
          for (let j = 0; j < this.childitems[i].items.length; j++) {
            if (item.meteType === this.childitems[i].items[j].meteType) {
              this.childitems[i].items[j].typeId = item.typeId
            }
          }
        }
      })
    },
    // 查询品类，产品名称及收货单位
    seach() {
      axios.get('/api/b01crm/recCompany/getProduct').then((result) => {
        this.sort = result.data.resultData
      }); axios.get('/api/b01crm/recCompany/findAllRecCompanies').then((result) => {
        this.itemName = result.data
      })
    },
    // 添加品类
    addSon(index) {
      this.childitems[index].items.push({})
    },
    // 添加子项
    addAction() {
      this.childitems.push({ items: [{}] })
    },
    readyDelete(index) {
      this.childitems.splice(index, 1)
    },
    readyDelete1(index, index1) {
      this.childitems[index].items.splice(index1, 1)
    }
  }
}

</script>
