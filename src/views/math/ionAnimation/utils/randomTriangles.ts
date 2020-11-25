export default function randomTriangles() {
  const u_color = [Math.random(), Math.random(), Math.random(), 1.0] // 随机颜色
  const u_rotation = Math.random() * Math.PI // 初始旋转角度
  const u_scale = Math.random() * 0.05 + 0.03 // 初始大小
  const u_time = 0
  const u_duration = 3.0 // 持续3秒钟
  const rad = Math.random() * Math.PI * 2
  const u_dir = [Math.cos(rad), Math.sin(rad)] // 运动方向
  const startTime = performance.now()
  return { u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime }
}
