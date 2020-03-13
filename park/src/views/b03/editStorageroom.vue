<template>
  <div>
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          园区名称：
          <el-select v-model="addParkName" placeholder="请选择园区" class="g_input" disabled>
            <el-option
              v-for="item in allParkName"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          省份：
          <el-input
            v-model="addProvince"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            disabled
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          所在城市：
          <el-input
            v-model="addCity"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            disabled
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系人姓名：
          <el-input
            v-model="addConcateName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            disabled
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          仓库编码：
          <el-input
            v-model="editStoCode"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          仓库名称：
          <el-input
            v-model="editStoName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          负责人姓名：
          <el-input
            v-model="editchargeName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系电话：
          <el-input
            v-model="editMobilePhone"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          备注信息：
          <el-input v-model="editTextarea" type="textarea" placeholder="请输入内容" class="g_input" style="margin-bottom: 0; width: 300px" @change="inputChange" />
        </el-col>
        <div class="g_button">
          <el-button type="primary" plain icon="el-icon-search" @click="editStorageroomReset">重置</el-button>
          <el-button type="primary" plain icon="el-icon-minus" @click="editStorageroomCancel">取消</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" :disabled="buttonLimit" @click="addStorageroomSave">保存</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestTable',
  data() {
    return {
      addParkName: this.$route.params.resultData.parkName, // 添加园区名称
      addProvince: '', // 添加省份
      addCity: '', // 添加城市
      addConcateName: '', // 添加联系人
      editStoCode: this.$route.params.resultData.code, // 添加库房编码
      editStoName: this.$route.params.resultData.storageroomName, // 库房名称
      editchargeName: this.$route.params.resultData.chargeName, // 负责人姓名
      editMobilePhone: this.$route.params.resultData.mobilePhone, // 添加负责人联系人电话
      editTextarea: this.$route.params.resultData.remark, // 添加备注
      allParkName: [],
      allPark: [],
      parkId: '',
      buttonLimit: true
    }
  },

  // 监视园区名称的选择
  watch: {
    addParkName: function() {
      this.allParkName.forEach((item, index) => {
        if (item.name === this.addParkName) {
          this.addProvince = item.Column_15
          this.addCity = item.Column_17
          this.addConcateName = item.concateName
          this.parkId = item.id
        }
      })
    }
  },

  created: function() {
    const list = {}
    list.page = 1
    list.rows = 10
    this.$axios({
      method: 'get',
      url: '/api/b03res/packmanage/findallpark',
      params: list
    }).then(response => {
      this.allParkName = response.data.resultMap.rows
      this.allParkName.forEach((item, index) => {
        if (item.name === this.addParkName) {
          this.addProvince = item.Column_15
          this.addCity = item.Column_17
          this.addConcateName = item.concateName
          this.parkId = item.id
        }
      })
    })
  },

  methods: {
    //   重置
    editStorageroomReset: function() {
      this.editStoCode = this.$route.params.resultData.code // 添加库房编码
      this.editStoName = this.$route.params.resultData.storageroomName // 库房名称
      this.editchargeName = this.$route.params.resultData.chargeName // 负责人姓名
      this.editMobilePhone = this.$route.params.resultData.mobilePhone // 添加负责人联系人电话
      this.editTextarea = this.$route.params.resultData.remark // 添加备注
    },

    // 保存按钮的限制
    inputChange: function() {
      if (!this.editStoCode || !this.editStoName || !this.editchargeName || !this.editMobilePhone) {
        this.buttonLimit = true
      } else if (
        this.editStoCode === this.$route.params.resultData.code &&
      this.editStoName === this.$route.params.resultData.storageroomName &&
      this.editchargeName === this.$route.params.resultData.chargeName &&
      this.editMobilePhone === this.$route.params.resultData.mobilePhone &&
      this.editTextarea === this.$route.params.resultData.remark) {
        this.buttonLimit = true
      } else {
        this.buttonLimit = false
      }
    },

    // 取消
    editStorageroomCancel: function() {
      this.$router.push({
        name: 'storageroom'
      })
    },

    // 保存
    addStorageroomSave: function() {
      const list = {}
      list.id = this.$route.params.resultData.id
      list.version = this.$route.params.resultData.version
      list.name = this.editStoName
      list.code = this.editStoCode
      list.chargeName = this.editchargeName
      list.remark = this.editTextarea
      list.parkId = this.parkId
      list.isDel = this.$route.params.resultData.isDel
      list.chargeId = 1
      list.state = 1
      list.modifierCode = this.$store.state.userInfo.code
      list.modifierName = this.$store.state.userInfo.name
      list.createUserCode = this.$store.state.userInfo.code
      list.createUserName = this.$store.state.userInfo.name
      this.$axios({
        method: 'post',
        url: '/api/b03res/storageroom/updatestorageroom',
        data: list
      }).then(response => {
        if (response.data.status === 1) {
          this.$notify({
            title: '成功',
            message: '修改库房信息成功',
            type: 'success',
            position: 'bottom-right'
          })
        }
        this.$router.push({
          name: 'storageroom'
        })
      })
    }
  }
}
</script>
