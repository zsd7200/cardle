export default async function fetchData(url: string, key: string | undefined = undefined) {
  const headers: HeadersInit = {
    'X-Api-Key': key ?? '',
  };
  const res = await fetch(url, {
    method: 'GET',
    headers: (key) ? headers : undefined,
    cache: 'force-cache',
  });

  if (!res.ok) {
    return [];
  }

  return await res.json();
}