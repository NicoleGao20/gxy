import Cookies from 'js-cookie'
export function getToken(TokenKey) {
  return Cookies.get(TokenKey)
}

export function setToken(TokenKey, token) {
  return Cookies.set(TokenKey, token)
}
export function removeToken(TokenKey) {
  return Cookies.remove(TokenKey)
}

export function getSession(TokenKey) {
  return JSON.parse(sessionStorage.getItem(TokenKey))
}

export function setSession(TokenKey, data) {
  return sessionStorage.setItem(TokenKey, JSON.stringify(data))
}

export function removeSession(TokenKey) {
  return sessionStorage.removeItem(TokenKey)
}
