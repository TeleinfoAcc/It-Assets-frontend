import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Project {
  id: number;
  name: string;
  slug: string;
  folder_path: string;
  main_file: string;
  viewer_url?: string;
  created_at: string;
  size_mb: string;
  count_files: string;
  first_name_th: string;
  last_name_th: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  // private apiUrl = 'http://localhost:8000/api';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}projects`);
  }

  getProject(slug: string): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}projects/${slug}`);
  }

  createProject(name: string, proj_id: number | null): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}projects`, { name, proj_id });
  }

  uploadZip(slug: string, zipFile: File, mainFile?: string): Observable<any> {
    const formData = new FormData();
    formData.append('zip_file', zipFile);
    if (mainFile) formData.append('main_file', mainFile);
    return this.http.post(`${this.apiUrl}projects/${slug}/upload`, formData);
  }

  deleteProject(slug: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}projects/${slug}`);
  }

  getProjectsonQamon(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}get-projects`);
  }
}