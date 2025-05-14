import { ApplicationConfig } from "@angular/core";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";

import { headerHttpInterceptor } from "./interceptors/header-http.interceptor";
import { loadingHttpInterceptor } from "./interceptors/loading-http.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter(routes),
      provideAnimationsAsync(),
      provideHttpClient(
        withFetch(),
        withInterceptors([headerHttpInterceptor, loadingHttpInterceptor])
      )
    ]
};
