/* eslint-disable prettier/prettier */
// 懒加载组件lazy
function lazy(name) {
  // const file = name.split('/');
  return () => import(/* webpackMode: "lazy" */ `@/views/${name}.vue`)
}
export { lazy }
