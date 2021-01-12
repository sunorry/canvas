class Model {
  uniforms: any
  bufferInfo: any
  translation: number[]
  rotation: number[]
  scalation: number[]
  constructor(bufferInfo?: any, uniforms?: any) {
    this.bufferInfo = bufferInfo || {}
    this.uniforms = uniforms || {}
    // this.u_Matrix = matrix.identity(); // 单位矩阵
    // 偏移
    this.translation = [0, 0, 0]
    // 旋转角度
    this.rotation = [0, 0, 0]
    // 缩放
    this.scalation = [1, 1, 1]
  }

  setBufferInfo(bufferInfo: any) {
    this.bufferInfo = bufferInfo || async function name() {}
  }
}

// bufferInfo = {
//   attributes:{
//       a_Positions: {
//           buffer: buffer,
//           type: gl.FLOAT,
//           normalize: false,
//           numsPerElement: 4,
//       },
//       a_Colors:{
//           buffer:buffer,
//           type: gl.UNSIGNED_BYTE,
//           normalize: true,
//           numsPerElement: 4
//       },
//       a_Normals:{
//           buffer:buffer,
//           type: gl.FLOAT,
//           normalize: false,
//           numsPerElement: 3
//       },
//       a_Texcoords:{
//           buffer:buffer,
//           type: gl.FLOAT,
//           normalize: false,
//           numsPerElement: 2
//       }
//   },
//   indices:[],
//   elementsCount: 30
// }
