const authority = (id) => {
  const key = window.location.pathname
  let rule = localStorage.getItem('rule')
  const ruleobj = JSON.parse(rule)
  if (ruleobj[key] && ruleobj[key][id]) {
    return true
  } else {
    return false
  }
}
export default authority
