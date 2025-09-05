
const ApiUrls = {
  '/api/app-setting': '/api/app-setting',
  '/api/signin-ad': '/api/signin-ad',
  '/api/signout': '/api/signout',
  '/api/signout': '/api/signout',
  '/api/refresh': '/api/refresh',
  '/api/email-template': '/api/email-template',
  '/api/email-templates': '/api/email-templates',
  '/api/email-template-active': '/api/email-template-active',
  '/api/email-template-count': '/api/email-template-count',
  '/api/user-info': '/api/user-info',
  '/api/user-admins': '/api/user-admins',
  '/api/user-admin': '/api/user-admin',
  '/api/user': '/api/user',
};

const _apiHeader = (accessToken='', forgery='') => {
  let headers = { 'Content-Type': 'application/json' };
  if(accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if(forgery) headers['X-CSRF-TOKEN'] = forgery;
  return headers;
}

export const makeRequest = (type='POST', target, input={}, accessToken='', forgery='') => {
  const headers = _apiHeader(accessToken, forgery);
  let url = ApiUrls[target];
  console.log(type, url)
  if(type === 'GET'){
    if(input?.Id) url += `/${input.Id}`;
  console.log(123)
    return fetch(url, { method: 'GET', headers: headers });
  }
  return fetch(url, { method: type, headers: headers, body: JSON.stringify(input) });
}
