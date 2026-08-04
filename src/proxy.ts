import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // `admin` está de fora porque a área de administração não é multi-idioma:
  // sem esta exclusão o next-intl reescrevia /admin para /pt/admin e a rota
  // (que vive em src/app/admin, fora de [locale]) dava 404.
  // Isto não é uma fronteira de segurança — a sessão é verificada dentro de
  // cada página e de cada server action, ver src/lib/auth.ts.
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
