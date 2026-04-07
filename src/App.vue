<script setup>
// 這裡放「邏輯」：盒子、功能、動作
import { ref } from 'vue'
// 建立一個「名字盒子」，一開始是空的（放使用者輸入的帳號）
const 名字盒 = ref('')

// 建立一個「資料盒子」，一開始沒有東西（放從 GitHub 拿回來的資料）
const 資料盒 = ref(null)

// 建立一個「錯誤訊息盒子」，一開始是空的（放找不到用戶時的提示）
const 錯誤訊息盒 = ref('')

// 建立一個「專案列表盒子」，一開始是空的（放專案名稱列表）
const 專案列表盒 = ref([])

// 建立一個「搜尋功能」，專門去 GitHub 拿資料
const 去抓資料 = async () => {
  // 如果名字盒是空的，就不做任何事
  if (!名字盒.value) return

  // 先清空錯誤訊息（假設這次會成功）
  錯誤訊息盒.value = ''

  // 叫「資料快遞員」去 GitHub 拿「用戶資料」
  const 用戶回應 = await fetch(`https://api.github.com/users/${名字盒.value}`)

  // 如果快遞員說「找不到這個人」（狀態碼不是 200）
  if (!用戶回應.ok) {
    錯誤訊息盒.value = '查無此用戶'
    資料盒.value = null
    專案列表盒.value = []  // 同時清空專案列表
    return
  }

  // 把用戶資料放進「資料盒子」
  資料盒.value = await 用戶回應.json()

  // 再叫「資料快遞員」去拿「專案列表」
  const 專案回應 = await fetch(`https://api.github.com/users/${名字盒.value}/repos`)
  專案列表盒.value = await 專案回應.json()
}
</script>

<template>
  <!-- 這裡放「長什麼樣子」：輸入框、按鈕、顯示區 -->

  <div>
    <!-- 搜尋區：用一個盒子包住，讓裡面的輸入框和按鈕置中 -->
    <div class="search-box">
      <!-- 文字格子：讓使用者輸入 GitHub 用戶名 -->
      <!-- v-model 是「連接線」：格子裡打的字會自動放進「名字盒」 -->
      <input 
        type="text" 
        v-model="名字盒" 
        placeholder="輸入 GitHub 用戶名..."
      />

      <!-- 搜尋按鈕：按下時觸發「去抓資料」這個功能 -->
      <button @click="去抓資料">搜尋</button>
    </div>

    <!-- 錯誤訊息區：如果錯誤訊息盒裡有東西，就顯示紅色提示 -->
    <div v-if="錯誤訊息盒" class="error">
      ❌ {{ 錯誤訊息盒 }}
    </div>

    <!-- 顯示區：如果「資料盒」裡有東西，就顯示出來 -->
    <div v-if="資料盒">
      <!-- 個人資料區：大頭貼和介紹放在同一排 -->
      <div class="profile-row">
        <!-- 顯示大頭貼 -->
        <img :src="資料盒.avatar_url" width="150" />
        <!-- 名字和自我介紹包在一起 -->
        <div class="profile-info">
          <!-- 顯示名字 -->
          <h2>{{ 資料盒.name || 資料盒.login }}</h2>
          <!-- 顯示自我介紹 -->
          <p>{{ 資料盒.bio || '這個人很懶，沒有自我介紹' }}</p>
        </div>
      </div>

      <!-- 專案列表區：如果「專案列表盒」裡有東西，就顯示 -->
      <div v-if="專案列表盒.length > 0" class="repo-section">
        <h3>公開專案</h3>
        <!-- 用一個大盒子裝所有專案，讓專案兩個一排 -->
        <div class="repo-grid">
          <!-- 用 v-for 把專案列表盒裡的每個專案一個個拿出來顯示 -->
          <div v-for="專案 in 專案列表盒" :key="專案.id" class="repo-card">
            <!-- 專案名稱可以點擊，連到 GitHub 頁面 -->
            <a :href="專案.html_url" target="_blank">
              {{ 專案.name }}
            </a>
            <!-- 顯示星星數和語言 -->
            <span class="repo-info">
              ⭐ {{ 專案.stargazers_count }} | {{ 專案.language || '未知' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 這裡放「裝飾」，只影響這個積木 */

/* 搜尋區：讓裡面的東西置中 */
.search-box {
  text-align: center;
  margin-top: 30px;
}

/* 讓輸入框好看一點 */
input {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

/* 讓按鈕好看一點 */
button {
  padding: 10px 20px;
  font-size: 16px;
  background: #24292e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 個人資料區：大頭貼和介紹放在同一排 */
.profile-row {
  display: flex;          /* 讓東西横排 */
  align-items: center;     /* 垂直置中 */
  gap: 20px;               /* 大頭貼和文字之間留一點空間 */
  margin-top: 30px;
}

/* 讓大頭貼變成圓的 */
img {
  border-radius: 50%;
}

/* 個人資料的文字區 */
.profile-info {
  text-align: left;  /* 文字靠左對齊 */
}

/* 錯誤訊息的樣式：紅色背景、白字、圓角 */
.error {
  margin-top: 15px;
  padding: 10px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 5px;
  text-align: center;
}

/* 專案列表區的樣式 */
.repo-section {
  margin-top: 30px;
  text-align: left;
}

.repo-section h3 {
  margin-bottom: 15px;
  color: #333;
}

/* 專案大盒子：用格線系統讓專案兩個一排 */
.repo-grid {
  display: grid;                    /* 用格線排版 */
  grid-template-columns: 1fr 1fr;  /* 切成兩欄 */
  gap: 20px;                        /* 每個專案之間留空隙 */
}

/* 每個專案卡片的樣式 */
.repo-card {
  padding: 20px;                    /* 卡片內距加深 */
  border: 1px solid #999;           /* 邊框加深 */
  border-radius: 8px;               /* 圓角大一點 */
}

.repo-card a {
  color: #0366d6;
  text-decoration: none;
  font-weight: bold;
}

.repo-card a:hover {
  text-decoration: underline;
}

.repo-info {
  display: block;
  font-size: 12px;
  color: #101010;
  margin-top: 5px;
}
</style>
