import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import {
  NDoc,
  NDocBlockText,
  NDocBlockType,
  NDocRevision,
  NDocRevisionType,
} from './history'
import { keepCaretPos } from './utils/keep-caret-position'

interface Props {
  onNewRevision: (revision: NDocRevision) => void
  doc: NDoc
}

export const Doc = ({ doc, onNewRevision }: Props) => {
  return (
    <div>
      {doc.blocks.map((block) => {
        if (block.type === NDocBlockType.Text) {
          return (
            <BlockText
              key={block.id}
              block={block}
              onNewRevision={onNewRevision}
            />
          )
        }
      })}
    </div>
  )
}

const BlockText = ({
  block,
  onNewRevision,
}: {
  block: NDocBlockText
  onNewRevision: (revision: NDocRevision) => void
}) => {
  const elRef = useRef<HTMLParagraphElement>()
  const { contents } = block
  useEffect(() => {
    const prev = elRef.current.textContent

    if (prev === contents) return

    console.log(
      'Updating because contents changed',
      prev,
      contents,
      prev === contents,
    )

    const sel = document.getSelection()
    let beforeCaretPos: number | undefined
    if (
      sel &&
      sel.type === 'Caret' &&
      sel.focusNode &&
      // sometimes it will be in a text node, otherwise the element directly
      (sel.focusNode === elRef.current ||
        sel.focusNode.parentElement === elRef.current)
    ) {
      beforeCaretPos = sel.focusOffset
    }
    elRef.current.textContent = contents
    if (sel && beforeCaretPos !== undefined) {
      const afterCaretPos = keepCaretPos(beforeCaretPos, prev, contents)
      const node = elRef.current.firstChild
      if (node) {
        sel.removeAllRanges()
        const range = document.createRange()
        range.setStart(node, afterCaretPos)
        range.setEnd(node, afterCaretPos)
        sel.addRange(range)
      }
    }
  }, [elRef, contents])
  const updateTimeout = useRef<number>()
  return (
    <p
      ref={elRef}
      contentEditable
      onInput={() => {
        clearTimeout(updateTimeout.current)
        updateTimeout.current = setTimeout(() => {
          const value = elRef.current.textContent as string
          onNewRevision({
            type: NDocRevisionType.EditBlock,
            blockId: block.id,
            timestamp: new Date().getTime(),
            blockValue: { contents: value },
          })
          // Don't add a revision until user is idle for 400ms
        }, 400)
      }}
    />
  )
}

declare global {
  function setTimeout(
    handler: TimerHandler,
    timeout?: number,
    ...arguments: any[]
  ): number
}
