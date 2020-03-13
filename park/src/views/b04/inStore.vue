<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="materielCost">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            物料号:
            <el-input v-model.trim="materielCost.matNo" class="g_elFormInput" placeholder="请输入物料号" clearable />

          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            存放仓库:
            <el-select v-model="materielCost.houseId" class="g_elFormSelect" clearable placeholder="请选择">
              <el-option v-for="item in options1" :key="item.id" :label="item.storageroomName" :value="item.id" />
            </el-select>

          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            在库状态:
            <el-select v-model="materielCost.stockStatus" class="g_elFormSelect" clearable placeholder="请选择">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            受限状态:
            <el-select v-model="materielCost.limitStatus" class="g_elFormSelect" clearable placeholder="请选择">
              <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>

          </el-col>
        </el-row>
        <br>
      </el-form>
    </div>

    <el-upload
      action="/api/b04wms/materiel/importExcel"
      :show-file-list="false"
      name="file"
      accept=".xlsx"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :auto-upload="true"
      class="g_button"
    >
      <!-- /api/b04wms/materiel/importExcel -->
      <el-button slot="trigger" icon="el-icon-upload" type="primary">
        导入
      </el-button>
    </el-upload>

    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd()">入库</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit()">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete()">刪除</el-button>
    </div>

    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" fixed />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- 编码 -->
      <el-table-column label="物料号" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.matNo }}</span>
        </template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column label="名称" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 所属合同 -->
      <el-table-column v-if="false" label="所属合同" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.contractId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属合同" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.contractName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="所属合同子项" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.contractItemId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属合同子项" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.contractItemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同号" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.contractNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="存放仓库" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.houseId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放仓库" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.houseName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="存放库位" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.positionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放库位" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.positionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在库状态" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.stockStatus == 0 ? '未入库' : row.stockStatus == 1 ? '已入库' : row.stockStatus == 2 ? '已预约': row.stockStatus == 3 ? '已提货' : row.stockStatus == 4 ? '已出库' : row.stockStatus == 11 ? '已下发' : '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="受限状态" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.limitStatus == 0 ? '未受限' : row.limitStatus == 1? '受限' : '未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库日期" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.inDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="免费存储期限  单位:天" align="center" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.freeTerm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大草垫个数" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.bStrawMat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中草垫个数" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.mStrawMat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小草垫个数" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.sStrawMat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存储费用  单位:元/天·吨" align="center" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.cost }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="产品" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.proId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.proName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="品类" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.categoryId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品类" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="false" label="费用标准" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.costId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="费用标准" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.costName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="长" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.length }}</span>
        </template>
      </el-table-column>
      <el-table-column label="宽" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.width }}</span>
        </template>
      </el-table-column>
      <el-table-column label="高" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.height }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="立卷" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.stand == 0 ? '未立卷' : row.stand == 1? '立卷' : '未知' }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="g_pagination">
      <el-pagination
        :current-page.sync="materielCost.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="materielCost.rows"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

</template>

<script>
import axios from 'axios'
/* import XLSX from 'xlsx' */
export default {
  data() {
    return {
      materielCost: {
        matNo: '',
        houseId: '',
        positionId: '',
        stockStatus: '',
        limitStatus: '',
        page: 1,
        rows: 10
      },
      modifierCode: 's01',
      modifierName: 'hezekun',
      version: 0,
      total: 0,
      multipleTable: [],
      ids: [],
      uploadData: [],
      tableData: [],
      options1: [],
      options2: [{
        value: 1,
        label: '已入库'
      }, {
        value: 4,
        label: '已出库'
      }, {
        label: '已下发',
        value: 11
      }],
      options3: [{
        value: 0,
        label: '未受限'
      }, {
        value: 1,
        label: '受限'
      }],
      options5: {},
      options6: {},
      options7: {},
      options8: {},
      options9: {},
      options10: {},
      ptions10: {}
    }
  },

  created() {
    this.handleSearch()
    this.getPosition()
    this.handleTypeName()
    this.handlecontract()
    this.handlePositionId()
    this.getPro()
    this.getCost()
  },
  methods: {

    getPosition() {
      axios.get('/api/s01/instore/findAllStorageroom').then((result) => {
        this.options1 = result.data.resultData.datalist
        result.data.resultData.datalist.forEach(item => {
          this.options7[item.id] = item.storageroomName
        })
        this.handleSearch()
      })
    },

    getPro() {
      axios.get('/api/b02pdm/product/findAllProName').then((result) => {
        result.data.resultData.forEach(item => {
          this.options10[item.proId] = item.proName
        })
        this.handleSearch()
      })
    },

    getCost() {
      axios.get('/api/b04wms/cost/selectCost').then((result) => {
        result.data.forEach(item => {
          this.options10[item.id] = item.costName
        })
        this.handleSearch()
      })
    },

    // 从后台拿品类名称
    handleTypeName() {
      axios.get('/api/s01/instore/findAllCategory').then(result => {
        result.data.resultData.forEach(item => {
          this.options5[item.value] = item.label
        })
        this.handleSearch()
      })
    },

    handlecontract() {
      axios.get('/api/s01/instore/findAllContract').then(result => {
        result.data.resultData.forEach(item => {
          this.options6[item.contractId] = item.contractName
          item.contractItemNo.forEach(item2 => {
            this.options8[item2.itemId] = item2.contractItemNo
          })
        })
        this.handleSearch()
      })
    },

    handlePositionId() {
      axios.get('/api/b04wms/storehouse/selectStoreHouse').then((result) => {
        result.data.forEach(item => {
          this.options9[item.id] = item.storeArea + '区-' + item.storeRow + '行-' + item.sotreColumn + '列-' +
              item.storeLayer + '层'
        })
        this.handleSearch()
      })
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 查询
    handleSearch() { /* /api/b04wms/materiel/selectMaterielByCondition */
      axios.get('/api/b04wms/materiel/selectMaterielByCondition', {
        params: this.materielCost
      }).then((result) => {
        for (const row of result.data.resultData.rows) {
          row['categoryName'] = this.options5[row.categoryId]
          row['contractName'] = this.options6[row.contractId]
          row['houseName'] = this.options7[row.houseId]
          row['positionName'] = this.options9[row.positionId]
          row['contractItemName'] = this.options8[row.contractItemId]
          row['proName'] = this.options10[row.proId]
          row['costName'] = this.options10[row.costId]
        }

        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
      })
    },

    // 开始删除
    readyDelete() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const obj = {
              id: select[i].id,
              version: select[i].version,
              modifierCode: this.modifierCode,
              modifierName: this.modifierName
            }
            listmap.push(obj)
          }
          axios.put('/api/b04wms/materiel/deleteMateriel', listmap).then((res) => {
            this.handleSearch()
            this.$notify({
              type: 'success',
              message: '删除成功!',
              position: 'bottom-right'
            })
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消删除',
              position: 'bottom-right'
            })
          })
        })
      }
    },

    // 添加
    handleAdd() {
      this.$router.push('materielInStore')
    },

    uploadSuccess(res, file) {
      axios.post('/api/b01crm/contract/updateNewColumnByContractNumber', {
        'newColumn': 1,
        'contractNumbers': res.contractNumbers
      }).then((result) => {})

      this.$notify({
        title: '提示',
        message: '文件导入成功',
        type: 'success',
        position: 'bottom-right'
      })
      this.handleSearch()
    },
    uploadError() {
      this.$notify({
        title: '提示',
        message: '文件导入失败',
        type: 'error',
        position: 'bottom-right'
      })
    },

    // 修改
    handleEdit() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({
          name: 'materielInStoreUpdate',
          params: {
            materielCost: this.multipleTable[0]
          }
        })
      }
    },
    handleSizeChange: function(val) {
      this.materielCost.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.materielCost.page = val
      this.handleSearch()
    }
  }
}
</script>
