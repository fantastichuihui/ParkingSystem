<template>
  <div>
    <div class="g_container">
      <el-form
        ref="dataForm"
        class="person_form"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
        style="margin-top:5%"
      >
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <!-- 编码 -->
            <el-form-item label="编码：" prop="code" class="g_item_label" :rules="[{ required: true, message: '编码不能为空'},] ">
              <el-input v-model="temp.code" type="code" maxlength="64" class="g_elFormInput_other" @change="inputChage" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <!-- 名称 -->
            <el-form-item label="名称：" prop="name" class="g_item_label" :rules="[{ required: true, message: '名称不能为空'},]">
              <el-input v-model="temp.name" maxlength="64" class="g_elFormInput_other" @change="inputChage" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="值：" prop="value" class="g_item_label" :rules="[{ required: true, message: '值不能为空'},]">
              <el-input v-model="temp.value" maxlength="64" class="g_elFormInput_other" @change="inputChage" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="状态：" prop="status" class="g_item_label">
              <el-select v-model="temp.status" placeholder="请选择" class="g_elFormSelect_other" :readonly="false" @change="inputChage">
                <el-option
                  v-for="item in options"
                  :key="item.statucode"
                  :label="item.statuname"
                  :value="item.statuname"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="说明：" class="g_item_label">
              <el-input
                v-model="temp.description"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                class="g_elFormTextarea_other"
                placeholder="Please input"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-form-item label="备注：" class="g_item_label">
              <el-input
                v-model="temp.remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                class="g_elFormTextarea_other"
                placeholder="请输入备注"
                maxlength="100"
              />
            </el-form-item></el-col>
        </el-row></el-form></div>

    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
        <el-button type="primary" plain style="float:left;" icon="el-icon-refresh" @click="cancleYes">取消</el-button>
        <el-button type="primary" plain style="float:left;" icon="el-icon-plus" :disabled="edit" @click="addSure()">添加</el-button>
        <el-button type="primary" plain style="float:left;" icon="el-icon-plus" :disabled="edit" @click="addSureAgain()">添加并继续</el-button>
      </el-col>
    </el-row>
    <!--添加的确认框-->
    <!-- <el-dialog :visible.sync="dialogaddVisible" modal:true>
      确定添加吗？
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogaddVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSure()">确 定</el-button>
      </span>
    </el-dialog> -->

    <!--成功对话框-->
    <!-- <el-dialog class="g_form" :visible.sync="dialogSuccess">
      <div>操作成功!</div>
    </el-dialog> -->
    <!--失败对话框-->
    <!-- <el-dialog class="g_form" :visible.sync="dialogFaile">
      <div>操作失败!</div>
    </el-dialog> -->
    <!--数据重复对话框-->
    <!-- <el-dialog title="操作失败" class="g_form" :visible.sync="dialogFaileToRrepeat">
      <div>该数据已存在，不能重复创建!</div>
    </el-dialog> -->
  </div></template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      temp: {
        code: '',
        name: '',
        value: '',
        status: '',
        remark: '',
        description: ''
      },
      options: [],
      edit: true,
      showId: false,
      showVersion: false,
      // dialogaddVisible: false,
      // dialogSuccess: false,
      // dialogFaile: false,
      // dialogFaileToRrepeat: false,
      rules: {
        status: [
          { required: true, message: '状态不能为空' }
        ]
      },
      picked: 'choice'
    }
  },
  created() {
    axios.get('/api/a04ds/systemparam/findstatus').then(res => {
      this.options = res.data.resultData
    })
  },
  methods: {
    inputChage() {
      if (this.temp.code === 'undefined' || this.temp.code === '' || this.temp.code === null ||
      this.temp.name === 'undefined' || this.temp.name === '' || this.temp.name === null ||
      this.temp.value === 'undefined' || this.temp.value === '' || this.temp.value === null ||
      this.temp.status === 'undefined' || this.temp.status === '' || this.temp.status == null
      ) {
        this.edit = true
      } else {
        this.edit = false
      }
    },
    addSure() {
      var data = {}
      data.code = this.temp.code
      data.name = this.temp.name
      data.value = this.temp.value
      data.status = this.temp.status
      data.description = this.temp.description
      data.remark = this.temp.remark
      data.createUserName = '张三'
      data.createUserCode = 'm001'
      axios
        .post('/api/a04ds/systemparam/insert', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.status === 1) {
            // 添加未成功
            if (response.data.resultData === 0) {
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
              this.$router.push({ name: 'systemParameter' })
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
            message: '后台添加出错',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 添加并继续
    addSureAgain() {
      var data = {}
      data.code = this.temp.code
      data.name = this.temp.name
      data.value = this.temp.value
      data.status = this.temp.status
      data.description = this.temp.description
      data.remark = this.temp.remark
      data.createUserName = '张三'
      data.createUserCode = 'm001'
      axios
        .post('/api/a04ds/systemparam/insert', data)
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
                message: '添加成功，请继续添加',
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
    cancleYes() {
      this.dialogEditCancleVisible = false
      this.$router.push({ name: 'systemParameter' })
    }
  }
}
</script>
<style>
  .g_item_label .el-form-item__label{
    font-size: 16px;
    color: #606266;
    font-weight: normal;
   }
</style>
