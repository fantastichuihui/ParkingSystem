<template>
  <div>
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          园区名称：
          <el-input
            v-model="editParkName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          省份：
          <el-select v-model="editProvince" placeholder="请选择省份" class="g_input" @change="inputChange">
            <el-option
              v-for="item in allProvince"
              :key="item.cnValue"
              :label="item.cnValue"
              :value="item.cnValue"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          所在城市：
          <el-select v-model="editCity" placeholder="请选择市区" class="g_input" @change="inputChange">
            <el-option v-for="item in allCity" :key="item" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系人姓名：
          <el-input
            v-model="editConcateName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          详细地址：
          <el-input
            v-model="editDetail_address"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          经度：
          <el-input
            v-model="editLng"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            oninput="value=value.replace(/[^\d.]/g,'')"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          维度：
          <el-input
            v-model="editLat"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            oninput="value=value.replace(/[^\d.]/g,'')"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系电话：
          <el-input
            v-model="editConcatePhone"
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
      </el-row>
      <div class="g_button">
        <el-button type="primary" plain icon="el-icon-search" @click="editParkReset">重置</el-button>
        <el-button type="primary" plain icon="el-icon-minus" @click="editParkCancel">取消</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-refresh"
          :disabled="buttonLimit"
          @click="editParkSave"
        >保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestTable',
  data() {
    return {
      editParkName: this.$route.params.resultData.name, // 添加园区名称
      editProvince: this.$route.params.resultData.Column_15, // 添加省份
      editCity: this.$route.params.resultData.Column_17, // 添加城市
      editConcateName: this.$route.params.resultData.concateName, // 添加联系人
      editDetail_address: this.$route.params.resultData.detail_address, // 添加详细地址
      editLng: this.$route.params.resultData.lng, // 经度
      editLat: this.$route.params.resultData.lat, // 维度
      editConcatePhone: this.$route.params.resultData.concatePhone, // 添加联系人电话
      editTextarea: this.$route.params.resultData.remark, // 添加备注
      allProvince: [],
      allCity: [],
      buttonLimit: true
    }
  },

  watch: {
    editProvince: function() {
      this.editCity = ''
      const array2 = []
      this.allProvince.forEach((item, index) => {
        if (item.cnValue === this.editProvince) {
          item.children.forEach((item2, index) => {
            array2.push(item2.cnValue)
          })
        }
      })
      this.allCity = array2
    }
  },

  created: function() {
    // 园区文件的获取
    const list = {}
    list.page = 1
    list.rows = 10
    this.$axios({
      method: 'get',
      url: '/api/b03res/packmanage/findallpark',
      params: list
    }).then(response => {
      this.allParkName = response.data.resultMap.rows
    })

    // 全国省市的获取
    this.$axios({
      method: 'get',
      url: '/api/a04ds/datastandard/findProviceTree '
    }).then(response => {
      this.allProvince = response.data.resultData.children
    })
  },

  methods: {
    //   重置
    editParkReset: function() {
      this.editParkName = this.$route.params.resultData.name
      this.editProvince = this.$route.params.resultData.Column_15
      this.editCity = this.$route.params.resultData.Column_17
      this.editConcateName = this.$route.params.resultData.concateName
      this.editDetail_address = this.$route.params.resultData.detail_address
      this.editLng = this.$route.params.resultData.lng
      this.editLat = this.$route.params.resultData.lat
      this.editConcatePhone = this.$route.params.resultData.concatePhone
      this.editTextarea = this.$route.params.resultData.remark
    },

    // 取消
    editParkCancel: function() {
      this.$router.push({
        name: 'park'
      })
    },

    // 按钮的限制
    inputChange: function() {
      if (
        !this.editParkName ||
        !this.editProvince ||
        !this.editCity ||
        !this.editConcateName ||
        !this.editDetail_address ||
        !this.editConcatePhone
      ) {
        this.buttonLimit = true
      } else
      if (this.editParkName === this.$route.params.resultData.name &&
      this.editProvince === this.$route.params.resultData.Column_15 &&
      this.editCity === this.$route.params.resultData.Column_17 &&
      this.editConcateName === this.$route.params.resultData.concateName &&
      this.editDetail_address === this.$route.params.resultData.detail_address &&
      this.editLng === this.$route.params.resultData.lng &&
      this.editLat === this.$route.params.resultData.lat &&
      this.editConcatePhone === this.$route.params.resultData.concatePhone &&
      this.editTextarea === this.$route.params.resultData.remark
      ) {
        this.buttonLimit = true
      } else {
        this.buttonLimit = false
      }
    },

    // 保存
    editParkSave: function() {
      const list = {}
      list.name = this.editParkName
      list.Column_15 = this.editProvince
      list.Column_17 = this.editCity
      list.concateName = this.editConcateName
      list.detail_address = this.editDetail_address
      list.lng = this.editLng
      list.lat = this.editLat
      list.concatePhone = this.editConcatePhone
      list.remark = this.editTextarea
      list.id = this.$route.params.resultData.id
      list.version = this.$route.params.resultData.version
      list.modifierCode = this.$store.state.userInfo.code
      list.modifierName = this.$store.state.userInfo.name
      list.isDel = this.$route.params.resultData.isDel
      this.$axios({
        method: 'post',
        url: '/api/b03res/packmanage/updatepark',
        data: list
      }).then(response => {
        if (response.data.status === 1) {
          this.$notify({
            title: '成功',
            message: '园区修改成功',
            type: 'success',
            position: 'bottom-right'
          })
        }
        this.$router.push({
          name: 'park'
        })
      })
    }
  }
}
</script>
