import debounce from 'lodash.debounce'
import log from 'lunzi/src/log'

const print = log.create()

let _canvas: HTMLImageElement | null = null

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
  const img = new Image(parseInt(context.canvas.style.width), parseInt(context.canvas.style.height))
  console.log(img.height, img.width)
  img.src = context.canvas.toDataURL('image/png', 1)
  _canvas = img
}

/**
 * 恢复上一帧动画
 * @param context
 */
function restoreCanvas (context: CanvasRenderingContext2D) {
  if (_canvas) {
    context.clearRect(0, 0, _canvas.width, _canvas.height)
    context.drawImage(_canvas, 0, 0, _canvas.width, _canvas.height)
  }
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

  context.beginPath()

  const step = 40

  // 横线簇
  for (let i = step; i < context.canvas.height; i += step) {
    context.moveTo(0, i)
    context.lineTo(context.canvas.width, i)
  }

  // 竖线簇
  for (let i = step; i < context.canvas.width; i += step) {
    context.moveTo(i, 0)
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

  /**
   * 横线
   */
  context.beginPath()
  context.moveTo(0, e.clientY)
  context.lineTo(context.canvas.width, e.clientY)
  context.stroke()

  /**
   * 横线标签
   */
  const measure = context.measureText(e.clientY.toString())
  const padding = 4
  const width = measure.width + padding
  const height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent + padding

  context.beginPath()
  context.rect(0, e.clientY - height / 2, width, height)
  context.fill()
  context.save()
  context.fillStyle = 'white'
  context.textBaseline = 'middle'
  context.fillText(e.clientY.toString(), 0 + padding / 2, e.clientY)
  context.stroke()
  context.restore()

  /**
   * 竖线
   */
  context.beginPath()
  context.moveTo(e.clientX, 0)
  context.lineTo(e.clientX, context.canvas.height)
  context.stroke()

  /**
   * 竖线标签
   */
  context.beginPath()
  context.textBaseline = 'top'
  context.textAlign = 'center'
  context.fillText(e.clientX.toString(), e.clientX, 0)
  context.stroke()

  context.restore()
}

function drawBubbles (context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas
  for (let i = 0; i < 2000; i++) {
    context.beginPath()
    context.arc(Math.random() * width, Math.random() * height, 10, 0, 360)
    context.stroke()
  }
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

  const container = document.createElement('div')
  container.className = 'ruler'

  if (context) {
    aa(context, width, height)

    if (context) {
      drawGrid(context)
      saveCanvas(context)

      const draw = (e) => {
        restoreCanvas(context)
        // drawCrosshair(context, e)
        // drawBubbles(context)
      }

      root.addEventListener('mousemove', e => {
        requestAnimationFrame(() => {
          restoreCanvas(context)
          drawCrosshair(context, e)
          // drawBubbles(context)
        })
      })


      root.addEventListener('touchmove', () => {
        requestAnimationFrame(draw)
      })
    }

    container.appendChild(canvas)
  }

  return container
}

function kehua (mixed: string | HTMLElement) {
  let el: HTMLElement | null = null

  print('jojo')

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

  window.onresize = debounce(() => {
    el?.removeChild(ruler)

    if (el) {
      ruler = makeRuler(el)
      el?.appendChild(ruler)
    }
  }, 150)

  return ruler
}

export default kehua
