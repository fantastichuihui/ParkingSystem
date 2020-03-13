<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form ref="maSys" :model="maSys">
        <el-row style="margin-left:20px;">

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="物料编码" prop="matNo">
              <el-input
                v-model="maSys.matNo"
                maxlength="20"
                placeholder="请输入物料编码"
                class="g_elFormInput"
                clearable
                @keyup.enter.native="handleSearch"
              />
            </el-form-item>
          </el-col>

          <!-- <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="合同编码" prop="contractId">
              <el-input v-model="maSys.contractId" maxlength="20" placeholder="请输入合同编码" class="g_elFormInput" clearable @keyup.enter.native="handleSearch" />
            </el-form-item>
          </el-col> -->

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="受限状态">
              <el-select v-model="maSys.limitStatus" clearable required class="g_input" placeholder="请选择">
                <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- 物料状态: -->
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="在库状态">
              <el-select v-model="maSys.stockStatus" clearable class="g_input" placeholder="请选择">
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">查询</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加合同受限</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete1">删除合同受限</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="onAddDialog2">添加超期受限</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete2">删除超期受限</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="onAddDialog3">添加状态受限</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete3">删除状态受限</el-button>
    </div>

    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column class="g_tableSelection" type="selection" />

      <el-table-column label="序号" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- 物料编码 -->
      <el-table-column label="物料编码" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.matNo }}</span>
        </template>
      </el-table-column>
      <!-- 所属合同 -->
      <el-table-column label="所属合同" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.contractNumber }}</span>
        </template>
      </el-table-column>
      <!-- 合同受限 -->
      <el-table-column label="合同受限" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.htsx === '是'" style="color:red">{{ row.htsx }}</span>
          <span v-else style="color: darkgreen">{{ row.htsx }}</span>
          <!-- <span>{{ row.htsx }}</span> -->
        </template>
      </el-table-column>
      <!--超期受限-->
      <el-table-column label="超期受限" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.cqsx === '是'" style="color:red">{{ row.cqsx }}</span>
          <span v-else style="color: darkgreen">{{ row.cqsx }}</span>
          <!-- <span>{{ row.cqsx }}</span> -->
        </template>
      </el-table-column>
      <!--状态受限-->
      <el-table-column label="状态受限" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.hwztsx === '是'" style="color:red">{{ row.hwztsx }}</span>
          <span v-else style="color: darkgreen">{{ row.hwztsx }}</span>
        </template>
      </el-table-column>
      物料状态-->
      <el-table-column label="在库状态" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.stockStatus == 0 ? '未入库' : row.stockStatus == 1 ? '已入库' : row.stockStatus == 2 ? '已预约': row.stockStatus == 3 ? '已提货' : row.stockStatus == 4 ? '已出库' : '已下发' }}</span>
        </template>
      </el-table-column>
      <!--物料状态
      <el-table-column label="物料状态" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.limitStatus === 1" style="color:red">受限</span>
          <span v-else style="color:darkgreen">未受限</span>
        </template>
      </el-table-column>
      创建时间 -->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <!--创建人-->
      <el-table-column label="创建人" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="float: right">
      <el-pagination
        :current-page.sync="maSys.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="maSys.rows"
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
export default {
  data() {
    return {
      maSys: {
        matNo: '',
        contractId: '',
        htsx: '',
        cqsx: '',
        hwztsx: '',
        limitStatus: '',
        stockStatus: '',
        createTime: '',
        createUserName: '',
        page: 1,
        rows: 10
      },
      /* rules: {
                    matNo: [{
                      required: true,
                      message: '请输入20位以内物料编码号',
                      trigger: 'blur'
                    }]
                  }, */
      dialogVisible: false,
      dialogEditFormVisible: false,
      dialogAddFormVisible: false,
      tableData: [],
      multipleTable: [],
      modifierCode: this.$store.state.userInfo.code,
      modifierName: this.$store.state.userInfo.name,
      total: 0,
      contractNumber: [],
      options: [],
      options3: [{}],
      options2: [{
        value: 0,
        label: '未入库'
      },
      {
        value: 1,
        label: '已入库'
      },
      {
        value: 2,
        label: '已预约'
      },
      {
        value: 3,
        label: '已提货'
      },
      {
        value: 4,
        label: '已发车'
      },
      {
        value: 11,
        label: '已下发'
      }
      ],
      options1: [{
        value: 0,
        label: '未受限'
      },
      {
        value: 1,
        label: '受限'
      }
      ],
      options4: [{
        value: 1,
        label: '合同受限'
      },
      {
        value: 2,
        label: '超期受限'
      },
      {
        value: 3,
        label: '货物状态受限'
      }
      ],
      paramList: {
        id: '',
        limitType: '',
        materielId: '',
        isDel: 0,
        version: 0,
        createUserCode: this.$store.state.userInfo.code,
        createUserName: this.$store.state.userInfo.name,
        modifierCode: this.$store.state.userInfo.code,
        modifierName: this.$store.state.userInfo.name
      },
      paramData: []
    }
  },
  /* 向后台发送数据 */
  created() {
    this.handleSearch()
    this.handleC()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    /**
       *根据合同id查合同编码
       */
    handleC() {
      axios
        .get('/api/s01/instore/findAllContract')
        .then(result => {
          this.options = result.data.resultData
          for (var i = 0; i < this.tableData.length; i++) {
            for (var j = 0; j < this.options.length; j++) {
              if (this.tableData[i].contractId === this.options[j].contractId) {
                this.tableData[i].contractNumber = this.options[j].contractNumber
              }
            }
          }
        })
    },
    /* 分页查询所有数据以及条件查询 */
    handleSearch() {
      axios
        .get('/api/b04wms/storeLimit/findAllLimitTypeByMarId', {
          params: this.maSys
        })
        .then(result => {
          this.tableData = result.data.resultData.rows
          this.total = result.data.resultData.total
          this.handleC()
        })
    },
    /* 添加合同受限 */
    handleAdd() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable[0].htsx === '是') {
        this.$notify({
          title: '警告信息',
          message: '该物料存在合同受限，请勿重复操作',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else {
        this.paramList = this.multipleTable[0]
        this.paramList.isDel = 0
        this.paramList.limitType = 1
        this.paramList.materielId = this.paramList.id
        this.paramList.modifierCode = this.$store.state.userInfo.code
        this.paramList.modifierName = this.$store.state.userInfo.name
        this.paramList.createUserCode = this.$store.state.userInfo.code
        this.paramList.createUserName = this.$store.state.userInfo.name
      }
      axios
        .post('/api/b04wms/storeLimit/insertStoreLimit', this.paramList)
        .then(res => {
          this.handleSearch()
          this.$notify({
            type: 'success',
            message: '添加成功!',
            position: 'bottom-right'
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '添加失败!',
            position: 'bottom-right'
          })
        })
    },
    /* 删除合同受限 */
    readyDelete1() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable[0].htsx === '否') {
        this.$notify({
          title: '警告信息',
          message: '存在未受限物料，请重新选择',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else {
        const selectLength = this.multipleTable.length
        const listmap = []
        const select = this.multipleTable
        for (let i = 0; i < selectLength; i++) {
          const obj = {
            materielId: select[i].id,
            modifierCode: this.$store.state.userInfo.code,
            modifierName: this.$store.state.userInfo.name,
            limitType: 1
          }
          listmap.push(obj)
        }
        axios
          .put('/api/b04wms/storeLimit/deleteStoreLimit', listmap)
          .then(res => {
            this.handleSearch()
            this.$notify({
              type: 'success',
              message: '删除成功!',
              position: 'bottom-right'
            })
          })
          .catch(() => {
            this.$notify({
              type: 'info',
              message: '删除失败!',
              position: 'bottom-right'
            })
          })
      }
    },
    /* 添加超期受限 */
    onAddDialog2() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable[0].cqsx === '是') {
        this.$notify({
          title: '警告信息',
          message: '该物料存在货物状态受限，请勿重复操作',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else {
        this.paramList = this.multipleTable[0]
        this.paramList.isDel = 0
        this.paramList.limitType = 2
        this.paramList.materielId = this.paramList.id
        this.paramList.modifierCode = this.$store.state.userInfo.code
        this.paramList.modifierName = this.$store.state.userInfo.name
        this.paramList.createUserCode = this.$store.state.userInfo.code
        this.paramList.createUserName = this.$store.state.userInfo.name
      }
      axios
        .post('/api/b04wms/storeLimit/insertStoreLimit', this.paramList)
        .then(res => {
          this.handleSearch()
          this.$notify({
            type: 'success',
            message: '添加成功!',
            position: 'bottom-right'
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '添加失败',
            position: 'bottom-right'
          })
        })
    },
    /* 删除超期受限 */
    readyDelete2() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable[0].cqsx === '否') {
        this.$notify({
          title: '警告信息',
          message: '存在未受限物料，请重新选择',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else {
        const selectLength = this.multipleTable.length
        const listmap = []
        const select = this.multipleTable
        for (let i = 0; i < selectLength; i++) {
          const obj = {
            materielId: select[i].id,
            modifierCode: this.$store.state.userInfo.code,
            modifierName: this.$store.state.userInfo.name,
            limitType: 2
          }
          listmap.push(obj)
        }
        axios
          .put('/api/b04wms/storeLimit/deleteStoreLimit', listmap)
          .then(res => {
            this.handleSearch()
            this.$notify({
              type: 'success',
              message: '删除成功!',
              position: 'bottom-right'
            })
          })
          .catch(() => {
            this.$notify({
              type: 'success',
              message: '添加失败!',
              position: 'bottom-right'
            })
          })
      }
    },
    /* 添加状态受限 */
    onAddDialog3() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable[0].hwztsx === '是') {
        this.$notify({
          title: '警告信息',
          message: '该物料存在货物状态受限，请勿重复操作',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else {
        this.paramList = this.multipleTable[0]
        this.paramList.isDel = 0
        this.paramList.limitType = 3
        this.paramList.materielId = this.paramList.id
        this.paramList.modifierCode = this.$store.state.userInfo.code
        this.paramList.modifierName = this.$store.state.userInfo.name
        this.paramList.createUserCode = this.$store.state.userInfo.code
        this.paramList.createUserName = this.$store.state.userInfo.name
      }
      axios
        .post('/api/b04wms/storeLimit/insertStoreLimit', this.paramList)
        .then(res => {
          this.handleSearch()
          this.$notify({
            type: 'success',
            message: '添加成功!',
            position: 'bottom-right'
          })
        })
        .catch(() => {
          this.$notify({
            type: 'info',
            message: '添加失败!',
            position: 'bottom-right'
          })
        })
    },
    /* 删除状态受限 */
    readyDelete3() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else if (this.multipleTable[0].hwztsx === '否') {
        this.$notify({
          title: '警告信息',
          message: '存在未受限物料，请重新选择',
          type: 'error',
          position: 'bottom-right'
        })
        return
      } else {
        const selectLength = this.multipleTable.length
        const listmap = []
        const select = this.multipleTable
        for (let i = 0; i < selectLength; i++) {
          const obj = {
            materielId: select[i].id,
            modifierCode: this.$store.state.userInfo.code,
            modifierName: this.$store.state.userInfo.name,
            limitType: 3
          }
          listmap.push(obj)
        }
        axios
          .put('/api/b04wms/storeLimit/deleteStoreLimit', listmap)
          .then(res => {
            this.handleSearch()
            this.$notify({
              type: 'success',
              message: '删除成功!',
              position: 'bottom-right'
            })
          })
          .catch(() => {
            this.$notify({
              type: 'info',
              message: '删除失败!',
              position: 'bottom-right'
            })
          })
      }
    },
    handleSizeChange: function(val) {
      this.maSys.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.maSys.page = val
      this.handleSearch()
    }
  }
}
</script>
