import debounce from 'lodash.debounce'

/**
 * 确保容器的position属性为非static值
 */
function ensurePostion (dom: HTMLElement) {
  const position = window.getComputedStyle(dom).position

  if ('static' === position) {
    dom.style.position = 'relative'
  }
}

function drawAxies (context: CanvasRenderingContext2D) {
  context.save()
  context.lineWidth = 0.5
  context.strokeStyle = 'red'

  // x-axis
  context.moveTo(0, 0)
  context.lineTo(context.canvas.width, 0.5)

  // y-axis
  context.moveTo(0, 0)
  context.lineTo(0.5, context.canvas.height)

  context.stroke()

  context.restore()
}

function drawGrid (context: CanvasRenderingContext2D) {
  context.save()

  context.clearRect(0, 0, context.canvas.width, context.canvas.height)

  context.lineWidth = 0.5
  context.strokeStyle = 'grey'

  const step = 30

  // horizontal lines
  for (let i = step; i < context.canvas.height; i += step) {
    context.moveTo(0, i + 0.5)
    context.strokeText(i.toString(), 0, i)
    context.lineTo(context.canvas.width, i + 0.5)
  }

  context.textBaseline = 'top'
  context.textAlign = 'center'

  // vertical lines
  for (let i = step; i < context.canvas.width; i += step) {
    context.moveTo(i + 0.5, 0)
    context.strokeText(i.toString(), i, 0)
    context.lineTo(i + 0.5, context.canvas.height)
  }

  context.stroke()

  context.restore()
}

function makeRuler (root: HTMLElement) {
  const container = document.createElement('div')
  const style = root.getBoundingClientRect()
  const width = style.width
  const height = style.height
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  container.className = 'ruler'

  if (context) {
    // drawAxies(context)
    drawGrid(context)
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