import { createKeyboardHandler, KeyboardOptions } from '.'

const i = 'insert'
const n = 'normal'

type Cursor = typeof i | typeof n

const cursorString = (cursor: Cursor) => `\${${cursor === i ? 'i' : 'n'}}`

const createInput = (options: KeyboardOptions) => (
  strings: TemplateStringsArray,
  cursor: Cursor,
) => {
  let cursorIdx = strings[0].length
  let value = strings.join('')

  const { handleKeystroke, setIsInsert, getIsInsert } = createKeyboardHandler(
    options,
  )

  setIsInsert(cursor === i)

  const handleKeys = (...input: string[]) => {
    input.forEach((k) => {
      const isHandled = handleKeystroke(k) !== null
      if (!isHandled) {
        if (k[0] === '<' && k[k.length - 1] === '>') {
          // keyboard shortcut like <c-s>, do nothing (for now)
          return
        }
        // default keyboard handling, insert typed characters
        value = value.slice(0, cursorIdx) + k + value.slice(cursorIdx)
        cursorIdx += k.length
      }
    })
  }

  const serialize = () => {
    return (
      value.slice(0, cursorIdx) +
      cursorString(getIsInsert() ? i : n) +
      value.slice(cursorIdx)
    )
  }

  return { handleKeys, serialize }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchInput(strings: TemplateStringsArray, cursor: Cursor): R
    }
  }
}

expect.extend({
  toMatchInput(
    received: ReturnType<ReturnType<typeof createInput>>,
    strings: TemplateStringsArray,
    cursor: Cursor,
  ) {
    const expectedValue = strings[0] + cursorString(cursor) + strings[1]
    const actualValue = received.serialize()
    const pass = expectedValue === actualValue

    const options = {
      isNot: this.isNot,
      promise: this.promise,
    }

    const message = pass
      ? () =>
          this.utils.matcherHint(
            'toMatchInput',
            undefined,
            undefined,
            options,
          ) +
          '\n\n' +
          `Expected: not ${this.utils.printExpected(expectedValue)}\n` +
          `Received: ${this.utils.printReceived(actualValue)}`
      : () => {
          return (
            this.utils.matcherHint(
              'toMatchInput',
              undefined,
              undefined,
              options,
            ) +
            '\n\n' +
            `Expected: ${this.utils.printExpected(expectedValue)}\n` +
            `Received: ${this.utils.printReceived(actualValue)}`
          )
        }

    return { actual: actualValue, message, pass }
  },
})

test('vim entering/exiting insert mode and typing', () => {
  const input = createInput({ vim: true })`asdf ${n} asdf`
  expect(input).toMatchInput`asdf ${n} asdf`
  input.handleKeys('i')
  expect(input).toMatchInput`asdf ${i} asdf`
  input.handleKeys('i')
  expect(input).toMatchInput`asdf i${i} asdf`
  input.handleKeys('<esc>')
  expect(input).toMatchInput`asdf i${n} asdf`
})

test('non-vim typing', () => {
  const input = createInput({ vim: false })`asdf 12${i}34 12`
  input.handleKeys('a', 's', 'd', 'f')
  expect(input).toMatchInput`asdf 12asdf${i}34 12`
  input.handleKeys('<esc>')
  // does nothing (non-vim keybindings means it shouldn't switch to normal)
  expect(input).toMatchInput`asdf 12asdf${i}34 12`
})
