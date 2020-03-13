<template>
  <div>
    <!--添加对话框-->
    <el-form
      ref="dataForm"
      :rules="rules"
      :model="temp"
      label-position="right"
      label-width="80px"
      style="width: 450px; margin-left:700px; margin-top:100px"
    >
      <el-form-item v-show="showId" label="数据标准id" prop="id">
        <el-input v-model="temp.id" />
      </el-form-item>
      <el-form-item v-show="showVersion" label="version" prop="version">
        <el-input v-model="temp.version" />
      </el-form-item>
      <el-form-item
        label="逻辑编码"
        prop="lCode"
      >
        <el-input v-model="temp.lCode" type="lCode" maxlength="64" @change="inputChage" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="temp.code" :disabled="true" />
      </el-form-item>
      <el-form-item label="上级编码" prop="pCode">
        <el-input v-model="temp.pCode" :disabled="true" />
      </el-form-item>
      <el-form-item
        label="中文值"
        prop="cnValue"
      >
        <el-input v-model="temp.cnValue" maxlength="64" @change="inputChage" />
      </el-form-item>
      <el-form-item label="英文值" prop="enValue">
        <el-input v-model="temp.enValue" maxlength="64" />
      </el-form-item>
      <el-form-item label="序号" prop="sort">
        <el-input v-model="temp.sort" type="number" @change="inputChage" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="temp.status" placeholder="请选择" style="width: 370px; margin-left:0px;" :readonly="false" @change="inputChage">
          <el-option
            v-for="item in options"
            :key="item.statucode"
            :label="item.statuname"
            :value="item.statuname"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="temp.remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          type="textarea"
          placeholder="请输入备注"
          maxlength="100"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" plain icon="el-icon-refresh" @click="cancleYes()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-plus" :disabled="edit" @click="addSure()">添加</el-button>
      <el-button type="primary" plain icon="el-icon-plus" :disabled="edit" @click="addSureAgain()">添加并继续</el-button>
    </div>
    <!--添加的确认框-->
    <!-- <el-dialog :visible.sync="dialogaddVisible" modal:true>
      确定添加吗？
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogaddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSure()">确 定</el-button>
      </span>
    </el-dialog> -->

    <!--成功对话框-->
    <!-- <el-dialog title="操作成功" class="g_form" :visible.sync="dialogSuccess">
      <div>操作成功!</div>
    </el-dialog> -->
    <!--失败对话框-->
    <!-- <el-dialog title="操作失败" class="g_form" :visible.sync="dialogFaile">
      <div>操作失败!</div>
    </el-dialog> -->
    <!--数据重复对话框-->
    <!-- <el-dialog title="操作失败" class="g_form" :visible.sync="dialogFaileToRrepeat">
      <div>该数据已存在，不能重复创建!</div>
    </el-dialog> -->

  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      temp: {
        id: undefined,
        lCode: '',
        code: '',
        pCode: '',
        cnValue: '',
        enValue: '',
        sort: '',
        status: '',
        remark: '',
        version: ''
      },
      options: [],
      edit: true,
      showId: false,
      showVersion: false,
      // dialogaddVisible: false,
      // dialogSuccess: false,
      // dialogFaile: false,
      // dialogFaileToRrepeat: false,
      pCodes: [],
      codes: [],
      rules: {
        lCode: [
          { required: true, message: '逻辑编码不能为空' }],
        cnValue: [
          { required: true, message: '中文值不能为空' }
        ],
        sort: [
          { required: true, message: '输入数据不符合规范' }
        ],
        status: [
          { required: true, message: '状态不能为空' }
        ]
      }

    }
  },
  created() {
    axios.get('/api/a04ds/datastandard/findstatus').then(res => {
      this.options = res.data.resultData
    })
    this.addtemp = Object.assign({}, this.$route.params) // copy obj  将选中的数据放入表格中
    this.temp.pCode = this.addtemp.lCode
    this.temp.code = this.addtemp.code
  },
  methods: {
    inputChage() {
      if (this.temp.lCode === 'undefined' || this.temp.lCode === '' || this.temp.lCode === null ||
      this.temp.cnValue === 'undefined' || this.temp.cnValue === '' || this.temp.cnValue === null ||
      this.temp.sort === 'undefined' || this.temp.sort === '' || this.temp.sort === null ||
      this.temp.status === 'undefined' || this.temp.status === '' || this.temp.status === null
      ) {
        this.edit = true
      } else {
        this.edit = false
      }
    },
    // 添加
    addSure() {
      var data = {}
      data.id = this.temp.id
      data.lCode = this.temp.lCode
      data.pCode = this.temp.pCode
      data.code = this.temp.code
      data.cnValue = this.temp.cnValue
      data.enValue = this.temp.enValue
      data.sort = this.temp.sort
      data.status = this.temp.status
      data.remark = this.temp.remark
      data.createUserName = '张三'
      data.createUserCode = 'm001'
      axios
        .post('/api/a04ds/datastandard/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.status === 1) {
            // 数据已经存在
            if (response.data.resultData === -1) {
              this.$notify({
                title: '错误',
                message: '该数据已存在，不能重复创建!',
                type: 'error',
                position: 'bottom-right'
              })
            } else if (response.data.resultData === 0) {
              // 更新未成功
              this.$notify({
                title: '错误',
                message: '后台添加出错',
                type: 'error',
                position: 'bottom-right'
              })
            } else if (response.data.resultData > 0) {
              // 更新成功
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.$router.push({ name: 'dataStandard' })
            }
            // 后台出错
          } else if (response.data.msg === 'EC00001') {
            this.$notify({
              title: '错误',
              message: '后台添加出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台添加请求出错',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 添加并继续
    addSureAgain() {
      var data = {}
      data.id = this.temp.id
      data.lCode = this.temp.lCode
      data.pCode = this.temp.pCode
      data.code = this.temp.code
      data.cnValue = this.temp.cnValue
      data.enValue = this.temp.enValue
      data.sort = this.temp.sort
      data.status = this.temp.status
      data.remark = this.temp.remark
      data.createUserName = '张三'
      data.createUserCode = 'm001'
      axios
        .post('/api/a04ds/datastandard/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.status === 1) {
            // 数据已经存在
            if (response.data.resultData === -1) {
              this.$notify({
                title: '错误',
                message: '该数据已存在，不能重复创建!',
                type: 'error',
                position: 'bottom-right'
              })
            } else if (response.data.resultData === 0) {
              // 更新未成功
              this.$notify({
                title: '错误',
                message: '后台添加出错',
                type: 'error',
                position: 'bottom-right'
              })
            } else if (response.data.resultData > 0) {
              // 更新成功
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.$refs['dataForm'].resetFields()
              this.temp.remark = undefined
              this.add = true
            }
            // 后台未成功
          } else if (response.data.msg === 'EC00001') {
            this.$notify({
              title: '错误',
              message: '后台添加出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台添加请求出错',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 取消添加，返回上一界面
    cancleYes() {
      this.$router.push({ name: 'dataStandard' })
    }
  }
}
</script>
