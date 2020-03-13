<template>
  <div class="container" style="width: 760px;height: 100%;margin: 0 auto;">
    <div id="printHtml">
      <div v-for="(listSelect,index) in listSelecteds" ref="listSelecteds" :key="index" style="width: 760px;height: 90%;">
        <div style="width: 730px;height:110px;">
          <p style="font-size:32px;float:left;ine-height:110px;margin-left:28%">智慧物流园区核对单</p>
          <img
            :src="listSelect.quark"
            style="float:right;border:1px solid black;width: 100px;height:100px;"
          >
        </div>

        <div style="display:inline-block;page-break-after: always;">
          <p style="float:left;width:280px;color: black;font-size: 14px;text-align: left;">提货日期：<span>{{ listSelect.nowData }}</span></p>
          <p style="float:left;width:280px;color: black;font-size: 14px;text-align: left;">配车计划号：<span>{{ listSelect.delPlanNo }}</span></p>
          <p style="float:left;width:155px;color: black;font-size: 14px;text-align: left;">提货人姓名：<span>{{ listSelect.delDriverName }}</span></p>
          <p style="float:left;width:280px;color: black;font-size: 14px;text-align: left;">身份证号：<span>{{ listSelect.delDriverCard }}</span></p>
          <p style="float:left;width:280px;color: black;font-size: 14px;text-align: left;">提货车号：<span>{{ listSelect.carNo }}</span></p>
          <p style="float:left;width:175px;color: black;font-size: 14px;text-align: left;">联系电话：<span>{{ listSelect.delDriverPhone }}</span></p>
          <p style="float:left;width:700px;color: black;font-size: 14px;text-align: left;">订货单位：<span>{{ listSelect.orderName }}</span></p>
          <p style="float:left;width:700px;color: black;font-size: 14px;text-align: left;">订单打印收货人：<span>{{ listSelect.receivingName }}</span></p>
          <el-table
            :data="listSelect.checklist"
            border
            :header-cell-style="{fontFamily:'宋体',fontWeight: 'normal',fontSize:'12px'}"
            style="width:755px;font-family:'宋体';border:1px solid black;font-size:12px;clear:both"
          >
            <el-table-column label="序号" width="40px" type="index" align="center" />
            <!-- 测试ID(hidden) -->
            <el-table-column label="订单号" width="95px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.contractId }}</span>-<span>{{ row.contractItemId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="运单品名" width="115px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.natName }}</span>
              </template>
            </el-table-column>
            <!-- 规格 -->
            <el-table-column label="规格" width="95px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.length }}</span>*<span>{{ row.width }}</span>*<span>{{ row.height }}</span>
              </template>
            </el-table-column>
            <!-- 物料号 -->
            <el-table-column label="物料号" width="110px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.matNo }}</span>
              </template>
            </el-table-column>
            <!-- 钢牌号 -->
            <el-table-column label="钢牌号" width="75px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.gNo }}</span>
              </template>
            </el-table-column>
            <!-- 重量/吨 -->
            <el-table-column label="重量/吨" width="50px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.weight }}</span>
              </template>
            </el-table-column>
            <!-- 存地号 -->
            <el-table-column label="存地号" width="105px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.houseId }}</span>-<span>{{ row.storeArea }}</span>-<span>{{ row.storeRow }}</span>-<span>{{ row.sotreColumn }}</span>-<span>{{ row.storeLayer }}</span>
              </template>
            </el-table-column>
            <!-- 草垫 -->
            <el-table-column label="草垫" width="35px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.straw }}</span>
              </template>
            </el-table-column>
            <!-- 立卷 -->
            <el-table-column label="立卷" width="35px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.stand===1?'有':'无' }}</span>
              </template>
            </el-table-column>
          </el-table>
          <p style="float:left;width:180px;color: black;font-size: 14px;text-align: left;">制单人：<span>{{ listSelect.makePone }}</span></p>
          <p style="float:left;width:180px;color: black;font-size: 14px;text-align: left;">理货员：<span>{{ listSelect.makePtwo }}</span></p>
          <p style="float:left;width:180px;color: black;font-size: 14px;text-align: left;">天车司机：<span>{{ listSelect.makePthree }}</span></p>
          <p style="float:left;width:185px;color: black;font-size: 14px;text-align: left;">总计:{{ listSelect.sum }}</p>
          <p style="float:left;width:180px;color: black;font-size: 14px;text-align: left;">草垫发放人：<span>{{ listSelect.makePfour }}</span></p>
          <p style="float:left;width:180px;color: black;font-size: 14px;text-align: left;">小草垫：<span>{{ listSelect.smallStraw }}</span></p>
          <p style="float:left;width:180px;color: black;font-size: 14px;text-align: left;">中草垫：<span>{{ listSelect.mediumStraw }}</span></p>
          <p style="float:left;width:185px;color: black;font-size: 14px;text-align: left;">大草垫：<span>{{ listSelect.largeStraw }}</span></p>
        </div>

      </div>
    </div>
    <div>
      <el-button style="clear:both;margin-top:10px;" @click="printPdf">打印</el-button>
    </div>
  </div>
</template>

<script>
import { getLodop } from '@/utils/LodopFuncs'

export default {
  data() {
    console.log(this.$route)
    return {
      listSelecteds: this.$route.params.Print
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    initPage: function() {
      // 每一个核对单数据
      this.listSelecteds.forEach((item, index) => {
        item.smallStraw = 0
        item.mediumStraw = 0
        item.largeStraw = 0
        // 表格数据
        item.checklist.forEach((item1, index) => {
          item1.contractId = item.contractId
          item1.contractItemId = item.contractItemId
          if (item1.natName === '冷轧卷板' || item1.natName === '冷轧镀锌卷') {
            if (item1.straw === 0) {
              item1.straw = '无'
              if (item1.weight < 10) {
                item.smallStraw += 2
              } else if (item1.weight >= 10 && item1.weight <= 15) {
                item.mediumStraw += 2
              } else if (item1.weight > 15) {
                item.largeStraw += 2
              }
            } else {
              item1.straw = '有'
            }
          } else {
            if (item1.straw === 0) {
              item1.straw = '无'
            } else {
              item1.straw = '有'
            }
          }
        })
      })
    },
    printPdf() {
      const LODOP = getLodop()
      LODOP.PRINT_INIT('物流核对打印单')
      var cssStyle = '<style>.el-table td, .el-table th.is-leaf, .el-table--border, .el-table--group {text-align: center;border:1px solid black;}</style>'
      var printThis = cssStyle + document.getElementById('printHtml').innerHTML
      LODOP.ADD_PRINT_HTM('5mm', '3mm', 'RightMargin:5mm', 'BottomMargin:5mm', printThis)
      LODOP.PREVIEW()
      LODOP.PRINT()
    }
  }
}
</script>
