import { ApplicationConfig } from '@angular/core';
import { RouterLink, provideRouter } from '@angular/router';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ErrorInterceptor } from './AuthInterceptor/authInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withInterceptorsFromDi()),{provide: HTTP_INTERCEPTORS,useClass: ErrorInterceptor, multi: true}, provideToastr(),provideAnimations(), ]
};
