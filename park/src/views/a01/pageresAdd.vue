<template>
  <div class="g_container">
    <el-form
      class="g_elForm"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 父页面资源：" prop="pid">
            <el-select v-model="pid" class="g_elFormTextarea_other" placeholder="请选择资源名称">
              <el-option v-for="item in pageResData" :key="item.id" :label="item.displayText" :value="item.id" />
            </el-select>
            <!-- <el-select v-model.trim="pid" class="g_elFormInput_other" placeholder="请输入内容">
              <el-option label="1" value="1" />
              <el-option label="2" value="2" />
            </el-select> --><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 显示文本：" prop="displayText">
            <el-input
              v-model.trim="displayText"
              class="g_elFormInput_other"
              placeholder="请输入内容"
              clearable
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 提示文本：" prop="tooltipText">
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
          <el-form-item label=" 元素类型：" prop="type">
            <el-select v-model="type" class="g_elFormInput_other" placeholder="请输入内容">
              <el-option label="菜单" value="caidan" />
              <el-option label="按钮" value="anniu" />
            </el-select><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label=" 排序：" prop="sort">
            <el-input
              v-model.trim="sort"
              placeholder="请输入内容"
              class="g_elFormInput_other"
              clearable
            /><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="是否启用：" prop="isEnable">
            <el-select v-model="isEnable" placeholder="请输入内容" class="g_elFormInput_other">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select><br>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="动作图标：" prop="icon">
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
          <el-form-item label="动作样式：" prop="aClass">
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
        <el-button type="primary" plain icon="el-icon-refresh" style="float:left;margin-left:50px;" @click="handleYes()">添加</el-button>
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
      // 表单label右对齐
      currentPage: 1,
      /*  id: undefined, */
      pid: undefined,
      displayText: undefined,
      tooltipText: undefined,
      url: undefined,
      type: undefined,
      isEnable: undefined,
      sort: undefined,
      icon: undefined,
      aClass: undefined,
      EC00001: '接口表添加出错（后台错误）！'
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
    getParamMap: function() {
      return {
        pid: this.pid,
        url: this.url,
        displayText: this.displayText,
        tooltipText: this.tooltipText,
        type: this.type,
        isEnable: this.isEnable,
        sort: this.sort,
        icon: this.icon,
        aClass: this.aClass,
        modifierCode: this.useInfo.code,
        modifierName: this.useInfo.name,
        createUserCode: this.useInfo.code,
        createUserName: this.useInfo.name,
        version: 0,
        isDel: 0
      }
    },
    // 错误消息过滤
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
      if (this.sort.length === 1 && (/^[0-9]*$/.test(this.sort))) {
        if (this.type === undefined ||
        this.displayText === undefined ||
        this.tooltipText === undefined ||
        this.url === undefined ||
        this.sort === undefined ||
        this.isEnable === undefined ||
        this.icon === undefined ||
        this.aClass === undefined
        ) {
          if (this.notifyInstance) {
            this.notifyInstance.close()
          }
          this.notifyInstance = this.$notify({
            title: '警告信息',
            message: '请输入有效数据',
            type: 'error',
            position: 'bottom-right'
          })
        } else {
          axios.post('/api/a01auth/pageres/addPageres', this.getParamMap()).then((res) => {
            if (res.data.status === 1) {
              this.$router.push('pageres')
              if (this.notifyInstance) {
                this.notifyInstance.close()
              }
              this.notifyInstance = this.$notify({
                type: 'success',
                message: '添加成功!',
                position: 'bottom-right'
              })
            } else {
              this.msg = res.data.msg
              if (this.msg === 'EC00001') {
                this.open2(this.EC00001)
              }
            }
          })
        }
      } else {
        if (this.notifyInstance) {
          this.notifyInstance.close()
        }
        this.notifyInstance = this.$notify({
          title: '警告',
          message: '请输入位数为一的有效数字排序',
          type: 'warning',
          position: 'bottom-right'
        })
      }
    },
    handleNO() {
      this.$router.push('pageres')
    }
  }
}
</script>

