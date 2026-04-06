export enum USERS_ENDPOINTS {
  CHECK_EMAIL_EXISTS = '/users/check-existence',
}

export enum AUTH_ENDPOINTS {
  LOGIN = '/auth/login',
  REGISTER = '/auth/register',
  TRACK_SESSION = '/auth/track',
  PROFILE = '/auth/profile',
  REFRESH_TOKEN = '/auth/refresh',
  LOGOUT = '/auth/logout',
  GOOGLE_LOGIN_URL = '/auth/google',
}

export enum EVENTS_ENDPOINTS {
  EVENT_CALENDAR = '/events',
}
