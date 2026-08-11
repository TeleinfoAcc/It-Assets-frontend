import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Asset } from '../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assets.component.html',
  styleUrl: './assets.component.scss'
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getAssets().subscribe({
      next: (data) => {
        this.assets = data.tools;
        console.log('Assets loaded:', data);
      },
      error: (err) => console.error('Failed to load assets', err),
    });
  }

  onEdit(asset: Asset): void {
    this.router.navigate(['/update-assets'], { state: { it_asset_id: asset.it_asset_id } });
  }
}
