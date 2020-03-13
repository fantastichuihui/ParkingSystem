<template>
  <div>
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          园区名称：
          <el-select v-model="temp.p_name" :disabled="true" placeholder="请选择园区" class="g_input">
            <el-option
              v-for="(item,index) in allPark"
              :key="index"
              :label="item.p_name"
              :value="item.p_name"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          省份：
          <el-select v-model="temp.p_province" :disabled="true" placeholder="请选择省份" class="g_input">
            <el-option
              v-for="(item,index) in allPark"
              :key="index"
              :label="item.p_province"
              :value="item.p_province"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          所在城市：
          <el-select v-model="temp.p_city" :disabled="true" placeholder="请选择市区" class="g_input">
            <el-option
              v-for="(item,index) in allPark"
              :key="index"
              :label="item.p_city"
              :value="item.p_city"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系人姓名：
          <el-input v-model="temp.p_concateName" class="g_input" maxlength="15" :disabled="true" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          仓库编码：
          <el-select v-model="temp.s_code" placeholder="请选择仓库" class="g_input">
            <el-option
              v-for="item in allPark"
              :key="item.s_id"
              :label="item.s_code"
              :value="item.s_code"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          仓库名称：
          <el-input v-model="temp.s_name" class="g_input" maxlength="15" :disabled="true" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          负责人姓名：
          <el-input v-model="temp.s_chargeName" :disabled="true" class="g_input" maxlength="15" />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系电话：
          <el-input v-model="temp.p_concatePhone" :disabled="true" class="g_input" maxlength="15" />
        </el-col>

        <div v-for="(item,index) in context" :key="index">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            作业区名：
            <el-input v-model="item.name" placeholder="请输入作业区名" class="g_input" maxlength="15" />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            作业区号：
            <el-input
              v-model="item.number"
              placeholder="请输入作业区号"
              type="number"
              class="g_input"
              maxlength="15"
            />
          </el-col>
        </div>

        <el-button v-if="addflag" type="danger" icon="el-icon-delete" circle @click="deleteSelect" />
        <el-button v-if="addflag" type="primary" icon="el-icon-plus" circle @click="addSelect" />

        <br>

        <div class="g_button">
          <el-button type="primary" plain icon="el-icon-search" @click="editParkReset()">重置</el-button>
          <el-button type="primary" plain icon="el-icon-minus" @click="cancleYes()">取消</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" @click="editParkSave">保存</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      temp: {
        id: '',
        number: '',
        name: '',
        p_name: '',
        p_province: '',
        p_city: '',
        p_concateName: '',
        p_concatePhone: '',
        s_id: '',
        s_code: '',
        s_name: '',
        s_chargeName: '',
        version: ''
      },
      addtemp: {},
      addflag: true,
      allPark: [],
      addflg: false,
      edit: true,
      edit2: false,
      context: [{}]
    }
  },
  watch: {
    'temp.s_code'(newName, oldName) {
      this.allPark.forEach((item, index) => {
        if (item.s_code === this.temp.s_code) {
          this.temp.number = item.number
          this.temp.name = item.name
          this.temp.p_id = item.p_id
          this.temp.p_name = item.p_name
          this.temp.p_province = item.p_province
          this.temp.p_city = item.p_city
          this.temp.p_concateName = item.p_concateName
          this.temp.p_concatePhone = item.p_concatePhone
          this.temp.s_id = item.s_id
          this.temp.s_code = item.s_code
          this.temp.s_name = item.s_name
          this.temp.s_chargeName = item.s_chargeName
        }
      })
    }
  },
  created() {
    if (JSON.stringify(this.$route.params) === '{}') {
      this.addflg = true
      axios.get('/api/b03res/area/getParkAndRoom').then(res => {
        this.allPark = res.data.resultData.datalist
      })
    } else {
      this.addtemp = Object.assign({}, this.$route.params) // copy obj  将选中的数据放入表格中
      axios.get('/api/b03res/area/getParkAndRoom').then(res => {
        this.allPark = res.data.resultData.datalist
        this.temp.id = this.addtemp.id
        this.temp.version = this.addtemp.version
        this.temp.s_code = this.addtemp.s_code
        this.context = []
        this.context.push({
          name: this.addtemp.name,
          number: this.addtemp.number
        })
      })

      this.addflag = false
    }
  },
  methods: {
    editParkSave() {
      if (JSON.stringify(this.temp.s_code) === '{}' || this.temp.s_code === '') {
        this.$notify({
          title: '提示信息',
          message: '请选择仓库',
          type: 'info',
          position: 'bottom-right'
        })
        return
      }
      if (this.addflg) {
        this.addSure()
      } else {
        this.editSure()
      }
    },

    // 添加作业区
    addSelect() {
      this.context.push({})
    },

    // 删除作业区
    deleteSelect: function(index) {
      this.context.splice(index, 1)
    },
    // 添加
    addSure() {
      if (this.context.length < 1) {
        this.$notify({
          title: '错误信息',
          message: '请添加数据!',
          type: 'error',
          position: 'bottom-right'
        })
        return
      }
      for (let i = 0; i < this.context.length; i++) {
        if (
          this.context[i].name === undefined ||
          this.context[i].number === undefined ||
          this.context[i].name.split(' ').join('').length === 0 ||
          this.context[i].number.split(' ').join('').length === 0
        ) {
          this.$notify({
            title: '错误信息',
            message: '作业区名和作业区号不能为空!!',
            type: 'error',
            position: 'bottom-right'
          })
          return
        }
        if (this.context[i].number <= 0) {
          this.$notify({
            title: '错误信息',
            message: '作业区号只能为正数!!',
            type: 'error',
            position: 'bottom-right'
          })
          return
        }
      }
      var data = {}
      const array = []
      for (let i = 0; i < this.context.length; i++) {
        var temp = {}
        temp.s_id = this.temp.s_id
        temp.name = this.context[i].name
        temp.number = this.context[i].number
        temp.createUserCode = '501'
        temp.createUserName = 'lq'
        temp.modifierCode = this.$store.state.userInfo.code
        temp.modifierName = this.$store.state.userInfo.name
        array.push(temp)
      }
      data.list = array
      axios
        .post('/api/b03res/area/add', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00001') {
            this.$notify({
              title: '错误信息',
              message: '添加失败',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
            this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.editParkReset()
            setTimeout(() => {
              // 清空表单
              this.cancleYes()
            }, 2000)
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '添加失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    editSure() {
      for (let i = 0; i < this.context.length; i++) {
        if (
          this.context[i].name.split(' ').join('').length === 0 ||
          this.context[i].name === undefined ||
          //  this.context[i].number.split(" ").join("").length === 0 ||
          this.context[i].number === undefined
        ) {
          this.$notify({
            title: '错误信息',
            message: '作业区名和作业区号不能为空!!',
            type: 'error',
            position: 'bottom-right'
          })
          return
        }
        if (this.context[i].number <= 0) {
          this.$notify({
            title: '错误信息',
            message: '作业区号只能为正数!!',
            type: 'error',
            position: 'bottom-right'
          })
          return
        }
      }
      var data = {}
      data.id = this.temp.id
      data.version = this.temp.version
      data.s_id = this.temp.s_id
      data.name = this.context[0].name
      data.number = this.context[0].number
      data.modifierCode = this.$store.state.userInfo.code
      data.modifierName = this.$store.state.userInfo.name

      axios
        .put('/api/b03res/area/update', data)
        .then(response => {
          // 返回值为0后台操作未成功
          if (response.data.msg === 'EC00003') {
            this.$notify({
              title: '错误信息',
              message: '添加失败',
              type: 'error',
              position: 'bottom-right'
            })
          } else if (response.data.status === 1) {
            this.$notify({
              title: '提示信息',
              message: '操作成功',
              type: 'success',
              position: 'bottom-right'
            })
            this.temp = {}
            setTimeout(() => {
              // 清空表单
              this.cancleYes()
            }, 2000)
          }
        })
        .catch(() => {
          this.$notify({
            title: '错误信息',
            message: '添加失败',
            type: 'error',
            position: 'bottom-right'
          })
        })
    },
    // 重置
    editParkReset() {
      this.addtemp = Object.assign({}, this.$route.params) // copy obj  将选中的数据放入表格中
      this.temp.id = this.addtemp.id
      this.temp.number = this.addtemp.number
      this.temp.name = this.addtemp.name
      this.temp.p_id = this.addtemp.p_id
      this.temp.p_name = this.addtemp.p_name
      this.temp.p_province = this.addtemp.p_province
      this.temp.p_city = this.addtemp.p_city
      this.temp.p_concateName = this.addtemp.p_concateName
      this.temp.p_concatePhone = this.addtemp.p_concatePhone
      this.temp.s_id = this.addtemp.s_id
      this.temp.s_code = this.addtemp.s_code
      this.temp.s_name = this.addtemp.s_name
      this.temp.s_chargeName = this.addtemp.s_chargeName
      this.temp.version = this.addtemp.version
      this.context.forEach((item, index) => {
        item.name = ''
        item.number = ''
      })
    },
    // 取消添加，返回上一界面
    cancleYes() {
      this.temp = {}
      this.context = []
      this.$router.push({ name: 'area' })
    }
  }
}
</script>
