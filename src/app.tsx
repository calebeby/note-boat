import { h } from 'preact'
import { useState } from 'preact/hooks'
import { Doc } from './doc'
import { applyRevisions, NDoc, NDocBlockType, NDocRevision } from './history'

export const App = () => {
  const [revisions, setRevisions] = useState<NDocRevision[]>([])
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
  return (
    <Doc
      doc={applyRevisions(doc, revisions)}
      onNewRevision={(revision) => setRevisions((r) => r.concat(revision))}
    />
  )
}
