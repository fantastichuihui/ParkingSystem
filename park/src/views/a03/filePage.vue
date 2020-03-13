<template>
  <div g_container>
    <div class="g_inputForm">
      文件名称：
      <el-input
        v-model.trim="file_searchName"
        placeholder="请输入内容"
        class="g_input"
        style="width:20%"
        maxlength="15"
        clearable
        @keyup.enter.native="handleFilter"
      />
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="file_readyFile()">搜索</el-button>
      <el-button type="primary" plain @click="file_dialogFormVisible=true">
        上传文件
        <i class="el-icon-upload el-icon--right" />
      </el-button>
      <el-button type="primary" plain @click="downloadFile()">
        下载文件
        <i class="el-icon-upload el-icon--right" />
      </el-button>
      <el-button type="primary" plain icon="el-icon-delete" @click="deleteFile()">删除</el-button>
    </div>
    <el-table
      :data="fileList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="fileSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <el-table-column type="index" label="序号" width="60px" align="center" />
      <!-- 文件名称 -->
      <el-table-column label="文件名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.fileName }}</span>
        </template>
      </el-table-column>
      <!-- 文件类型 -->
      <el-table-column label="文件类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.filetypeName }}</span>
        </template>
      </el-table-column>
      <!-- 桶名称 -->
      <el-table-column label="桶名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.bucketName }}</span>
        </template>
      </el-table-column>
      <!-- 文件大小 -->
      <el-table-column label="文件大小" align="center">
        <template slot-scope="{row}">
          <span>{{ row.size }}</span>
        </template>
      </el-table-column>
      <!-- 修改时间 -->
      <el-table-column label="修改时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.editTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件区 -->
    <el-pagination
      style="float:right"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="fileList.length"
      layout="total,sizes,prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 文件的上传 -->
    <el-dialog title="文件上传" :visible.sync="file_dialogFormVisible" width="30%" top="10%" :close-on-click-modal="false">
      <div>
        <el-select v-model="fileshuju.fileType" placeholder="请选择文件类型">
          <el-option
            v-for="item in fileTypeName"
            :key="item.typeName"
            :label="item.typeName"
            :value="item.typeName"
          />
        </el-select>
        <br>
        <br>
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/api/a03-oss/file/upload"
          :data="fileshuju"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList1"
          multiple
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="primary"
            @click="submitUpload"
          >上传文件</el-button>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="CancledialogFormVisible">取 消</el-button>
        <el-button type="primary" @click="fileClean()">清空</el-button>
        <!-- <el-button type="primary" @click="uploadfileType()">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file_dialogFormVisible: false,
      downloadZipName: 'files.zip', // 下载文件名字
      file_searchName: '', // 搜索框文件名称
      fileList: [], // 后台获取数据
      selectfile: [], // 表格数据
      fileList1: [], // 上传文件内容
      fileTypeName: [], // 类型文件名称的获取
      fileshuju: {
        fileType: '',
        createUserCode: 's001',
        createUserName: 'zl',
        modifierCode: 'a001',
        modifierName: 'wp'
      },
      total: 0,
      pageSize: 10,
      currentPage: 1,
      dropDown: ''
    }
  },

  // 用于数据初始化
  created: function() {
    // 文件后台数据的获取
    this.init1()

    // 桶名称后台数据的获取
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
      this.fileTypeName = bucketlist
    })
  },

  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleSizeChange: function(val) {
      this.pageSize = val
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
    },
    handleRemove(file, fileList1) {
      // console.log(file, fileList1);
    },
    handlePreview(file) {
      // console.log(file);
    },
    CancledialogFormVisible: function() {
      this.file_dialogFormVisible = false
      this.fileList1 = []
      this.fileshuju.fileType = ''
    },
    handleSuccess(response, file, fileList1) {
      if (response.msg === 'success') {
        this.$notify({
          title: '成功',
          message: '上传文件成功',
          type: 'success',
          position: 'bottom-right'
        })
        const uploadData = this.fileshuju.fileType
        this.dropDown = this.fileshuju.fileType
        if (JSON.stringify(uploadData) !== '{}') {
          this.$axios({
            method: 'get',
            url: '/api/a03-oss/filetype/check',
            params: { name: this.fileshuju.fileType }
          }).then(response => {
            const bucketlist = []
            for (var i = 0; i < response.data.length; i++) {
              var bucketarray = response.data[i].split(',')
              bucketlist.push({
                fileName: bucketarray[0],
                filetypeName: bucketarray[1],
                bucketName: bucketarray[2],
                size: bucketarray[3],
                editTime: bucketarray[4]
              })
            }
            this.fileList = bucketlist
          })
        }
        this.file_dialogFormVisible = false
        this.fileClean()
      }
      if (response.msg === '上传文件失败!文件类型为空!') {
        this.fileList1 = []
        this.$notify({
          title: '失败',
          message: response.msg,
          type: 'error',
          position: 'bottom-right'
        })
      }
    },
    // err, file, fileList1
    handleError() {
      this.$notify({
        title: '失败',
        message: '上传文件失败',
        type: 'error',
        position: 'bottom-right'
      })
    },
    // 清空上传文件内容
    fileClean: function() {
      this.fileshuju.fileType = ''
      this.fileList1 = []
    },

    // 上传文件时弹框的关闭以及上传文件的显示
    // uploadfileType: function() {
    //   const uploadData = this.fileshuju.fileType
    //   if (JSON.stringify(uploadData) !== '{}') {
    //     this.$axios({
    //       method: 'get',
    //       url: '/api/a03-oss/filetype/check',
    //       params: { name: this.fileshuju.fileType }
    //     }).then(response => {
    //       const bucketlist = []
    //       for (var i = 0; i < response.data.length; i++) {
    //         var bucketarray = response.data[i].split(',')
    //         bucketlist.push({
    //           fileName: bucketarray[0],
    //           filetypeName: bucketarray[1],
    //           bucketName: bucketarray[2],
    //           size: bucketarray[3],
    //           editTime: bucketarray[4]
    //         })
    //       }
    //       this.fileList = bucketlist
    //     })
    //   }
    //   this.file_dialogFormVisible = false
    // },

    // 获取表格内容
    fileSelectionChange(val) {
      this.selectfile = val
    },

    // 获取后台文件数据
    init1: function() {
      if (JSON.stringify(this.$route.params.bucketName) !== undefined) {
        this.$axios({
          method: 'get',
          url: '/api/a03-oss/bucket/check',
          params: { bucketName: this.$route.params.bucketName }
        }).then(response => {
          const bucketlist = []
          for (var i = 0; i < response.data.length; i++) {
            var bucketarray = response.data[i].split(',')
            bucketlist.push({
              fileName: bucketarray[0],
              filetypeName: bucketarray[1],
              bucketName: this.$route.params.bucketName,
              size: bucketarray[2],
              editTime: bucketarray[3]
            })
          }
          this.fileList = bucketlist
        })
      }
      if (JSON.stringify(this.$route.params.name) !== undefined) {
        this.$axios({
          method: 'get',
          url: '/api/a03-oss/filetype/check',
          params: { name: this.$route.params.name }
        }).then(response => {
          const bucketlist = []
          for (var i = 0; i < response.data.length; i++) {
            var bucketarray = response.data[i].split(',')
            bucketlist.push({
              fileName: bucketarray[0],
              filetypeName: bucketarray[1],
              bucketName: bucketarray[2],
              size: bucketarray[3],
              editTime: bucketarray[4]
            })
          }
          this.fileList = bucketlist
        })
      }
    },

    // 文件删除
    deleteFile: function() {
      if (this.selectfile.length === 0) {
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
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const array = []
            for (let i = 0; i < this.selectfile.length; i++) {
              array.push({
                bucketName: this.selectfile[i].bucketName,
                fileName: this.selectfile[i].fileName
              })
            }
            this.$axios({
              method: 'put',
              url: '/api/a03-oss/file/delete',
              data: array
            }).then(result => {
              if (result.data.msg === 'success') {
                this.$notify({
                  title: '成功',
                  type: 'success',
                  message: '删除文件成功',
                  position: 'bottom-right'
                })
                this.$axios({
                  method: 'get',
                  url: '/api/a03-oss/filetype/check',
                  params: { name: this.dropDown }
                }).then(response => {
                  const bucketlist = []
                  for (var i = 0; i < response.data.length; i++) {
                    var bucketarray = response.data[i].split(',')
                    bucketlist.push({
                      fileName: bucketarray[0],
                      filetypeName: bucketarray[1],
                      bucketName: bucketarray[2],
                      size: bucketarray[3],
                      editTime: bucketarray[4]
                    })
                  }
                  this.fileList = bucketlist
                })
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
              title: '警告',
              type: 'info',
              message: '已取消删除',
              position: 'bottom-right'
            })
          })
      }
    },

    // 查找
    file_readyFile: function() {
      if (this.file_searchName === '') {
        this.init1()
      } else {
        this.$axios({
          method: 'get',
          url: '/api/a03-oss/file/find',
          params: { fileName: this.file_searchName }
        }).then(result => {
          const bucketlist = []
          for (var i = 0; i < result.data.length; i++) {
            var bucketarray = result.data[i].split(',')
            bucketlist.push({
              fileName: bucketarray[0],
              filetypeName: bucketarray[1],
              bucketName: bucketarray[2],
              size: bucketarray[3],
              editTime: bucketarray[4]
            })
          }
          this.fileList = bucketlist
        })
      }
    },

    // 上传文件
    uploadFile: function() {},

    // 下载文件
    downloadFile: function() {
      if (this.selectfile.length === 0) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请选择至少一条数据',
          type: 'warning',
          position: 'bottom-right'
        })
      } else if (this.selectfile.length === 1) {
        this.$confirm('将下载该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const array = {
              fileName: this.selectfile[0].fileName,
              bucketName: this.selectfile[0].bucketName
            }
            this.$axios({
              method: 'post',
              url: '/api/a03-oss/file/downloadfile',
              headers: {
                'Content-Type': 'application/json'
              },
              data: array,
              responseType: 'blob' // 二进制格式转换
            }).then(result => {
              // console.log(result);
              const blob = result.data
              // 创建一个URL指向Blob，也就是Blob URL
              const url = window.URL.createObjectURL(blob)
              // 创建<a>标签
              const el = document.createElement('a')
              el.href = url
              // 指定下载的文件名
              el.download = this.selectfile[0].fileName
              el.hidden = true
              document.body.appendChild(el)
              el.click()
              document.body.removeChild(el)
            })
          })
          .catch(() => {
            this.$notify({
              title: '提示',
              type: 'info',
              message: '已取消下载',
              position: 'bottom-right'
            })
          })
      } else if (this.selectfile.length > 1) {
        this.$confirm('将下载该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const array = []
            for (let i = 0; i < this.selectfile.length; i++) {
              array.push({
                fileName: this.selectfile[i].fileName,
                bucketName: this.selectfile[i].bucketName
              })
            }
            this.$axios({
              method: 'post',
              url: '/api/a03-oss/file/downloadfiles',
              headers: {
                'Content-Type': 'application/json'
              },
              data: array,
              responseType: 'blob'
            }).then(result => {
              // console.log(result);
              const blob = result.data
              // 创建一个URL指向Blob，也就是Blob URL
              const url = window.URL.createObjectURL(blob)
              // 创建<a>标签
              const el = document.createElement('a')
              el.href = url
              // 指定下载的文件名
              el.download = this.downloadZipName
              el.hidden = true
              document.body.appendChild(el)
              el.click()
              document.body.removeChild(el)
            })
          })
          .catch(() => {
            this.$notify({
              title: '提示',
              type: 'info',
              message: '已取消下载',
              position: 'bottom-right'
            })
          })
      }
    }
  }
}
</script>
