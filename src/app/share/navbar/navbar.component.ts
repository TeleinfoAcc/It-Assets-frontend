import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isAdmin = false;
  isManager = false;
  agentName = '';
  menuOpen = false;
  room = 'Data Center';

  navItems: { label: string; path: string; icon: string }[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    const pmsId = sessionStorage.getItem('pms_id');
    const pms = pmsId ? Number(pmsId) : 0;
    this.isAdmin = pms === 1 || pms === 3 || pms === 4 || pms === 8;
    this.isManager = pms === 9 || pms === 6;
    this.agentName = sessionStorage.getItem('agents') ?? '';

    if (pms === 1 || pms === 4) {
      this.room = 'Room Checklist';
    }

    if (this.isAdmin) {
      this.navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: '../../../assets/Icon_checklist/white/data storage.png' },
        { label: 'Assets', path: '/assets', icon: '../../../assets/Icon_checklist/white/data storage.png' },
        { label: 'Assets-Rent', path: '/asset-rent', icon: '../../../assets/Icon_checklist/white/data storage.png' },
      ];
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
