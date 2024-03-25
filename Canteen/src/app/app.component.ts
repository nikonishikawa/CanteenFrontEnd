import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SignUpComponent } from "./components/users/sign-up/sign-up.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, SignUpComponent]
})
export class AppComponent {
  title = 'Canteen';
}
