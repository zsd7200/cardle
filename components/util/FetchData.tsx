export default async function fetchData(url: string, method: 'GET' | 'POST' = 'GET', body: string | undefined = undefined, key: string | undefined = undefined) {
  const headers: HeadersInit = {
    'X-Api-Key': key ?? '',
  };
  const res = await fetch(url, {
    method: method,
    headers: (key) ? headers : undefined,
    cache: 'force-cache',
    body: body,
  });

  if (!res.ok) {
    throw new Error(`${res.status} returned from ${url}`);
  }

  return await res.json();
}