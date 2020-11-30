const blockNodes = [
  'address',
  'blockquote',
  'center',
  'dir',
  'div',
  'hr',
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6'
]

/**
 * 提取文本内容
 */
export function extractText(el) {
  let text = ''
  if (!(el && el.childNodes)) {
    return text
  }
  Array.prototype.forEach.call(el.childNodes, (child, index) => {
    const nodeName = child.nodeName.toLowerCase()

    if (blockNodes.indexOf(nodeName) > -1) {
      console.log(index, index > 0 ? '\n' : '', 999)
      text += `${index > 0 ? '\n' : ''}${extractText(child)}`
      console.log(text, 100)
    } else if (nodeName === 'input') {
      text += child.value
    } else if (nodeName === 'br') {
      if (child.nextSibling) {
        text += '\n'
      }
    } else {
      text += child.textContent
    }
  })
  return text
}

/**
 *  把文本转化为dom节点
 */
export function getDom(data, islink) {
  return `<input value="${data}" style="display:inline-block;border:none;color:#0a8ddf;width:${textWidth(data)}px;text-align:center" readonly/>`
}

/**
 *  设置节点的宽度
 */
export function textWidth(text) {
  // 创建节点
  const sbox = document.createElement('span')

  // 设置节点id
  sbox.id = 'lswtColse'

  // 设置节点属性
  sbox.style.top = '-100000px'
  sbox.style.right = '0px'
  sbox.style.fontSize = '12px'
  sbox.style.position = 'absolute'
  sbox.innerHTML = `{ ${text} }`
  document.body.appendChild(sbox)
  return sbox.offsetWidth
}

/**
 *  把当前编辑框内的个性化文本批量转化为dom节点
 */
export function convertValueToDom(val) {
  const arr = val.match(/\{(.*?)\}/g)
  if (arr && arr.length) {
    arr.forEach(param => {
      const replaceDom = getDom(param)
      val = val.replace(param, replaceDom)
    })
  }
  return val
}

/**
 *  获取光标位置
 */
export function getCursor() {
  let sel, range
  if (window.getSelection()) {
    sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0)
      range.deleteContents()
    }
  }
  return { sel, range }
}

/**
 *  获取属性名
 */
export function getParamKey(val) {
  if (val.startsWith('{{') && val.endsWith('}}') && val.includes('.')) {
    return val.replace('{{', '').replace('}}', '').split('.')[0]
  } else {
    return val
  }
}

/**
 *  回显数据时转换属性名为对应的标签名
 */
export function convertValueToName(val, paramList) {
  const arr = val.match(/\{\{(.*?)\}\}/g)
  if (arr && arr.length) {
    arr.forEach(param => {
      const selectedParam = paramList.find(x => x.code === param)
      if (selectedParam && selectedParam.paramKey) {
        val = val.replace(param, selectedParam.paramKey)
      } else {
        val = val.replace(param, '')
      }
    })
  }
  return val
}

/**
 *  提交表单时转换标签名为对应的属性名
 */
export function convertNameToValue(val, paramList) {
  const arr = val.match(/\{(.*?)\}/g)
  if (arr && arr.length) {
    arr.forEach(param => {
      const selectedParam = paramList.find(x => x.paramKey === param)
      if (selectedParam && selectedParam.code) {
        val = val.replace(param, selectedParam.code)
      } else {
        val = val.replace(param, '')
      }
    })
  }
  return val
}

export function insertHtml(html, cursor, ref) {
  const sel = cursor.sel
  let range = cursor.range
  const el = document.createElement('div')
  el.innerHTML = html
  const frag = document.createDocumentFragment()
  let node
  let lastNode
  while ((node = el.firstChild)) {
    lastNode = frag.appendChild(node)
  }
  range.insertNode(frag)
  // Preserve the selection
  if (lastNode) {
    range = range.cloneRange()
    range.setStartAfter(lastNode)
    range.collapse(true)
    sel.removeAllRanges()
    sel.addRange(range)
  }
  extractText(ref)
}
