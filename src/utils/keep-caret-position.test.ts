import { keepCaretPos } from './keep-caret-position'

const parseCaret = (input: string) => {
  const caretPos = input.indexOf('|')
  const text = input.slice(0, caretPos) + input.slice(caretPos + 1)
  return [text, caretPos] as const
}

const stringifyCaret = (caretPos: number, input: string) =>
  `${input.slice(0, caretPos)}|${input.slice(caretPos)}`

const testPreserveCaret = (input: string, expected: string) => {
  const [textIn, caretPosIn] = parseCaret(input)
  const [textOut, caretPosOut] = parseCaret(expected)
  const actualCaretPos = keepCaretPos(caretPosIn, textIn, textOut)
  if (actualCaretPos === caretPosOut) return
  const msg = `  Input:

  ${input}

  Expected caret position:

  ${expected}

  Actual caret position:

  ${stringifyCaret(actualCaretPos, textOut)}
`

  const error = new Error(msg)
  let hasEliminated = false
  error.stack = error.stack
    ?.split('\n')
    .filter((l) => {
      if (hasEliminated) return true
      if (!/^\s*at/.test(l)) return true
      hasEliminated = true
      return false
    })
    .join('\n')
  throw error
}

test('keeps cursor position when text added before', () => {
  testPreserveCaret('asdf 1234| asdfl', 'newText asdf 1234| asdfl')
  testPreserveCaret(
    'asdf 1234\n\n\t | asdfl',
    'newText asdf 1234\n\n\t | asdfl',
  )
})

test('keeps cursor position when multiple instances of text', () => {
  testPreserveCaret('1234 1234| asdfl', '1234 1234 1234| asdfl')
})

test('clamps cursor position to ends', () => {
  testPreserveCaret('asdf 1234 asdl|', 'asdf|')
  testPreserveCaret('a|sdf 1234 asdfl', 's|sss')
})

test('Cursor position should stay at beginning at end if there are edits', () => {
  testPreserveCaret('this is a test|', 'something completely different|')
  testPreserveCaret('|this is a test', '|something completely different')
})
