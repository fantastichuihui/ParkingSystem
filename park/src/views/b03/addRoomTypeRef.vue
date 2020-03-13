<template>
  <div>
    <div class="g_inputForm">
      <el-row style="margin-left:20px;">
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          园区名称：
          <el-select v-model="addParkName" placeholder="请选择园区" class="g_input" @change="inputChange">
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
          <el-select v-model="addStoCode" placeholder="请选择" class="g_input" @change="inputChange">
            <el-option
              v-for="item in allStorageroom"
              :key="item.id"
              :label="item.storageroomName"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          仓库名称：
          <el-input
            v-model="addStoName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            disabled
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          负责人姓名：
          <el-input
            v-model="addchargeName"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            disabled
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
          联系电话：
          <el-input
            v-model="addMobilePhone"
            placeholder="请输入内容"
            class="g_input"
            maxlength="15"
            disabled
            @keyup.enter.native="handleFilter"
          />
        </el-col>

        <div v-for="(item,index) in context" :key="index">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            存储品类：
            <el-select v-model="item.typeName" class="g_input" @change="inputChange">
              <el-option
                v-for="item1 in allType"
                :key="item1"
                :label="item1"
                :value="item1"
              />
            </el-select>
          </el-col>
        </div>

        <el-button type="danger" icon="el-icon-delete" circle @click="deleteSelect" />
        <el-button type="primary" icon="el-icon-plus" circle @click="addSelect" />
        <br>
        <br>
        <br>
        <br>
        <br>

        <div class="g_button">
          <el-button type="primary" plain icon="el-icon-search" @click="addParkReset">重置</el-button>
          <el-button type="primary" plain icon="el-icon-minus" @click="addParkCancel">取消</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" :disabled="buttonLimit" @click="addParkSave">保存</el-button>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as systemTips from '@/utils/systemTips.js'
export default {
  name: 'TestTable',
  data() {
    return {
      addParkName: '', // 添加园区名称
      addProvince: '', // 添加省份
      addCity: '', // 添加城市
      addConcateName: '', // 添加联系人
      addStoCode: '', // 添加库房编码
      addStoName: '', // 库房名称
      addchargeName: '', // 负责人姓名
      addMobilePhone: '', // 添加负责人联系人电话
      addType: '', // 添加品类
      allParkName: [], // 后台园区数据
      allStorageroom: [], // 后台库房数据
      allPark: [],
      allType: [], // 后台品类数据
      parkId: '',
      context: [{}],
      typename: '',
      buttonLimit: true,
      allTypeId: []
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
      // 库房后台数据的获取
      const map = {}
      map.page = 1
      map.rows = 100
      map.parkId = this.parkId
      this.$axios({
        method: 'get',
        url: '/api/b03res/storageroom/findByParkId',
        params: map
      }).then(response => {
        this.allStorageroom = response.data.resultData.dataList
      })
    },
    addStoCode: function() {
      this.allStorageroom.forEach((item, index) => {
        if (item.id === this.addStoCode) {
          this.addStoName = item.storageroomName
          this.addchargeName = item.chargeName
          this.addMobilePhone = item.concatePhone
        }
      })
    }
  },

  created: function() {
    // 园区后台数据的获取
    const list = {}
    list.page = 1
    list.rows = 100
    this.$axios({
      method: 'get',
      url: '/api/b03res/packmanage/findallpark',
      params: list
    }).then(response => {
      this.allParkName = response.data.resultMap.rows
    })
    // 存储品类获取
    const array = new Set()
    this.$axios({
      method: 'get',
      url: '/api/b02pdm/type/findalltype'
    }).then(response => {
      response.data.resultData.forEach((item, index) => {
        array.add(item.label)
      })
      this.allType = array
      this.allTypeId = response.data.resultData
    })
  },

  methods: {
    //   重置
    addParkReset: function() {
      this.addParkName = ''
      this.addProvince = ''
      this.addCity = ''
      this.addConcateName = ''
      this.addStoCode = ''
      this.addStoName = ''
      this.addchargeName = ''
      this.addMobilePhone = ''
      this.addType = ''
      this.context.forEach((item, index) => {
        item.typeName = ''
      })
      this.buttonLimit = true
    },

    // 保存按钮设置
    inputChange: function() {
      if (this.context.length === 0 || !this.addParkName || !this.addStoCode) {
        this.buttonLimit = true
      } else {
        this.buttonLimit = false
      }
    },
    // 添加选择框
    addSelect() {
      this.context.push({})
    },

    // 删除选择框
    deleteSelect: function(index) {
      this.context.splice(index, 1)
    },

    // 取消
    addParkCancel: function() {
      this.$router.push({
        name: 'roomTypeRef'
      })
    },

    // 保存
    addParkSave: function() {
      const array = []
      //  this.allType.forEach((item,index)=>{
      //     if(item.value==this.addType){
      //         this.typename=item.label
      //     }
      // })
      // let map = new Object();
      //   map.roomid=this.addStoCode;
      //   map.typeid=this.addType;
      //   map.typename=this.typename;
      //   map.modifierCode="s008";
      //   map.createUserCode="f007";
      //   array[0]=map;

      const array2 = []
      for (let i = 0; i < this.context.length; i++) {
        this.allTypeId.forEach((item, index) => {
          if (item.label === this.context[i].typeName) {
            array2.push(item.value)
          }
        })
      }

      const set = new Set(array2)
      if (set.size !== array2.length) {
        systemTips.warning('请不要添加重复品类')
        return
      }

      for (let i = 0; i < this.context.length; i++) {
        // for(let j = 0; j < )
        const map = {}
        map.roomid = this.addStoCode
        map.typeid = array2[i]
        map.typename = this.context[i].typeName
        map.modifierCode = this.$store.state.userInfo.code
        map.createUserCode = 'h001'
        map.modifierName = this.$store.state.userInfo.name
        array[i] = map
      }
      this.$axios({
        method: 'post',
        url: '/api/b03res/roomtype/addroomtype',
        data: array
      }).then(response => {
        if (response.data.status === 1) {
          this.$notify({
            title: '成功',
            message: '添加库房信息成功',
            type: 'success',
            position: 'bottom-right'
          })
          this.$router.push({
            name: 'roomTypeRef'
          })
        } else if (response.data.status === 0) {
          this.$notify({
            title: '错误信息',
            message: '添加库房信息失败',
            type: 'error',
            position: 'bottom-right'
          })
        } else if (response.data.status === -1) {
          // this.$notify({
          //   title: '错误信息',
          //   message: '品类重复插入',
          //   type: 'error',
          //   position: 'bottom-right'
          // })
          systemTips.error('品类重复插入')
        }
      })
    }
  }
}
</script>
