
export function setCurrentPath(queryParams = {}) {
  const route = useRoute();
  const query = { ...route.query, ...queryParams };
  let nQuery = Object.keys(query).length;
  let path = route.path;
  if (nQuery) {
    path += '?';
    for (const [key, value] of Object.entries(query)) {
      path += `${key}=${value}`;
      nQuery--;
      if (nQuery) path += '&';
    }
  };
  return path;
}

export function useParams(name) {
  const route = useRoute();
  return computed(() => route.params[name] ?? null);
}

export function useQuery(name) {
  const route = useRoute();
  return computed(() => route.query[name] ?? null);
}

export function useAllQueryBP() {
  const route = useRoute();

  const baseUrl = route.path;
  const fullQuery = route.query;

  const bp = fullQuery.bp;
  const ca = fullQuery.ca;
  const chanel = fullQuery.chanel;
  const serviceCode = fullQuery.serviceCode;
  const requestId = fullQuery.requestId;

  const fullUrl = `${baseUrl}?bp=${bp}&ca=${ca}&chanel=${chanel}&serviceCode=${serviceCode}&requestId=${requestId}`;
  const fullBack = `?bp=${bp}&ca=${ca}&chanel=${chanel}&serviceCode=${serviceCode}&requestId=${requestId}`;

  return {
    baseUrl,
    fullUrl,
    fullBack,
    fullQuery,
    bp,
    ca,
    chanel,
    serviceCode,
    requestId,
  };
}
