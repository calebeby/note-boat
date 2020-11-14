export const keepCaretPos = (
  initialCaretPos: number,
  initialText: string,
  changedText: string,
) => {
  // Special case: If the cursor is at the end, keep it at the end
  if (initialCaretPos === initialText.length) return changedText.length
  // Special case: If the cursor is at the end, keep it at the end
  if (initialCaretPos === 0) return 0

  const charsBeforeCaret = initialText.slice(0, initialCaretPos)

  let cursorCanidates: number[] = []
  let cursorCanidatePos = 0
  while (cursorCanidatePos < changedText.length) {
    if (
      changedText[cursorCanidatePos - 1] ===
      charsBeforeCaret[charsBeforeCaret.length - 1]
    )
      cursorCanidates.push(cursorCanidatePos)

    cursorCanidatePos++
  }
  let checkIdx = -1
  while (cursorCanidates.length > 1) {
    let newCursorCanidates: number[] = []
    const expectedChar = initialText[initialCaretPos + checkIdx]
    for (const cPos of cursorCanidates) {
      if (changedText[cPos + checkIdx] === expectedChar) {
        newCursorCanidates.push(cPos)
      }
    }
    // after checking 10 chars before the caret
    // or hitting the start of string
    // start checking chars after
    if (checkIdx < -9 || -checkIdx >= initialCaretPos) {
      checkIdx = 0
    } else if (checkIdx >= 0) {
      checkIdx++
    } else {
      checkIdx--
    }
    if (newCursorCanidates.length === 0 || checkIdx > 9) {
      return cursorCanidates[0]
    }
    cursorCanidates = newCursorCanidates
  }
  if (cursorCanidates[0]) return cursorCanidates[0]

  return clamp(0, initialCaretPos, changedText.length)
}

const clamp = (low: number, val: number, high: number) =>
  Math.max(low, Math.min(val, high))
