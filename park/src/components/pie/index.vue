<template>
  <div>
    <div id="main" style="width: 100%;height: 100%" />
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'Pie',
  data() {
    return {
      charts: '',
      opinion: ['冷轧卷板', '热轧卷板', '球扁钢', '冷轧镀锌卷'],
      opinionData: [{
        value: 635,
        name: '冷轧卷板',
        itemStyle: {
          color: '#CD3700'
        }
      },
      {
        value: 310,
        name: '热轧卷板',
        itemStyle: {
          color: '#5F9EA0'
        }
      },
      {
        value: 234,
        name: '球扁钢',
        itemStyle: {
          color: '#6B8E23'
        }
      },
      {
        value: 135,
        name: '冷轧镀锌卷',
        itemStyle: {
          color: '#FFC125'
        }
      }
      ]
    }
  },

  // 调用
  mounted() {
    this.$nextTick(function() {
      this.drawPie('main')
    })
  },
  methods: {
    drawPie(id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({

        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b}:{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: this.opinion
        },
        series: [{
          name: '品类',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,

              textStyle: {
                fontSize: '20',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.opinionData
        }]
      })
    },
    drawLine(id) {

    }
  }
}
</script>

<style>
</style>
