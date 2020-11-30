function insertHtmlAtCaret(html) { // 在光标位置添加内容
  var sel, range
  if (window.getSelection) {
    console.log('有光标情况')
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
    console.log('没光标情况')
    // IE < 9
    document.selection.createRange().pasteHTML(html)
  }
}

export default insertHtmlAtCaret
