import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';

import { routes } from './app.routes';
import {
  MSALInstanceFactory,
  MSALGuardConfigFactory,
  MSALInterceptorConfigFactory,
} from './auth/msal.config';

// MSAL v3 exige inicializar el PublicClientApplication (y procesar la respuesta
// del redirect) ANTES de que Angular monte los componentes. Sin esto, la app
// queda en blanco porque MsalGuard/MsalService se usan antes de estar listos.
export function initializeMsal(msalService: MsalService) {
  // initialize() ya procesa internamente la respuesta del redirect (code + state).
  // NO llamar también a handleRedirectPromise() aquí, o se procesa dos veces
  // y la segunda falla con "state_not_found" (el state ya fue consumido).
  return () => msalService.instance.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },

    MsalService,
    MsalGuard,
    MsalBroadcastService,

    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsal,
      deps: [MsalService],
      multi: true,
    },
  ],
};
