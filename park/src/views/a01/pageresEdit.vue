<template>
  <div class="g_container">
    <el-form
      class="g_elForm"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="父页面资源:" prop="pid">
            <el-select v-model="pid" class="g_elFormTextarea_other" placeholder="请选择资源名称">
              <el-option v-for="item in pageResData" :key="item.id" :label="item.displayText" :value="item.id" />
            </el-select><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="显示文本:" prop="displayText">
            <el-input
              v-model.trim="displayText"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="提示文本:" prop="tooltipText">
            <el-input
              v-model.trim="tooltipText"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 访问URL：" prop="url">
            <el-input
              v-model.trim="url"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="元素类型:" prop="type">
            <el-select v-model="type" placeholder="请输入内容" class="g_elFormInput_other">
              <el-option label="菜单" value="caidan" />
              <el-option label="按钮" value="anniu" />
            </el-select><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="排序:" prop="sort">
            <el-input
              v-model.trim="sort"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
              @input="handleFilter($event)"
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="是否启用:" prop="isEnable">
            <el-select v-model="isEnable" placeholder="请输入内容" class="g_elFormInput_other">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作图标:" prop="icon">
            <el-input
              v-model.trim="icon"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 动作样式:" prop="aClass">
            <el-input
              v-model.trim="aClass"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="5">
        <el-button type="primary" plain icon="el-icon-search" style="float:left;" @click="handleNO()">取消</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" style="float:left;margin-left:50px;" @click="handleYes()">修改</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      pageResData: [],
      currentPage: 1,
      id: this.$route.params.pageres.id,
      pid: this.$route.params.pageres.pid,
      displayText: this.$route.params.pageres.displayText,
      tooltipText: this.$route.params.pageres.tooltipText,
      url: this.$route.params.pageres.url,
      type: this.$route.params.pageres.type,
      isEnable: this.$route.params.pageres.isEnable,
      sort: this.$route.params.pageres.sort,
      icon: this.$route.params.pageres.icon,
      aClass: this.$route.params.pageres.aClass
    }
  },
  computed: {
    useInfo() {
      return this.$store.state.userInfo
    }
  },
  created() {
    axios.get('/api/a01auth/pageres/findAllPageres').then((res) => {
      this.pageResData = res.data.resultData
    })
  },
  methods: {
    handleFilter() {
      if (this.sort.replace(/\s+/g, '').length === 1) {
        return this.sort
      } else {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '排序只能为一位数的数字',
          type: 'warning',
          position: 'bottom-right'
        })
      }
    },
    getParamMap: function() {
      return {
        id: this.id,
        pid: this.pid,
        displayText: this.displayText,
        tooltipText: this.tooltipText,
        type: this.type,
        isEnable: this.isEnable,
        sort: this.sort,
        icon: this.icon,
        aClass: this.aClass,
        modifierCode: this.useInfo.code,
        modifierName: this.useInfo.name
      }
    },
    open2: function(msg) {
      if (this.notifyInstance) {
        this.notifyInstance.close()
      }
      this.notifyInstance = this.$notify({
        title: '警告',
        message: msg,
        type: 'warning',
        position: 'bottom-right'
      })
    },
    handleYes() {
      if (this.pid === this.id ||
        (this.pid === this.$route.params.pageres.pid &&
        this.displayText === this.$route.params.pageres.displayText &&
      this.tooltipText === this.$route.params.pageres.tooltipText &&
      this.url === this.$route.params.pageres.url &&
      this.type === this.$route.params.pageres.type &&
      this.isEnable === this.$route.params.pageres.isEnable &&
      this.sort === this.$route.params.pageres.sort &&
      this.icon === this.$route.params.pageres.icon &&
      this.aClass === this.$route.params.pageres.aClass)) {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告信息',
          message: '您未输入修改数据或你输入的修改数据无效，无法修改',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        if (this.isEnable === '启用') {
          this.isEnable = 1
        } else if (this.isEnable === '禁用') {
          this.isEnable = 0
        }
        axios.post('/api/a01auth/pageres/upPageres', this.getParamMap()).then((res) => {
          if (res.data.status === 1) {
            this.$router.push('pageres')
            if (this.notifyInstance) {
              this.notifyInstance.close()
            }
            this.notifyInstance = this.$notify({
              type: 'success',
              message: '修改成功',
              position: 'bottom-right'
            })
          } else {
          // 修改失败，给出提示
            this.msg = res.data.msg
            if (this.msg === 'EC00003') {
              this.open2(this.EC00003)
            }
          }
        })
      }
    },
    handleNO() {
      this.$router.push('pageres')
    }
  }
}
</script>

