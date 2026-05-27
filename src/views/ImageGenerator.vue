<template>
  <div class="container">
    <div class="left-panel-wrapper">
      <div class="tabs">
        <div :class="['tab', { active: activeTab === 'image' }]" @click="activeTab = 'image'">
          图片生成
        </div>
        <div :class="['tab', { active: activeTab === 'template' }]" @click="activeTab = 'template'">
          模板生成
        </div>
      </div>

      <div class="left-panel">
        <div class="model-selector">
          <div class="selector-header">
            <span class="label">模型</span>
            <button class="expand-btn">▼</button>
          </div>
          <div class="model-item">
            <div class="model-icon">
              <div class="icon-inner"></div>
            </div>
            <div class="model-info">
              <div class="model-name">万相 2.7 Image Pro</div>
            </div>
          </div>
        </div>

        <div class="prompt-section">
          <div class="section-label">
            <span>提示词</span>
          </div>
          <div class="prompt-wrapper">
            <textarea
              v-model="prompt"
              class="prompt-input"
              placeholder="可仅用文本，也可上传参考图"
            ></textarea>
            <div class="prompt-actions">
              <button class="action-btn" @click="clearPrompt" title="清空">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button class="action-btn" @click="openPromptModal" title="放大编辑">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="reference-section">
          <div class="section-label">
            <span>参考图</span>
            <span class="count">0/9</span>
          </div>
          <div class="upload-area">
            <div class="upload-btn">
              <span class="plus-icon">+</span>
              <span class="upload-text">点击上传或拖拽参考图</span>
            </div>
          </div>
        </div>

        <div class="quick-options">
          <div class="count-section">
            <div class="label">生成数量</div>
            <div class="count-options">
              <button
                v-for="n in 4"
                :key="n"
                :class="['count-btn', { active: count === n }]"
                @click="count = n"
              >
                {{ n }}
              </button>
            </div>
          </div>

          <div class="ratio-section">
            <div class="label">比例</div>
            <div class="ratio-options">
              <button
                v-for="ratio in quickRatios"
                :key="ratio.value"
                :class="['ratio-btn', { active: selectedRatio === ratio.value }]"
                @click="selectedRatio = ratio.value"
              >
                {{ ratio.label }}
              </button>
            </div>
          </div>

          <div class="resolution-section">
            <div class="label">分辨率</div>
            <div class="resolution-options">
              <button
                v-for="res in resolutions"
                :key="res.value"
                :class="['resolution-btn', { active: selectedResolution === res.value }]"
                @click="selectedResolution = res.value"
              >
                {{ res.label }}
              </button>
            </div>
          </div>
        </div>

        <div class="advanced-section">
          <div class="section-header" @click="showAdvanced = !showAdvanced">
            <span class="section-title">高级参数</span>
            <button :class="['expand-btn', { rotated: showAdvanced }]">▼</button>
          </div>
          
          <div v-if="showAdvanced" class="advanced-content">
            <div class="reverse-prompt">
              <div class="label">反向提示词（可选）</div>
              <textarea
                v-model="negativePrompt"
                class="reverse-input"
                placeholder="描述不希望出现的内容"
              ></textarea>
            </div>

            <div class="seed-row">
              <div class="label">随机种子</div>
              <div class="seed-input-group">
                <input
                  type="number"
                  v-model="seed"
                  class="seed-input"
                  placeholder="-1"
                />
                <button class="random-btn" @click="randomSeed">随机</button>
              </div>
            </div>

            <div class="toggle-row">
              <span class="toggle-label">不添加每次出图前缀词</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="disablePrefix" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-row">
              <span class="toggle-label">智能扩写提示词</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="smartExpand" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-row">
              <span class="toggle-label">生成水印</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="watermark" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="toggle-row">
              <span class="toggle-label">生成火图</span>
              <label class="toggle-switch">
                <input type="checkbox" v-model="hotImage" />
                <span class="slider"></span>
              </label>
            </div>

            <div class="custom-size-section">
              <div class="label">自定义尺寸</div>
              <div class="size-input-row">
                <div class="size-input-group">
                  <input
                    type="number"
                    v-model="width"
                    class="size-input"
                    placeholder="宽度"
                  />
                  <span class="size-unit">W</span>
                </div>
                <div class="size-input-group">
                  <input
                    type="number"
                    v-model="height"
                    class="size-input"
                    placeholder="高度"
                  />
                  <span class="size-unit">H</span>
                </div>
                <span class="size-unit">PX</span>
              </div>
              <div class="size-preview">
                {{ width }}×{{ height }} · 2张
              </div>
            </div>

            <div class="all-ratios-section">
              <div class="label">全部比例</div>
              <div class="all-ratio-options">
                <button
                  v-for="ratio in ratios"
                  :key="ratio.value"
                  :class="['ratio-btn', { active: selectedRatio === ratio.value }]"
                  @click="selectedRatio = ratio.value"
                >
                  {{ ratio.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bottom-bar">
        <button class="generate-btn">生成</button>
      </div>
    </div>

    <div class="right-panel">
      <div class="empty-placeholder">
        <div class="empty-icon">📷</div>
        <p>生成的图片将显示在这里</p>
      </div>
    </div>
  </div>

  <!-- 提示词放大编辑弹框 -->
  <div v-if="showPromptModal" class="modal-overlay" @click="closePromptModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>提示词编辑</h3>
        <button class="close-btn" @click="closePromptModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <textarea
          v-model="tempPrompt"
          class="modal-textarea"
          placeholder="可仅用文本，也可上传参考图"
        ></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn-clear" @click="clearModalPrompt">清空</button>
        <div class="spacer"></div>
        <button class="btn-cancel" @click="cancelModal">取消</button>
        <button class="btn-confirm" @click="confirmModal">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('image')
const showAdvanced = ref(false)
const showPromptModal = ref(false)
const prompt = ref('')
const tempPrompt = ref('')
const negativePrompt = ref('')
const seed = ref('-1')
const disablePrefix = ref(false)
const smartExpand = ref(true)
const watermark = ref(false)
const hotImage = ref(false)
const count = ref(1)
const selectedRatio = ref('16:9')
const selectedResolution = ref('2K')
const width = ref(4096)
const height = ref(3072)

const quickRatios = [
  { label: '16:9', value: '16:9' },
  { label: '4:3', value: '4:3' },
  { label: '1:1', value: '1:1' },
  { label: '9:16', value: '9:16' }
]

const ratios = [
  { label: '2:1', value: '2:1' },
  { label: '16:9', value: '16:9' },
  { label: '3:2', value: '3:2' },
  { label: '4:3', value: '4:3' },
  { label: '1:1', value: '1:1' },
  { label: '2:3', value: '2:3' },
  { label: '9:16', value: '9:16' },
  { label: '3:4', value: '3:4' },
  { label: '2.35:1', value: '2.35:1' }
]

const resolutions = [
  { label: '1K', value: '1K' },
  { label: '2K', value: '2K' },
  { label: '3K', value: '3K' },
  { label: '4K', value: '4K' }
]

const randomSeed = () => {
  seed.value = Math.floor(Math.random() * 1000000).toString()
}

const clearPrompt = () => {
  prompt.value = ''
}

const openPromptModal = () => {
  tempPrompt.value = prompt.value
  showPromptModal.value = true
}

const cancelModal = () => {
  showPromptModal.value = false
}

const confirmModal = () => {
  prompt.value = tempPrompt.value
  showPromptModal.value = false
}

const clearModalPrompt = () => {
  tempPrompt.value = ''
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  background: #0d0d0d;
}

.left-panel-wrapper {
  width: 520px;
  background: #1a1a1a;
  border-right: 1px solid #2d2d2d;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
}

.left-panel {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
}

.tabs {
  display: flex;
  padding: 16px;
  gap: 8px;
  border-bottom: 1px solid #2d2d2d;
}

.tab {
  padding: 10px 20px;
  border-radius: 8px;
  background: #2d2d2d;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  background: #3d3d3d;
  color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.expand-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.expand-btn.rotated {
  transform: rotate(180deg);
}

.model-selector {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.label {
  font-size: 13px;
  color: #999;
}

.model-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.model-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-inner {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.model-name {
  font-size: 14px;
  color: #fff;
  font-weight: 500;
}

.reference-section {
  margin-bottom: 16px;
}

.section-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #999;
}

.count {
  color: #666;
}

.upload-area {
  background: #2d2d2d;
  border: 2px dashed #3d3d3d;
  border-radius: 12px;
  padding: 24px;
}

.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.plus-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #3d3d3d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 24px;
}

.upload-text {
  font-size: 13px;
  color: #666;
  text-align: center;
}

.prompt-section {
  margin-bottom: 16px;
}

.prompt-wrapper {
  position: relative;
}

.prompt-input {
  width: 100%;
  height: 100px;
  background: #2d2d2d;
  border: none;
  border-radius: 12px;
  padding: 12px;
  padding-bottom: 40px;
  color: #fff;
  font-size: 14px;
  resize: none;
  outline: none;
}

.prompt-input::placeholder {
  color: #666;
}

.prompt-actions {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* 弹框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  background: #1a1a1a;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #2d2d2d;
}

.modal-header h3 {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.modal-textarea {
  width: 100%;
  min-height: 400px;
  background: #2d2d2d;
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: #fff;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.modal-textarea::placeholder {
  color: #666;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #2d2d2d;
}

.spacer {
  flex: 1;
}

.btn-clear,
.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear {
  background: rgba(255, 80, 80, 0.1);
  color: #ff5050;
}

.btn-clear:hover {
  background: rgba(255, 80, 80, 0.2);
  color: #ff6b6b;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #999;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.btn-confirm {
  background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
  color: #000;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
}

.quick-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.quick-options .count-section,
.quick-options .ratio-section,
.quick-options .resolution-section {
  background: #2d2d2d;
  border-radius: 10px;
  padding: 12px;
}

.quick-options .label {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.quick-options .count-options,
.quick-options .ratio-options,
.quick-options .resolution-options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quick-options .count-btn,
.quick-options .ratio-btn,
.quick-options .resolution-btn {
  padding: 6px;
  background: #1a1a1a;
  border: none;
  border-radius: 6px;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-options .count-btn.active,
.quick-options .ratio-btn.active,
.quick-options .resolution-btn.active {
  background: #3d3d3d;
  color: #fff;
}

.advanced-section {
  background: #2d2d2d;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.advanced-content {
  margin-top: 12px;
}

.reverse-prompt {
  margin-bottom: 16px;
}

.reverse-input {
  width: 100%;
  height: 60px;
  background: #1a1a1a;
  border: none;
  border-radius: 8px;
  padding: 10px;
  color: #fff;
  font-size: 13px;
  resize: none;
  outline: none;
  margin-top: 6px;
}

.reverse-input::placeholder {
  color: #555;
}

.seed-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.seed-input-group {
  display: flex;
  gap: 8px;
}

.seed-input {
  width: 100px;
  background: #1a1a1a;
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  color: #fff;
  font-size: 13px;
  outline: none;
}

.random-btn {
  background: #3d3d3d;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.toggle-label {
  font-size: 13px;
  color: #999;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #444;
  border-radius: 12px;
  transition: 0.3s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #999;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle-switch input:checked + .slider {
  background: #00ff88;
}

.toggle-switch input:checked + .slider:before {
  transform: translateX(20px);
  background: #fff;
}

.custom-size-section {
  margin-top: 16px;
}

.size-input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.size-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
}

.size-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px;
  color: #fff;
  font-size: 14px;
  outline: none;
}

.size-unit {
  padding: 10px;
  color: #666;
  font-size: 13px;
}

.size-preview {
  margin-top: 8px;
  font-size: 12px;
  color: #666;
}

.all-ratios-section {
  margin-top: 16px;
}

.all-ratio-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.all-ratio-options .ratio-btn {
  padding: 6px 12px;
  background: #1a1a1a;
  border: none;
  border-radius: 6px;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.all-ratio-options .ratio-btn.active {
  background: #3d3d3d;
  color: #fff;
}

.bottom-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #1a1a1a;
  border-top: 1px solid #2d2d2d;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
}

.generate-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #00ff88 0%, #00cc6a 100%);
  border: none;
  border-radius: 12px;
  color: #000;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 255, 136, 0.3);
}

.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0d0d0d;
}

.empty-placeholder {
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-placeholder p {
  color: #666;
  font-size: 14px;
}
</style>