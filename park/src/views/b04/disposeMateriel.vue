<template>
  <div g_container>
    <div class="g_inputForm">
      <div class="g_button">
        <el-button type="primary" plain icon="el-icon-search" @click="returnPlanPallet">返回</el-button>
        <el-button type="primary" plain icon="el-icon-search" @click="handleEdit">占用时间</el-button>
        <el-button type="primary" plain icon="el-icon-search" @click="save">确认配置</el-button>
      </div>
      <div>
        托盘列表
        <el-table
          :data="tableData"
          class="g_table"
          show-overflow-tooltip
          :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
          border
          @selection-change="handleSelectionChange"
        >
          <!-- 全选 -->
          <el-table-column class="g_tableSelection" type="selection" />
          <!-- 序号 -->
          <el-table-column label="序号" type="index" align="center" width="60px" />
          <!-- 角色名称 -->
          <el-table-column v-if="false" label="托盘id" align="center">
            <template slot-scope="{row}">
              <span>{{ row.palletId }}</span>
            </template>
          </el-table-column>
          <!-- 托盘名 -->
          <el-table-column label="托盘名" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="托盘状态" align="center">
            <template slot-scope="{row}">
              <span>{{ row.palletState ==1 ? '待提货' : row.palletState==2 ? '提货中' : '提货完成' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="托盘启用时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.palletStartTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="托盘结束时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.palletEndTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已配置物料" align="center">
            <template slot-scope="{row}">
              <span>{{ row.count }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最大能力" align="center">
            <template slot-scope="{row}">
              <span>{{ row.maxability }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="float: right;">
        <el-pagination
          :current-page.sync="planPallet.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="planPallet.rows"
          layout="sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <div style="margin-top: 100px;">
        <div style="width:40%;float: left;">
          <div>
            可选物料
            <el-table
              :data="notSelectedData"
              class="g_table"
              :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
              border
              @selection-change="handleSelectionChange1"
            >
              <!-- 全选 -->
              <el-table-column class="g_tableSelection" type="selection" />
              <!-- 角色id(hidden) -->
              <el-table-column label="序号" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.id }}</span>
                </template>
              </el-table-column>
              <!-- 角色名称 -->
              <el-table-column label="物料号" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.matNo }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物料名称" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物料品类" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.kind }}</span>
                </template>
              </el-table-column>
              <el-table-column label="占用能力" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.ability }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="float: right;">
            <el-pagination
              :current-page.sync="notSelectedMateriel.page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="notSelectedMateriel.rows"
              layout="sizes, prev, pager, next"
              :total="total1"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
        <div style="width:20%;float: left;">
          <div style="text-align: center;margin-bottom: auto;">
            <el-button type="primary" @click="toRight"> ==》</el-button>
            <el-button type="primary" @click="toLeft">《== </el-button>
          </div>
        </div>

        <div style="width:40%;float: left;">
          <div>
            已选物料
            <el-table
              :data="selectedData"
              class="g_table"
              :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
              border
              @selection-change="handleSelectionChange2"
            >
              <!-- 全选 -->
              <el-table-column class="g_tableSelection" type="selection" />
              <!-- 角色id(hidden) -->
              <el-table-column label="序号" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.id }}</span>
                </template>
              </el-table-column>
              <!-- 角色名称 -->
              <el-table-column label="物料号" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.matNo }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物料名称" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="物料品类" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.kind }}</span>
                </template>
              </el-table-column>
              <el-table-column label="占用能力" align="center">
                <template slot-scope="{row}">
                  <span>{{ row.ability }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div style="float: right;">
            <el-pagination
              :current-page.sync="selectedMateriel.page"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="selectedMateriel.rows"
              layout="sizes, prev, pager, next"
              :total="total2"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>

    </div>
    <el-dialog title="添加" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="offDialog">
      <!-- 添加的表单 -->
      <el-form ref="paramList" :rules="rules" :model="paramList" label-width="100px">
        <el-form-item label="托盘计划日期" style="width: 100%;">
          <el-date-picker
            v-model="paramList.daterange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="---"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogAddFormVisible = false">取消</el-button>
          <el-button type="primary" @click="edit()">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      planPallet: {
        id: '',
        palletId: '',
        planId: '',
        name: '',
        status: '',
        palletStartTime: '',
        palletEndTime: '',
        page: 1,
        rows: 10
      },
      notSelectedMateriel: {
        id: '',
        palletId: '',
        planId: '',
        matNo: '',
        name: '',
        kind: '',
        ability: 0,
        categoryList: [],
        page: 1,
        rows: 10
      },
      selectedMateriel: {
        id: '',
        palletId: '',
        planId: '',
        matNo: '',
        name: '',
        kind: '',
        ability: 0,
        page: 1,
        rows: 10
      },
      modifierCode: this.$store.state.userInfo.code,
      modifierName: this.$store.state.userInfo.name,
      total: 0,
      total1: 0,
      total2: 0,
      sum: 0,
      multipleTable: [],
      multipleTable1: [],
      multipleTable2: [],
      ids: [],
      dialogFormVisible: false,
      notSelectedData: [],
      selectedData: [],
      tableData: [],
      rules: {},
      paramList: {
        id: '',
        palletId: '',
        planId: '',
        name: '',
        status: '',
        isDel: '',
        version: '',
        palletStartTime: '',
        palletEndTime: '',
        daterange: []
      },
      countData: []
    }
  },
  /* 向后台发送数据 */
  created() {
    this.handleSearch()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleTable = val
      this.addMateriel()
    },
    addMateriel() {
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
        /* this.$refs.multipleTable.clearSelection() */
      } else {
        // 从b04 通过palletId拿到一批物料的信息
        this.notSelectedMateriel.palletId = this.multipleTable[0].palletId
        axios.get('/api/b04wms/planPallet/selectMaterielByPalletId', {
          params: this.notSelectedMateriel
        }).then((result) => {
          this.notSelectedData = result.data.resultData.rows
          this.total = result.data.resultData.total
          // 将拿到的一批物料信息发往 s 拿到palletId 和 一批 能力
          if (result.data !== null) {
            axios.post('/api/s01/planPallet/selectCategoryByPallet',
              this.notSelectedData
            ).then((result) => {
              if (result.data !== null) {
                this.notSelectedData = result.data.resultData.resultData.categoryList
                this.notSelectedMateriel.palletId = result.data.resultData.palletId
              }
            })
          }
        })
      }
    },
    handleSelectionChange1(val) {
      this.multipleTable1 = val
    },
    handleSelectionChange2(val) {
      this.multipleTable2 = val
    },
    toRight() {
      if (this.multipleTable1.length > 0) {
        this.notSelectedData = this.notSelectedData.filter(item => {
          // 在已选中数组中查找当前数据,如果不是-1,证明在已选中里存在
          if (this.multipleTable1.indexOf(item) !== -1) {
            // 则在左边的数据列表里过滤掉当前数据
            return false
          } else {
            // 则不过滤(保留)
            return true
          }
        })
        // 把左边的所有选中数据都添加到右边
        this.selectedData.push(...this.multipleTable1)
        // }
      } else {
        this.$notify({
          title: '警告信息',
          message: '无可选物料,不可进行此操作',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    toLeft() {
      console.log(this.selectedData)
      if (this.multipleTable2.length > 0) {
        this.selectedData = this.selectedData.filter(item => {
          // 在已选中数组中查找当前数据,如果不是-1,证明在已选中里存在
          if (this.multipleTable2.indexOf(item) !== -1) {
            // 则在左边的数据列表里过滤掉当前数据
            return false
          } else {
            // 则不过滤(保留)
            return true
          }
        })
        // 把左边的所有选中数据都添加到右边
        this.notSelectedData.push(...this.multipleTable2)
      } else {
        this.$notify({
          title: '警告信息',
          message: '无已选物料,不可进行此操作',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    save() {
      if (this.selectedData.length > 0) {
        for (var i = 0; i < this.selectedData.length; i++) {
          this.selectedData[i].modifierCode = this.$store.state.userInfo.code
          this.selectedData[i].modifierName = this.$store.state.userInfo.name
          this.selectedData[i].createUserCode = this.$store.state.userInfo.code
          this.selectedData[i].createUserName = this.$store.state.userInfo.name
          this.sum = this.sum + this.selectedData[i].ability
        }
        if (this.sum < this.multipleTable[0].maxability) {
          axios.post('/api/b04wms/planPallet/insertPalletMateriel',
            this.selectedData
          ).then((result) => {
            this.$message({
              type: 'success',
              message: '保存成功!',
              position: 'bottom-right'
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '失败!已取消',
              position: 'bottom-right'
            })
          })
        } else {
          this.$notify({
            title: '警告信息',
            message: '品类能力总和超过托盘能力最大值',
            type: 'error',
            position: 'bottom-right'
          })
        }
      } else {
        this.$notify({
          title: '警告信息',
          message: '无已选物料,不可进行此操作',
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    // 查询
    handleSearch() {
      axios.get('/api/b04wms/planPallet/selectPlanPalletByPage', {
        params: this.planPallet
      }).then((result) => {
        this.tableData = result.data.resultData.rows
        this.total = result.data.resultData.total
        axios.post('/api/b04wms/planPallet/selectMatCountBypalletId',
          this.tableData
        ).then((result) => {
          this.countData = result.data.resultData
          var palParam = {
            palletList: this.countData
          }
          axios.post('/api/s01/planPallet/selectMaxAbilityByPalletId',
            palParam
          ).then((result) => {
            this.countData = result.data.resultData.palletList
            for (var i = 0; i < this.tableData.length; i++) {
              for (var j = 0; j < this.countData.length; j++) {
                if (this.tableData[i].palletId === this.countData[j].palletId) {
                  this.tableData[i].count = this.countData[j].count
                  this.tableData[i].maxability = this.countData[j].maxability
                  this.tableData[i].name = this.countData[j].name
                }
              }
            }
          })
        })
      })
    },
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
        this.onDialog()
        this.paramList = this.multipleTable[0]
      }
    },
    edit() {
      this.paramList.palletStartTime = this.daterange[0]
      this.paramList.palletEndTime = this.daterange[1]
      axios.put('/api/b04wms/planPallet/updatePlanPallet', this.paramList).then((res) => {
        this.handleSearch()
        this.$message({
          type: 'success',
          message: '更新成功!',
          position: 'bottom-right'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消更新',
          position: 'bottom-right'
        })
      })
      this.offDialog()
    },
    // 添加
    returnPlanPallet() {
      this.$router.push('planPallet')
    },
    handleSizeChange: function(val) {
      this.planPallet.rows = val
      this.handleSearch()
    },
    handleCurrentChange: function(val) {
      this.planPallet.page = val
      this.handleSearch()
    },

    handleSizeChange1: function(val) {
      this.notSelectedMateriel.rows = val
      this.handleSearch()
    },
    handleCurrentChange1: function(val) {
      this.notSelectedMateriel.page = val
      this.handleSearch()
    },

    handleSizeChange2: function(val) {
      this.selectedMateriel.rows = val
      this.handleSearch()
    },
    handleCurrentChange2: function(val) {
      this.selectedMateriel.page = val
      this.handleSearch()
    },
    onDialog() {
      this.dialogFormVisible = true
    },
    offDialog() {
      this.dialogFormVisible = false
    }
  }
}
</script>
