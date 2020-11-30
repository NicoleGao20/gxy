function insertHtmlAtCaret (html) { // 在光标位置添加内容
  var sel, range
  console.log(1)
  if (window.getSelection) {
    console.log(2)
    // IE9 and non-IE
    sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0)
      range.deleteContents()
      // Range.createContextualFragment() would be useful here but is
      // non-standard and not supported in all browsers (IE9, for one)
      var el = document.createElement('div')
      el.innerHTML = html
      var frag = document.createDocumentFragment(); var node; var lastNode
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
    }
  } else if (document.selection && document.selection.type !== 'Control') {
    // IE < 9
    document.selection.createRange().pasteHTML(html)
  } else {
    console.log(3)
  }
}

export default insertHtmlAtCaret
