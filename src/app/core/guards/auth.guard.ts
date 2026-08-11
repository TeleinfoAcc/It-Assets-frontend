import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // ถ้าไม่ได้ล็อกอิน ให้ไปหน้า login
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const pmsRaw = sessionStorage.getItem('pms_id'); // string | null
  // const pmsRaw = sessionStorage.getItem('pms_id');
  const pms = pmsRaw ? Number(pmsRaw) : null;
  const projIdRaw = sessionStorage.getItem('proj_id');

  // admin (pms=1) => เข้าทุกหน้าได้
  if (pms === 8 || pms === 3) {
    return true;
  }


  // ถ้า pms ไม่ระบุหรือค่าอื่นๆ ให้ไป login หรือ dashboard ตามต้องการ
  return router.createUrlTree(['/login']);
};
