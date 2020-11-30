const getServerUrl = () => {
  // let env = `${location.protocol}//crm-admin-app.01.prd.bjm6v.belle.lan`
  // const envList = ['dev', 'test', 'pre', 'demo']
  // envList.forEach(item => {
  //   if (window.location.host.includes(item)) {
  //     env = `crm-sso-op-${item}`
  //     env = `${location.protocol}//${env}.belle.net.cn`
  //   }
  // })
  // // `${location.protocol}//${env}.belle.net.cn`
  // return env
  return window.location.origin
}
export const ssoServer = getServerUrl()
// export const ssoServer = `${location.protocol}//crm-sso-dev.belle.net.cn`

// export const ssoServer = `${location.protocol}//crm-sso-dev.belle.net.cn`
