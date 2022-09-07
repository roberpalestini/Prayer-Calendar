let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = (requestModel: any) => {
  if (requestModel) {

    for (let index = 0; index < 1; index++) {
      const element = requestModel[index];
        return {
          id: element.id,
          tittle: element.content,
          start: element.publishedAt,
        }
    }

  } else return
};

export function createEventId() {
  return String(eventGuid++)
}
