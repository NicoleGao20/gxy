/* eslint-disable prettier/prettier */
// 懒加载组件lazy
function lazy(name) {
  // const file = name.split('/');
  // return () => import(/* webpackChunkName: "lazy" */ `@/views/${name}.vue`)
  return () => Promise.resolve(require(`@/views/${name}`).default)
}
export { lazy }
