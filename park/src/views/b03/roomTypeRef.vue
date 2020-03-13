<template>
  <div>
    <div class="g_inputForm">
      园区名称：
      <el-select v-model="searchParkName" placeholder="请选择园区">
        <el-option
          v-for="item in allParkName"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      库房名称：
      <el-select v-model="searchStorageroom" placeholder="请选择库房">
        <el-option
          v-for="item in allStorageroomName"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      品类名称：
      <el-select v-model="searchRoomTypeName" placeholder="请选择品类">
        <el-option
          v-for="item in allRoomTypeName"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <br>
      <br>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="findRoomTypeById">查询</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="roomTypeReset">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="addStorageroom">添加</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteRoomType">删除</el-button>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <!-- 序号 -->
      <!-- <el-table-column
        type="index"
        :index="indexMethod"
        label="序号"
      /> -->
      <!-- 园区名称 -->
      <el-table-column label="园区名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.parkName }}</span>
        </template>
      </el-table-column>
      <!-- 库房名称 -->
      <el-table-column label="库房名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.storageroomName }}</span>
        </template>
      </el-table-column>
      <!-- 品类名称 -->
      <el-table-column label="品类名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roomTypeName }}</span>
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
      searchStorageroom: '', // 搜索库房名称
      searchRoomTypeName: '', // 搜索品类名称
      tableData: [], // 后台数据
      selectid: [], // 选中表单数据
      allCity: [],
      page: 1,
      rows: 10,
      resultlength: 10,
      allParkName: [],
      allStorageroomName: [],
      allRoomTypeName: []

    }
  },
  // 用于数据初始化
  created: function() {
    this.findRoomType()
  },

  // 获取表单数据
  methods: {
    // 序号
    // indexMethod: function(index) {
    //   return index + 1
    // },

    handleSelectionChange(val) {
      this.selectid = val
      // console.log(this.multipleTable)
    },

    // 搜索框重置
    roomTypeReset: function() {
      this.searchParkName = ''
      this.searchStorageroom = ''
      this.searchRoomTypeName = ''
      this.findRoomType()
    },

    // 添加库房
    addStorageroom: function() {
      this.$router.push({
        name: 'addRoomTypeRef'
      })
    },

    // 品类的条件查询
    findRoomTypeById: function() {
      if (
        this.searchParkName === '' &&
        this.searchStorageroom === '' &&
        this.searchRoomTypeName === ''
      ) {
        this.findRoomType()
      } else {
        const list = {}
        list.parkName = this.searchParkName
        list.roomName = this.searchStorageroom
        list.roomTypeName = this.searchRoomTypeName
        list.page = this.page
        list.rows = this.rows
        this.$axios({
          method: 'get',
          url: '/api/b03res/roomtype/findallroomtypebyid',
          params: list
        }).then(result => {
          this.tableData = result.data.resultMap.resultData
        })
      }
    },

    // 品类的全部查找
    findRoomType: function() {
      // const array1 = new Set()
      // const array2 = new Set()
      // const array3 = new Set()
      const list = {}
      list.page = this.page
      list.rows = this.rows
      this.$axios({
        method: 'get',
        url: '/api/b03res/roomtype/findallroomtype',
        params: list
      }).then(response => {
        this.tableData = response.data.resultMap.rows
        this.resultlength = response.data.resultMap.total
        // response.data.resultMap.rows.forEach((item, index) => {
        //   array1.add(item.parkName)
        //   array2.add(item.storageroomName)
        //   array3.add(item.roomTypeName)
        // })
        // this.allParkName = array1
        // this.allStorageroomName = array2
        // this.allRoomTypeName = array3
      })

      // 库房下拉框数据填入
      this.$axios({
        method: 'get',
        url: '/api/b03res/roomtype/findAllStoragerrom'
      }).then(response => {
        if (response.data.status === 1) {
          this.allStorageroomName = response.data.resultDate
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
      // 园区下拉框数据加入
      this.$axios({
        method: 'get',
        url: '/api/b03res/roomtype/findAllPark'
      }).then(response => {
        if (response.data.status === 1) {
          this.allParkName = response.data.resultDate
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
      // 品类下拉框数据填入
      this.$axios.get('/api/b02pdm/type/findalltype').then(res => {
        if (res.data.status === 1) {
          this.allRoomTypeName = res.data.resultData
        } else {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }

          this.notifyInstance = this.$notify({
            title: '错误',
            message: '后台查询出错',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
    },

    // 库房的删除
    deleteRoomType: function() {
      if (this.selectid.length === 0) {
        this.$notify({
          title: '提示',
          message: '请至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除所选品类，是否继续？', '提示', {
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
            url: '/api/b03res/roomtype/deleteroomtype',
            data: array
          }).then(result => {
            if (result.data.status === 1) {
              this.$notify({
                title: '成功',
                message: '删除园区成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.findRoomType()
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
      this.findRoomType()
    },
    handleCurrentChange: function(page) {
      this.page = page
      this.findRoomType()
    }
  }
}
</script>
