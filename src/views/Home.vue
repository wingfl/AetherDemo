<template>
  <div class="home-container">
    <header class="header">
      <h1>Vue3 Project</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>
    </header>
    
    <main class="main-content">
      <div class="welcome-card">
        <h2>欢迎使用 Vue3 + Vite 项目</h2>
        <p>这是一个使用 Vue3 语法糖搭建的项目框架</p>
        <ul class="features">
          <li>✓ Vue3 Composition API</li>
          <li>✓ Vue Router 路由配置</li>
          <li>✓ Axios 封装</li>
          <li>✓ ESLint + Prettier 代码规范</li>
          <li>✓ 路由守卫</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const message = ref('Hello Vue3!')

onMounted(() => {
  console.log('Home page mounted')
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.header h1 {
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 40px 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.welcome-card h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 16px;
}

.welcome-card p {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}

.features {
  list-style: none;
  padding: 0;
  text-align: left;
}

.features li {
  padding: 10px 0;
  color: #555;
  font-size: 16px;
}
</style>