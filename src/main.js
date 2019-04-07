import Vue from 'vue'
import ShortNIM_addon from './ShortNIM_addon.vue'

import '@nimiq/style/nimiq-style.min.css'
import '@nimiq/style/nimiq-style.icons.svg'

Vue.config.productionTip = false

const app = new Vue({
  render: h => h(ShortNIM_addon)
}).$mount('#shortnim_addon')
export default app
