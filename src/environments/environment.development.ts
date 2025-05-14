const appConfig = {
  production: false,
  // appApiUrl: 'api',
  appApiUrl: 'http://172.0.0.1:3000',
  endpoints: {
    authToken: '/auth/login',
    authRegister: '/auth/register',
    verifyEmail: '/auth/validate-email',
    users: '/users',
    tasks: '/tasks',
  },
};

export default appConfig;
