
export const makeRequest = (type='POST', target, input={}, accessToken='', forgery='') => {
  let headers = { 'Content-Type': 'application/json' };
  if(accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if(forgery) headers['X-CSRF-TOKEN'] = forgery;
  return fetch(target, {
    method: type,
    headers: headers,
    body: JSON.stringify(input),
  });
}
