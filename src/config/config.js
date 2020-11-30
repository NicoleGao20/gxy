const stage_env = process.env.STAGE_ENV || 'prod'
const isDev = process.env.NODE_ENV !== 'production'
// npm run dev 起本地服务，isDev 就等于true
const urlConfig = {
  'dev': 'http://101.133.229.211:9091/crm-sadmin',
  'test': 'http://47.103.43.2:9091/crm-sadmin',
  'prod': ''
}
const uploadUrlConfig = {
  'dev': '/auth-setting',
  'test': '/auth-setting',
  'prod': ''
}
console.log('stage_env', stage_env)
const burl = isDev
  ? '/crm-sadmin'
  : urlConfig[stage_env]
const bFileConfig = isDev
  ? '/auth-setting'
  : uploadUrlConfig[stage_env]

const config = {
  url: burl,
  uploadUrl: `${burl}/oss/inputFile${bFileConfig}`
}

const urlConfigBackend = {
  'dev': 'http://101.133.229.211:9091/crm-backend',
  'test': 'http://47.103.43.2:9091/crm-backend',
  'prod': ''
}
const uploadUrlConfigBackend = {
  'dev': '/auth-setting',
  'test': '/auth-setting',
  'prod': ''
}
console.log('stage_env', stage_env)
const burlBackend = isDev
  ? '/crm-backend'
  : urlConfigBackend[stage_env]
const bFileConfigBackend = isDev
  ? '/auth-setting'
  : uploadUrlConfigBackend[stage_env]

export const configBackend = {
  url: burlBackend,
  uploadUrl: `${burlBackend}/oss/inputFile${bFileConfigBackend}`
}

const urlConfigXxl = {
  'dev': 'http://101.133.229.211:9091/crm-xxl',
  'test': 'http://47.103.43.2:9091/crm-xxl',
  'prod': ''
}
const uploadUrlConfigXxl = {
  'dev': '/auth-setting',
  'test': '/auth-setting',
  'prod': ''
}
const burlXxl = isDev
  ? '/crm-xxl'
  : urlConfigXxl[stage_env]
const bFileConfigXxl = isDev
  ? '/auth-setting'
  : uploadUrlConfigXxl[stage_env]

export const configXxl = {
  url: burlXxl,
  uploadUrl: `${burlXxl}/oss/inputFile${bFileConfigXxl}`
}
const urlConfigLogin = {
  'dev': 'http://101.133.229.211:9091/crm-login',
  'test': 'http://47.103.43.2:9091/crm-login',
  'prod': ''
}
const uploadUrlConfigLogin = {
  'dev': '/auth-setting',
  'test': '/auth-setting',
  'prod': ''
}
const burlLogin = isDev
  ? '/crm-login'
  : urlConfigLogin[stage_env]
const bFileConfigLogin = isDev
  ? '/auth-setting'
  : uploadUrlConfigLogin[stage_env]

export const configLogin = {
  url: burlLogin,
  uploadUrl: `${burlLogin}/oss/inputFile${bFileConfigLogin}`
}

export default config
