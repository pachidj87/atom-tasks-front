const appConfig = {
  production: true,
  appApiUrl: 'https://some-production-host.com',
  endpoints: {
    authToken: '/auth/login',
    authRegister: '/auth/register',
    verifyEmail: '/auth/validate-email',
    users: '/users',
    tasks: '/tasks',
  },
};

export default appConfig;
