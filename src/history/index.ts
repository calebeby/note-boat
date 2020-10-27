export const enum NDocBlockType {
  Text,
}

interface NDocBlockBase {
  type: NDocBlockType
  id: string
}

interface NDocBlockText extends NDocBlockBase {
  type: NDocBlockType.Text
  contents: string
}

type NDocBlock = NDocBlockText

/////////////////////////////////////////////////////////////////////////////////

export interface NDoc {
  blocks: NDocBlock[]
}

/////////////////////////////////////////////////////////////////////////////////

export const enum NDocRevisionType {
  EditBlock,
}

interface NDocRevisionBase {
  type: NDocRevisionType
  timestamp: number
}

interface NDocRevisionEditBlock extends NDocRevisionBase {
  type: NDocRevisionType.EditBlock
  blockId: string
  blockValue: Partial<
    Pick<NDocBlock, Exclude<keyof NDocBlock, keyof NDocBlockBase>>
  >
}

export type NDocRevision = NDocRevisionEditBlock

/////////////////////////////////////////////////////////////////////////////////

/**
 * Applies a set of revisions to the given initial document.
 * A new document is returned without mutating the initial.
 * The input revisions are assumed to be in order.
 */
export const applyRevisions = (document: NDoc, revisions: NDocRevision[]) => {
  return revisions.reduce((doc, revision) => {
    return {
      ...doc,
      blocks: doc.blocks.map((b) =>
        b.id === revision.blockId ? { ...b, ...revision.blockValue } : b,
      ),
    }
  }, document)
}
