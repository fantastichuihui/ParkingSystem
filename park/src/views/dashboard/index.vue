<template>
  <div class="dashboard-container">
    <div style="width: 1600px; height:900px">
      <div style="width: 90%">
        <div class="box_sing">
          <svg-icon icon-class="user" class="icon-left" color="#1C1C1C" />
          <div style="color:white" class="text-right">
            <h1 style="width: 100%">{{ deliveryWeight }}</h1>
            <h4 style="width: 100%">当天发货吨数</h4>
          </div>
        </div>
        <div class="box_double">
          <svg-icon icon-class="form" class="icon-left" color="#1C1C1C" />
          <div style="color:white" class="text-right">
            <h1 style="width: 100%">{{ stockWeight }}</h1>
            <h4 style="width: 100%">当天库存吨数</h4>
          </div>
        </div>
        <div class="box_sing">
          <svg-icon icon-class="tree" class="icon-left" color="#1C1C1C" />
          <div style="color:white" class="text-right">
            <h1 style="width: 100%">{{ parkName }}</h1>
            <h4 style="width: 100%">发货量最高园区</h4>
          </div>
        </div>
        <div class="box_double">
          <svg-icon icon-class="eye" class="icon-left" color="#1C1C1C" />
          <div style="color:white" class="text-right">
            <h1 style="width: 100%">{{ result }}</h1>
            <h4 style="width: 100%">园区最高发货吨数</h4>
          </div>
        </div>
      </div>
      <div style="width: 85%">
        <div class="radar_com" style="width: 45%;height: 400px;float:left; margin-top: 30px;">
          <div id="radar" style="width: 100%;height: 100%">
            <Radar style="width: 100%;height:100%;" />
          </div>
        </div>

        <div class="pie_com" style="width: 45%;height: 400px;float:right; margin-top: 30px;">
          <div id="pie" style="width: 100%;height: 100%;">
            <Pie style="width: 100%;height:100%" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Radar from '@/components/radar/index.vue'
import Pie from '@/components/pie/index.vue'
import axios from 'axios'

export default {
  name: 'Dashboard',
  components: {
    Radar,
    Pie
  },
  data() {
    return {
      deliveryWeight: '',
      stockWeight: '',
      parkName: '',
      result: ''
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  created() {
    const svgs = document.getElementsByTagName('svg')
    for (let i = 0; i < svgs.length; i++) {
      svgs[i].fill = '#fff'
    }
    this.search()
  },
  methods: {
    search: function() {
      axios.get('/api/b06report/b06/selectAllWeight'
      ).then((response) => {
        this.deliveryWeight = response.data.deliveryWeight
        // 用list接收这个数据;
      }).catch((error) => { // 接收错误
        console.log(error)
      })
      axios.get('/api/b06report/b06/selectStock'
      ).then((response) => {
        this.stockWeight = response.data.stockWeight
        // 用list接收这个数据;
      }).catch((error) => { // 接收错误
        console.log(error)
      })
      axios.get('/api/b06report/b06/selectTopP'
      ).then((response) => {
        this.parkName = response.data.parkName
        this.result = response.data.result
        // 用list接收这个数据;
      }).catch((error) => { // 接收错误
        console.log(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
body{
  background-color: #F0F0F0
}
.dashboard {
  &-container {
    margin: 30px;
    background-color: #F0F0F0
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.box_sing {
  font-size: 12px;
  opacity: 0.69;
  line-height: 24px;
  position: relative;
  border-radius: 4px;
  padding: 20px;
  margin: 2.5% 2.5%;
  height: 114px;
  background:	#3399CC;
  width: 20%;
  float: left;
}
.box_double {
  font-size: 12px;
  opacity: 0.69;
  line-height: 24px;
  position: relative;
  border-radius: 4px;
  padding: 20px;
  margin: 2.5% 2.5%;
  height: 114px;
  background: #336699;
  width: 20%;
  float: left;
}
#pie {
  padding: 10px;
  background-color: #ffffff;
  border-radius: 4px;
}
#radar {
  padding: 10px;
  background-color: #ffffff;
  border-radius: 4px;
}
.icon-left{
  width:20%;
  height:50px;
  float:left;
  margin-top:10px;
}
.text-right{
  width: 75%;
  height: 50px;
  margin-top: -10px;
  float: left;
  text-align: right
}
</style>
