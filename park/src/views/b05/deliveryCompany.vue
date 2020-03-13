<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form class="deliveryCompany_form">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="配送单位：" prop="name">
              <el-select
                v-model.trim="name"
                class="g_elFormSelect"
                placeholder="请选择单位名称"
                clearable
              >
                <el-option
                  v-for="item in deliveryOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="省份：" prop="searchProvince">

              <el-select
                v-model.trim="searchProvince"
                class="g_elFormSelect"
                placeholder="请选择省份"
                clearable
              >
                <el-option
                  v-for="item in proviceData"
                  :key="item.id"
                  :label="item.cnValue"
                  :value="item.cnValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="市：" prop="searchCity">

              <el-select
                v-model.trim="searchCity"
                class="g_elFormSelect"
                placeholder="请选择市"
                clearable
              >
                <el-option
                  v-for="item in cityData"
                  :key="item.id"
                  :label="item.cnValue"
                  :value="item.cnValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="锁定状态:" prop="status">

              <el-switch
                v-model="status"
                on-value="1"
                off-value="0"
                @change="changeStatus"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="handleEdit">修改</el-button>
      <el-button type="primary" plain icon="el-icon-lock" @click="handleLock">锁定</el-button>
      <el-button type="primary" plain icon="el-icon-unlock" @click="handleUnlock">解锁</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="readyDelete">刪除</el-button>
    </div>
    <el-table
      ref="deliveryTable"
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      :row-key="getRowKeys"
      @selection-change="handleSelectionChange"
    >
      <!-- 勾选框 -->
      <el-table-column class="g_tableSelection" type="selection" :reserve-selection="true" align="center" />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" :index="table_index" align="center" width="60px" />
      <!-- 配送单位ID -->
      <el-table-column v-if="show" label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <!-- 配送单位编号 -->
      <el-table-column label="单位编号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.companyNo }}</span>
        </template>
      </el-table-column>
      <!-- 配送单位名称 -->
      <el-table-column label="单位名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 电话 -->
      <el-table-column label="电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.telephone }}</span>
        </template>
      </el-table-column>
      <!-- 网址 -->
      <el-table-column label="网址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.website }}</span>
        </template>
      </el-table-column>
      <!--省编码-->
      <el-table-column v-if="show" label="省编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <!-- 所在省 -->
      <el-table-column label="所在省" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Column_15 }}</span>
        </template>
      </el-table-column>
      <!--市编码-->
      <el-table-column v-if="show" label="市编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.city_code }}</span>
        </template>
      </el-table-column>
      <!-- 所在市 -->
      <el-table-column label="所在市" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Column_17 }}</span>
        </template>
      </el-table-column>
      <!-- 详细地址 -->
      <el-table-column v-if="show" label="详细地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.detail_address }}</span>
        </template>
      </el-table-column>
      <!-- 地理位置经度 -->
      <el-table-column v-if="show" label="地理位置经度" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lng }}</span>
        </template>
      </el-table-column>
      <!-- 地理位置维度 -->
      <el-table-column v-if="show" label="地理位置维度" align="center">
        <template slot-scope="{row}">
          <span>{{ row.lat }}</span>
        </template>
      </el-table-column>
      <!-- 联系人姓名 -->
      <el-table-column label="联系人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.concateName }}</span>
        </template>
      </el-table-column>
      <!-- 联系人电话 -->
      <el-table-column label="联系人电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.concatePhone }}</span>
        </template>
      </el-table-column>
      <!-- 联系人邮编 -->
      <el-table-column v-if="show" label="联系人邮编" align="center">
        <template slot-scope="{row}">
          <span>{{ row.concateZipCode }}</span>
        </template>
      </el-table-column>
      <!-- 联系人备注 -->
      <el-table-column v-if="show" label="联系人备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.concateRemark }}</span>
        </template>
      </el-table-column>
      <!-- 联系人邮箱 -->
      <el-table-column label="联系人邮箱" align="center">
        <template slot-scope="{row}">
          <span>{{ row.concateEmail }}</span>
        </template>
      </el-table-column>
      <!-- 更改人编码 -->
      <el-table-column v-if="show" label="更改人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierCode }}</span>
        </template>
      </el-table-column>
      <!-- 更改人姓名 -->
      <el-table-column v-if="show" label="更改人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierName }}</span>
        </template>
      </el-table-column>
      <!-- 更改时间 -->
      <el-table-column v-if="show" label="更改时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime }}</span>
        </template>
      </el-table-column>
      <!-- 创建人编码 -->
      <el-table-column v-if="show" label="创建人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserCode }}</span>
        </template>
      </el-table-column>
      <!-- 创建人名称 -->
      <el-table-column v-if="show" label="创建人名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column v-if="show" label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <!-- 乐观锁 -->
      <el-table-column v-if="show" label="乐观锁" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <!-- 是否删除 -->
      <el-table-column v-if="show" label="是否删除" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isDel }}</span>
        </template>
      </el-table-column>
      <!--锁定状态-->
      <el-table-column label="锁定状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_lock ===1?'已锁定':'未锁定' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="g_pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
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
  name: 'DeliveryCompany',
  data() {
    return {
      name: '',
      searchProvince: '',
      searchCity: '',
      status: false,
      is_lock: 0,
      // 省份列表
      proviceData: [],
      // 市列表
      cityData: [],
      // 配送单位名称
      deliveryOptions: [],
      show: false,
      currentPage: 1,
      total: 100,
      pageSize: 10,
      tableData: [],
      multipleTable: [],
      // 抓到的后台错误编码
      EC00001: '配送单位信息查询出错（后台错误）！',
      EC00002: '配送单位信息删除出错（后台错误）！',
      EC00003: '配送单位信息修改出错（后台错误）！',
      EC00004: '配送单位信息添加出错（后台错误）！',
      EC00005: '查询配送单位名称（后台错误）！',
      EC00006: '锁定配送单位数据（后台错误）！',
      EC00007: '解锁配送单位数据（后台错误）！',
      msg: ''
    }
  },
  computed: { useInfo() { return this.$store.state.userInfo } },
  watch: {
    searchProvince: function() {
      this.searchCity = ''
      this.cityData = ''
      this.proviceData.forEach((item, index) => {
        if (item.cnValue === this.searchProvince) {
          this.cityData = item.children
        }
      })
    }
  },
  created() {
    // 查询数据
    this.search()
    // 获取配送单位下拉列表
    this.findDeliveryName()
    // 获得省份列表
    this.getProvince()
  },
  methods: {
    // 清除所有勾选行
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => { this.$refs.deliveryTable.toggleRowSelection(row) })
      } else {
        this.$refs.deliveryTable.clearSelection()
      }
    },
    // 根据id表示每一行，为后面跨页勾选区分选中行
    getRowKeys(row) {
      return row.id
    },
    // 获取锁定状态
    changeStatus: function(val) {
      if (val === false) {
        this.is_lock = 0
      } else {
        this.is_lock = 1
      }
    },
    // 获得省份列表
    getProvince() {
      axios.get('/api/a04ds/datastandard/findProviceTree').then((province) => {
        for (let i = 0; i < province.data.resultData.children.length; i++) {
          this.proviceData[i] = province.data.resultData.children[i]
          this.cityData = ''
        }
      })
    },
    // 分页按条件查询数据
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        name: this.name,
        Column_15: this.searchProvince,
        Column_17: this.searchCity,
        is_lock: this.is_lock
      }
    },
    // 切换每页条数
    handleSizeChange: function(val) {
      this.pageSize = val
      this.search()
    },
    // 切换页面
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
    },
    // 序号
    table_index(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    // 获取勾选list
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 查询配送单位数据
    search: function() {
      axios.get('/api/b05lms/deliverycompany/findDeliveryComByCondition',
        { params: this.getParamMap() }).then((response) => {
        if (response.data.status === 1) {
          this.tableData = response.data.resultData.rows // 用list接收这个数据
          this.total = response.data.resultData.total
        } else {
          this.tableData = response.data.resultData
          this.msg = response.data.msg
          if (this.msg === 'EC00001') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: this.EC00001,
              type: 'error',
              position: 'bottom-right'
            })
          }
        }
      })
    },
    // 查询配送单位名称
    findDeliveryName: function() {
      axios.get('/api/b05lms/deliverycompany/findAllDeliveryCompany').then((response) => {
        if (response.data.status === 1) {
          this.deliveryOptions = response.data.resultData
        } else {
          this.tableData = response.data.resultData
          this.msg = response.data.msg
          if (this.msg === 'EC00005') {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: this.EC00005,
              type: 'error',
              position: 'bottom-right'
            })
          }
        }
      })
    },
    // 重置查询框
    handleRefresh: function() {
      this.name = ''
      this.searchProvince = ''
      this.searchCity = ''
      this.status = false
      this.is_lock = 0
      this.toggleSelection()
      // 查询数据
      this.search()
    },
    // 点击查询按钮查询数据
    handleFilter: function() {
      this.toggleSelection()
      this.search()
    },
    // 添加
    handleAdd: function() {
      this.$router.push('deliveryCompanyAdd')
    },
    // 修改
    handleEdit: function() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.multipleTable.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        if (this.multipleTable[0].is_lock === true) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误信息',
            message: '该数据已被锁定，无法修改！',
            type: 'error',
            position: 'bottom-right'
          })
        } else {
          this.$router.push({ name: 'deliveryCompanyEdit', params: { deliveryCompanys: this.multipleTable[0] }})
        }
      }
    },
    // 锁定
    handleLock: function() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将锁定该批数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        // console.log(this.multipleTable)
        // let selected = ''
        // this.tableData.forEach((item1, index1) => {
        //   this.multipleTable.forEach((item2, index2) => {
        //     console.log(item2.is_lock)
        //     // 勾选行已是锁定状态
        //     if (item.is_lock === true) {
        //       if (selected === '') {
        //         selected += index + 1
        //       } else {
        //         selected += ',' + (index + 1)
        //       }
        //     }
        //   })
        // })
          const selectLength = this.multipleTable.length
          const select = this.multipleTable
          let selected = ''
          for (let i = 0; i < selectLength; i++) {
            console.log(this.tableData.indexOf(select[i]) + 1) // 获取选中行序号
            // 勾选行已是锁定状态
            if (select[i].is_lock === true) {
              if (selected === '') {
                selected += this.tableData.indexOf(select[i]) + 1
              } else {
                selected += ',' + (this.tableData.indexOf(select[i]) + 1)
              }
            }
          }
          if (selected) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '序号为' + selected + '的配送单位是锁定状态，无法继续锁定，请重新选择！',
              type: 'error',
              position: 'bottom-right'
            })
          } else {
            axios.put('/api/b05lms/deliverycompany/updateIsLockTrue', { modifierCode: this.$store.state.userInfo.code,
              modifierName: this.$store.state.userInfo.name, list: this.multipleTable }).then((res) => {
              if (res.data.status === 1) {
                if (this.notifyInstance) {
                  this.notifyInstance.close()
                }
                this.notifyInstance = this.$notify({
                  type: 'success',
                  message: '锁定成功！',
                  position: 'bottom-right'
                })
              } else {
                // 如果后台错误，则弹出提示
                this.msg = res.data.msg
                if (this.msg === 'EC00006') {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '错误信息',
                    message: this.EC00006,
                    type: 'error',
                    position: 'bottom-right'
                  })
                }
              }
              this.currentPage = 1
              this.search()
              this.toggleSelection()
            })
          }
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消锁定',
            position: 'bottom-right'
          })
        })
      }
    },
    // 解锁
    handleUnlock: function() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据！',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将解锁该批数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const select = this.multipleTable
          let selected = ''
          for (let i = 0; i < selectLength; i++) {
            // console.log(this.tableData.indexOf(select[i]) + 1) // 获取选中行序号
            // 勾选行已是解锁状态
            if (select[i].is_lock === false) {
              if (selected === '') {
                selected += this.tableData.indexOf(select[i]) + 1
              } else {
                selected += ',' + (this.tableData.indexOf(select[i]) + 1)
              }
            }
          }
          if (selected) {
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              title: '错误信息',
              message: '序号为' + selected + '的配送单位是解锁状态，无法继续解锁，请重新选择！',
              type: 'error',
              position: 'bottom-right'
            })
          } else {
            axios.put('/api/b05lms/deliverycompany/updateIsLockFalse', { modifierCode: this.$store.state.userInfo.code,
              modifierName: this.$store.state.userInfo.name, list: this.multipleTable }).then((res) => {
              if (res.data.status === 1) {
                if (this.notifyInstance) {
                  this.notifyInstance.close()
                }
                this.notifyInstance = this.$notify({
                  type: 'success',
                  message: '解锁成功！',
                  position: 'bottom-right'
                })
              } else {
                // 如果后台错误，则弹出提示
                this.msg = res.data.msg
                if (this.msg === 'EC00007') {
                  if (this.notifyInstance) {
                    this.notifyInstance.close()
                  }
                  this.notifyInstance = this.$notify({
                    title: '错误信息',
                    message: this.EC00007,
                    type: 'error',
                    position: 'bottom-right'
                  })
                }
              }
              this.currentPage = 1
              this.search()
              this.toggleSelection()
            })
          }
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消解锁',
            position: 'bottom-right'
          })
        })
      }
    },
    // 删除
    readyDelete: function() {
      if (this.multipleTable.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'warning',
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
            const ids = {}
            ids.id = select[i].id
            listmap[i] = ids
          }
          axios.put('/api/b05lms/deliverycompany/logicDelDeliveryCompany', { modifierCode: this.$store.state.userInfo.code,
            modifierName: this.$store.state.userInfo.name, list: listmap }).then((res) => {
            this.search()
          })
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'success',
            message: '删除成功',
            position: 'bottom-right'
          })
        }).catch(() => {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            type: 'info',
            message: '已取消删除',
            position: 'bottom-right'
          })
        })
      }
    }
  }
}
</script>

<style>
.el-form-item__label {
    font-size: 16px;
    color: #606266;
    font-weight: normal;
}

.deliveryCompany_form {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
