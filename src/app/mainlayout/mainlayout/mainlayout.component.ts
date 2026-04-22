import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './mainlayout.component.html',
  styleUrl: './mainlayout.component.scss'
})
export class MainlayoutComponent {

}
