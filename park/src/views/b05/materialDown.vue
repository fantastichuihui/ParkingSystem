<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form :label-position="labelPosition" label-width="130px">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="执行单号：" prop="executionOrder">
              <el-input
                v-model.trim="executionOrder"
                disabled="disabled"
                placeholder="执行单号"
                style="width:60%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="配送单位：" prop="deliveryCompany">
              <el-input
                v-model.trim="deliveryCompany"
                disabled="disabled"
                placeholder="请输入内容"
                style="width:60%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="联系人姓名：" prop="contactsName">
              <el-input
                v-model.trim="contactsName"
                disabled="disabled"
                placeholder="请输入内容"
                style="width:60%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="计划开始日期：" prop="planStartTime">
              <el-input
                v-model.trim="planStartTime"
                disabled="disabled"
                placeholder="请输入内容"
                style="width:60%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="计划结束日期：" prop="planFinishTime">
              <el-input
                v-model.trim="planFinishTime"
                disabled="disabled"
                placeholder="请输入内容"
                style="width:60%;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="联系电话：" prop="concatePhone">
              <el-input
                v-model.trim="concatePhone"
                disabled="disabled"
                placeholder="请输入内容"
                style="width:60%;"
                clearable
              /></el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="23" :xl="24">
            <el-form-item label="备注：" prop="remark">
              <el-input
                v-model.trim="remark"
                disabled="disabled"
                type="textarea"
                placeholder="请输入内容"
                class="down_textarea"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-for="(conitem,conindex) in conList" :key="conindex" style="width:95%;border:1px solid #606266;border-radius: 4px;margin-bottom:30px;padding-top:30px;padding-bottom:15px;">
      <el-form :label-position="labelPosition" label-width="100px">
        <el-row style="margin-left:25px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="合同编号：" prop="contractCode">
              <el-select
                v-model.trim="conitem.contractCode"
                style="width:60%;float:left;"
                placeholder="请选择合同编号"
                @change="getShowCodeSelect(conitem)"
              >
                <el-option
                  v-for="(conCodeItem,conItemIndex) in contractData"
                  v-show="conitem.contractCode==conCodeItem.contractCode || !selectConCodeArr.includes(conCodeItem.contractCode)"
                  :key="conItemIndex"
                  :label="conCodeItem.contractCode"
                  :value="conCodeItem.contractCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="合同名称：" prop="contractName">
              <el-input
                v-model.trim="conitem.contractName"
                placeholder="请输入内容"
                style="width:60%;float:left;"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="客户公司：" prop="contractCompany">
              <el-input
                v-model.trim="conitem.contractCompany"
                placeholder="请输入内容"
                style="width:60%;float:left;"
                clearable
              /></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-for="(itemlist,itemindex) in conitem.itemList" :key="itemindex">
        <el-form :label-position="labelPosition" label-width="100px">
          <el-row style="margin-left:25px;">
            <el-col :xs="2" :sm="4" :md="6" :lg="6" :xl="6">
              <el-form-item label="子项号：" prop="itemId">
                <el-select
                  v-model.trim="itemlist.itemId"
                  style="width:60%;float:left;"
                  placeholder="请选择子项号"
                >
                  <el-option
                    v-for="(item,itemsIndex) in conitem.itemData"
                    :key="itemsIndex"
                    :label="item.childItem"
                    :value="item.itemId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="6" :xl="6">
              <el-form-item label="收货单位：" prop="reciveCompany">
                <el-input
                  v-model.trim="itemlist.reciveCompany"
                  placeholder="请输入内容"
                  style="width:60%;float:left;"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="6" :xl="6">
              <el-form-item label="联系人：" prop="concateItemPeople">
                <el-input
                  v-model.trim="itemlist.concateItemPeople"
                  placeholder="请输入内容"
                  style="width:60%;float:left;"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="2" :sm="4" :md="6" :lg="6" :xl="6">
              <el-form-item>
                <el-button v-show="itemindex>0" type="primary" plain icon="el-icon-delete" @click="deleteButItem(conitem,itemindex)">删除子项</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-button type="primary" plain icon="el-icon-add" @click="AddButItem(conitem)">添加子项</el-button>
      <el-button v-show="conindex>0" type="primary" plain icon="el-icon-delete" @click="deleteButCon(conindex)">删除合同</el-button>
    </div>
    -
    <div>
      <el-button type="primary" plain icon="el-icon-add" @click="AddButCon">添加合同</el-button>
      <el-button type="primary" plain icon="el-icon-refersh" @click="handleRefresh()">重置</el-button>
      <el-button type="primary" plain icon="el-icon-back" @click="handleBack">取消</el-button>
      <el-button type="primary" plain icon="el-icon-save" @click="selectMatNo()">保存</el-button>
    </div>
  </div>
</template>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}
.down_textarea {
  width:93%;
}
</style>

<script>
import axios from 'axios'
export default {
  name: 'MaterialDownTable',
  data() {
    return {
      labelPosition: 'right',
      currentTime: '',
      msg: '',
      EC000011: '执行单物料关联关系表插入出错',
      // 执行单id
      id: this.$route.params.executionOrders.id,
      sendState: this.$route.params.executionOrders.sendState,
      executionOrder: this.$route.params.executionOrders.execOrderNo,
      deliveryCompany: this.$route.params.executionOrders.deliveryName,
      contactsName: this.$route.params.executionOrders.contactsName,
      planStartTime: this.$route.params.executionOrders.planStartTime,
      planFinishTime: this.$route.params.executionOrders.planFinishTime,
      concatePhone: this.$route.params.executionOrders.contactsPhone,
      remark: this.$route.params.executionOrders.remark,
      // contractData: [],
      itemId: undefined,
      contractData: [],
      selectConCodeArr: [],
      selectItemCodeArr: [],
      selectItemIdArrMap: [],
      execRefs: [],
      matData: [],
      execSendStates: {},
      paramMap: {},
      conList: [{ contractCode: '', contractName: '', contractCompany: '', itemList: [{ itemId: '', childItem: '', reciveCompany: '', concateItemPeople: '' }], itemData: [] }]
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  watch: {
    conList: {
      handler: function(conList) {
        conList.forEach((item, i) => {
          // 从已选中的合同编号，获取所有合同数据中的对应合同信息
          const constract = this.findConByCode(item.contractCode)
          if (constract !== undefined) {
            // 名字，公司联动
            item.contractName = constract.contractName
            item.contractCompany = constract.contractCompany
            item.itemData = constract.itemList
            item.itemList.forEach((jitem, j) => {
              // 从已选中的子项信息，获取对应的子项信息
              const itemId = this.findItemByCode(constract.itemList, jitem.itemId)
              if (itemId !== undefined) {
                jitem.itemId = itemId.itemId
                jitem.childItem = itemId.childItem
                jitem.reciveCompany = itemId.reciveCompany
                jitem.concateItemPeople = itemId.concateItemPeople
              }
            })
          }
        })
      },
      deep: true
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    // 数组去重
    disTinct(arr) {
      var ans = []
      for (var i = arr.length - 1; i >= 0; i--) {
        var nb = 0 // 没重复为0.有重复不为0
        for (var j = i - 1; j >= 0; j--) {
          if (arr[i] === arr[j]) {
            nb = 1
            break
          }
        }
        if (nb === 0) {
          ans.unshift(arr[i])
        }
      }
      return ans
    },
    // 错误消息过滤
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
    // 加载所有合同和子项ok
    loadData: function() {
      axios.get('/api/s01/selectConItem').then((res) => {
        this.contractData = res.data
      })
    },
    getTime() {
      this.currentTime = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
    },
    // 选择合同
    getShowCodeSelect(conitem) {
      this.selectConCodeArr = []
      for (const items of this.conList) {
        if (items.contractCode) {
          this.selectConCodeArr.push(items.contractCode)
        }
      }
      conitem.itemList = [{ itemId: '', childItem: '', reciveCompany: '', concateItemPeople: '' }]
    },
    // 选择所有的子项Id,List<Map>,传给b04.找到对应子项Id下的物料号
    selectMatNo: function() {
      this.selectItemCodeArr = []
      for (const conitem of this.conList) {
        for (const item of conitem.itemList) {
          this.selectItemCodeArr.push(item.itemId)
        }
      }
      // 去除子项中的，'',null,undefined
      for (var i = 0; i < this.selectItemCodeArr.length; i++) {
        if (this.selectItemCodeArr[i] === '' || this.selectItemCodeArr[i] == null || typeof (this.selectItemCodeArr[i]) === undefined) {
          this.selectItemCodeArr.splice(i, 1)
          i = i - 1
        }
      }
      if (this.selectItemCodeArr.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          type: 'error',
          message: '您未选择子项，如不选择请取消返回',
          position: 'bottom-right'
        })
      } else if (this.disTinct(this.selectItemCodeArr).length !== this.selectItemCodeArr.length) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          type: 'error',
          message: '重复选择子项号，请重新选择',
          position: 'bottom-right'
        })
      } else {
        for (let j = 0; j < this.selectItemCodeArr.length; j++) {
          this.selectItemIdArrMap[j] = { contractItemId: this.selectItemCodeArr[j] }
        }
        axios.post('/api/s01/selectMatNoByItemId', this.selectItemIdArrMap).then((res) => {
          this.matData = res.data
          this.execRefs = res.data
          console.log(res)
          for (let i = 0; i < this.execRefs.length; i++) {
            this.execRefs[i].execOrderId = this.id
            this.execRefs[i].modifierCode = this.$store.state.userInfo.code
            this.execRefs[i].modifierName = this.$store.state.userInfo.name
            this.execRefs[i].createUserCode = this.$store.state.userInfo.code
            this.execRefs[i].createUserName = this.$store.state.userInfo.name
          }
          this.execSendStates.id = this.id
          this.execSendStates.modifierCode = this.$store.state.userInfo.code
          this.execSendStates.modifierName = this.$store.state.userInfo.name
          this.execSendStates.sendState = 1
        }).then(() => {
          this.paramMap.execRefs = this.execRefs
          this.paramMap.execSendStates = this.execSendStates
          axios.post('/api/b05lms/ExecutionOrder/insertEcexMaterRef', this.paramMap).then((res1) => {
            if (res1.data.status === 1) {
              this.handleRefresh()
              this.loadData()
              // 更新04物料下发状态
              axios.post('/api/s01/updateMatState', { modifierCode: this.$store.state.userInfo.code,
                modifierName: this.$store.state.userInfo.name, list: this.matData }).then((res2) => {
                if (res2.data === 0) {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    type: 'success',
                    message: '物料下发状态更新失败',
                    position: 'bottom-right'
                  })
                } else {
                  // if (this.notifyInstance) {
                  //   this.notifyInstance.close()
                  // }
                  // this.notifyInstance = this.$notify({
                  //   type: 'success',
                  //   message: '下发成功',
                  //   position: 'bottom-right'
                  // })
                }
              })
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '物料下发成功',
                position: 'bottom-right'
              })
            } else {
              this.msg = res1.data.msg
              if (this.msg === 'EC000011') {
                this.open2(this.EC000011)
              }
            }
          })
        })
      }
    },
    // 重置页面
    handleRefresh: function() {
      this.id = this.$route.params.executionOrders.id
      this.executionOrder = this.$route.params.executionOrders.execOrderNo
      this.deliveryCompany = this.$route.params.executionOrders.deliveryName
      this.contactsName = this.$route.params.executionOrders.contactsName
      this.planStartTime = this.$route.params.executionOrders.planStartTime
      this.planFinishTime = this.$route.params.executionOrders.planFinishTime
      this.concatePhone = this.$route.params.executionOrders.contactsPhone
      this.remark = this.$route.params.executionOrders.remark
      this.conList = [{ contractCode: '', contractName: '', contractCompany: '', itemList: [{ itemId: '', childItem: '', reciveCompany: '', concateItemPeople: '' }] }]
      this.selectItemCodeArr = []
      this.selectItemIdArrMap = []
    },
    // 返回主界面
    handleBack: function() {
      this.$router.push('executionOrder')
    },
    // 添加子项
    AddButItem: function(item) {
      // 找到是哪个合同
      item.itemList.push({ childItem: '', reciveCompany: '', concateItemPeople: '' })
    },
    // 删除子项
    deleteButItem: function(item, index) {
      item.itemList.splice(index, 1)
    },
    // 添加合同
    AddButCon: function() {
      this.conList.push({ contractCode: '', contractName: '', contractCompany: '', itemList: [{ childItem: '', reciveCompany: '', concateItemPeople: '' }] })
    },
    // 删除合同
    deleteButCon: function(index) {
      this.conList.splice(index, 1)
    },
    findConByCode: function(conCode) {
      let result
      this.contractData.forEach((item, index) => {
        if (item.contractCode === conCode) {
          result = item
        }
      })
      return result
    },
    // 通过合同查找子项信息，子项号
    findItemByCode: function(items, itemId) {
      let result
      // 循环子项信息
      items.forEach((item, index) => {
        // 如果子项信息里的子项号等于选中的子项号
        if (item.itemId === itemId) {
          // 把该子项信息返回
          result = item
        }
      })
      return result
    }
  }
}
</script>
