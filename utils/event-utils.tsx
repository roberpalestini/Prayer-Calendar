let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  },
  
    { title: 'nice event', start: new Date(), resourceId: 'a' },
    {
      id: 'a',
      title: 'my event',
      start: '2022-09-01'
    }
  
]

export function createEventId() {
  return String(eventGuid++)
}