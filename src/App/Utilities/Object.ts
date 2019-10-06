export const hasOwnProperty: (key: string | number | symbol) => (o: object) => boolean =
  key => o => Object.prototype.hasOwnProperty.call (o, key)
