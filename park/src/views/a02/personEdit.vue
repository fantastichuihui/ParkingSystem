<template>
  <div class="container">
    <div class="form">
      <fieldset style="width:100%">
        <legend style="text-align:left; margin-left:0">用户信息</legend>
        <el-row type="flex" justify="center" style="padding-top:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">用户名称：</label>
            <el-input
              v-model="personForm.name"
              placeholder="请输入内容"
              class="editInput"
              clearable
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">人员别名：</label>
            <el-input
              v-model="personForm.aliases"
              placeholder="请输入内容"
              class="editInput"
              clearable
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10" style="padding-top:15px;">
            <label class="editSexLabel">性别：</label>
            <el-radio v-model="personForm.sex" label="1" value="1">男</el-radio>
            <el-radio v-model="personForm.sex" class="editRadio" label="0" value="0">女</el-radio>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">用户类型：</label>
            <el-select
              v-model="personForm.personTypeCode"
              class="editSelect"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">出生日期：</label>
            <el-date-picker
              v-model="personForm.birthday"
              align="right"
              type="date"
              placeholder="选择日期"
              class="editDatePicker"
              style="width:250px;"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">联系电话：</label>
            <el-input v-model.trim="personForm.personTel" placeholder="请输联系电话" class="editInput" clearable />
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">身份证号：</label>
            <el-input v-model.trim="personForm.idCard" placeholder="请输身份证号" class="editInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">联系邮箱：</label>
            <el-input v-model.trim="personForm.personEmail" placeholder="请输联系邮箱" class="editInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">联系手机：</label>
            <el-input v-model.trim="personForm.personMobilePhone" placeholder="请输联系手机" :disabled="true" class="editInput" clearable />
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">人员编码：</label>
            <el-input v-model.trim="personForm.personCode" placeholder="请输入人员编码" class="editInput" clearable />
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">用  户  组:&nbsp;&nbsp;&nbsp;&nbsp;</label>
            <el-select v-model="personForm.userSelectGroups" multiple class="editInput" :disabled="true" placeholder="请选择">
              <el-option v-for="item in allGroups" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-col>

          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">分配角色：</label>
            <el-select v-model="personForm.userSelectRoles" multiple class="editInput" :disabled="true" placeholder="请选择">
              <el-option v-for="item1 in allRoles" :key="item1.id" :label="item1.name" :value="item1.id" />
            </el-select>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset style="width:100%;margin-top:20px;">
        <legend style="text-align:left;margin-left:0px;">职务信息</legend>
        <el-row type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">主职组织：</label>
            <el-select v-model="personForm.userMainOrg" class="editInput" :disabled="true" placeholder="请选择">
              <el-option v-for="item2 in allOrgs" :key="item2.id" :label="item2.name" :value="item2.id" />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">职务：</label>
            <el-select v-model="personForm.userMainJob" class="editInput" :disabled="true" placeholder="请选择职务">
              <el-option
                v-for="item3 in allJobs"
                :key="item3.lCode"
                :label="item3.cnValue"
                :value="item3.lCode"
              />
            </el-select>
          </el-col>
        </el-row>
        <el-row v-for="(orgSelect,index) in personForm.orgSelecteds" :key="index" type="flex" justify="center">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">兼职组织：</label>
            <el-select v-model="orgSelect.organizationId" class="editInput" :disabled="true" placeholder="请选择">
              <el-option
                v-for="item2 in allOrgs"
                :key="item2.id"
                :label="item2.name"
                :value="item2.id"
              />
            </el-select>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">
            <label class="editLabel">职务：</label>
            <el-select v-model="orgSelect.jobCode" class="editInput" :disabled="true" placeholder="请选择职务">
              <el-option
                v-for="item3 in allJobs"
                :key="item3.lCode"
                :label="item3.cnValue"
                :value="item3.lCode"
              />
            </el-select>
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
.editLabel {
  color: #606266;
  font-weight: normal
}

.editInput {
  width:250px;
  margin-right: 16%;
  margin-bottom: 30px;
}

.editSexLabel {
  color: #606266;
  font-weight: normal;
}

.editSelect {
  width: 250px;
  margin-right: 16%;
  margin-bottom: 30px;
}

.editDatePicker {
  margin-right: 16%;
  margin-bottom: 30px;
}

.editRadio {
  margin-bottom: 30px;
  margin-right: 20%;
}

.editComponent {
  margin-left: 25%;
  margin-right: 15%;
  margin-bottom: 30px;
}
.editSelectedsLabel {
  margin-left: 15%;
  color: #606266;
  font-weight: normal;
}

.editSelectedsLabel2 {
  color: #606266;
  font-weight: normal;
}
.editSelecteds {
  width: 30%;
}
.editSelecteds2 {
  width: 30%;
  margin-bottom: 30px;
}
</style>

<script>
import axios from 'axios'
import * as systemTips from '@/utils/systemTips.js'

export default {
  data() {
    return {
      currentPage: 1,
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
      personForm: {
        id: this.$route.params.persons.id,
        personId: this.$route.params.persons.id,
        // 人员姓名
        name: this.$route.params.persons.name,
        // 人员别名
        aliases: this.$route.params.persons.aliases,
        // 人员性别
        sex: String(this.$route.params.persons.sex),
        // 人员生日
        birthday: this.$route.params.persons.birthday,
        // 人员类型
        personTypeCode: this.$route.params.persons.personTypeCode,
        // 人员类型名称
        personTypeName: this.$route.params.persons.personTypeName,
        // 联系电话
        personTel: this.$route.params.persons.tel,
        // 手机
        personMobilePhone: this.$route.params.persons.mobilePhone,
        // 邮箱
        personEmail: this.$route.params.persons.email,
        // 身份证号
        idCard: this.$route.params.persons.idCard,
        // 人员编码
        personCode: this.$route.params.persons.code,
        // 用户选择的用户组
        userSelectGroups: [],
        // 用户选择的角色信息
        userSelectRoles: [],
        // 用户主组织
        userMainOrg: '',
        // 用户主组织职务
        userMainJob: '',
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
      // 所有的用户组信息
      allGroups: [],
      // 所有的角色信息
      allRoles: [],
      // 所有的组织信息
      allOrgs: [],
      // 所有的职务信息
      allJobs: []
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
    // 获取职务下拉列表
    // console.log(this.$route.params.persons)
    axios.get('/api/a04ds/datastandard/getComboByCode/MD02').then(res => {
      this.allJobs = res.data
    })
    // 获取组织下拉列表
    axios.get('/api/a02person/organization/selectName').then(res => {
      this.allOrgs = res.data
    })
    // 获取用户组下拉列表
    axios.get('/api/a01auth/usergroup/selectGroupNameAndId').then(res => {
      this.allGroups = res.data.resultData
    })
    // 获取角色下拉列表
    axios.get('/api/a01auth/role/findAllRole').then(res => {
      this.allRoles = res.data
    })

    // 根据人员id查询用户组名
    axios.get('/api/a01auth/usergroup/selectGroupByPersonIdToPerson', { params: { id: this.$route.params.persons.id }}).then((res) => {
      res.data.resultData.forEach((item, index) => {
        this.personForm.userSelectGroups.push(item.groupId)
      })
    })

    // 根据人员id查询主职组织名称
    axios.post('/api/a02person/organization/selectRefInfo', { personId: this.$route.params.persons.id }).then((res) => {
      // console.log(res.data)
      this.personForm.userMainOrg = res.data.organizationId
      this.personForm.userMainJob = res.data.jobCode
    })
    // 根据人员id查询兼职组织名称
    axios.post('/api/a02person/organization/selectRefInfoType', { personId: this.$route.params.persons.id }).then((res) => {
      this.personForm.orgSelecteds = res.data
    })

    // 根据人员id查询角色名
    axios.get('/api/a01auth/personAccount/selectrole', { params: { personId: this.$route.params.persons.id }}).then((res) => {
      // console.log(res.data)
      res.data.resultData.forEach((item, index) => {
        this.personForm.userSelectRoles.push(item.id)
      })
    })
  },
  methods: {
    getParamMap: function() {
      const sel = []
      let personTypeName = ''
      this.options.forEach((item, index) => {
        if (item.value === this.personTypeCode) {
          personTypeName = item.label
        }
      })
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
        type.organizationId = this.orgSelecteds[i].organizationId
        // 职务编码
        type.jobCode = this.orgSelecteds[i].jobCode
        // 职务名称
        type.jobName = jobMapping[type.jobCode]
        type.personId = this.id
        sel.push(type)
      }
      // 追加主职组织
      var primarySel = {
        type: 1,
        personId: this.id,
        organizationId: this.org1,
        jobCode: this.org2,
        jobName: jobMapping[this.org2]
      }
      sel.push(primarySel)

      return {
        id: this.id,
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
        isDel: this.isDel,
        orgs: sel
      }
    },
    getGroupMap: function() {
      for (let i = 0; i < this.group.length; i++) {
        const ids = {}
        ids.groupId = this.group[i]
        this.groupIds[i] = ids
      }
      return {
        personId: this.id,
        groupId: this.groupIds
      }
    },
    getRoleMap: function() {
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
      return {
        personId: this.id,
        roleIds: this.roleIds,
        groupsIds: this.groupIds
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
        if (submitOrgCodes.includes(this.personForm.orgSelecteds[index].organizationId)) {
          // console.log(submitOrgCodes, this.personForm.orgSelecteds[index].organizationId)
          systemTips.error('存在重复的组织信息!')
          return
        } else {
          submitOrgCodes.push(this.personForm.orgSelecteds[index].organizationId)
          this.personForm.orgSelecteds[index]['jobName'] = jobMap[this.personForm.orgSelecteds[index].jobCode]
          this.personForm.orgSelecteds[index]['jobType'] = 0
        }
      }
      // 发送请求之前，对请求数据进行职务名称的拼装
      this.handleSave().then(res => {
        systemTips.success('数据修改成功!')
        this.$router.push('person')
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
    updateToA02() {
      return new Promise((resolve, reject) => {
        axios.post('/api/a02person/person/update', this.personForm).then(res => {
          resolve(res)
        })
      })
    },
    async handleSave() {
      await this.updateToA02()
    }
  }
}
</script>
