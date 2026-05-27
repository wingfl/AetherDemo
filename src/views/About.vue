<template>
  <div class="about-container">
    <header class="header">
      <h1>Vue3 Project</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>
    </header>
    
    <main class="main-content">
      <div class="about-card">
        <h2>关于项目</h2>
        <div class="info-section">
          <h3>技术栈</h3>
          <ul>
            <li><strong>框架:</strong> Vue 3.4+</li>
            <li><strong>构建工具:</strong> Vite 5.1+</li>
            <li><strong>路由:</strong> Vue Router 4.3+</li>
            <li><strong>HTTP:</strong> Axios 1.6+</li>
            <li><strong>代码规范:</strong> ESLint + Prettier</li>
          </ul>
        </div>
        
        <div class="info-section">
          <h3>项目结构</h3>
          <pre class="code-block">
src/
├── api/           # API接口
├── components/    # 组件
├── router/        # 路由配置
│   ├── index.js   # 路由定义
│   └── guard.js   # 路由守卫
├── utils/         # 工具函数
│   └── axios.js   # Axios封装
├── views/         # 页面视图
│   ├── Home.vue
│   └── About.vue
├── App.vue        # 根组件
└── main.js        # 入口文件
          </pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('About page mounted')
})
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  align-items: flex-start;
  padding: 60px 20px;
}

.about-card {
  background: white;
  border-radius: 20px;
  padding: 40px 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 800px;
}

.about-card h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.info-section {
  margin-bottom: 30px;
}

.info-section h3 {
  font-size: 18px;
  color: #444;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f093fb;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section li {
  padding: 8px 0;
  color: #666;
  font-size: 15px;
}

.code-block {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
  color: #333;
  white-space: pre;
}
</style>