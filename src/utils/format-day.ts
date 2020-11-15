/** Strips the time from a date object. Does not mutate. */
export const stripTime = (date: Date) => {
  const d = new Date(date.getTime())
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Formats a relative day. Caveats: Only works with dates in the past
 * @param today Just the day part of a date object. Call stripTime to get rid of the time.
 */
export const formatDay = (today: Date) => (dateToFormat: Date) => {
  // @ts-expect-error subtracting dates is fine, they are coerced to numbers
  const tDiff = today - dateToFormat
  if (tDiff === 0) return 'Today'
  if (tDiff === dayDuration) return 'Yesterday'
  if (tDiff === -dayDuration) return 'Tomorrow'
  return dateToFormat.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      dateToFormat.getFullYear() === today.getFullYear()
        ? undefined
        : 'numeric',
  })
}

const dayDuration = 1000 * 60 * 60 * 24
