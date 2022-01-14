module.exports = {
  reactStrictMode: true,
  env: {
    USER_NAME: process.env.USER_NAME,
    SERVER_URL: process.env.SERVER_URL,
    GOOGLE_OAUTH_URL: process.env.GOOGLE_OAUTH_URL,
  },
  distDir: "build",
};
