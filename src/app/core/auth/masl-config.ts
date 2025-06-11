import { Configuration, LogLevel } from '@azure/msal-browser';
import { environment } from '../../../environments/environment';

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.msalConfig.clientId,
    authority: environment.msalConfig.authority,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: environment.msalConfig.redirectUri
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
      piiLoggingEnabled: false
    }
  }
};

export const loginRequest = {
  scopes: environment.apiScopes
};