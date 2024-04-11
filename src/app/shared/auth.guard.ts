// import { inject } from '@angular/core';
// import type { CanActivateFn } from '@angular/router';
// import { TokenService } from '../services/token.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   const service = inject(TokenService)
//     const token = await service.getToken();

//     async fetchData(): Promise<void> {
//
//       try {
//         const token = await this.tokenService.getToken();
//         console.log('Token:', token);
//         if (token) {
//           this.router.navigate(['/opcoes']);
//         } else {
//           this.userService.getAuthCode();
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     }
//   return true;
// };
