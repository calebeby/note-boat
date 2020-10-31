import { JSX } from 'preact'

export interface KeyboardOptions {
  vim: boolean
}

export const createKeyboardHandler = (options: KeyboardOptions) => {
  let isInsert = options.vim ? false : true

  // Keybindings handlers should return `null` if they did not handle the keybinding
  // If a keybinding has multiple strokes (i.e <space>a), the additional strokes will be nested
  const vimNormalKeybindings = {
    i: () => {
      isInsert = true
    },
  }

  const vimInsertKeybindings = {
    '<esc>': () => {
      isInsert = false
    },
  }

  const regularKeybindings = {}

  /**
   * @param key Key(s) pressed in the vim keyboard shortcut format,
   * i.e. `a` or `<c-space>`
   * @returns null if the keystroke was not handled
   */
  const handleKeystroke = (key: string) => {
    if (options.vim) {
      if (isInsert) {
        const fn = vimInsertKeybindings[key]
        const result = fn ? fn() : null
        if (result !== null) return
      } else {
        const fn = vimNormalKeybindings[key]
        const result = fn ? fn() : null
        if (result !== null) return
      }
    }
    const fn = regularKeybindings[key]
    const result = fn ? fn() : null
    if (result !== null) return

    return null
  }

  const setIsInsert = (insert: boolean) => {
    isInsert = insert
  }

  const getIsInsert = () => isInsert

  return { handleKeystroke, setIsInsert, getIsInsert }
}
