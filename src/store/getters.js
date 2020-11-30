const getters = {
  token: state => state.user.token,
  jobNumber: state => state.user.jobNumber,
  brandRoles: state => state.user.brandRoles,
  merchantId: state => state.user.merchantId,
  sidebar: state => state.app.sidebar,
  sideSubRouter: state => state.app.sideSubRouter,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  sidebarRouter: state => state.user.sidebarRouter,
  language: state => state.app.language,
  showSettings: state => state.settings.showSettings,
  brandCode: state => state.brand.brandCode,
  brandName: state => state.brand.brandName
}
export default getters
