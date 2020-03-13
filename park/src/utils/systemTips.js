import { Notification } from 'element-ui'
let notifyInstance
export function open2(msg) {
// 错误消息过滤
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '警告',
    message: msg,
    type: 'warning',
    position: 'bottom-right'
  })
  return notifyInstance
}
export function openWarning() {
  // 提示填写数据
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '警告信息',
    message: '请填写这3项数据！',
    type: 'error',
    position: 'bottom-right'
  })
}

// 删除
export function delSelect() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '警告信息',
    message: '请选择至少一条数据',
    type: 'error',
    position: 'bottom-right'
  })
}
// 删除成功
export function delSuccess() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    type: 'success',
    message: '删除成功!',
    position: 'bottom-right'
  })
}
// 删除取消
export function delCancel() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    type: 'info',
    message: '已取消删除',
    position: 'bottom-right'
  })
}

// 修改 选择一条数据
export function editOne() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '警告信息',
    message: '请选择一条数据',
    type: 'error',
    position: 'bottom-right'
  })
}
// 修改 选择一条数据
export function editMut() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '警告信息',
    message: '最多只能选择一条数据进行操作',
    type: 'error',
    position: 'bottom-right'
  })
}
// 修改成功的提示
export function open1() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '成功',
    message: '修改成功',
    type: 'success',
    position: 'bottom-right'
  })
}
// 未修改数据，弹框提示
export function open3() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '警告信息',
    message: '您未输入修改数据，无法修改！',
    type: 'error',
    position: 'bottom-right'
  })
}
// 入园成功的提示
export function carIn() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '成功',
    message: '入园成功',
    type: 'success',
    position: 'bottom-right'
  })
}
// 审核成功的提示
export function planCheck() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '成功',
    message: '审核通过',
    type: 'success',
    position: 'bottom-right'
  })
}
// 打印成功的提示
export function planPrint() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '成功',
    message: '打印成功',
    type: 'success',
    position: 'bottom-right'
  })
}
// 出园成功的提示
export function carOut() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '成功',
    message: '出园成功',
    type: 'success',
    position: 'bottom-right'
  })
}
// 子页面
// 选数据进行编制
export function compile() {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '成功',
    message: '编制成功',
    type: 'success',
    position: 'bottom-right'
  })
}

/**
 * 通用成功提示
 * @param {提示消息} msg
 */
export function success(msg) {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '提示',
    message: msg,
    type: 'success',
    position: 'bottom-right'
  })
}

/**
 * 通用警告提示
 * @param {警告消息} msg
 */
export function warning(msg) {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '提示',
    message: msg,
    type: 'warning',
    position: 'bottom-right'
  })
}

/**
 * 通用错误提示
 * @param {错误消息} msg
 */
export function error(msg) {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '提示',
    message: msg,
    type: 'error',
    position: 'bottom-right'
  })
}

/**
 * 通用消息提示
 * @param {info消息} msg
 */
export function info(msg) {
  if (notifyInstance) {
    notifyInstance.close()
  }
  notifyInstance = Notification({
    title: '提示',
    message: msg,
    type: 'info',
    position: 'bottom-right'
  })
}
