<template>
  <div>
    <div id="main1" style="width: 100%;height: 100%;" />
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Radar',
  data() {
    return {

    }
  },

  // 调用
  mounted() {
    this.$nextTick(function() {
      this.drawRadar('main1')
    })
  },
  methods: {
    drawRadar(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '物流业务雷达图'
        },
        tooltip: {},
        legend: {
          data: ['预算分配', '实际开销']
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: '冷轧卷板', max: 6500 },
            { name: '热轧卷板', max: 16000 },
            { name: '球扁钢', max: 30000 },
            { name: '镀锌卷板', max: 38000 },
            { name: '冷轧镀锌卷板', max: 52000 }
          ]
        },
        series: [{
          name: '预算 vs 开销',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [4300, 10000, 28000, 35000, 50000, 19000],
              name: '发货量'
            },
            {
              value: [5000, 14000, 28000, 31000, 42000, 21000],
              name: '实际发货量'
            }
          ]
        }]
      })
    }

  }
}
</script>

<style>
</style>
