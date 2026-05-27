<template>
  <nav class="navbar">
    <div class="nav-content">
      <div class="nav-title">AI Image Studio</div>
      <div class="nav-links">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="['nav-link', { active: $route.path === item.path }]"
        >
          <span class="link-icon">{{ item.icon }}</span>
          <span class="link-text">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
const navItems = [
  { path: '/', label: '画布编辑', icon: '🖌️' }
  // { path: '/image', label: '图片生成', icon: '🎨' }
]
</script>

<style scoped>
.navbar {
  background: #1a1a1a;
  border-bottom: 1px solid #2d2d2d;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #00ff88;
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  color: #999;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 14px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.nav-link.active {
  background: rgba(0, 255, 136, 0.15);
  color: #00ff88;
}

.link-icon {
  font-size: 16px;
}

.link-text {
  font-weight: 500;
}
</style>