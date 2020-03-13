<template>
  <div>
    <div class="g_inputForm">
      园区名称：
      <el-select v-model="searchParkName" placeholder="请选择园区">
        <el-option
          v-for="item in allParkName"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        />
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      省份：
      <el-select v-model="searchProvince" placeholder="请选择省份">
        <el-option v-for="item in allProvince" :key="item.cnValue" :label="item.cnValue" :value="item.cnValue" />
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      市：
      <el-select v-model="searchCity" placeholder="请选择市区">
        <el-option v-for="item in allCity" :key="item" :label="item" :value="item" />
      </el-select>
      <br>
      <br>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="findPark">查询</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="parkReset">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="addPark">添加</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="editPark">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deletePark()">删除</el-button>
    </div>
    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <!-- 园区名称 -->
      <el-table-column label="园区名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 所在省市 -->
      <el-table-column label="所在省市" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Column_15 }}</span>
        </template>
      </el-table-column>
      <!-- 详细地址 -->
      <el-table-column label="详细地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.detail_address }}</span>
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
      <!-- 备注信息 -->
      <el-table-column label="备注信息" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件区 -->
    <el-pagination
      style="float:right"
      :current-page="page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="rows"
      :total="resultlength"
      layout="total,sizes,prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'TestTable',
  data() {
    return {
      searchParkName: '', // 搜索园区名称
      searchProvince: '', // 搜索省份
      searchCity: '', // 搜索市区
      tableData: [], // 后台数据
      selectid: [], // 选中表单数据
      allParkName: [], // 所有园区名称
      allProvince: [],
      allCity: [],
      page: 1,
      rows: 10,
      resultlength: 10
    }
  },

  watch: {
    searchProvince: function() {
      this.searchCity = ''
      const array2 = []
      this.allProvince.forEach((item, index) => {
        if (item.cnValue === this.searchProvince) {
          item.children.forEach((item2, index) => {
            array2.push(item2.cnValue)
          })
        }
      })
      this.allCity = array2
    }
  },
  // 用于数据初始化
  created: function() {
    this.parkInit()

    this.$axios({
      method: 'get',
      url: '/api/a04ds/datastandard/findProviceTree '
    }).then(response => {
      this.allProvince = response.data.resultData.children
    })

    // 园区文件的获取
    const list = {}
    list.page = this.page
    list.rows = this.rows
    this.$axios({
      method: 'get',
      url: '/api/b03res/packmanage/findallpark',
      params: list
    }).then(response => {
      this.allParkName = response.data.resultMap.rows
    })
  },

  // 获取表单数据
  methods: {
    // indexMethod(index) {
    //   return index + 1;
    // },

    handleSelectionChange(val) {
      this.selectid = val
      // console.log(this.multipleTable)
    },

    // 搜索框重置
    parkReset: function() {
      this.searchParkName = ''
      this.searchProvince = ''
      this.searchCity = ''
      this.parkInit()
    },

    // 添加园区
    addPark: function() {
      this.$router.push({
        name: 'addPark'
      })
    },

    // 更新园区
    editPark: function() {
      if (this.selectid.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.selectid.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '最多只能更新一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({
          name: 'editPark',
          params: { resultData: this.selectid[0] }
        })
      }
    },

    // 园区的条件查询
    findPark: function() {
      if (
        this.searchParkName === '' &&
        this.searchProvince === '' &&
        this.searchCity === ''
      ) {
        this.parkInit()
      } else {
        const list = {}
        list.name = this.searchParkName
        list.column_15 = this.searchProvince
        list.column_17 = this.searchCity
        list.page = this.page
        list.rows = this.rows
        this.$axios({
          method: 'get',
          url: '/api/b03res/packmanage/findallparkbyid',
          params: list
        }).then(result => {
          this.tableData = result.data.resultMap.resultData
        })
      }
    },

    // 园区的全部查找
    parkInit: function() {
      const list = {}
      list.page = this.page
      list.rows = this.rows
      this.$axios({
        method: 'get',
        url: '/api/b03res/packmanage/findallpark',
        params: list
      }).then(response => {
        this.tableData = response.data.resultMap.rows
        this.resultlength = response.data.resultMap.total
      })
    },

    // 园区的删除
    deletePark: function() {
      if (this.selectid.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除所选园区，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const array = []
          for (let i = 0; i < this.selectid.length; i++) {
            const map = {}
            map.id = this.selectid[i].id
            array[i] = map
          }
          this.$axios({
            method: 'post',
            url: '/api/b03res/packmanage/deletepark',
            data: array
          }).then(result => {
            if (result.data.status === 1) {
              this.$notify({
                title: '成功',
                message: '园区删除成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.parkInit()
            }
          })
        }).catch(() => {
          this.$notify({
            title: '提示',
            message: '已取消删除',
            type: 'info',
            position: 'bottom-right'
          })
        })
      }
    },

    handleSizeChange: function(size) {
      this.rows = size
      this.parkInit()
    },
    handleCurrentChange: function(page) {
      this.page = page
      this.parkInit()
    }

  }
}
</script>
