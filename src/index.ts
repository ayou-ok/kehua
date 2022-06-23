/**
 * 确保容器的position属性为非static值
 */
function ensurePostion (dom: HTMLElement) {
  const position = window.getComputedStyle(dom).position

  if ('static' === position) {
    dom.style.position = 'relative'
  }
}

function makeHorizontalRuler (width: number) {
  const ruler = document.createElement('div')
  for (let i = 1; i < width; i += 5) {
    const scale = document.createElement('i')
    scale.style.cssText = `
      position: absolute;
      top: 0;
      width: 1px;
      height: 5px;
      left: ${i}px;
      background: red;
      display: inline-block;
    `

    ruler.appendChild(scale)
  }
  return ruler
}

function makeVerticalRuler (height: number) {
  const ruler = document.createElement('div')
  return ruler
}

function makeRuler (root: HTMLElement) {
  const container = document.createElement('div')
  const style = root.getBoundingClientRect()
  console.log(style)
  const width = style.width
  const height = style.height
  const c = document.createElement('canvas')
  c.width = width
  c.height = height

  container.style.display = 'none'
  container.className = 'ruler'

  // container.appendChild(makeHorizontalRuler(width))
  // container.appendChild(makeVerticalRuler(height))
  container.appendChild(c)

  return container
}

function styleRule (rule: HTMLElement) {
  rule.style.display = ''

  rule.querySelector('horizontal')
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

  const ruler = makeRuler(el)

  styleRule(ruler)

  el.appendChild(ruler)
}

export default kehua