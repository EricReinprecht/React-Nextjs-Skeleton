export function formatDateGerman(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;

  if (isNaN(date.getTime())) {
    return "Kein Startdatum bekannt!";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
