/*
 * @Author: 阿佑[ayooooo@petalmail.com] 
 * @Date: 2022-06-30 18:07:00 
 * @Last Modified by: 阿佑
 * @Last Modified time: 2022-07-04 18:53:14
 * 
 * x轴aka主轴aka时间轴aka横坐标轴
 */

type Range = [from: number, to: number]

/**
 * left 向左溢出
 * right 向右溢出
 * shrink 收缩（会突破设置的bandWidth）
 */
type OverflowMode = 'left' | 'right' | 'shrink'

type Domain = (string | number)[]

export type MainAxisOptions = Partial<{
  overflow: OverflowMode; // 溢出模式
  range: Range; // x轴的值域(轴上的显示范围)
  domain: Domain; // 一个domain对应x轴上一个节点
  bandWidth: number; // 一个单位图形显示所需的宽度
  padding: number; // 相邻图形之间的间距（左右两边的总值）
}>

function mainAxis (options: MainAxisOptions = {}) {
  const FROM = 0
  const TO = 1

  let overflow: OverflowMode = options.overflow ?? 'left'
  let _bandWidth = options.bandWidth ?? 1
  let _range: Range = options.range ?? [0, 1]
  let _domain: Domain = options.domain ?? [0, 1]
  let _padding = options.padding ?? 0
  let unitDomainWorth = 1
  let visiableRange: Range = [0, 1]
  let visiableDomain: Range = [0, 1]

  function axis(domain: number) {
    return domain * 1
  }

  /**
   * 更新内部变量
   */
  function apply() {
    const step = (_range[TO] - _range[FROM]) / _domain.length
    _bandWidth = (1 - _padding) * step
  }

  /**
   * 设置/获取domain(轴上的值)
   * @param nextDomain
   * @returns 
   */
  function domain(nextDomain?: Domain) {
    if (nextDomain) {
      _domain = nextDomain
      apply()
    }

    return domain
  }

  /**
   * 
   * @param nextPadding 0 - 1 之间的数字
   * @returns 
   */
  function padding (nextPadding?: number) {
    if (nextPadding && nextPadding > 0 && nextPadding <=1) {
      _padding = nextPadding
      apply()
    }

    return _padding
  }

  /**
   * 获取一个band的区域宽度
   */
  function step () {
    return _bandWidth * (1 + _padding)
  }

  /**
   * 设置/获取一个band宽度
   * @param nextBandWith 
   * @returns 
   */
  function bandWidth (nextBandWith?: number) {
    if (nextBandWith) {
      _bandWidth = nextBandWith
      apply()
    }

    return _bandWidth
  }

  /**
   * 设置/读取range(css区域)
   * @param nextRange 
   * @returns 
   */
  function range(nextRange?: Range) {
    if (nextRange) {
      _range = nextRange
      apply()
    }

    return range
  }

  /**
   * 平移轴
   * @param x 
   */
  function translate (x: number) {
    return x
  }

  /**
   * 缩放轴
   * @param k 缩放系数
   * @param px 缩放点
   */
  function scale (k: number, px?: number) {
    return k * (px ?? 1)
  }

  /**
   * domain选区
   * @param start start domain
   * @param stop  stop domain
   */
  function clip (start: number, stop?: number) {}

  /**
   * range选区
   * @param from range from
   * @param to  range stop
   */
  function clipRange (from: number, to?: number) {}

  axis.prototype = {
    domain,
    range,
    padding,
    step,
    bandWidth,
    translate,
    scale,
  }

  return axis
}

export default mainAxis
