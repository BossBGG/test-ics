export const months = ref([
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
]);

export function dateFormat(event: number) {
  const dateString = event;
  const date = new Date(dateString);
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
}

export function dateFormatYmd(event: number) {
  const dateString = event;
  const date = new Date(dateString);
  const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

  return formattedDate;
}

export function dateFormatBy(date: number | string, format: string): string {
  const rawDate = useDateFormat(date, format);

  // 'DD/MM/YYYY HH:mm:ss'
  // 'YYYY/MM/DD HH:mm:ss'
  // 'DD/MM/YYYY'
  // 'YYYY/MM/DD'
  return rawDate.value;
}

export function dateFormatThaiMonth(timestamp: number): string {
  // const { locale, t } = useI18n()

  const date = new Date(timestamp);
  date.setHours(date.getHours() - 7);

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based, so we add 1
  let year = date.getFullYear();
  // if (locale.value === 'th')
  year += 543;

  // const hours = date.getHours()
  // const minutes = date.getMinutes()

  // Ensure hours and minutes are formatted with leading zeros if necessary
  // const formattedHours = hours.toString().padStart(2, '0')
  // const formattedMinutes = minutes.toString().padStart(2, '0')

  // const result = `${day} ${(fullMonth(month))} ${year} ${formattedHours}:${formattedMinutes}`
  const result = `${day} ${fullMonth(month)} ${year}`;

  return result;
}

export function dateTimeFormatThaiMonth(
  timestamp: string | number | Date,
): string {
  // const { locale, t } = useI18n()

  const date = new Date(timestamp);
  date.setHours(date.getHours());

  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based, so we add 1
  let year = date.getFullYear();
  // if (locale.value === 'th')
  year += 543;

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${day} ${fullMonth(month)} ${year}, ${formattedHours}:${formattedMinutes} น.`;
}

export function dateFormatMonth(timestamp: number | string): string {
  const date = new Date(timestamp);
  date.setHours(date.getHours() - 7);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  let year = date.getFullYear();

  const result = `${day} ${fullMonth(month)} ${year}`;

  return result;
}

export function fullMonth(int: number): string {
  int = +int;
  const num = int - 1;

  return months.value[num];
}

// export function ThaiYear(event) {
//   const dateString = event
//   const date = new Date(dateString)
//   const formattedthaiyear = `${date.getFullYear() + 543}`

//   return formattedthaiyear
// }

// export function getYearsFromNow(next: number): string {
//   const currentYear = new Date().getFullYear();
//   const nextTotalYears = next;

//   const yearsArray = [];
//   for (let i = 0; i <= nextTotalYears; i++) yearsArray.push(currentYear + i);

//   return yearsArray;
// }

export function getYearsFromNow(next: number): string[] {
  const currentYear = new Date().getFullYear();
  const nextTotalYears = next;

  const yearsArray: string[] = [];
  for (let i = 0; i <= nextTotalYears; i++) {
    yearsArray.push((currentYear + i).toString());
  }

  return yearsArray;
}

export function getYearsBetweenNowRange(range: number): number[] | string[] {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - range;
  const endYear = currentYear + range;
  const yearsArray = [];

  for (let year = startYear; year <= endYear; year++) yearsArray.push(year);

  return yearsArray;
}

export function totalDays(start: string, end: string): number {
  const startDate = new Date(
    new Date(start).getFullYear(),
    new Date(start).getMonth(),
    new Date(start).getDate(),
  );
  const endDate = new Date(
    new Date(end).getFullYear(),
    new Date(end).getMonth(),
    new Date(end).getDate(),
  );

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return +diffDays + 1;
}

export function getCurrentDateTime(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function getCurrentDateTimeYmd(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

export function convertDateTimeFormat(dateTime: string): string {
  const [date, time] = dateTime.split(" ");
  const [day, month, year] = date.split("/");
  return `${year}/${month}/${day} ${time}`;
}

export function toTimestamp(dateString: string): number {
  const [day, month, yearAndTime] = dateString.split("/");
  const [year, time] = yearAndTime.split(" ");
  let [hour, minute] = ['0', '0']
  if (time){
    [hour, minute] = time.split(":");
  }

  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
  return date.getTime();
}

export function thaiFormatDate(date: Date, monthFormat: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined = "long"): string {
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: monthFormat,
    day: "numeric"
  });
}

export function convertTimeFormat(date: Date): string {
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit"
  }) + ' น.'
}

export function formatIsoToDisplay(dateIsoString: string) {
  if(!dateIsoString) return ''
  const dateObj = new Date(dateIsoString);

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  const hour = String(dateObj.getHours()).padStart(2, '0');
  const minute = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${minute}`;
}
