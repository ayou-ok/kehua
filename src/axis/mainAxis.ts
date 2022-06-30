/*
 * @Author: 阿佑[ayooooo@petalmail.com] 
 * @Date: 2022-06-30 18:07:00 
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-06-30 18:10:07
 */

type Range = [from: number, to: number]

function mainAxis () {
  const FROM = 0
  const TO = 1

  let range: Range = [0, 1]
  let domain: Range = [0, 1]
  let renagedDomain: Range = [0, 1]
  let unitDromainRange = 1
  let originDomain = 0

  function axis(domain: number) {
    return domain * 1
  }

  function apply() {
    unitDromainRange = (range[TO] - range[FROM]) / (domain[TO] - domain[FROM])
  }

  function domain(nextDomain?: Range) {
    if (nextDomain) {
      domain = nextDomain
      apply()
    }

    return domain
  }

  function padding () {}

  function step () {}

  function bandWidth () {}

  function scaleTo () {}

  function rangeTo () {}

  function range(nextRange?: Range) {
    if (nextRange) {
      range = nextDomain
      apply()
    }

    return range
  }

  axis.prototype = {
    domain,
    range,
    padding,
    step,
    bandWidth,
  }

  return axis
}

export default mainAxis
