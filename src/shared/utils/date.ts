import { Compare } from "./compare.ts"

/**
 * A comparator function for {@link Date} objects in ascending order.
 */
export const compareDate: Compare<Date> = (a, b) => a.getTime() - b.getTime()
