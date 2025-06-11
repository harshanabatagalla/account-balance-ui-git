export const environment = {
  production: false,
  apiUrl: 'https://localhost:7034/api',
  msalConfig: {
    clientId: 'e60c57ff-6f09-4fe3-b5da-ea92a684d8d2', 
    authority: 'https://login.microsoftonline.com/e70219c0-1739-42f3-b579-b8d1475e25cd', 
    redirectUri: 'http://localhost:4200'
  },
  apiScopes: ['api://54c17a89-ced4-4667-965d-4e5d6231122b/User.Access'] 
};