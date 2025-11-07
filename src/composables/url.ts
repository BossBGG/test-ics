export function getFileName(url) {
  const filename = url.split('/').pop();

  return filename
}

export function peaUrl(url = "") {
  const peaUrl = import.meta.env.VITE_PEA_URL;
  return peaUrl + url
}

export function peaUrlDashboard(serviceGroupId) {
  const peaUrl = `${import.meta.env.VITE_PEA_URL}notification/y3?id=`;
  return peaUrl + serviceGroupId
}
