export default function(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const offsetWidth = canvas.offsetWidth
  const offsetHeight = canvas.offsetHeight
  const dpr = window.devicePixelRatio || 1
  const bsr = 1
  // ctx.webkitBackingStorePixelRatio ||
  // ctx.mozBackingStorePixelRatio ||
  // ctx.msBackingStorePixelRatio ||
  // ctx.oBackingStorePixelRatio ||
  // ctx.backingStorePixelRatio ||
  const ratio = dpr / bsr
  canvas.width = offsetWidth * ratio
  canvas.height = offsetHeight * ratio
  ctx.scale(ratio, ratio)
  return ratio
}
