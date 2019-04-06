import Vue from 'vue'
import ShortNIM_addon from './ShortNIM_addon.vue'

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(ShortNIM_addon)
}).$mount('#shortnim_addon')
export default app
