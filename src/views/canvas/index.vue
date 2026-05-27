<template>
  <div class="canvas-container">
    <div class="toolbar">
      <div class="tool-section upload-section">
        <label class="upload-btn">
          <input type="file" accept="image/*" @change="loadImage" class="upload-input" multiple />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <span>上传图片</span>
        </label>
      </div>
    </div>

    <div class="image-grid-wrapper">
      <div v-if="images.length === 0" class="empty-state">
        <div class="empty-icon">📷</div>
        <h3>暂无图片</h3>
        <p>点击上方按钮上传图片</p>
      </div>

      <div v-else class="image-grid">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="image-card"
        >
          <img :src="image.src" :alt="`图片 ${index + 1}`" class="card-image" />
          <div class="card-overlay">
            <button class="overlay-btn" @click="startEditing(index)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span>局部绘制</span>
            </button>
          </div>
          <div class="card-info">
            <span>图片 {{ index + 1 }}</span>
            <button class="delete-btn" @click="deleteImage(index)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 局部重绘弹窗 -->
    <div v-if="currentEditingImage" class="modal-overlay" @click.self="exitEditing">
      <div class="modal-content">
        <!-- 弹窗标题 -->
        <div class="modal-header">
          <span class="modal-title">局部重绘</span>
          <button class="modal-close" @click="exitEditing">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 画布区域 -->
        <div class="modal-body">
          <div class="canvas-area" ref="canvasAreaRef">
            <Stage
              ref="stageRef"
              :config="stageConfig"
              class="konva-stage"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseLeave"
              @wheel="handleWheel"
            >
              <Layer ref="layerRef">
                <Group ref="mainGroupRef" :config="groupConfig">
                  <Image
                    v-if="currentEditingImage"
                    :config="imageConfig"
                  />
                  <Image
                    v-if="maskImageObj"
                    :config="maskDisplayConfig"
                  />
                  <Rect
                    v-if="selectionRect"
                    :config="selectionRect"
                  />
                </Group>
                <Circle
                  v-if="showCursor && (tool === 'brush' || tool === 'eraser')"
                  :config="cursorConfig"
                />
              </Layer>
            </Stage>
          </div>

          <!-- 画笔尺寸条（始终占位，不可见时用 visibility 隐藏） -->
          <div :class="['brush-size-bar', { 'bar-hidden': tool !== 'brush' && tool !== 'eraser' }]">
            <span class="size-label">画笔尺寸</span>
            <button class="size-btn" @click="brushSize = Math.max(1, brushSize - 1)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
            <input
              type="range"
              v-model="brushSize"
              min="1"
              max="100"
              class="size-slider"
            />
            <button class="size-btn" @click="brushSize = Math.min(100, brushSize + 1)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </button>
            <span class="size-value">{{ brushSize }}</span>
          </div>
        </div>

        <!-- 底部工具栏 -->
        <div class="modal-footer">
          <!-- 第一行：工具 + 操作 + 缩放 -->
          <div class="toolbar-row">
            <div class="tool-group">
              <button
                :class="['tool-label-btn', { active: tool === 'move' }]"
                @click="setTool('move')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="5 9 2 12 5 15"></polyline>
                  <polyline points="19 9 22 12 19 15"></polyline>
                  <polyline points="9 5 12 2 15 5"></polyline>
                  <polyline points="9 19 12 22 15 19"></polyline>
                </svg>
                <span>移动</span>
              </button>
              <button
                :class="['tool-label-btn', { active: tool === 'select' }]"
                @click="setTool('select')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>框选</span>
              </button>
              <button
                :class="['tool-label-btn', { active: tool === 'brush' }]"
                @click="setTool('brush')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>涂抹</span>
              </button>
              <button
                :class="['tool-label-btn', { active: tool === 'eraser' }]"
                :disabled="!hasMaskContent"
                @click="setTool('eraser')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 20H7L3 16"></path>
                  <path d="M20 3H6.6a1.6 1.6 0 0 0-1.5 1.5L4 19.1a1.6 1.6 0 0 0 1.5 1.5h13.4a1.6 1.6 0 0 0 1.5-1.5V4.5A1.6 1.6 0 0 0 20 3z"></path>
                </svg>
                <span>橡皮擦</span>
              </button>
            </div>

            <div class="action-group">
              <button class="icon-btn" @click="undo" :disabled="historyIndex <= 0" title="撤销">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 7v6h6"></path>
                  <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                </svg>
              </button>
              <button class="icon-btn" @click="redo" :disabled="historyIndex >= currentHistory.length - 1" title="重做">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 7v6h-6"></path>
                  <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path>
                </svg>
              </button>
              <button class="icon-btn" :disabled="!hasMaskContent" @click="clearCanvas" title="清除">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  <rect x="5" y="12" width="14" height="3" rx="1" fill="currentColor" opacity="0.6"/>
                  <path d="M5 15 L3 21 Q12 24 21 21 L19 15 Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <div class="zoom-group">
              <button class="icon-btn" @click="zoomOut">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <span class="zoom-text">{{ Math.round(scale * 100) }}%</span>
              <button class="icon-btn" @click="zoomIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- 第二行：提示词 + 模型 + 张数 + 开始重绘 -->
          <div class="toolbar-row prompt-row">
            <textarea
              v-model="promptText"
              class="prompt-input"
              placeholder="请描述你的重绘区域内容，不填则基于子原图生成"
              rows="1"
            ></textarea>
            <div class="model-select-wrapper">
              <select v-model="selectedModel" class="model-select">
                <option v-for="m in modelOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div class="count-select-wrapper">
              <select v-model="generateCount" class="count-select">
                <option :value="1">1张</option>
                <option :value="2">2张</option>
                <option :value="3">3张</option>
                <option :value="4">4张</option>
              </select>
            </div>
            <button class="generate-btn" :disabled="!hasMaskContent" @click="openAiParamsDialog">
              <span>开始重绘</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Stage, Layer, Image, Rect, Circle, Group } from 'vue-konva'

const stageRef = ref(null)
const layerRef = ref(null)
const mainGroupRef = ref(null)
const canvasAreaRef = ref(null)

const images = ref([])
const currentEditingIndex = ref(null)
const currentLines = ref([])
const currentHistory = ref([])
const historyIndex = ref(-1)
const currentImageObj = ref(null)

const tool = ref('brush')
const brushSize = ref(10)
const brushColor = ref('rgba(0, 255, 136, 0.6)')
const scale = ref(1)
const groupX = ref(0)
const groupY = ref(0)

const showCursor = ref(false)
const cursorX = ref(0)
const cursorY = ref(0)

const isDrawing = ref(false)
const currentLine = ref([])
const tempLine = ref(null)
const selectionRect = ref(null)
const selectionStart = ref({ x: 0, y: 0 })

// 移动工具拖拽状态
const dragStartPos = ref({ x: 0, y: 0 })
const dragStartGroupX = ref(0)
const dragStartGroupY = ref(0)

const stageWidth = ref(800)
const stageHeight = ref(600)

// 离屏 canvas：用于正确合成 mask 层（支持画笔和橡皮擦）
const maskCanvas = ref(null)
const maskCtx = ref(null)
const maskImageObj = ref(null)
const maskImageLoading = ref(false)

// 新增：提示词、生成张数、模型选择、AI参数弹窗
const promptText = ref('')
const generateCount = ref(4)
const selectedModel = ref('stable-diffusion-xl')
const modelOptions = [
  { value: 'stable-diffusion-xl', label: 'Stable Diffusion XL' },
  { value: 'stable-diffusion-3', label: 'Stable Diffusion 3' },
  { value: 'stable-diffusion-3-turbo', label: 'SD3 Turbo' },
  { value: 'flux-1-dev', label: 'Flux.1 Dev' },
  { value: 'flux-1-schnell', label: 'Flux.1 Schnell' },
]

// textarea 自动高度（最高 3 行后滚动）
const autoResizeTextarea = () => {
  const el = document.querySelector('.prompt-input')
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 84) + 'px'
}
watch(promptText, () => nextTick(autoResizeTextarea))

const currentEditingImage = computed(() => {
  return currentEditingIndex.value !== null ? images.value[currentEditingIndex.value] : null
})

// 是否存在涂抹内容（画笔或框选产生的线条）
const hasMaskContent = computed(() => {
  return currentLines.value.length > 0
})

// AI 生成参数（前端提交给 AI 的数据结构）
const aiParams = computed(() => {
  if (!currentEditingImage.value) return {}
  return {
    originalImage: currentEditingImage.value.src,
    maskImage: maskImageObj.value ? maskCanvas.value?.toDataURL('image/png') : null,
    prompt: promptText.value || undefined,
    model: selectedModel.value,
    generateCount: generateCount.value,
    width: currentEditingImage.value.originalWidth,
    height: currentEditingImage.value.originalHeight,
    maskLines: currentLines.value.map(line => ({
      tool: line.tool,
      strokeWidth: line.strokeWidth,
      points: line.points,
      closed: line.closed || false
    }))
  }
})

const stageConfig = computed(() => ({
  width: stageWidth.value,
  height: stageHeight.value
}))

const groupConfig = computed(() => ({
  x: groupX.value,
  y: groupY.value,
  scaleX: scale.value,
  scaleY: scale.value
}))

const imageConfig = computed(() => {
  if (!currentEditingImage.value || !currentImageObj.value) return {}
  return {
    x: 0,
    y: 0,
    width: currentEditingImage.value.width,
    height: currentEditingImage.value.height,
    image: currentImageObj.value
  }
})

const maskDisplayConfig = computed(() => {
  if (!maskImageObj.value || !currentEditingImage.value) return {}
  return {
    x: 0,
    y: 0,
    width: currentEditingImage.value.width,
    height: currentEditingImage.value.height,
    image: maskImageObj.value,
    opacity: 0.4
  }
})

const cursorConfig = computed(() => {
  const isEraser = tool.value === 'eraser'
  const displaySize = brushSize.value * scale.value
  return {
    x: cursorX.value,
    y: cursorY.value,
    radius: displaySize / 2,
    stroke: isEraser ? '#ff6666' : '#ffffff',
    strokeWidth: 1.5,
    fill: isEraser ? '#ff6666' : '#ffffff'
  }
})

const openAiParamsDialog = () => {
  // TODO: 对接后端 AI 生成接口
  console.log('开始重绘 - 待对接 API')
}

// 初始化离屏 mask canvas
const initMaskCanvas = (width, height) => {
  const canvas = window.document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  maskCanvas.value = canvas
  maskCtx.value = canvas.getContext('2d')
}

// 重绘整个 mask canvas（根据所有已提交的线条）
const redrawMaskCanvas = () => {
  const ctx = maskCtx.value
  const canvas = maskCanvas.value
  if (!ctx || !canvas) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  currentLines.value.forEach(line => {
    if (!line.points || line.points.length < 2) return

    ctx.save()
    if (line.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = 'rgba(0, 255, 136, 1)'
    }
    ctx.lineWidth = line.strokeWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (line.closed) {
      if (line.tool === 'eraser') {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      } else {
        ctx.fillStyle = 'rgba(0, 255, 136, 1)'
      }
      ctx.beginPath()
      ctx.moveTo(line.points[0], line.points[1])
      for (let i = 2; i < line.points.length; i += 2) {
        ctx.lineTo(line.points[i], line.points[i + 1])
      }
      ctx.closePath()
      ctx.fill()
    } else {
      ctx.beginPath()
      ctx.moveTo(line.points[0], line.points[1])
      for (let i = 2; i < line.points.length; i += 2) {
        ctx.lineTo(line.points[i], line.points[i + 1])
      }
      ctx.stroke()
    }

    ctx.restore()
  })

  updateMaskImageObj()
}

// 把离屏 canvas 转成 Konva 可用的 Image 对象
const updateMaskImageObj = () => {
  if (!maskCanvas.value) return
  const img = new window.Image()
  maskImageLoading.value = true
  img.onload = () => {
    maskImageObj.value = img
    maskImageLoading.value = false
  }
  img.src = maskCanvas.value.toDataURL()
}

// 检查坐标是否在图片区域内
const isInsideImage = (localX, localY) => {
  if (!currentEditingImage.value) return false
  const img = currentEditingImage.value
  return localX >= 0 && localX <= img.width && localY >= 0 && localY <= img.height
}

const getGroupLocalPos = () => {
  const stage = stageRef.value
  const group = mainGroupRef.value
  if (!stage || !group) return { x: 0, y: 0 }

  const stageNode = stage.getNode()
  const groupNode = group.getNode()
  if (!stageNode || !groupNode) return { x: 0, y: 0 }

  const pointer = stageNode.getPointerPosition()
  if (!pointer) return { x: 0, y: 0 }

  const transform = groupNode.getAbsoluteTransform().copy().invert()
  return transform.point(pointer)
}

const setTool = (newTool) => {
  if (isDrawing.value) {
    isDrawing.value = false
    tempLine.value = null
    currentLine.value = []
  }

  tool.value = newTool
  const stage = stageRef.value
  if (stage) {
    const stageNode = stage.getNode()
    if (stageNode) {
      const container = stageNode.container()
      if (container) {
        if (newTool === 'select') {
          container.style.cursor = 'crosshair'
        } else if (newTool === 'move') {
          container.style.cursor = 'grab'
        } else {
          container.style.cursor = 'none'
        }
      }
    }
  }
}

const handleMouseDown = (e) => {
  if (!currentEditingImage.value) return

  const pos = getGroupLocalPos()

  if (tool.value === 'brush' || tool.value === 'eraser') {
    if (!isInsideImage(pos.x, pos.y)) return
    isDrawing.value = true
    currentLine.value = [{ x: pos.x, y: pos.y }]
  } else if (tool.value === 'move') {
    const stage = stageRef.value
    if (stage) {
      const stageNode = stage.getNode()
      if (stageNode) {
        const container = stageNode.container()
        if (container) {
          container.style.cursor = 'grabbing'
        }
        const pointer = stageNode.getPointerPosition()
        if (pointer) {
          isDrawing.value = true
          dragStartPos.value = { x: pointer.x, y: pointer.y }
          dragStartGroupX.value = groupX.value
          dragStartGroupY.value = groupY.value
        }
      }
    }
  } else if (tool.value === 'select') {
    showCursor.value = false
    selectionStart.value = { ...pos }
    isDrawing.value = true
    selectionRect.value = {
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      stroke: '#00ff88',
      strokeWidth: 2 / scale.value,
      dash: [10 / scale.value, 5 / scale.value],
      fill: 'rgba(0, 255, 136, 0.1)'
    }
  }
}

const handleMouseMove = (e) => {
  const stage = stageRef.value
  if (!stage) return

  const stageNode = stage.getNode()
  if (!stageNode) return

  const pointer = stageNode.getPointerPosition()
  if (!pointer) return

  cursorX.value = pointer.x
  cursorY.value = pointer.y

  if (tool.value === 'brush' || tool.value === 'eraser') {
    const localPos = getGroupLocalPos()
    const inside = isInsideImage(localPos.x, localPos.y)
    showCursor.value = inside
    const container = stageNode.container()
    if (container) {
      container.style.cursor = inside ? 'none' : 'default'
    }
  } else {
    showCursor.value = false
  }

  if (!isDrawing.value) return

  const pos = getGroupLocalPos()

  if (tool.value === 'brush' || tool.value === 'eraser') {
    if (isInsideImage(pos.x, pos.y)) {
      currentLine.value.push({ x: pos.x, y: pos.y })
      updateTempLine()
    }
  } else if (tool.value === 'move') {
    const stage = stageRef.value
    if (stage) {
      const stageNode = stage.getNode()
      if (stageNode) {
        const pointer = stageNode.getPointerPosition()
        if (pointer) {
          groupX.value = dragStartGroupX.value + (pointer.x - dragStartPos.value.x)
          groupY.value = dragStartGroupY.value + (pointer.y - dragStartPos.value.y)
        }
      }
    }
  } else if (tool.value === 'select' && selectionRect.value) {
    selectionRect.value.x = Math.min(pos.x, selectionStart.value.x)
    selectionRect.value.y = Math.min(pos.y, selectionStart.value.y)
    selectionRect.value.width = Math.abs(pos.x - selectionStart.value.x)
    selectionRect.value.height = Math.abs(pos.y - selectionStart.value.y)
  }
}

const handleMouseUp = () => {
  if (!isDrawing.value) return

  isDrawing.value = false

  if (tool.value === 'move') {
    const stage = stageRef.value
    if (stage) {
      const stageNode = stage.getNode()
      if (stageNode) {
        const container = stageNode.container()
        if (container) {
          container.style.cursor = 'grab'
        }
      }
    }
  } else if (tool.value === 'brush' || tool.value === 'eraser') {
    showCursor.value = true
    if (currentLine.value.length > 1 && tempLine.value) {
      currentLines.value.push({ ...tempLine.value })
      saveToHistory()
      redrawMaskCanvas()
    }
    tempLine.value = null
    currentLine.value = []
  } else if (tool.value === 'select') {
    applySelection()
    selectionRect.value = null
  }
}

const handleMouseLeave = () => {
  showCursor.value = false
  if (tool.value === 'brush' || tool.value === 'eraser') {
    const stage = stageRef.value
    if (stage) {
      const stageNode = stage.getNode()
      if (stageNode) {
        const container = stageNode.container()
        if (container) {
          container.style.cursor = 'default'
        }
      }
    }
  }
  if (isDrawing.value) {
    handleMouseUp()
  }
}

const handleWheel = (e) => {
  e.evt.preventDefault()

  const stage = stageRef.value
  const group = mainGroupRef.value
  if (!stage || !group) return

  const stageNode = stage.getNode()
  const groupNode = group.getNode()
  if (!stageNode || !groupNode) return

  const pointer = stageNode.getPointerPosition()
  if (!pointer) return

  const oldScale = scale.value

  const transform = groupNode.getAbsoluteTransform().copy().invert()
  const localPoint = transform.point(pointer)

  const direction = e.evt.deltaY > 0 ? -1 : 1
  const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1
  scale.value = Math.max(0.25, Math.min(3, newScale))

  groupX.value = pointer.x - localPoint.x * scale.value
  groupY.value = pointer.y - localPoint.y * scale.value
}

const updateTempLine = () => {
  if (currentLine.value.length < 2) return

  const points = []
  currentLine.value.forEach(p => {
    points.push(p.x, p.y)
  })

  tempLine.value = {
    points: points,
    strokeWidth: brushSize.value,
    lineCap: 'round',
    lineJoin: 'round',
    tool: tool.value
  }

  redrawMaskCanvas()
  drawTempLineOnCanvas()
  updateMaskImageObj()
}

const drawTempLineOnCanvas = () => {
  const ctx = maskCtx.value
  const canvas = maskCanvas.value
  if (!ctx || !canvas || !tempLine.value) return
  if (!tempLine.value.points || tempLine.value.points.length < 2) return

  ctx.save()
  if (tempLine.value.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = 'rgba(0, 255, 136, 1)'
  }
  ctx.lineWidth = tempLine.value.strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.moveTo(tempLine.value.points[0], tempLine.value.points[1])
  for (let i = 2; i < tempLine.value.points.length; i += 2) {
    ctx.lineTo(tempLine.value.points[i], tempLine.value.points[i + 1])
  }
  ctx.stroke()
  ctx.restore()
}

const applySelection = () => {
  if (!selectionRect.value) return

  const rect = selectionRect.value
  const width = Math.abs(rect.width)
  const height = Math.abs(rect.height)

  if (width < 5 || height < 5) return

  const fillLine = {
    points: [
      rect.x, rect.y,
      rect.x + width, rect.y,
      rect.x + width, rect.y + height,
      rect.x, rect.y + height,
      rect.x, rect.y
    ],
    strokeWidth: 0,
    closed: true,
    tool: 'brush'
  }

  currentLines.value.push(fillLine)
  saveToHistory()
  redrawMaskCanvas()
}

const saveToHistory = () => {
  const state = JSON.stringify(currentLines.value)

  if (historyIndex.value < currentHistory.value.length - 1) {
    currentHistory.value = currentHistory.value.slice(0, historyIndex.value + 1)
  }

  currentHistory.value.push(state)
  historyIndex.value = currentHistory.value.length - 1

  if (currentHistory.value.length > 50) {
    currentHistory.value.shift()
    historyIndex.value--
  }
}

const undo = () => {
  if (historyIndex.value <= 0) return

  historyIndex.value--
  currentLines.value = JSON.parse(currentHistory.value[historyIndex.value])
  redrawMaskCanvas()
  if (tool.value === 'eraser' && currentLines.value.length === 0) {
    setTool('brush')
  }
}

const redo = () => {
  if (historyIndex.value >= currentHistory.value.length - 1) return

  historyIndex.value++
  currentLines.value = JSON.parse(currentHistory.value[historyIndex.value])
  redrawMaskCanvas()
}

const clearCanvas = () => {
  currentLines.value = []
  tempLine.value = null
  saveToHistory()
  redrawMaskCanvas()
  if (tool.value === 'eraser') {
    setTool('brush')
  }
}

const zoomIn = () => {
  const oldScale = scale.value
  scale.value = Math.min(3, scale.value + 0.25)

  const centerX = stageWidth.value / 2
  const centerY = stageHeight.value / 2

  const localCenterX = (centerX - groupX.value) / oldScale
  const localCenterY = (centerY - groupY.value) / oldScale

  groupX.value = centerX - localCenterX * scale.value
  groupY.value = centerY - localCenterY * scale.value
}

const zoomOut = () => {
  const oldScale = scale.value
  scale.value = Math.max(0.25, scale.value - 0.25)

  const centerX = stageWidth.value / 2
  const centerY = stageHeight.value / 2

  const localCenterX = (centerX - groupX.value) / oldScale
  const localCenterY = (centerY - groupY.value) / oldScale

  groupX.value = centerX - localCenterX * scale.value
  groupY.value = centerY - localCenterY * scale.value
}

const loadImage = (event) => {
  const files = event.target.files
  if (!files) return

  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        const maxWidth = 800
        const maxHeight = 600

        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        images.value.push({
          src: e.target.result,
          width: width,
          height: height,
          originalWidth: img.width,
          originalHeight: img.height,
          lines: []
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })

  event.target.value = ''
}

const deleteImage = (index) => {
  images.value.splice(index, 1)
}

const startEditing = (index) => {
  currentEditingIndex.value = index
  currentLines.value = JSON.parse(JSON.stringify(images.value[index].lines || []))
  currentHistory.value = [JSON.stringify(currentLines.value)]
  historyIndex.value = 0
  tempLine.value = null
  promptText.value = ''

  const img = new window.Image()
  img.onload = () => {
    currentImageObj.value = img
    setTimeout(() => {
      updateStageSize()
      scale.value = 1
      groupX.value = Math.max(0, (stageWidth.value - images.value[index].width) / 2)
      groupY.value = Math.max(0, (stageHeight.value - images.value[index].height) / 2)

      initMaskCanvas(images.value[index].width, images.value[index].height)
      redrawMaskCanvas()

      setTool(tool.value)
    }, 150)
  }
  img.src = images.value[index].src
}

const exitEditing = () => {
  currentEditingIndex.value = null
  currentLines.value = []
  currentHistory.value = []
  historyIndex.value = -1
  currentImageObj.value = null
  maskImageObj.value = null
  maskCanvas.value = null
  maskCtx.value = null
  tempLine.value = null
  promptText.value = ''
}

const updateStageSize = () => {
  const canvasArea = canvasAreaRef.value
  if (canvasArea) {
    stageWidth.value = canvasArea.clientWidth
    stageHeight.value = canvasArea.clientHeight
  }
}

let resizeObserver = null

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && currentEditingImage.value) {
    exitEditing()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  resizeObserver = new ResizeObserver(() => {
    if (currentEditingImage.value) {
      updateStageSize()
    }
  })
  if (canvasAreaRef.value) {
    resizeObserver.observe(canvasAreaRef.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped lang="scss" src="./index.scss">
</style>