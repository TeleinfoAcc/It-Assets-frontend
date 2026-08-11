import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiService, Asset, Room, Site, AssetStatus } from '../../core/services/api.service';

@Component({
  selector: 'app-update-assets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-assets.component.html',
  styleUrl: './update-assets.component.scss'
})
export class UpdateAssetsComponent implements OnInit {
  assetForm!: FormGroup;
  isSubmitting = false;

  assetTypeOptions: string[] = ['AIO', 'Desktop', 'Notebook'];
  siteOptions: Site[] = [];
  roomOptions: Room[] = [];
  projectSeatOptions: string[] = [];
  statusOptions: AssetStatus[] = [];

  selectedAssetType: string | null = null;
  selectedLocation: string | null = null;
  selectedRoomCode: string | null = null;
  selectedProjectSeat: string | null = null;
  selectedWfoWfh: string | null = null;
  selectedAssetStatus: number | null = null;

  private allRooms: Room[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    const it_asset_id = history.state?.it_asset_id;

    this.assetForm = this.fb.group({
      it_asset_id: [{ value: it_asset_id ?? '', disabled: true }],
      gl_asset_code: [''],
      serialnumber: [''],
      cap_date: [''],
      com_brand: [''],
      com_model: [''],
      com_name: [''],
      com_local_ip: [''],
      com_join_ip: [''],
      mdf_date: [''],
      com_desc1: [''],

    });

    this.apiService.getRooms().subscribe({
      next: (res) => {
        this.allRooms = res.rooms;
        this.roomOptions = res.rooms;
      },
    });

    this.apiService.getAssetStatus().subscribe({
      next: (res) => {
        this.statusOptions = res.asset_statuses;
        // console.log('Asset statuses loaded:', this.statusOptions);
      },
    });

    this.apiService.getSites().subscribe({
      next: (res) => {
        this.siteOptions = res.sites;
      },
    });

    if (it_asset_id) {
      this.http.get<{ tools: Asset }>(`${environment.apiUrl}getAssets/${it_asset_id}`).subscribe({
        next: (data) => {
          console.log('Asset detail loaded:', data.tools);
          this.assetForm.patchValue(data.tools);
          this.selectedAssetType = data.tools.com_type ?? null;
          this.selectedLocation = data.tools.location ?? null;
          this.selectedRoomCode = data.tools.curr_room_code ?? null;
          this.selectedProjectSeat = data.tools.project_seat ?? null;
          this.selectedWfoWfh = data.tools.loc_type ?? null;
          this.selectedAssetStatus = data.tools.asset_status != null ? Number(data.tools.asset_status) : null;
          const mdfisoDate = data.tools.mdf_date ?? '';
          const mdfformattedDate: string = mdfisoDate ? mdfisoDate.split('T')[0] : '';
          const capisoDate = data.tools.cap_date ?? '';
          const capformattedDate: string = capisoDate ? capisoDate.split('T')[0] : '';
          this.assetForm.patchValue({ mdf_date: mdfformattedDate, cap_date: capformattedDate });
        },
        error: (err) => console.error('Failed to load asset', err),
      });
    }
  }

  onSubmit(): void {
    if (this.assetForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;

    const payload = {
      ...this.assetForm.getRawValue(),
      com_type: this.selectedAssetType,
      location: this.selectedLocation,
      curr_room_code: this.selectedRoomCode,
      project_seat: this.selectedProjectSeat,
      loc_type: this.selectedWfoWfh,
      asset_status: this.selectedAssetStatus,
    };

    this.http.post(`${environment.apiUrl}updateAssets`, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        // this.router.navigate(['/assets']);
        console.log('Update successful', res);
      },
      error: (err) => {
        console.error('Update failed', err);
        this.isSubmitting = false;
      },
    });
  }

  onLocationChange(): void {
    this.roomOptions = this.selectedLocation
      ? this.allRooms.filter(r => r.site_code === this.selectedLocation)
      : this.allRooms;
    this.selectedRoomCode = null;
  }

  onCancel(): void {
    this.router.navigate(['/assets']);
  }
}


