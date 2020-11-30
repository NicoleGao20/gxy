'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
console.log(process.env.NODE_ENV)
module.exports = merge(prodEnv, {
  NODE_ENV: `"${process.env.NODE_ENV}"`,
  BASE_API: '"crm-sadmin"'
})
