<template>
  <div g_container>
    <div class="g_inputForm">
      桶名称：
      <el-input
        v-model.trim="searchName"
        placeholder="请输入内容"
        class="g_input"
        style="width:16%"
        maxlength="15"
        clearable
        @keyup.enter.native="handleFilter"
      />
    </div>

    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="findBucket">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="bucket_dialogFormVisible=true">新建</el-button>
      <el-button type="primary" plain icon="el-icon-search" @click="bucket_findFile()">查看</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="bucket_handleEdit()">清空</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="bucket_deleteBucket()">删除</el-button>
    </div>
    <el-table
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <!-- 桶名称 -->
      <el-table-column label="桶名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bucketName }}</span>
        </template>
      </el-table-column>
      <!-- 桶大小 -->
      <el-table-column label="桶大小" align="center">
        <template slot-scope="{row}">
          <span>{{ row.size }}</span>
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件区 -->
    <el-pagination
      style="float:right"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="tableData.length"
      layout="total,sizes,prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="新建桶" :visible.sync="bucket_dialogFormVisible" width="30%" top="10%" :close-on-click-modal="false" @close="noBucketdialogFormVisible()">
      <el-form :model="form">
        <el-form-item label="桶名称：" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" maxlength="15" placeholder="最大长度为15" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="noBucketdialogFormVisible()">取 消</el-button>
        <el-button type="primary" @click="createBucket">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TestTable',
  data() {
    return {
      searchName: '', // 搜索桶数据
      tableData: [], // 后台数据
      bucket_dialogFormVisible: false,
      form: {
        name: ''
      },
      formLabelWidth: '120px',
      selectid: [],
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  // 用于数据初始化
  created: function() {
    //  this.$options.methods.init()
    this.init()
  },
  // 获取选择框
  methods: {
    handleSelectionChange(val) {
      this.selectid = val
      // console.log(this.multipleTable)
    },

    // 创建桶弹出框取消的操作
    noBucketdialogFormVisible: function() {
      this.bucket_dialogFormVisible = false
      this.form.name = ''
    },
    handleSizeChange: function(val) {
      this.pageSize = val
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
    },

    // 创建桶文件
    createBucket: function() {
      this.$axios({
        method: 'post',
        url: '/api/a03-oss/bucket/create',
        data: { name: this.form.name }
      }).then(result => {
        if (result.data.msg === 'success') {
          this.$notify({
            title: '成功',
            message: '桶创建成功！',
            type: 'success',
            position: 'bottom-right'
          })
          this.init()
          this.bucket_dialogFormVisible = false
        } else {
          this.$notify({
            title: '错误',
            message: '桶创建失败',
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
    },

    // 桶的搜索
    findBucket: function() {
      if (this.searchName === '') {
        this.init()
      } else {
        this.$axios({
          method: 'get',
          url: '/api/a03-oss/bucket/find',
          params: { bucketName: this.searchName }
        }).then(result => {
          const bucketlist = []
          for (var i = 0; i < result.data.length; i++) {
            var bucketarray = result.data[i].split(',')
            bucketlist.push({
              bucketName: bucketarray[0],
              size: bucketarray[1],
              editTime: bucketarray[2]
            })
          }
          this.tableData = bucketlist
        })
      }
    },

    // 桶的全部查找
    init: function() {
      this.$axios({
        method: 'get',
        url: '/api/a03-oss/bucket/findAll'
      }).then(response => {
        const bucketlist = []
        for (var i = 0; i < response.data.length; i++) {
          var bucketarray = response.data[i].split(',')
          bucketlist.push({
            bucketName: bucketarray[0],
            size: bucketarray[1],
            createTime: bucketarray[2]
          })
        }
        this.tableData = bucketlist
      })
    },

    // 桶的删除
    bucket_deleteBucket: function() {
      if (this.selectid.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请选择至少一个桶',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除该桶, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const array = []
            for (let i = 0; i < this.selectid.length; i++) {
              array.push(this.selectid[i].bucketName)
            }
            this.$axios({
              method: 'delete',
              url: '/api/a03-oss/bucket/delete',
              data: array
            }).then(result => {
              if (result.data.msg === 'success') {
                this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '删除成功!',
                  position: 'bottom-right'
                })
                this.init()
              } else {
                this.$notify({
                  title: '错误',
                  message: '后台删除出错',
                  type: 'error',
                  position: 'bottom-right'
                })
              }
            })
          })
          .catch(() => {
            this.$notify({
              title: '警告',
              type: 'info',
              message: '已取消删除',
              position: 'bottom-right'
            })
          })
      }
    },

    // 桶内文件的查看
    bucket_findFile: function() {
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
          message: '只能选择一条数据进行查看',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$router.push({
          name: 'filePage',
          params: {
            bucketName: this.selectid[0].bucketName,
            tableData: this.tableData
          }
        })
      }
    },

    // 清空文件
    bucket_handleEdit: function() {
      if (this.selectid.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请选择至少一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        const array = []
        for (let i = 0; i < this.selectid.length; i++) {
          array.push(this.selectid[i].bucketName)
        }
        this.$axios({
          method: 'put',
          url: '/api/a03-oss/bucket/clear',
          data: array
        }).then(result => {
          if (result.data.msg === 'success') {
            this.$notify({
              title: '成功',
              message: '清空桶成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.init()
          } else {
            this.$notify({
              title: '失败',
              message: '后台清空失败',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
      }
    }
  }
}
</script>
