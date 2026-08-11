import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ApiService, Asset, Room, Site, AssetStatus, AssetRent } from '../../core/services/api.service';

@Component({
  selector: 'app-update-assets-rent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-assets-rent.component.html',
  styleUrl: './update-assets-rent.component.scss'
})
export class UpdateAssetsRentComponent {

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
      com_desc2: [''],
      current_owner: [''],
      hdd_mac: [''],
      ssd_mac: [''],
      wifi_mac: [''],
      lan_mac: [''],
      sn_adapter: [''],
      sn_usb_lan: [''],
      sn_mouse: [''],
      seat: [''],

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
      this.http.get<{ assets_rent: AssetRent }>(`${environment.apiUrl}getAssetsRent/${it_asset_id}`).subscribe({
        next: (data) => {
          console.log('Asset detail loaded:', data.assets_rent);
          this.assetForm.patchValue(data.assets_rent);
          this.selectedAssetType = data.assets_rent.com_type ?? null;
          this.selectedLocation = data.assets_rent.location ?? null;
          this.selectedRoomCode = data.assets_rent.curr_room_code ?? null;
          this.selectedWfoWfh = data.assets_rent.loc_type ?? null;
          this.selectedAssetStatus = data.assets_rent.asset_status != null ? Number(data.assets_rent.asset_status) : null;
          const mdfisoDate = data.assets_rent.mdf_date ?? '';
          const mdfformattedDate: string = mdfisoDate ? mdfisoDate.split('T')[0] : '';
          const capisoDate = data.assets_rent.cap_date ?? '';
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

    this.http.post(`${environment.apiUrl}updateAssetsRent`, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        // this.router.navigate(['/assets']);
        // console.log('Update successful', payload);
        // console.log('Update successful', res);
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
