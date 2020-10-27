import {
  applyRevisions,
  NDoc,
  NDocBlockType,
  NDocRevision,
  NDocRevisionType,
} from '.'

test('Apply text edit revisions', () => {
  const document: NDoc = {
    blocks: [
      {
        id: 'a',
        type: NDocBlockType.Text,
        contents: 'paragraph one',
      },
      {
        id: 'b',
        type: NDocBlockType.Text,
        contents: 'paragraph two',
      },
    ],
  }

  const revisions: NDocRevision[] = [
    {
      type: NDocRevisionType.EditBlock,
      blockId: 'a',
      blockValue: {
        contents: 'p one revised',
      },
      timestamp: 0,
    },
  ]

  expect(applyRevisions(document, revisions)).toMatchInlineSnapshot(`
    Object {
      "blocks": Array [
        Object {
          "contents": "p one revised",
          "id": "a",
          "type": 0,
        },
        Object {
          "contents": "paragraph two",
          "id": "b",
          "type": 0,
        },
      ],
    }
  `)
})
