<template>
  <div g_container>
    <div class="g_inputForm">
      类型名称：
      <el-input
        v-model="file_searchName"
        placeholder="请输入内容"
        class="g_input"
        style="width:20%"
        maxlength="15"
        clearable
        @keyup.enter.native="handleFilter"
      />
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="file_typeFile()">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-plus" @click="type_dialogFormVisible=true">新建</el-button>
      <el-button type="primary" plain icon="el-icon-search" @click="findFileType()">查看</el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteType()">删除</el-button>
    </div>
    <el-table
      :data="typeList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="fileSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <!-- 类型名称 -->
      <el-table-column label="类型名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeName }}</span>
        </template>
      </el-table-column>
      <!-- 上级类型 -->
      <el-table-column label="上级类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.parentType }}</span>
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
      :total="typeList.length"
      layout="total,sizes,prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog title="新建类型" :visible.sync="type_dialogFormVisible" width="35%" top="10%" :close-on-click-modal="false">
      <el-form :model="type">
        <el-form-item label="类型名称：" :label-width="formLabelWidth">
          <el-input v-model="type.name" autocomplete="off" maxlength="15" placeholder="最大长度为15" />
        </el-form-item>
        <el-form-item label="上级类型：" :label-width="formLabelWidth" style="float:left">
          <el-select v-model="fatherName" placeholder="请选择上级类型">
            <el-option
              v-for="item in typeList"
              :key="item.typeName"
              :label="item.typeName"
              :value="item.typeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人：" :label-width="formLabelWidth" style="display:none">
          <el-input v-model="type.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="创建时间：" :label-width="formLabelWidth" style="display:none">
          <el-input v-model="type.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="修改人：" :label-width="formLabelWidth" style="display:none">
          <el-input v-model="type.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="修改时间：" :label-width="formLabelWidth" style="display:none">
          <el-input v-model="type.name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="noDialogFormVisible()">取 消</el-button>
        <el-button type="primary" @click="fileTypeClean()">清空</el-button>
        <el-button type="primary" @click="createFileType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type_dialogFormVisible: false,
      file_searchName: '', // 搜索框文件名称
      typeList: [], // 后台获取数据
      seleteType: [], // 表格数据
      formLabelWidth: '100px',
      fatherName: '',
      type: {
        name: ''
      },
      total: 0,
      pageSize: 10,
      currentPage: 1
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.useInfo
    }
  },

  // 用于数据初始化
  created: function() {
    // 文件后台数据的获取
    this.init2()
  },

  methods: {
    // 获取表格内容
    fileSelectionChange(val) {
      this.seleteType = val
    },
    handleSizeChange: function(val) {
      this.pageSize = val
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
    },
    // 文件查看
    findFileType: function() {
      if (this.seleteType.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.seleteType.length > 1) {
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
          params: { name: this.seleteType[0].typeName }
        })
      }
    },

    // 清空
    fileTypeClean: function() {
      this.fatherName = ''
      this.type.name = ''
    },

    // 取消的操作内容
    noDialogFormVisible: function() {
      this.type_dialogFormVisible = false
      this.type.name = ''
      this.fatherName = ''
    },

    // 创建类型文件
    createFileType: function() {
      this.$axios({
        method: 'post',
        url: '/api/a03-oss/filetype/createFileType',
        data: {
          name: this.type.name,
          parentName: this.fatherName,
          createUserCode: 's001',
          createUserName: 'zl',
          modifierCode: 'a001',
          modifierName: 'wp'
        }
      }).then(result => {
        this.type_dialogFormVisible = false
        if (result.data.msg === 'success') {
          this.$notify({
            title: '成功',
            message: '文件类型创建成功！',
            type: 'success',
            position: 'bottom-right'
          })
          this.init2()
        } else {
          this.$notify({
            title: '失败',
            message: result.data.msg,
            type: 'error',
            position: 'bottom-right'
          })
        }
      })
    },

    // 获取后台文件数据
    init2: function() {
      this.$axios({
        method: 'get',
        url: '/api/a03-oss/filetype/findAll',
        params: { bucketName: this.$route.params.bucketName }
      }).then(response => {
        const bucketlist = []
        for (var i = 0; i < response.data.length; i++) {
          var bucketarray = response.data[i].split(',')
          bucketlist.push({
            typeName: bucketarray[0],
            parentType: bucketarray[1],
            createTime: bucketarray[2]
          })
        }
        this.typeList = bucketlist
      })
    },

    // 类型文件删除
    deleteType: function() {
      if (this.seleteType.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请至少选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.seleteType.length > 1) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请选择一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$axios({
              method: 'put',
              url: '/api/a03-oss/filetype/delete',
              data: {
                name: this.seleteType[0].typeName,
                modifierCode: 'a001',
                modifierName: 'wp'
              }
            }).then(result => {
              if (result.data.msg === 'success') {
                this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '删除文件成功',
                  position: 'bottom-right'
                })
                this.init2()
              } else {
                this.$notify({
                  title: '失败',
                  message: result.data.msg,
                  type: 'error',
                  position: 'bottom-right'
                })
              }
            })
          })
          .catch(() => {
            this.$notify({
              title: '提示',
              type: 'info',
              message: '已取消删除',
              position: 'bottom-right'
            })
          })
      }
    },

    // 搜索文件
    file_typeFile: function() {
      if (this.file_searchName === '') {
        this.init2()
      } else {
        this.$axios({
          method: 'get',
          url: '/api/a03-oss/filetype/search',
          params: { name: this.file_searchName }
        }).then(result => {
          const bucketlist = []
          for (var i = 0; i < result.data.length; i++) {
            var bucketarray = result.data[i].split(',')
            bucketlist.push({
              typeName: bucketarray[0],
              parentType: bucketarray[1],
              createTime: bucketarray[2]
            })
          }
          this.typeList = bucketlist
        })
      }
    }
  }
}
</script>
