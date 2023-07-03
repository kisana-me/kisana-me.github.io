const blockPanel = document.getElementById('block-panel')
const workspace = document.getElementById('workspace')

blockPanel.addEventListener('dragstart', function(event) {
  event.dataTransfer.setData('text', event.target.id)
})

workspace.addEventListener('dragover', function(event) {
  event.preventDefault()
})

workspace.addEventListener('drop', function(event) {
  const blockId = event.dataTransfer.getData('text')
  const block = document.getElementById(blockId).cloneNode(true)
  workspace.appendChild(block)

  event.preventDefault()
})

//追加機構
//blockPanelではなく一つ一つにforでリスナー設定する
blockPanel.addEventListener('touchstart', (event)=>hundleDragStart(event))
function hundleDragStart(event) {
  const touch = event.touches[0]
  console.log(touch.target.id)
  const block = document.getElementById(touch.target.id).cloneNode(true)
  workspace.appendChild(block)
  const offsetX = touch.clientX - block.getBoundingClientRect().x
  const offsetY = touch.clientY - block.getBoundingClientRect().y
  console.log(workspace.getBoundingClientRect().x, workspace.getBoundingClientRect().y)

  function handleDrag(event) {
    const moveTouch = event.touches[0]
    const x = moveTouch.clientX - offsetX
    const y = moveTouch.clientY - offsetY
    console.log(x, y)
    block.style.transform = `translate(${x}px, ${y}px)`
  }

  function handleDrop(event) {
    event.preventDefault()
    window.removeEventListener('touchmove', handleDrag)
    window.removeEventListener('touchend', handleDrop)
  }

  window.addEventListener('touchmove', handleDrag)
  window.addEventListener('touchend', handleDrop)
}