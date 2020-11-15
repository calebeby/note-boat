import { formatDay, stripTime } from './format-day'

test('format day', () => {
  const now = new Date('Nov 14 2020')
  const formatter = formatDay(now)
  const yesterday = new Date('Nov 13 2020')
  const tomorrow = new Date('Nov 15 2020')
  expect(formatter(yesterday)).toEqual('Yesterday')
  expect(formatter(now)).toEqual('Today')
  expect(formatter(tomorrow)).toEqual('Tomorrow')
  expect(formatter(new Date('Nov 1 2020'))).toEqual('Nov 1')
  expect(formatter(new Date('Nov 1 2019'))).toEqual('Nov 1, 2019')
})

test('strip time', () => {
  expect(stripTime(new Date('Nov 14 2020 17:15:54'))).toEqual(
    new Date('Nov 14 2020 00:00:00'),
  )
})
