import debounce from 'lodash.debounce'

let _canvas: ImageData | null = null

/**
 * 抗锯齿
 */
function aa (context: CanvasRenderingContext2D, w?: number, h?: number) {
  const devicePixelRatio = window.devicePixelRatio || 2
  const canvas = context.canvas
  const width = w ?? canvas.width
  const height = h ?? canvas.height

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  canvas.width = width * devicePixelRatio
  canvas.height = height * devicePixelRatio

  context.scale(devicePixelRatio, devicePixelRatio)
}

/**
 * 确保容器的position属性为非static值
 */
function ensurePostion (dom: HTMLElement) {
  const position = window.getComputedStyle(dom).position

  if ('static' === position) {
    dom.style.position = 'relative'
  }
}

/**
 * 保存上一帧动画
 * @param context
 */
function saveCanvas (context: CanvasRenderingContext2D) {
  _canvas = context.getImageData(0, 0, context.canvas.width, context.canvas.height)
}

/**
 * 恢复上一帧动画
 * @param context 
 */
function restoreCanvas (context: CanvasRenderingContext2D) {
  _canvas && context.putImageData(_canvas, 0, 0)
}

/**
 * 网格绘制
 * @param context 
 */
function drawGrid (context: CanvasRenderingContext2D) {
  context.save()

  context.clearRect(0, 0, context.canvas.width, context.canvas.height)

  context.lineWidth = 1
  context.strokeStyle = 'rgba(0, 0, 0, 0.03)'
  context.fillStyle = 'rgba(0, 0, 0, 0.2)'

  const step = 40

  // horizontal lines
  for (let i = step; i < context.canvas.height; i += step) {
    context.moveTo(0, i)
    context.fillText(i.toString(), 0, i)
    context.lineTo(context.canvas.width, i)
  }

  context.textBaseline = 'top'
  context.textAlign = 'center'

  // vertical lines
  for (let i = step; i < context.canvas.width; i += step) {
    context.moveTo(i, 0)
    context.fillText(i.toString(), i, 0)
    context.lineTo(i, context.canvas.height)
  }

  context.stroke()

  context.restore()
}

/**
 * 十字线动态绘制
 * @param context 
 * @param e 
 */
function drawCrosshair (context: CanvasRenderingContext2D, e: MouseEvent) {
  context.save()

  context.beginPath()

  /**
   * 横线
   */
  context.moveTo(0, e.clientY)
  context.lineTo(context.canvas.width, e.clientY)

  /**
   * 竖线
   */
  context.moveTo(e.clientX, 0)
  context.lineTo(e.clientX, context.canvas.height)

  context.stroke()

  context.restore()
}

/**
 * 
 * @param root 
 */
function makeRuler (root: HTMLElement) {
  const style = root.getBoundingClientRect()
  const width = style.width
  const height = style.height
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  context && aa(context, width, height)

  const container = document.createElement('div')
  container.className = 'ruler'

  if (context) {
    // drawAxies(context)
    drawGrid(context)
    saveCanvas(context)

    root.addEventListener('mousemove', e => {
      requestAnimationFrame(() => {
        restoreCanvas(context)
        drawCrosshair(context, e)
      })
    })
  }

  container.appendChild(canvas)

  return container
}

function kehua (mixed: string | HTMLElement) {
  let el: HTMLElement | null = null

  if ('string' === typeof mixed) {
    const node = document.querySelector(mixed)
    if (node instanceof HTMLElement) {
      el = node
    }
  } else {
    el = mixed
  }

  if (!(el instanceof HTMLElement)) return

  ensurePostion(el)

  let ruler = makeRuler(el)

  el.appendChild(ruler)

  const onResize = debounce(() => {
    el?.removeChild(ruler)

    if (el) {
      ruler = makeRuler(el)
      el?.appendChild(ruler)
    }
  }, 150)

  window.onresize = onResize

  return ruler
}

export default kehua