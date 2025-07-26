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
