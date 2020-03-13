<template>
  <div>
    <!-- <b>Vusername </b>
    <Vusername v-model="cData" />{{ cData.status }} {{ cData.value }} {{ cData.msg }}
    <br><br><br><br>
    <b>VtextInput</b>
    <VtextInput v-model="cData" />{{ cData.status }} {{ cData.msg }}
    <br><br><br><br>
    <b>Vtextarea</b>
    <Vtextarea v-model="cData" />{{ cData.status }}
    <br><br><br><br>
    <b>Vphone</b>
    <Vphone v-model="cData" />{{ cData.status }}{{ cData.msg }} -->
    <b>ComMoney</b>
    <ComMoney v-model="cData" />{{ cData.status }}{{ cData.msg }}
  </div>
</template>

<script>

// import Vusername from '@/components/com-username.vue'
// import VtextInput from '@/components/com-textInput.vue'
// import Vtextarea from '@/components/com-textarea.vue'
// import Vphone from '@/components/com-phone.vue'
import ComMoney from '@/components/com-money.vue'

export default {
  name: 'TestUsername',
  components: {
    // Vusername,
    // VtextInput,
    // Vtextarea,
    // Vphone,
    ComMoney
  },
  data() {
    return {
      cData: {
        outname: '测试:',
        status: 0,
        value: '',
        value1: '',
        msg: ''
      }
    }
  }
}
</script>
