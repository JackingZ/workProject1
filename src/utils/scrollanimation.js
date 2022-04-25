/**
 *Created by Jhonor on 2018/11/3.
 */

// 滚动条滚动动画

export function scrollAnimation(currentY, targetY) {
  const needScrollTop = targetY - currentY
  let _currentY = currentY
  setTimeout(() => {
    const dist = Math.ceil(needScrollTop / 10)
    _currentY += dist
    window.scrollTo(_currentY, currentY)
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimation(_currentY, targetY)
    } else {
      window.scrollTo(_currentY, targetY)
    }
  }, 1)
}
