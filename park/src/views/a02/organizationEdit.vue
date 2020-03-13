<template>
  <div class="g_container">
    <el-form
      ref="organization"
      :model="organization"
      :rules="rules"
      class="g_elForm"
      :label-position="labelPosition"
      label-width="150px"
    >
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="组织机构编码：" prop="code">
            <el-input
              v-model.trim="organization.code"
              class="g_elFormInput_other"
              placeholder="请输入组织机构编码"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="组织机构名称：" prop="name">
            <el-input
              v-model.trim="organization.name"
              class="g_elFormSelect_other"
              placeholder="请输入组织机构名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="附属机构编码：" prop="pcode">
            <el-input
              v-model.trim="organization.pcode"
              class="g_elFormInput_other"
              :disabled="true"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="附属机构名称：" prop="pname">
            <el-input
              v-model.trim="organization.pname"
              class="g_elFormInput_other"
              :disabled="true"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="组织机构级别：" prop="orgLevel">
            <el-input-number
              v-model.trim="organization.orgLevel"
              class="g_elFormInput_other"
              controls-position="right"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
          <el-form-item label="机构同级排序：" prop="sort">
            <el-input-number
              v-model.trim="organization.sort"
              class="g_elFormInput_other"
              controls-position="right"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6" justify="center">
        <el-button type="primary" plain style="float:left;" icon="el-icon-search" @click="handleReset()">重置</el-button>
        <el-button type="primary" plain style="float:left;" icon="el-icon-search" @click="handleNo()">取消</el-button>
        <el-button type="primary" plain style="float:left;" icon="el-icon-refresh" @click="handleYes()">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from 'axios'
import * as systemTips from '@/utils/systemTips.js'
export default {
  data() {
    return {
      // 表单label右对齐
      labelPosition: 'right',
      organization: {
        id: undefined,
        version: undefined,
        name: '',
        code: '',
        pcode: '',
        pname: '',
        orgLevel: 1,
        sort: 1
      },
       // 校验
      rules: {
        code: [
          { required: true, message: '请输入组织机构编码', trigger: 'blur' },
          { max: 32, message: '组织机构编码最大长度为32', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]+$/, message: '组织机构编码只能为英文或数字，不包含特殊字符！', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入组织机构名称', trigger: 'blur' },
          { max: 50, message: '组织机构名称最大长度为50', trigger: 'blur' },
          { pattern: /^[\u0391-\uFFE5A-Za-z0-9]+$/, message: '组织机构名称只能为中文、英文、数字，不包含特殊字符！', trigger: 'blur' }
        ],
        orgLevel: [
          { required: true, message: '请输入组织机构级别', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入机构同级排序', trigger: 'blur' }
        ]
      },
    }
  }, 
  created() {
    if(this.$route.params.organization){
      this.organization.id = this.$route.params.organization.id
      this.organization.code = this.$route.params.organization.code
      this.organization.name = this.$route.params.organization.name
      this.organization.pcode = this.$route.params.organization.pcode
      this.organization.pname = this.$route.params.organization.pname
      this.organization.version = this.$route.params.organization.version
      this.organization.orgLevel = this.$route.params.organization.orgLevel
      this.organization.sort = this.$route.params.organization.sort
    }
  },
  methods: {
    handleYes(organization) {
     this.$refs['organization'].validate((valid) => {
       if(this.$route.params.organization.code === this.organization.code
       && this.$route.params.organization.name === this.organization.name
       && this.$route.params.organization.orgLevel === this.organization.orgLevel
       && this.$route.params.organization.sort === this.organization.sort){
         systemTips.warning('未修改任何数据')
         return 
       }
        if (valid) {
          this.organization.modifierCode = this.$store.state.userInfo.code
          this.organization.modifierName = this.$store.state.userInfo.name
          axios.post('/api/a02person/organization/updateorg', this.organization).then((res) => {
            if (res.data.resultData > 0) {
              systemTips.success('修改成功')
              this.$router.push('organization')
            } else {
              systemTips.error('修改失败')
            }
          }).catch(e => {
              systemTips.error('修改失败')
          });
        } else {
          return false
        }
       });
    },
    handleNo() {
      this.$router.push('organization')
    }
  }
}
</script>
