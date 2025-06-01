import type { Router } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    exp: number;
    [key: string]: any;
}

export function registerAuthGuard(router: Router) {
    router.beforeEach((to, from, next) => {
        const requiresAuth = to.matched.some(record => record.meta?.requiresAuth);
        const token = localStorage.getItem('jwt');


        if (!requiresAuth) return next();
        if (!token) return next('/login');

        try {
            const decoded = jwtDecode<JwtPayload>(token);
            const now = Date.now() / 1000;
            if (decoded.exp < now) {
                localStorage.removeItem('jwt');
                return next('/login');
            }
            return next();
        } catch {
            localStorage.removeItem('jwt');
            return next('/login');
        }
    });
}