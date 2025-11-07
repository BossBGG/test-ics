export function allowOnlyPrice(event) {
  const charCode = event.which ? event.which : event.keyCode;

  if (
    (charCode >= 48 && charCode <= 57) || // Numbers 0-9
    charCode === 46 // "."
  ) {
  } else {
    event.preventDefault();
  }
}

export function allowNumberDecimal(event) {
  const charCode = event.which ? event.which : event.keyCode;
  const input = event.target.value;

  if (
    (charCode >= 48 && charCode <= 57) || // Numbers 0-9
    (charCode === 46 && !input.includes(".")) // "." only if not already present
  ) {
    // Allow input
  } else {
    event.preventDefault();
  }
}

export function allowOnlyNumbers(event) {
  const charCode = event.which ? event.which : event.keyCode;

  if (
    (charCode >= 48 && charCode <= 57) || // Numbers 0-9
    charCode === 47 || // "/"
    charCode === 45 // "-"
  ) {
  } else {
    event.preventDefault();
  }
}
export function allowOnlyNumbersNotSymbol(event) {
  const charCode = event.which ? event.which : event.keyCode;

  if (event.type === "keypress") {
    if (!(charCode >= 48 && charCode <= 57)) { // Numbers 0-9
      event.preventDefault();
    }
  }
  else if (event.type === "paste") {
    const pasteData = event.clipboardData.getData('text');
    if (!/^[0-9]+$/.test(pasteData)) {
      event.preventDefault();
    }
  }
}

export function allowOnlyAlphanumericAndThai(event) {
  const alphanumericAndThaiRegex = /^[a-zA-Z0-9\u0E00-\u0E7F. \-]+$/;

  if (event.type === "keypress") {
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (!alphanumericAndThaiRegex.test(char)) {
      event.preventDefault();
    }
  } else if (event.type === "paste") {
    const pasteData = (event.clipboardData || window.clipboardData).getData(
      "text",
    );
    const sanitizedData = pasteData.replace(
      /^[a-zA-Z0-9\u0E00-\u0E7F. \-]+$/,
      "",
    );
    if (pasteData !== sanitizedData) {
      event.preventDefault();
      document.execCommand("insertText", false, sanitizedData);
    }
  }
}

export function allowAllExceptThai(event) {
  const nonThaiRegex = /^[^\u0E00-\u0E7F]*$/;

  if (event.type === "keypress") {
    const char = String.fromCharCode(event.which ? event.which : event.keyCode);
    if (!nonThaiRegex.test(char)) {
      event.preventDefault();
    }
  } else if (event.type === "paste") {
    const pasteData = (event.clipboardData || window.clipboardData).getData(
      "text",
    );
    const sanitizedData = pasteData.replace(/[\u0E00-\u0E7F]/g, "");
    if (pasteData !== sanitizedData) {
      event.preventDefault();
      document.execCommand("insertText", false, sanitizedData);
    }
  }
}

export function sanitizeInput(input) {
  return input.replace(/[^a-zA-Z0-9\u0E00-\u0E7F ]/g, "");
}

export function quantityNumbers(event) {
  const charCode = event.which ? event.which : event.keyCode;

  if (
    charCode >= 48 &&
    charCode <= 57 // Numbers 0-9
  ) {
  } else {
    event.preventDefault();
  }
}

export function blockNumbers(event) {
  const charCode = event.which ? event.which : event.keyCode;

  // Check for numbers (0-9) and special characters
  if (
    (charCode >= 48 && charCode <= 57) || // Numbers 0-9
    (charCode >= 33 && charCode <= 47) || // Special characters !"#$%&'()*+,-./
    (charCode >= 58 && charCode <= 64) || // Special characters :;<=>?@
    (charCode >= 91 && charCode <= 96) || // Special characters [\]^_`
    (charCode >= 123 && charCode <= 126) // Special characters {|}~
  ) {
    event.preventDefault();
  }
}

export function blockCopy(event) {
  const selectedText = window.getSelection().toString();
  if (/\d/.test(selectedText)) {
    event.preventDefault();
  }
}

export function copyOnlyNumber(event) {
  const pastedText = (event.clipboardData || window.clipboardData).getData(
    "text",
  );
  if (!/^\d+$/.test(pastedText)) {
    event.preventDefault();
  }
}

export function copyOnlyText(event) {
  // const pastedText = (event.clipboardData || window.clipboardData).getData(
  //   "text",
  // );
  // if (/\d/.test(pastedText)) {
  //   event.preventDefault();
  // }

  const pastedText = (event.clipboardData || window.clipboardData).getData(
    "text",
  );
  if (/[^a-zA-Z\s]/.test(pastedText)) {
    event.preventDefault();
  }
}

export const numberMask = "###,###,###,###";
export const numberMask2 = "###,###,###.##";

// export function formatPrice(value) {
//   if (!value) return "";
//   const number = parseFloat(value.replace(/,/g, ""));
//   if (isNaN(number)) return value;
//   return new Intl.NumberFormat("en-US").format(number);
// }

export function formatPrice(value) {
  if (!value) return "";
  const number = parseFloat(value.replace(/,/g, ""));
  if (isNaN(number)) return value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export function convertToDecimal(num) {
  let decimalNum = (num / 100).toFixed(2);
  return decimalNum;
}

export function intToCurrency(value) {
  const number = currencyToDecimal(value);
  if (isNaN(number)) return value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}
export function decimalToCurrency(value) {
  const number = currencyToDecimal(value);
  if (isNaN(number)) return value;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

export function currencyToDecimal(value) {
  const cleanedNumber = `${value}`.replace(/[^0-9.-]+/g, "");
  return parseFloat(cleanedNumber);
}

export function setLocalStorage(name, value) {
  const encodeName = btoa(name);
  localStorage.setItem(encodeName, JSON.stringify(value));
}

export function getLocalStorage(name) {
  const encodeName = btoa(name);
  const value = localStorage.getItem(encodeName);
  return JSON.parse(value);
}

export function removeLocalStorage(name) {
  const encodeName = btoa(name);
  localStorage.removeItem(encodeName);
}
