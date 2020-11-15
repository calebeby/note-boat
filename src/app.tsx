import { css } from 'goober'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Doc } from './doc'
import { applyRevisions, NDoc, NDocBlockType, NDocRevision } from './history'
import { formatDay, stripTime } from './utils/format-day'
import clsx from 'clsx'

const headerHeight = '4rem'

export const App = () => {
  const [revisions, setRevisions] = useState<NDocRevision[]>([])
  const [pinnedRevision, pinRevision] = useState<NDocRevision | null>(null)
  const [isHistoryShown, setIsHistoryShown] = useState(false)
  useEffect(() => {
    // Should not be pinned to an old version if history menu is closed.
    // And reopening the menu should not go back to the previously-pinned version
    if (!isHistoryShown) pinRevision(null)
  }, [isHistoryShown])
  const doc: NDoc = {
    blocks: [
      { id: 'a', type: NDocBlockType.Text, contents: 'p. 1' },
      {
        id: 'b',
        type: NDocBlockType.Text,
        contents: 'p. 2 this test is test is a is test',
      },
    ],
  }
  const revisionsUpToPinned = pinnedRevision
    ? revisions.slice(0, revisions.lastIndexOf(pinnedRevision))
    : revisions
  const isEditable = pinnedRevision === null
  return (
    <div>
      <header class={headerStyle}>
        <h1>This is the document</h1>
        {!isHistoryShown && (
          <button onClick={() => setIsHistoryShown(true)}>Edit History</button>
        )}
      </header>
      <div class={bodyStyle}>
        <Doc
          doc={applyRevisions(doc, revisionsUpToPinned)}
          isEditable={isEditable}
          onNewRevision={(revision) => setRevisions((r) => r.concat(revision))}
        />
        {isHistoryShown && (
          <HistorySidebar
            pinRevision={pinRevision}
            shownRevision={pinnedRevision}
            revisions={revisions}
            onClose={() => setIsHistoryShown(false)}
          />
        )}
      </div>
    </div>
  )
}

const bodyStyle = css`
  display: flex;
  min-height: calc(100vh - ${headerHeight});
`

const headerStyle = css`
  background: #0000001f;
  padding: 0.5rem;
  height: ${headerHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  & h1 {
    margin: 0;
  }
`

const HistorySidebar = ({
  onClose,
  revisions,
  pinRevision,
  shownRevision,
}: {
  onClose: () => void
  revisions: readonly NDocRevision[]
  shownRevision: NDocRevision | null
  pinRevision: (revision: NDocRevision | null) => void
}) => {
  const day = useDate(stripTime)
  const dayFormatter = formatDay(day)
  const [pinnedRevision, setPinnedRevision] = useState<NDocRevision | null>(
    null,
  )
  return (
    <aside class={historySidebarStyle}>
      <h2>History</h2>
      <button onClick={onClose}>close</button>
      <ol>
        {revisions
          .slice()
          .reverse()
          .map((revision) => {
            const date = new Date(revision.timestamp)
            return (
              <li key={revision.timestamp}>
                <button
                  class={clsx(
                    historyEntryStyle,
                    revision === pinnedRevision && pinnedRevisionStyle,
                  )}
                  onClick={() => {
                    pinRevision(revision === pinnedRevision ? null : revision)
                    setPinnedRevision((pinned) =>
                      revision === pinned ? null : revision,
                    )
                  }}
                  onMouseEnter={() => {
                    pinRevision(revision)
                  }}
                  onMouseLeave={() => {
                    pinRevision(pinnedRevision)
                  }}
                >
                  {`${date.toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  })} ${dayFormatter(stripTime(date))}`}
                </button>
              </li>
            )
          })}
      </ol>
    </aside>
  )
}

const historyEntryStyle = css`
  background: transparent;
  border: none;
  padding: 1rem 0.7rem;
  cursor: pointer;
  width: 100%;
  text-align: left;

  &:hover {
    background: #00000020;
  }
`

const pinnedRevisionStyle = css`
  background: #0000000f;
`

const historySidebarStyle = css`
  width: 30rem;
  background: #00000008;
  min-height: 100%;
  & > ol {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
`

const useDate = (modify: (date: Date) => Date) => {
  const [day, setDay] = useState(modify(new Date()))
  useEffect(() => {
    const t = setInterval(
      () =>
        setDay((d) => {
          const newDate = modify(new Date())
          return d.getTime() === newDate.getTime() ? d : newDate
        }),
      1000,
    )
    return () => clearInterval(t)
  }, [])
  return day
}
