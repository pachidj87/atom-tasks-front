const appConfig = {
  production: false,
  // appApiUrl: 'api',
  appApiUrl: 'https://vercel-atom-task-api.onrender.com',
  endpoints: {
    authToken: '/auth/login',
    authRegister: '/auth/register',
    verifyEmail: '/auth/validate-email',
    users: '/users',
    tasks: '/tasks',
  },
};

export default appConfig;
