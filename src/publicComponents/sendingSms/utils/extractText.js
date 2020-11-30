// const matchParam = /<input[^<>]*value="({[^<>]+})"[^<>]*>/g

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

function extractText (el) {
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

export default extractText
