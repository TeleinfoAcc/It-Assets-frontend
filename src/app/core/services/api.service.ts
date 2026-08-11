import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


export interface Asset {
  it_asset_id: number;
  serialnumber: string;
  com_name: string;
  com_local_ip: string;
  com_join_ip: string;
  com_brand: string;
  com_model: string;
  location: string;
  gl_asset_code: string | number;
  com_status: string;
  cap_date?: string;
  com_type?: string;
  curr_room_code?: string;
  asset_status?: number;
  project_seat?: string;
  loc_type?: string;
  mdf_date?: string;
  com_desc1?: string;
}

export interface AssetRent {
  it_asset_id: number;
  serialnumber: string;
  emp_id: string;
  com_name: string;
  com_local_ip: string;
  com_join_ip: string;
  curr_room_code: string;
  com_brand: string;
  com_model: string;
  com_type: string;
  com_desc1: string;
  com_desc2: string;
  com_desc3: string;
  gl_asset_code: string;
  loc_type: string;
  create_date: string;
  mdf_date: string;
  asset_status: string;
  loc_seat: string;
  location: string;
  com_status: string;
  cap_date: string;
  mdf_agent_id: number;
  iss_date: string;
  return_date: string;
  asset_type: string;
  asset_project: string;
  com_hdd: string;
  com_wifi_mac: string;
  com_lan_mac: string;
  com_adapt_sn: string;
  com_mouse_sn: string;
  com_ssd: string;
  com_usb_sn: string;
}
export interface AssetStatus {
  asset_status: number;
  asset_status_name: string;
  is_active: number;
}

export interface Room {
  site_code: string;
  room_code: string;
  room_name: string;
  room_total_seat: number;
  room_row: number;
  room_col: number;
  is_active: number;
}

export interface Site {
  site_address: string;
  site_code: string;
  site_name: string;
  is_active: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  // private apiUrl = 'http://localhost:8000/api';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAssetStatus(): Observable<{ asset_statuses: AssetStatus[] }> {
    return this.http.get<{ asset_statuses: AssetStatus[] }>(`${this.apiUrl}getAssetStatus`);
  }

  getRooms(): Observable<{ rooms: Room[] }> {
    return this.http.get<{ rooms: Room[] }>(`${this.apiUrl}getRooms`);
  }

  getSites(): Observable<{ sites: Site[] }> {
    return this.http.get<{ sites: Site[] }>(`${this.apiUrl}getSites`);
  }

  getAssets(): Observable<{ tools: Asset[] }> {
    return this.http.get<{ tools: Asset[] }>(`${this.apiUrl}getAssets`);
  }

  getAssetsRent(): Observable<{ assets_rent: AssetRent[] }> {
    return this.http.get<{ assets_rent: AssetRent[] }>(`${this.apiUrl}getAssetsRent`);
  }


}