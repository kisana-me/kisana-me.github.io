document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_FRAMES = 6571
  const IMAGE_BASE_PATH = 'src/ba_'
  const BASE_FPS = 30

  const animationImage = document.getElementById('animationImage')
  const fpsSlider = document.getElementById('fpsSlider')
  const fpsValueSpan = document.getElementById('fpsValue')
  const startButton = document.getElementById('startButton')
  const stopButton = document.getElementById('stopButton')
  const resetButton = document.getElementById('resetButton')
  const frameInfo = document.getElementById('frameInfo')

  let faviconCanvas = document.createElement('canvas')
  let faviconCtx = faviconCanvas.getContext('2d')
  faviconCanvas.width = 80
  faviconCanvas.height = 60

  let faviconLink = document.querySelector('link[rel="icon"]')
  if (!faviconLink) {
    faviconLink = document.createElement('link')
    faviconLink.rel = 'icon'
    document.head.appendChild(faviconLink)
  }
  faviconLink.type = 'image/png'

  let internalFrameCounter = 0
  let fps = parseInt(fpsSlider.value, 30)
  let animationIntervalId = null
  let isPlaying = false

  function getImagePath(frameIndex) {
    const paddedIndex = String(frameIndex).padStart(5, '0')
    return `${IMAGE_BASE_PATH}${paddedIndex}.png?t=${new Date().getTime()}`
  }

  function updateFavicon() {
    try {
      faviconCtx.clearRect(0, 0, 80, 60)
      faviconCtx.drawImage(animationImage, 0, 0, 80, 60)
      faviconLink.href = faviconCanvas.toDataURL('image/png')
    } catch (e) {
      console.warn('Faviconの更新に失敗しました (画像がまだロードされていないか、CORSの問題):', e)
    }
  }

  function updateImage() {
    const framesToAdvanceInBase = BASE_FPS / fps
    const displayImageIndex = (Math.floor(internalFrameCounter * framesToAdvanceInBase) % TOTAL_FRAMES) + 1
    animationImage.onload = () => {
      frameInfo.textContent = `フレーム: ${displayImageIndex} / ${TOTAL_FRAMES}`
      updateFavicon()
    }
    animationImage.src = getImagePath(displayImageIndex)
    internalFrameCounter++
  }

  function startAnimation() {
    if (isPlaying) return
    isPlaying = true
    if (animationIntervalId) {
      clearInterval(animationIntervalId)
    }
    const intervalTime = 1000 / fps
    updateImage()
    animationIntervalId = setInterval(updateImage, intervalTime)
    startButton.disabled = true
    stopButton.disabled = false
    resetButton.disabled = false
  }

  function stopAnimation() {
    if (!isPlaying && animationIntervalId === null) return
    isPlaying = false
    clearInterval(animationIntervalId)
    animationIntervalId = null
    startButton.disabled = false
    stopButton.disabled = true
    resetButton.disabled = false
  }

  function resetAnimation() {
    stopAnimation()
    internalFrameCounter = 0
    animationImage.onload = () => {
      frameInfo.textContent = `フレーム: 0 / ${TOTAL_FRAMES}`
      updateFavicon()
    }
    animationImage.src = getImagePath(0)
    startButton.disabled = false
    stopButton.disabled = true
    resetButton.disabled = false
  }

  function handleFpsChange() {
    fps = parseInt(fpsSlider.value, 10)
    fpsValueSpan.textContent = fps
    if (isPlaying) {
      stopAnimation()
      startAnimation()
    } else {
    }
  }

  resetAnimation()
  fpsValueSpan.textContent = fpsSlider.value

  startButton.addEventListener('click', startAnimation)
  stopButton.addEventListener('click', stopAnimation)
  resetButton.addEventListener('click', resetAnimation)
  fpsSlider.addEventListener('input', handleFpsChange)
})