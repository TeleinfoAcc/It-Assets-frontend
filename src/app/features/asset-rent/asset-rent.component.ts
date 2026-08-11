import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiService, AssetRent } from '../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-rent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-rent.component.html',
  styleUrl: './asset-rent.component.scss'
})
export class AssetRentComponent {
  assets: AssetRent[] = [];

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getAssetsRent().subscribe({
      next: (data) => {
        this.assets = data.assets_rent;
        console.log('Assets loaded:', data);
      },
      error: (err) => console.error('Failed to load assets', err),
    });
  }

  onEdit(asset: AssetRent): void {
    this.router.navigate(['/update-assets-rent'], { state: { it_asset_id: asset.it_asset_id } });
  }
}
