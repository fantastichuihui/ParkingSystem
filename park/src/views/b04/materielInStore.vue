<template>
  <div class="g_container">
    <el-form ref="materielCost" :model="materielCost" :rules="rules" class="g_elForm" label-width="150px">
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="物料号：" prop="matNo">
            <el-input v-model="materielCost.matNo" class="g_elFormInput_other" placeholder="请输入物料号" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="materielCost.name" class="g_elFormInput_other" placeholder="请输入物料名称" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="所属合同：" prop="contractId">
            <el-select
              v-model="materielCost.contractId"
              class="g_elFormSelect_other"
              clearable
              placeholder="请选择所属合同"
              @change="changeStatus1"
            >
              <el-option v-for="item in options1" :key="item.contractId" :label="item.contractName" :value="item.contractId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="合同号：" prop="contractNumber">
            <el-input
              v-model="materielCost.contractNumber"
              :disabled="true"
              class="g_elFormInput_other"
              placeholder="请输入合同号"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="所属合同子项：" prop="contractItemId">
            <el-select v-model="materielCost.contractItemId" class="g_elFormSelect_other" clearable placeholder="请选择所属合同子项">
              <el-option v-for="item in options2" :key="item.itemId" :label="item.contractItemNo" :value="item.itemId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="存放仓库：" prop="houseId">
            <el-select
              v-model="materielCost.houseId"
              class="g_elFormSelect_other"
              clearable
              placeholder="请选择存放仓库"
              @change="changeStatus2"
            >
              <el-option v-for="item in options3" :key="item.id" :label="item.storageroomName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="存放库位：" prop="positionId">
            <el-select v-model="materielCost.positionId" class="g_elFormSelect_other" clearable placeholder="请选择存放库位">
              <el-option
                v-for="item in options4"
                :key="item.id"
                :label="item.storeArea+'区-'+item.storeRow+'行-'+item.sotreColumn+'列-'+item.storeLayer+'层'"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="在库状态：" prop="stockStatus">
            <el-select v-model="materielCost.stockStatus" class="g_elFormSelect_other" clearable placeholder="请选择在库状态">
              <el-option v-for="item in options5" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="受限状态：" prop="limitStatus">
            <el-select v-model="materielCost.limitStatus" class="g_elFormSelect_other" clearable placeholder="请选择受限状态">
              <el-option v-for="item in options6" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="入库日期：" prop="inDate">
            <el-date-picker v-model="materielCost.inDate" value-format="yyyy-MM-dd" placeholder="请选择入库日期" style="width:60%;float: left;" />
            <!-- <el-input v-model="materiel.inDate" placeholder="请输入日期" clearable /> -->
          </el-form-item>
          <el-form-item label="大草垫个数：" prop="bStrawMat">
            <el-input
              v-model.number="materielCost.bStrawMat"
              class="g_elFormInput_other"
              maxlength="2"
              placeholder="请输入大草垫个数"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="中草垫个数：" prop="mStrawMat">
            <el-input
              v-model.number="materielCost.mStrawMat"
              maxlength="2"
              class="g_elFormInput_other"
              placeholder="请输入中草垫个数"
              clearable
            />
          </el-form-item>
          <el-form-item label="小草垫个数：" prop="sStrawMat">
            <el-input
              v-model.number="materielCost.sStrawMat"
              maxlength="2"
              class="g_elFormInput_other"
              placeholder="请输入小草垫个数"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="产品：" prop="proId">
            <el-select v-model="materielCost.proId" class="g_elFormSelect_other" clearable placeholder="请选择产品种类">
              <el-option v-for="item in options11" :key="item.proId" :label="item.proName" :value="item.proId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="品类：" prop="categoryId">
            <el-select
              v-model="materielCost.categoryId"
              class="g_elFormSelect_other"
              clearable
              placeholder="请选择品类"
              @change="changeStatus3"
            >
              <el-option v-for="item in options7" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="费用标准：" prop="costId">
            <el-select
              v-model="materielCost.costId"
              class="g_elFormSelect_other"
              clearable
              placeholder="请选择费用标准"
              @change="changeStatus4"
            >
              <el-option v-for="item in options8" :key="item.id" :label="item.costName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="免费存储期限：" prop="freeTerm">
            <el-input
              v-model.number="materielCost.freeTerm"
              maxlength="3"
              class="g_elFormInput_other"
              placeholder="请输入免费存储期限"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="存储费用：" prop="cost">
            <el-input
              v-model.number="materielCost.cost"
              class="g_elFormInput_other"
              maxlength="7"
              placeholder="请输入存储费用"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="重量：" prop="weight">
            <el-input
              v-model.number="materielCost.weight"
              class="g_elFormInput_other"
              maxlength="2"
              placeholder="请输入重量"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="长度：" prop="length">
            <el-input
              v-model.number="materielCost.length"
              class="g_elFormInput_other"
              maxlength="2"
              placeholder="请输入长度"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="宽度：" prop="width">
            <el-input
              v-model.number="materielCost.width"
              class="g_elFormInput_other"
              maxlength="2"
              placeholder="请输入宽度"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="高度：" prop="height">
            <el-input
              v-model.number="materielCost.height"
              class="g_elFormInput_other"
              maxlength="2"
              placeholder="请输入高度"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :offset="7" :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="是否立卷：" prop="stand">
            <el-select v-model="materielCost.stand" class="g_elFormSelect_other" clearable placeholder="请选择是否立卷">
              <el-option v-for="item in options9" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          <el-button type="primary" plain icon="el-icon-check" @click="handleYes('materielCost')">确认</el-button>
          <el-button type="primary" plain icon="el-icon-close" @click="handleNo()">取消</el-button>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      materielCost: {
        categoryId: '',
        matNo: '',
        name: '',
        contractId: '',
        contractItemId: '',
        houseId: '',
        positionId: '',
        stockStatus: '',
        limitStatus: '',
        inDate: '',
        bStrawMat: '',
        mStrawMat: '',
        sStrawMat: '',
        freeTerm: '',
        cost: '',
        costId: '',
        proId: '',
        height: '',
        width: '',
        length: '',
        weight: '',
        stand: '',
        contractNumber: '',
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name,
        version: 1,
        isDel: 0
      },
      rules: {
        matNo: [{
          max: 20,
          required: true,
          message: '请输入物料号,长度在20个字符以内',
          trigger: 'blur'
        }],
        name: [{
          max: 20,
          required: true,
          message: '请输入物料名称,长度在20个字符以内',
          trigger: 'blur'
        }],
        contractId: [{
          required: true,
          message: '请选择所属合同',
          trigger: 'change'
        }],
        contractItemId: [{
          required: true,
          message: '请选择所属合同子项',
          trigger: 'change'
        }],
        houseId: [{
          required: true,
          message: '请选择存放仓库',
          trigger: 'change'
        }],
        positionId: [{
          required: true,
          message: '请选择存放库位',
          trigger: 'change'
        }],
        stockStatus: [{
          required: true,
          message: '请选择在库状态',
          trigger: 'change'
        }],
        limitStatus: [{
          required: true,
          message: '请选择受限状态',
          trigger: 'change'
        }],
        inDate: [{
          required: true,
          message: '请输入入库日期',
          trigger: 'blur'
        }],
        bStrawMat: [{
          required: true,
          type: 'number',
          message: '请输入大草垫，数量在100以内',
          trigger: 'blur'
        }],
        mStrawMat: [{
          required: true,
          type: 'number',
          message: '请输入中草垫，数量在100以内',
          trigger: 'blur'
        }],
        sStrawMat: [{
          required: true,
          type: 'number',
          message: '请输入小草垫数量，数量在100以内',
          trigger: 'blur'
        }],
        costId: [{
          required: true,
          message: '请选择费用标准',
          trigger: 'change'
        }],
        categoryId: [{
          required: true,
          message: '请选择品类',
          trigger: 'change'
        }],
        freeTerm: [{
          type: 'number',
          required: true,
          message: '请输入免费存储期限，',
          trigger: 'blur'
        }],
        cost: [{
          type: 'number',
          required: true,
          message: '请输入存储费用，',
          trigger: 'blur'
        }],
        weight: [{
          type: 'number',
          required: true,
          message: '请输入物料重量',
          trigger: 'blur'
        }],
        length: [{
          type: 'number',
          required: true,
          message: '请输入物料长度',
          trigger: 'blur'
        }],
        width: [{
          type: 'number',
          required: true,
          message: '请输入物料宽度',
          trigger: 'blur'
        }],
        height: [{
          type: 'number',
          required: true,
          message: '请输入物料高度',
          trigger: 'blur'
        }],
        proId: [{
          required: true,
          message: '请选择产品',
          trigger: 'change'
        }],
        stand: [{
          required: true,
          message: '请选择立卷状态',
          trigger: 'change'
        }]
      },
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      options5: [{
        label: '已入库',
        value: 1
      }, {
        label: '已出库',
        value: 4
      },
      {
        label: '已下发',
        value: 11
      }],
      options6: [{
        label: '未受限',
        value: 0
      }, {
        label: '受限',
        value: 1
      }],
      options7: [],
      options8: [],
      options9: [{
        label: '未立卷',
        value: 0
      }, {
        label: '立卷',
        value: 1
      }],
      options10: [],
      options11: []

    }
  },

  mounted() {
    this.getCategory()
    this.getPosition()
    this.getContract()
    this.getPro()
  },
  methods: {
    getPro() {
      axios.get('/api/b02pdm/product/findAllProName').then((result) => {
        this.options11 = result.data.resultData
      })
    },

    getContract() {
      axios.get('/api/s01/instore/findAllContract').then((result) => {
        this.options1 = result.data.resultData
      })
    },

    getCategory() {
      axios.get('/api/s01/instore/findAllCategory').then((result) => {
        this.options7 = result.data.resultData
      })
    },

    getPosition() {
      axios.get('/api/s01/instore/findAllStorageroom').then((result) => {
        this.options3 = result.data.resultData.datalist
      })
    },

    changeStatus1() {
      for (var i = 0; i < this.options1.length; i++) {
        if (this.options1[i].contractId === this.materielCost.contractId) {
          this.materielCost.contractNumber = this.options1[i].contractNumber
          this.options2 = this.options1[i].contractItemNo
        }
      }
    },

    changeStatus2() {
      axios.get('/api/b04wms/storehouse/selectIdByHouseId', {
        params: this.materielCost
      }).then((result) => {
        this.options4 = result.data.resultData
      })
      this.materielCost.positionId = ''
    },

    changeStatus3() {
      axios.get('/api/b04wms/cost/selectIdByCategoryId', {
        params: this.materielCost
      }).then((result) => {
        this.options8 = result.data.resultData
      })
      this.materielCost.costId = ''
    },

    changeStatus4() {
      axios.get('/api/b04wms/cost/selectcfById', {
        params: this.materielCost
      }).then((result) => {
        this.options10 = result.data.resultData
        this.materielCost.cost = this.options10.cost
        this.materielCost.freeTerm = this.options10.freeTerm
      })
    },

    handleYes(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios
            .post('/api/b04wms/materiel/insertMateriel', this.materielCost)
            .then(res => {
              this.$notify({
                type: 'success',
                title: '提示',
                message: '添加成功!',
                position: 'bottom-right'
              })
            })
            .catch(() => {
              this.$notify({
                type: 'error',
                title: '提示',
                message: '添加失败',
                position: 'bottom-right'
              })
            })
        } else {
          this.$notify({
            type: 'error',
            title: '提示',
            message: '添加失败',
            position: 'bottom-right'
          })
          return false
        }
        this.$router.push('inStore')
      })
    },
    handleNo() {
      this.$router.push('inStore')
      this.$notify({
        type: 'info',
        title: '提示',
        message: '已取消添加',
        position: 'bottom-right'
      })
    }
  }
}
</script>
