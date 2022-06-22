/**
 * 确保容器的position属性为非static值
 */
function ensurePostion (dom: HTMLElement) {
  const position = window.getComputedStyle(dom).position

  if ('static' === position) {
    dom.style.position = 'relative'
  }
}

function kehua (mixed: string | HTMLElement) {
  let target
  console.log('jojo', mixed)
}

export default kehua