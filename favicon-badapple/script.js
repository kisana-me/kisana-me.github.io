document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_FRAMES = 6572
  const LAST_FRAME_INDEX = TOTAL_FRAMES - 1
  const IMAGE_BASE_PATH = 'src/ba_'
  const BASE_FPS = 30

  const animationImage = document.getElementById('animationImage')
  const fpsSlider = document.getElementById('fpsSlider')
  const fpsValueSpan = document.getElementById('fpsValue')
  const seekerSlider = document.getElementById('seekerSlider')
  const seekerValueSpan = document.getElementById('seekerValue')
  const startButton = document.getElementById('startButton')
  const stopButton = document.getElementById('stopButton')
  const resetButton = document.getElementById('resetButton')
  const frameInfo = document.getElementById('frameInfo')

  const FAVICON_SIZE = 32
  let faviconCanvas = document.createElement('canvas')
  let faviconCtx = faviconCanvas.getContext('2d')
  faviconCanvas.width = FAVICON_SIZE
  faviconCanvas.height = FAVICON_SIZE

  let faviconLink = document.querySelector('link[rel="icon"]')
  if (!faviconLink) {
    faviconLink = document.createElement('link')
    faviconLink.rel = 'icon'
    document.head.appendChild(faviconLink)
  }
  faviconLink.type = 'image/png'

  let internalFrameCounter = 0
  let fps = parseInt(fpsSlider.value, 10)
  let animationIntervalId = null
  let isPlaying = false

  function getImagePath(frameIndex) {
    const paddedIndex = String(frameIndex).padStart(5, '0')
    return `${IMAGE_BASE_PATH}${paddedIndex}.png?t=${new Date().getTime()}`
  }

  function updateFavicon() {
    try {
      faviconCtx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE)
      faviconCtx.drawImage(animationImage, 0, 0, FAVICON_SIZE, FAVICON_SIZE)
      faviconLink.href = faviconCanvas.toDataURL('image/png')
    } catch (e) {
      // console.warn('Favicon update failed:', e)
    }
  }

  function updateDisplay(displayIndex) {
    const paddedDisplayIndex = String(displayIndex).padStart(5, '0')
    frameInfo.textContent = `フレーム: ${paddedDisplayIndex} / ${String(LAST_FRAME_INDEX).padStart(5, '0')}`
    seekerSlider.value = displayIndex
    seekerValueSpan.textContent = paddedDisplayIndex
  }

  function animateFrame() {
    const framesToAdvanceInBase = BASE_FPS / fps
    const displayImageIndex = Math.floor(internalFrameCounter * framesToAdvanceInBase) % TOTAL_FRAMES

    animationImage.onload = () => {
      updateDisplay(displayImageIndex)
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
    
    animateFrame()
    animationIntervalId = setInterval(animateFrame, intervalTime)

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
      updateDisplay(0)
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
    }
  }

  function handleSeekerChange() {
    stopAnimation()
    internalFrameCounter = Math.floor(parseInt(seekerSlider.value, 10) / (BASE_FPS / fps))

    const displayImageIndex = parseInt(seekerSlider.value, 10)
    animationImage.onload = () => {
      updateDisplay(displayImageIndex)
      updateFavicon()
    }
    animationImage.src = getImagePath(displayImageIndex)
  }

  resetAnimation()
  fpsValueSpan.textContent = fpsSlider.value
  seekerSlider.max = LAST_FRAME_INDEX

  startButton.addEventListener('click', startAnimation)
  stopButton.addEventListener('click', stopAnimation)
  resetButton.addEventListener('click', resetAnimation)
  fpsSlider.addEventListener('input', handleFpsChange)
  seekerSlider.addEventListener('input', handleSeekerChange)
})