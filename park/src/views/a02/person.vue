<template>
  <div class="g_container">
    <div class="g_inputForm">
      <el-form v-model="person" class="exeOrder_form">
        <el-row style="margin-left:20px;">
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="用户名称：" prop="name">
              <el-input
                v-model="person.name"
                placeholder="请输入内容"
                class="g_elFormSelect"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="人员别名：" prop="aliases">
              <el-input
                v-model="person.aliases"
                placeholder="请输入内容"
                class="g_elFormSelect"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="联系电话：" prop="tel">
              <el-input
                v-model="person.tel"
                placeholder="请输入内容"
                class="g_elFormSelect"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="手机号码：" prop="mobilePhone">
              <el-input
                v-model="person.mobilePhone"
                placeholder="请输入内容"
                class="g_elFormSelect"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="人员性别：" prop="sex">
              <el-select v-model="person.sex" class="g_elFormSelect" placeholder="请选择">
                <el-option label="男" value="1" />
                <el-option label="女" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="身份证号：" prop="idCard">
              <el-input
                v-model="person.idCard"
                placeholder="请输入内容"
                class="g_elFormSelect"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="联系邮箱：" prop="email">
              <el-input
                v-model="person.email"
                placeholder="请输入内容"
                class="g_elFormSelect"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="7" :xl="6">
            <el-form-item label="出生日期：" prop="birthday">
              <el-date-picker
                v-model="person.birthday"
                align="right"
                type="date"
                style="width:50%;"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="2" :sm="4" :md="6" :lg="8" :xl="6">
            <el-form-item label="用户类型：" prop="personTypeCode">
              <el-select
                v-model="person.personTypeCode"
                class="g_elFormSelect"
                placeholder="请选择用户类型"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="g_button">
      <el-button type="primary" plain icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button type="primary" plain icon="el-icon-refresh" @click="handleRefresh">重置</el-button>

      <el-button
        type="primary"
        plain
        icon="el-icon-delete"
        @click="readyDelete()"
      >刪除</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-edit"
        @click="handleEdit()"
      >修改</el-button>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        @click="handleAdd"
      >添加</el-button>
    </div>
    <el-table
      :data="tableData"
      class="g_table"
      :header-cell-style="{background:'#ecf5ff',fontSize:'14px',color:'#606266'}"
      border
      @selection-change="handleSelectionChange"
    >
      <!-- 全选 -->
      <el-table-column class="g_tableSelection" type="selection" />
      <!-- 序号 -->
      <el-table-column label="序号" type="index" align="center" width="60px" />
      <!-- ID(hidden) -->
      <el-table-column v-if="show" label="用户ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <!-- 用户名称 -->
      <el-table-column label="用户名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <!-- 人员别名 -->
      <el-table-column label="人员别名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.aliases }}</span>
        </template>
      </el-table-column>
      <!-- 时间 -->
      <el-table-column label="性别" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>

      <el-table-column label="出生日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.birthday }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证号码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.idCard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobilePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人员类型编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.personTypeCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人员类型名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.personTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="更改人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="更改人姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifierName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="更改时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="创建人编码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserCode }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="创建人名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createUserName }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="乐观锁" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="show" label="是否删除" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isDel }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="g_pagination">
      <el-pagination
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PersonAdd',
  data() {
    return {
      person: {
        name: '',
        aliases: '',
        sex: '',
        birthday: '',
        idCard: '',
        tel: '',
        mobilePhone: '',
        email: '',
        personTypeCode: ''
      },
      options: [{
        value: '1',
        label: '公司员工'
      }, {
        value: '2',
        label: '客户人员'
      }],
      value: '',
      show: false,
      currentPage: 1,
      total: 100,
      pageSize: 10,
      tableData: [],
      multipleTable: []
    }
  },
  computed: {
    myRouter: function() {
      return this.$router
    }
  },
  created() {
    this.search()
  },
  methods: {
    search: function() {
      axios.post('/api/a02person/person/selectPerInfoByPage', this.getParamMap()).then((response) => {
        this.tableData = response.data.resultData.rows // 用list接收这个数据
        this.total = response.data.resultData.total
      }).catch((error) => { // 接收错误
        console.log(error)
      })
    },
    getParamMap: function() {
      return {
        page: this.currentPage,
        rows: this.pageSize,
        name: this.person.name,
        aliases: this.person.aliases,
        sex: this.person.sex,
        birthday: this.person.birthday,
        idCard: this.person.idCard,
        tel: this.person.tel,
        mobilePhone: this.person.mobilePhone,
        email: this.person.email,
        personTypeCode: this.person.personTypeCode
      }
    },
    handleSizeChange: function(val) {
      console.log(' xxxxx' + this)
      this.pageSize = val
      this.search()
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange: function(val) {
      this.currentPage = val
      this.search()
      console.log(`当前页: ${val}`)
    },
    handleSelectionChange(val) {
      this.multipleTable = val
    },
    // 重置
    handleRefresh: function() {
      this.person = {}
      this.search()
    },
    // 查询
    handleFilter: function() {
      this.search()
    },
    // 删除
    readyDelete() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error',
          position: 'bottom-right'
        })
      } else {
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const selectLength = this.multipleTable.length
          const listmap = []
          const select = this.multipleTable
          for (let i = 0; i < selectLength; i++) {
            const ids = {}
            ids.id = select[i].id
            listmap[i] = ids
          }
          /*    console.log(listmap) */
          axios.post('/api/a02person/person/delete', listmap).then((res) => {
            this.search()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 修改
    handleEdit: function() {
      if (this.multipleTable.length === 0) {
        this.$notify({
          title: '警告信息',
          message: '请选择至少一条数据',
          type: 'error'
        })
      } else if (this.multipleTable.length > 1) {
        this.$notify({
          title: '警告信息',
          message: '最多只能选择一条数据进行操作',
          type: 'error'
        })
      } else {
        this.$router.push({ name: 'personEdit', params: { persons: this.multipleTable[0] }})
      }
    },
    // 添加
    handleAdd: function() {
      this.$router.push({ name: 'personAdd' })
    }
  }
}
</script>
