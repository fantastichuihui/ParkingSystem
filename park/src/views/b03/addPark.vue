<template>
  <div>
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          园区名称：
          <el-input
            v-model="addParkName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          省份：
          <el-select v-model="addProvince" placeholder="请选择省份" class="g_input" @change="inputChange">
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
          <el-select v-model="addCity" placeholder="请选择市区" class="g_input" @change="inputChange">
            <el-option
              v-for="item in allCity"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系人姓名：
          <el-input
            v-model="addConcateName"
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
            v-model="addDetail_address"
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
            v-model="addLng"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            oninput="value=value.replace(/[^\d.]/g,'')"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          维度：
          <el-input
            v-model="addLat"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            oninput="value=value.replace(/[^\d.]/g,'')"
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系电话：
          <el-input
            v-model="addConcatePhone"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            @keyup.enter.native="handleFilter"
            @change="inputChange"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          备注信息：
          <el-input v-model="addTextarea" type="textarea" placeholder="请输入内容" class="g_input" style="margin-bottom: 0; width: 300px" />
        </el-col>
      </el-row>

      <div class="g_button">
        <el-button type="primary" plain icon="el-icon-search" @click="addParkReset">重置</el-button>
        <el-button type="primary" plain icon="el-icon-minus" @click="addParkCancel">取消</el-button>
        <el-button type="primary" plain icon="el-icon-refresh" :disabled="parkSave" @click="addParkSave">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestTable',
  data() {
    return {
      addParkName: '', // 添加园区名称
      addProvince: '', // 添加省份
      addCity: '', // 添加城市
      addConcateName: '', // 添加联系人
      addDetail_address: '', // 添加详细地址
      addLng: '', // 经度
      addLat: '', // 维度
      addConcatePhone: '', // 添加联系人电话
      addTextarea: '', // 添加备注
      parkSave: true,
      allProvince: [],
      allCity: []
    }
  },

  watch: {
    addProvince: function() {
      this.addCity = ''
      const array2 = []
      this.allProvince.forEach((item, index) => {
        if (item.cnValue === this.addProvince) {
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
    addParkReset: function() {
      this.addParkName = ''
      this.addProvince = ''
      this.addCity = ''
      this.addConcateName = ''
      this.addDetail_address = ''
      this.addLng = ''
      this.addLat = ''
      this.addConcatePhone = ''
      this.addTextarea = ''
      this.parkSave = true
    },

    // 取消
    addParkCancel: function() {
      this.$router.push({
        name: 'park'
      })
    },

    // 禁用保存键的取消
    inputChange: function() {
      if (!this.addParkName || !this.addProvince || !this.addCity || !this.addConcateName || !this.addDetail_address || !this.addConcatePhone) {
        this.parkSave = true
      } else {
        this.parkSave = false
      }
    },

    // 保存
    addParkSave: function() {
      const list = {}
      list.name = this.addParkName
      list.Column_15 = this.addProvince
      list.Column_17 = this.addCity
      list.concateName = this.addConcateName
      list.detail_address = this.addDetail_address
      list.lng = this.addLng
      list.lat = this.addLat
      list.concatePhone = this.addConcatePhone
      list.remark = this.addTextarea
      list.modifierCode = this.$store.state.userInfo.code
      list.createUserCode = 'y001'
      list.modifierName = this.$store.state.userInfo.name
      this.$axios({
        method: 'post',
        url: '/api/b03res/packmanage/addpark',
        data: list
      }).then(response => {
        if (response.data.status === 1) {
          this.$notify({
            title: '成功',
            message: '添加园区信息成功',
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
