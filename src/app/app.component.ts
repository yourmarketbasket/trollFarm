import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MdbSidenavModule } from 'mdb-angular-ui-kit/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MdbSidenavModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'trollFarm';
  isCollapsed = true;
}
