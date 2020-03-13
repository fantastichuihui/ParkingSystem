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
          v-for="item in allRoomName"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <br>
      <br>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" class="dialogstore">
      <iframe style="width:660px;height:405px" src="http://sp.hs.nat123.cc:30491/stream_simple.html" />
    </el-dialog>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="findStorageroomById">查询</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="storageroomReset">重置</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="addStorageroom">添加</el-button>
      <el-button type="primary" plain icon="el-icon-edit" @click="editStorageroom">修改</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteStorageroom">删除</el-button>
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
      <!-- 园区名称 -->
      <el-table-column type="index" label="序号" width="60px" align="center" />
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
      <!-- 库房编码 -->
      <el-table-column label="库房编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <!-- 使用状态 -->
      <el-table-column label="使用状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.state }}</span>
        </template>
      </el-table-column>
      <!-- 负责人姓名 -->
      <el-table-column label="负责人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.chargeName }}</span>
        </template>
      </el-table-column>
      <!-- 负责人联系电话 -->
      <el-table-column label="负责人联系电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobilePhone }}</span>
        </template>
      </el-table-column>
      <!-- 备注信息 -->
      <el-table-column label="备注信息" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="监控" align="center">
        <template>
          <el-button v-show="isShow" type="primary" plain icon="el-icon-tickets" @click="handleDialog()" />
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
      dialogFormVisible: false,
      isShow: true,
      searchParkName: '', // 搜索园区名称
      searchStorageroom: '', // 搜索库房名称
      tableData: [], // 后台数据
      selectid: [], // 选中表单数据
      allStorageroomName: [], // 所有园区名称
      page: 1,
      rows: 10,
      resultlength: 10,
      allParkName: [],
      allRoomName: []
    }
  },

  // 用于数据初始化
  created: function() {
    this.findStorageroom()

    // 库房文件的获取
    // const list = {}
    // list.page = this.page
    // list.rows = this.rows
    // const array1 = new Set()
    // const array2 = new Set()
    // this.$axios({
    //   method: 'get',
    //   url: '/api/b03res/storageroom/find',
    //   params: list
    // }).then(response => {
    //   this.allStorageroomName = response.data.resultData.datalist
    //   response.data.resultData.datalist.forEach((item, index) => {
    //     array1.add(item.parkName)
    //     array2.add(item.storageroomName)
    //   })
    //   this.allParkName = array1
    //   this.allRoomName = array2
    // })

    // 库房下拉框数据填入
    this.$axios({
      method: 'get',
      url: '/api/b03res/storageroom/findAllStoragerrom'
    }).then(response => {
      if (response.data.status === 1) {
        this.allRoomName = response.data.resultDate
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
      url: '/api/b03res/storageroom/findAllPark'
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
  },

  methods: {

    handleSelectionChange(val) {
      this.selectid = val
    },

    // 搜索框重置
    storageroomReset: function() {
      this.searchParkName = ''
      this.searchStorageroom = ''
      this.findStorageroom()
    },

    // 添加库房
    addStorageroom: function() {
      this.$router.push({
        name: 'addStorageroom'
      })
    },

    // 更新库房
    editStorageroom: function() {
      if (this.selectid.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '提示',
          message: '请至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.selectid.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '提示',
          message: '一次只能修改一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({
          name: 'editStorageroom',
          params: { resultData: this.selectid[0] }
        })
      }
    },
    handleDialog: function() {
      this.dialogFormVisible = true
    },
    // 库房的条件查询
    findStorageroomById: function() {
      if (this.searchParkName === '' && this.searchStorageroom === '') {
        this.findStorageroom()
      } else {
        const list = {}
        list.parkName = this.searchParkName
        list.roomName = this.searchStorageroom
        list.page = this.page
        list.rows = this.rows
        this.$axios({
          method: 'get',
          url: '/api/b03res/storageroom/findallstorageroombyid',
          params: list
        }).then(result => {
          this.tableData = result.data.resultMap.resultData
        })
      }
    },

    // 库房的全部查找
    findStorageroom: function() {
      const list = {}
      list.page = this.page
      list.rows = this.rows
      this.$axios({
        method: 'get',
        url: '/api/b03res/storageroom/find',
        params: list
      }).then(response => {
        this.tableData = response.data.resultData.datalist
        this.resultlength = response.data.resultData.total
      })
    },

    // 库房的删除
    deleteStorageroom: function() {
      if (this.selectid.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '提示',
          message: '请至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除所选库房，是否继续？', '提示', {
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
            url: '/api/b03res/storageroom/deletestorageroom',
            data: array
          }).then(result => {
            if (result.data.status === 1) {
              this.$notify({
                title: '成功',
                message: '删除库房成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.findStorageroom()
            }
          })
        }).catch(() => {
          this.$notify({
            title: '提示',
            message: '已取消删除',
            type: 'warning',
            position: 'bottom-right'
          })
        })
      }
    },

    handleSizeChange: function(size) {
      this.rows = size
      this.findStorageroom()
    },
    handleCurrentChange: function(page) {
      this.page = page
      this.findStorageroom()
    }
  }
}
</script>
<style>
.dialogstore {
            height:700px;
            width: 1500px;
            position: absolute;
            align-items: center;
            /* top:50%;
            left:50%;
            transform: translate(-50%,-50%) */
}
</style>
