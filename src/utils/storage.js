// 获取本地存储
export const getItem = name => {
  return JSON.parse(window.localStorage.getItem(name))
}

// 添加本地存储

export const setItem = (name, data) => {
  return window.localStorage.setItem(name, JSON.stringify(data))
}

// 清除本地存储

export const removeItem = name => {
  return window.localStorage.removeItem(name)
}
