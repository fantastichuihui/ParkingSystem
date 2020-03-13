<template>
  <div>
    <el-form
      ref="dataFormEdit"
      :rules="rules"
      :model="temp"
      label-position="right"
      label-width="80px"
      style="width: 450px; margin-left:700px; margin-top:100px;"
    >
      <el-form-item v-show="showId" label="逻辑主键id" prop="id">
        <el-input v-model="temp.id" />
      </el-form-item>
      <el-form-item v-show="showVersion" label="version" prop="version">
        <el-input v-model="temp.version" />
      </el-form-item>
      <el-form-item label="编码" prop="code">
        <el-input v-model="temp.code" maxlength="64" @change="inputChage" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="temp.name" maxlength="64" @change="inputChage" />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input v-model="temp.value" maxlength="64" @change="inputChage" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="temp.status" :readonly="false" placeholder="请选择" style="width: 370px; margin-left:0px;" @change="inputChage">
          <el-option
            v-for="item in options"
            :key="item.statucode"
            :label="item.statuname"
            :value="item.statucode"
            maxlength="100"
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
      <el-button type="primary" plain icon="el-icon-refresh" @click="dialogEditCancleVisible = true">取消</el-button>
      <el-button type="primary" plain icon="el-icon-plus" :disabled="edit" @click="edityes()">修改</el-button>
    </div>

    <!--修改取消确认框-->
    <el-dialog :visible.sync="dialogEditCancleVisible" modal:true :close-on-click-modal="false">
      <div>已变更的数据将不被保存,确认修改？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditCancleVisible = false">取 消</el-button>
        <el-button type="primary" @click="cancleYes">确 定</el-button>
      </span>
    </el-dialog>

    <!--修改确认框-->
    <!-- <el-dialog :visible.sync="dialogEditYesVisible" modal:true>
      <div>确定修改吗？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditYesVisible = false">取 消</el-button>
        <el-button type="primary" @click="edityes">确 定</el-button>
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
        id: '',
        name: '',
        code: '',
        value: '',
        status: '0',
        remark: '',
        version: ''
      },
      options: [],
      edit: true,
      showId: false,
      showVersion: false,
      dialogEditCancleVisible: false,
      // dialogEditYesVisible: false,
      // dialogSuccess: false,
      // dialogFaile: false,
      // dialogFaileToRrepeat: false,
      rules: {
        code: [
          { required: true, message: '逻辑编码不能为空' }],
        name: [
          { required: true, message: '名称不能为空' }
        ],
        value: [
          { required: true, message: '值不能为空' }
        ],
        status: [
          { required: true, message: '状态不能为空' }
        ]
      }
    }
  },
  created() {
    axios.get('/api/a04ds/systemparam/findstatus').then(res => {
      this.options = res.data.resultData
    })
    this.newtemp = Object.assign({}, this.$route.params)
    this.temp.id = this.newtemp.id
    this.temp.name = this.newtemp.name
    this.temp.code = this.newtemp.code
    this.temp.value = this.newtemp.value
    this.temp.status = this.newtemp.status
    this.temp.remark = this.newtemp.remark
    this.temp.version = this.newtemp.version
    // if (!this.temp.code) {
    //   this.edit = false
    // } else if (this.temp.name === 'undefined' || this.temp.name === '' || this.temp.name === null) {
    //   this.$message({ message: '名称不能为空' })
    // } else if (this.temp.value === 'undefined' || this.temp.value === '' || this.temp.value === null) {
    //   this.$message({ message: '值不能为空' })
    // } else if (this.temp.status === 'undefined' || this.temp.status === '' || this.temp.status === null) {
    //   this.$message({ message: '状态不能为空' })
    // } else {
    //   this.edit = false
    // }
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
    edityes() {
      // 向后台传输的数据
      var data = {}
      data.id = this.temp.id
      data.version = this.temp.version
      data.name = this.temp.name
      data.value = this.temp.value
      data.code = this.temp.code
      data.status = this.temp.status
      data.modifierName = '张三'
      data.modifierCode = 'm001'
      if (this.temp.remark !== 'undefined') {
        data.remark = this.temp.remark
      }

      axios
        .post('/api/a04ds/systemparam/update', data)
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
                message: '后台修改出错',
                type: 'error',
                position: 'bottom-right'
              })
            } else if (response.data.resultData > 0) {
              // 更新成功
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                position: 'bottom-right'
              })
              this.$router.push({ name: 'systemParameter' })
            }
          } else if (response.data.msg === 'EC00003') {
            this.$notify({
              title: '错误',
              message: '后台修改出错',
              type: 'error',
              position: 'bottom-right'
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误',
            message: '前台修改请求出错',
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
