
const ApiUrls = {
  '/api/signin-ad': '/api/signin-ad',
  '/api/signout': '/api/signout',
  '/api/signout': '/api/signout',
  '/api/refresh': '/api/refresh',
  '/api/email-template': '/api/email-template',
  '/api/email-template': '/api/email-template',
  '/api/user-admin': '/api/user-admin',  
};

const _apiHeader = (accessToken='', forgery='') => {
  let headers = { 'Content-Type': 'application/json' };
  if(accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if(forgery) headers['X-CSRF-TOKEN'] = forgery;
  return headers;
}

export const makeRequest = (type='POST', target, input={}, accessToken='', forgery='') => {
  const headers = _apiHeader(accessToken, forgery);
  if(type === 'GET') return fetch(target, { method: 'GET', headers: headers });

  const url = ApiUrls[target];
  return fetch(url, { method: type, headers: headers, body: JSON.stringify(input) });
}
