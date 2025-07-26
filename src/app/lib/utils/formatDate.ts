import { Timestamp } from "firebase/firestore"; // adjust import if needed

export function formatDateGerman(input: string | Date | number | Timestamp): string {
    let date: Date;

    if (input instanceof Timestamp) {
      date = input.toDate();
    } else if (typeof input === "string" || typeof input === "number") {
      date = new Date(input);
    } else {
      date = input;
    }

    if (isNaN(date.getTime())) {
      return "Kein Startdatum bekannt!";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

const dayNameToNumber: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Get the Date of the next specified weekday (by name) at given hour.
 * @param dayName Day of the week as string (e.g. "friday", case-insensitive)
 * @param hour Hour of the day (0-23)
 * @returns Date object for next occurrence of the weekday at given hour
 */
export function getNextDateTimeAt(dayName: string, hour: number): Date {
  const day = dayName.toLowerCase();
  const weekday = dayNameToNumber[day];
  if (weekday === undefined) {
    throw new Error(`Invalid day name: ${dayName}`);
  }

  const date = new Date();
  const currentDay = date.getDay();
  const daysUntilNext = (weekday - currentDay + 7) % 7 || 7;
  date.setDate(date.getDate() + daysUntilNext);
  date.setHours(hour, 0, 0, 0);
  return date;
}
