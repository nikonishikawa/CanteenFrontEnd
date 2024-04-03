import { ApplicationConfig } from '@angular/core';
import { RouterLink, provideRouter } from '@angular/router';
import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), FormsModule, RouterLink, RouterModule]
};
