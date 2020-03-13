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
                  <el-option v-for="item1 in itemName" :key="item1.id" :label="item1.name" :value="item1.id" />
                </el-select>
              </el-col>
              <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                备注：
                <el-input v-model="item.remark" class="g_input" placeholder="请输入内容" />
              </el-col>
              <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete(index)" /><br>
            </el-row>
            <!-- 循环插入品类 -->
            <div v-for="(item2, index2) in item.items" :key="index2">
              <el-row style="margin-left:20px">
                <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                  品类：
                  <el-select v-model="item2.meteType" class="g_input" placeholder="请选择" @change="changeSort($event)">
                    <el-option v-for="item3 in sort" :key="item3.id" :label="item3.meteType" :value="item3.meteType" />
                  </el-select>
                </el-col>
                <!-- 品类id -->
                <el-input v-if="showing" v-model="item2.typeid" class="g_input" placeholder="请输入内容" />
                <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                  产品名称：
                  <el-select v-model="item2.proName" class="g_input" placeholder="请选择" @change="changePro($event)">
                    <el-option v-for="item3 in portductName" :key="item3.id" :label="item3.proName" :value="item3.proName" />
                  </el-select>
                  <el-input v-if="showing" v-model="item2.proId" class="g_input" placeholder="请输入内容" />
                </el-col>
                <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
                  数量：
                  <el-input v-model="item2.number" class="g_input" placeholder="请输入内容" />
                  <!-- 删除按钮 -->
                  <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete1(index,index2)" /><br>
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
      contractName: this.$route.params.permission.name,
      money: this.$route.params.permission.money,
      customerName: this.$route.params.permission.customer_name,
      value1: '',
      itemName: '',
      sort: '',
      portductName: '',
      attachment: '',
      input: '',
      value: '',
      options: [],
      childitems: this.$route.params.permission.item
    }
  },
  created() {
    this.seach()
    this.typesToValue()
  },
  methods: {
    // 新增页面所有数据
    allData() {
      return {
        version: this.$route.params.permission.version,
        contractId: this.$route.params.permission.contractId,
        contractName: this.$route.params.permission.name,
        customerId: this.$route.params.permission.customerId,
        businessId: this.$route.params.permission.businessId,
        planStartTime: this.$route.params.permission.plan_start_time,
        planEndTime: this.$route.params.permission.plan_end_time,
        money: this.$route.params.permission.money,
        types: this.$route.params.permission.types,
        paymentType: this.$route.params.permission.payment_type,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        createTime: '2019-01-02',
        confiles: this.$route.params.permission.confiles,
        returnPlans: this.$route.params.permission.plan,
        childitems: this.childitems,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        modifyTime: '2019-01-02'
      }
    },
    handleRefresh() {},
    // 返回
    handleBack() {
      this.$router.push('agreement')
    },
    // 保存，传输数据给后台
    next() {
      for (let i = 0; i < this.childitems.length; i++) {
        this.childitems[i].num = i + 1 + ''
      }
      axios.post('/api/b01crm/contract/updateContract', this.allData()).then((result) => {
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
    changePro(event) {
      this.portductName.forEach((item, index) => {
        for (let i = 0; i < this.childitems.length; i++) {
          for (let j = 0; j < this.childitems[i].items.length; j++) {
            if (item.proName === this.childitems[i].items[j].proName) {
              this.childitems[i].items[j].proId = item.proId
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
    // 改变配送方式
    typesToValue() {
      if (this.$route.params.permission.types === '1') {
        this.value1 = true
      } else {
        this.value1 = false
      }
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
    readyDelete1(index, index2) {
      this.childitems[index].items.splice(index2, 1)
    }
  }
}

</script>
