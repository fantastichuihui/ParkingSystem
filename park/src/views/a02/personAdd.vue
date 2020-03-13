<template>
  <div class="container">
    <div class="form">
      <fieldset style="width:100%">
        <legend style="text-align:left; margin-left:0">用户信息</legend>
        <el-row type="flex" justify="center" style="padding-top:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">用户名称：</label>
            <el-input v-model.trim="personForm.name" placeholder="请输入内容" class="addInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">人员别名：</label>
            <el-input v-model.trim="personForm.aliases" placeholder="请输入内容" class="addInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10" style="padding-top:15px;">
            <label class="addSexLabel">人员性别：</label>
            <el-radio v-model="personForm.sex" label="1" value="1">男</el-radio>
            <el-radio v-model="personForm.sex" class="addRadio" label="0" value="0">女</el-radio>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">用户类型：</label>
            <el-select v-model="personForm.personTypeCode" class="addInput" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">出生日期：</label>
            <el-date-picker
              v-model="personForm.birthday"
              align="right"
              type="date"
              class="addInput"
              placeholder="选择日期"
              style="width:250px"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">联系电话：</label>
            <el-input v-model.trim="personForm.personTel" placeholder="请输联系电话" class="addInput" clearable />
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">身份证号：</label>
            <el-input v-model.trim="personForm.idCard" placeholder="请输身份证号" class="addInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">联系邮箱：</label>
            <el-input v-model.trim="personForm.personEmail" placeholder="请输联系邮箱" class="addInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">联系手机：</label>
            <el-input v-model.trim="personForm.personMobilePhone" placeholder="请输联系手机" class="addInput" clearable />
          </el-col>
        </el-row>

        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">人员编码：</label>
            <el-input v-model.trim="personForm.personCode" placeholder="请输入人员编码" class="addInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">用  户  组:&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <el-select v-model="personForm.userSelectGroups" multiple class="addInput" placeholder="请选择">
              <el-option v-for="item in allGroups" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">分配角色：</label>
            <el-select v-model="personForm.userSelectRoles" multiple class="addInput" placeholder="请选择">
              <el-option v-for="item1 in allRoles" :key="item1.id" :label="item1.name" :value="item1.id" />
            </el-select>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset style="width:100%;margin-top:20px;">
        <legend style="text-align:left;margin-left:0px;">职务信息</legend>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">主职组织：</label>
            <el-select v-model="personForm.userMainOrg" class="addInput" placeholder="请选择">
              <el-option v-for="item2 in allOrgs" :key="item2.id" :label="item2.name" :value="item2.id" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">职务：</label>
            <el-select v-model="personForm.userMainJob" class="addInput" placeholder="请选择职务">
              <el-option
                v-for="item3 in allJobs"
                :key="item3.lCode"
                :label="item3.cnValue"
                :value="item3.lCode"
              />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-button type="primary" plain style="float:right" icon="el-icon-plus" circle @click="handleAddOrg()" />
          </el-col>
        </el-row>
        <el-row v-for="(orgSelect,index) in personForm.orgSelecteds" :key="index" type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">兼职组织：</label>
            <el-select v-model="orgSelect.orgId" class="addInput" placeholder="请选择">
              <el-option
                v-for="item2 in allOrgs"
                :key="item2.id"
                :label="item2.name"
                :value="item2.id"
              />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="addLabel">职务：</label>
            <el-select v-model="orgSelect.jobCode" class="addInput" placeholder="请选择职务">
              <el-option
                v-for="item3 in allJobs"
                :key="item3.lCode"
                :label="item3.cnValue"
                :value="item3.lCode"
              />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <el-button type="danger" plain circle icon="el-icon-delete" @click="handleRemoveOrg(index)" />
          </el-col>
        </el-row>
      </fieldset>
      <el-button type="primary" plain icon="el-icon-search" style="float:right;" @click="handleNo()">取消</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" style="float:right; margin-right:10px;" @click="handleYes()">确定</el-button>
    </div>
  </div>
</template>

<style>
.container {
  width: 100%;
  height: 100%;
  text-align: left;
}

.form {
  width: 90%;
  margin-top: 20px;
}

.addLabel {
  color: #606266;
  font-weight: normal;
}

.addInput {
  width: 250px;
  margin-bottom: 30px;
}

.addSexLabel {
  color: #606266;
  font-weight: normal;
}

.addSelect {
  width: 250px;
  margin-right: 16%;
  margin-bottom: 30px;
}

.addDatePicker {
  margin-right: 16%;
  margin-bottom: 30px;
}

.addRadio {
  margin-bottom: 30px;
  margin-right: 20%;
}

.addComponent {
  margin-left: 25%;
  margin-right: 15%;
  margin-bottom: 30px;
}
.addSelectedsLabel {
  margin-left: 15%;
  color: #606266;
  font-weight: normal;
}

.addSelectedsLabel2 {
  color: #606266;
  font-weight: normal;
}
.addSelecteds {
  width: 30%;
}
.addSelecteds2 {
  width: 30%;
  margin-bottom: 30px;
}
</style>

<script>
import axios from 'axios'
import * as systemTips from '@/utils/systemTips.js'

export default {
  //  引入组件
  data() {
    return {
      currentPage: 1,
      personForm: {
        // 人员姓名
        name: '',
        // 人员别名
        aliases: '',
        // 人员性别
        sex: '1',
        // 人员生日
        birthday: '',
        // 人员类型
        personTypeCode: '',
        // 人员类型名称
        personTypeName: '',
        // 联系电话
        personTel: '',
        // 手机
        personMobilePhone: '',
        // 邮箱
        personEmail: '',
        // 身份证号
        idCard: '',
        // 人员编码
        personCode: '',
        // 用户选择的用户组
        userSelectGroups: [],
        // 用户选择的角色信息
        userSelectRoles: [],
        // 用户主组织
        userMainOrg: '',
        // 用户主组织职务编码
        userMainJob: '',
        // 用户主组织职务名称
        userMainJobName: '',
        // 用户选择的兼职组织
        orgSelecteds: [{}],
        // 当前登录入code
        currentUserCode: this.$store.state.userInfo.code,
        // 当前登录人姓名
        currentUserName: this.$store.state.userInfo.name,
        // 版本号
        version: 0,
        // 删除标记
        isDel: 0
      },

      // 人员类型初始化列表
      options: [
        {
          value: '1',
          label: '公司员工'
        },
        {
          value: '2',
          label: '客户人员'
        }
      ],
      // 所有的用户组信息
      allGroups: [],
      // 所有的角色信息
      allRoles: [],
      // 所有的组织信息
      allOrgs: [],
      // 所有的职务信息
      allJobs: [],
      groupIds: [],
      roleIds: [],
      org1: '',
      org2: '',
      // 抓到的后台错误编码
      EW00004: '人员表添加出错（后台错误）！'
    }
  },
  computed: {
    mstr: function() {
      return this.$store.state.userInfo
    }
  },
  watch: {
    'personForm.personTypeCode': function(newValue) {
      for (const personType of this.options) {
        if (personType.value === newValue) {
          this.personForm.personTypeName = personType.label
        }
      }
    }
  },
  created() {
    axios.get('/api/a04ds/datastandard/getComboByCode/MD02').then(res => {
      this.allJobs = res.data
    })
    axios.get('/api/a02person/organization/selectName').then(res => {
      this.allOrgs = res.data
    })
    axios.get('/api/a01auth/usergroup/selectGroupNameAndId').then(res => {
      this.allGroups = res.data.resultData
    })
    axios.get('/api/a01auth/role/findAllRole').then(res => {
      this.allRoles = res.data
    })
  },
  methods: {
    getParamMap: function() {
      const sel = []
      // 通过用户编码得到用户名称
      let personTypeName = ''
      this.options.forEach((item, index) => {
        if (item.value === this.personTypeCode) {
          personTypeName = item.label
        }
      })
      for (let i = 0; i < this.group.length; i++) {
        const ids = {}
        ids.groupId = this.group[i]
        this.groupIds[i] = ids
      }
      for (let i = 0; i < this.role.length; i++) {
        const ids = {}
        ids.roleId = this.role[i]
        this.roleIds[i] = ids
      }
      // 处理职务编码和职务名称的映射，做成map
      const jobMapping = {}
      this.options.forEach((item, index) => {
        jobMapping[item.value] = item.label
      })
      // 兼职
      const type = { type: 0 }
      // let jName = ''

      // 遍历页面上选中的兼职
      for (let i = 0; i < this.orgSelecteds.length; i++) {
        // 组织id
        type.organizationId = this.orgSelecteds[i].orgId
        // 职务编码
        type.jobCode = this.orgSelecteds[i].jobCode
        // 职务名称
        type.jobName = jobMapping[type.jobCode]
        sel.push(type)
        console.log(sel)
      }
      // 追加主职组织
      var primarySel = {
        type: 1,
        organizationId: this.org1,
        jobCode: this.org2,
        jobName: jobMapping[this.org2]
      }
      sel.push(primarySel)
      return {
        name: this.name,
        aliases: this.aliases,
        sex: this.sex,
        birthday: this.birthday,
        idCard: this.idCard.value,
        tel: this.tel.value,
        mobilePhone: this.mobilePhone.value,
        email: this.email.value,
        personTypeCode: this.personTypeCode,
        personTypeName: personTypeName,
        groupId: this.groupIds,
        roleId: this.roleIds,
        orgs: sel,
        userAccount: [
          { userAccount: 'wang' },
          { userAccount: 'zhang' },
          { userAccount: 'li' }
        ]
      }
    },
    handleYes() {
      const jobMap = {}
      this.allJobs.forEach(item => {
        jobMap[item.lCode] = item.cnValue
      })

      // 发送请求之前，对组织数据进行校验
      this.personForm.userMainJobName = jobMap[this.personForm.userMainJob]
      const submitOrgCodes = []
      submitOrgCodes.push(this.personForm.userMainOrg)
      for (const index in this.personForm.orgSelecteds) {
        if (submitOrgCodes.includes(this.personForm.orgSelecteds[index].orgId)) {
          systemTips.error('存在重复的组织信息!')
          return
        } else {
          submitOrgCodes.push(this.personForm.orgSelecteds[index].orgId)
          this.personForm.orgSelecteds[index]['jobName'] = jobMap[this.personForm.orgSelecteds[index].jobCode]
          this.personForm.orgSelecteds[index]['jobType'] = 0
        }
      }
      // 发送请求之前，对请求数据进行职务名称的拼装
      this.handleSave().then(res => {
        systemTips.success('数据保存成功!')
      })
    },
    handleNo() {
      this.$router.push('person')
    },
    handleAddOrg() {
      this.personForm.orgSelecteds.push({})
    },
    handleRemoveOrg(index) {
      this.personForm.orgSelecteds.splice(index, 1)
    },
    saveT0A01() {
      return new Promise((resolve, reject) => {
        axios.post('/api/a01auth/personAccount/savePersonRoleRef', this.personForm).then(res => {
          // console.log(res)
          resolve(res)
        })
      })
    },
    saveToA02() {
      return new Promise((resolve, reject) => {
        axios.post('/api/a02person/person/save', this.personForm).then(res => {
          // console.log(res)
          resolve(res)
        })
      })
    },
    saveToUaa() {
      return new Promise((resolve, reject) => {
        const uaaParam = {}
        uaaParam.userAccount = this.personForm.personMobilePhone
        uaaParam.password = '123456'
        uaaParam.state = true
        uaaParam.audit = true
        uaaParam.isDel = false
        uaaParam.modifier = this.personForm.currentUserName
        uaaParam.createUser = this.personForm.currentUserName
        uaaParam.version = 0
        axios.post('/api/uaa/account/register', uaaParam).then(res => {
          resolve(res)
        })
      })
    },
    async handleSave() {
      let uaaResult = await this.saveToUaa()
      this.personForm.personUaaId = uaaResult.data.id
      uaaResult = await this.saveToA02()
      this.personForm.personId = uaaResult.data.resultData
      await this.saveT0A01()
    }
  }
}
</script>
