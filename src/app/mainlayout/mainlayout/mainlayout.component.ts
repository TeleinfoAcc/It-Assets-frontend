import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../share/navbar/navbar.component';

@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './mainlayout.component.html',
  styleUrl: './mainlayout.component.scss'
})
export class MainlayoutComponent {

}
