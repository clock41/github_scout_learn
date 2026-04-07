// 這是程式的「起點」，就像打開一本書的封面

// 從 Vue 的盒子裡拿出「工廠」
import { createApp } from 'vue'

// 把我們設計的「會員卡」（App.vue）拿過來
import App from './App.vue'

// 建立一個 Vue 應用程式，並把它放進 id="app" 的容器裡
createApp(App).mount('#app')
