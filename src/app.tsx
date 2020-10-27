import { css } from 'goober'
import { h, JSX } from 'preact'

const appStyle = css``

const avg = (...args: number[]) =>
  args.reduce((sum, n) => sum + n, 0) / args.length

const placeCursorAtPoint = (x: number, y: number) => {
  const sel = document.getSelection()
  if (!sel) return
  let newRange: Range
  if (document.caretPositionFromPoint) {
    // standard, only FF/Safari supports
    const pos = document.caretPositionFromPoint(x, y)
    if (!pos) return
    newRange = document.createRange()
    newRange.setStart(pos.offsetNode, pos.offset)
    newRange.setEnd(pos.offsetNode, pos.offset)
  } else if (document.caretRangeFromPoint) {
    // non-standard, but works in browsers except FF
    newRange = document.caretRangeFromPoint(x, y)
  } else {
    return
  }
  sel.removeAllRanges()
  sel.addRange(newRange)
}

const getTextBeginRect = (el: Element) => {
  const range = document.createRange()
  const firstTextNode = el.firstChild
  if (!firstTextNode) return
  range.setStart(firstTextNode, 0)
  range.setEnd(firstTextNode, 0)
  return range.getBoundingClientRect()
}

const getTextEndRect = (el: Element) => {
  const range = document.createRange()
  const lastTextNode = el.lastChild
  if (!lastTextNode) return
  range.setStart(lastTextNode, (lastTextNode as Text).length)
  range.setEnd(lastTextNode, (lastTextNode as Text).length)
  return range.getBoundingClientRect()
}

const TextBox = () => {
  const handleKeyDown: JSX.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const el = e.currentTarget
    if (e.key === 'ArrowDown') {
      const sel = document.getSelection()
      if (!sel || sel.type !== 'Caret' || !sel.focusNode) return
      if (sel.focusNode.parentElement !== el) return
      const cursorPos = sel.getRangeAt(0).getBoundingClientRect()
      const isLastLine = cursorPos.bottom === getTextEndRect(el)?.bottom
      console.log(isLastLine)
      if (!isLastLine || !el.nextElementSibling) return
      e.preventDefault()
      const nextLineCursorY = getTextBeginRect(el.nextElementSibling)?.y
      if (!nextLineCursorY) return
      placeCursorAtPoint(cursorPos.x, nextLineCursorY + 1)
    } else if (e.key === 'ArrowUp') {
      const sel = document.getSelection()
      if (!sel || sel.type !== 'Caret' || !sel.focusNode) return
      if (sel.focusNode.parentElement !== el) return
      const cursorPos = sel.getRangeAt(0).getBoundingClientRect()
      const isFirstLine = cursorPos.top === getTextBeginRect(el)?.top
      if (!isFirstLine || !el.previousElementSibling) return
      e.preventDefault()
      const prevLineCursorY = getTextEndRect(el.previousElementSibling)?.y
      if (!prevLineCursorY) return
      placeCursorAtPoint(cursorPos.x, prevLineCursorY + 1)
    }
  }
  return (
    <div
      contentEditable
      spellcheck
      class={css`
        width: 100px;
        font-size: 16px;
        font-family: 'sans';
      `}
      onKeyDown={handleKeyDown}
    >
      Lorem ipsum dolor sit amet
    </div>
  )
}

export const App = () => {
  return (
    <div class={appStyle}>
      <TextBox />
      <TextBox />
    </div>
  )
}
