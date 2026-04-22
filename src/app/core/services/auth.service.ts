import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
// import { environment } from '../../../environments/environment.development';

interface AgentData {
  permission_id: string | number;
  title_name_th: string;
  first_name_th: string;
  last_name_th: string;
  login: string;
}

interface LoginResponse {
  token: string;
  agent: AgentData;
  proj_id: number;
  slug: string | null;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  // private apiUrl = 'http://localhost:8000/api/';

  // private apiUrl = 'http://172.21.142.211:8000/api/';

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  login(loginData: any): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(`${this.apiUrl}auth/login`, loginData).pipe(
      tap(response => {

        if (response.token) {
          sessionStorage.setItem('authToken', response.token);
        }

        if (response.agent) {

          sessionStorage.setItem('agents', String(response.agent.title_name_th + ' ' + response.agent.first_name_th + ' ' + response.agent.last_name_th));
          sessionStorage.setItem('pms_id', String(response.agent.permission_id));
          sessionStorage.setItem('proj_id', String(response.proj_id));
          sessionStorage.setItem('proj_slug', response.slug ?? '');  // เพิ่มบรรทัดนี้
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('agents');
    sessionStorage.removeItem('pms_id');
    sessionStorage.removeItem('proj_id');
    sessionStorage.removeItem('proj_slug');
  }
}
