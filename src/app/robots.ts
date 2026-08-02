import type { MetadataRoute } from "next";
import { URL_SITE } from "@/lib/site";

/**
 * `/robots.txt`.
 *
 * O `/admin` já se declara `noindex` no seu próprio layout; isto é a segunda
 * camada, e a que evita que os robôs sequer lá passem. Nem uma nem outra é uma
 * fronteira de segurança — quem protege o `/admin` é a sessão verificada na
 * página e dentro de cada server action (ver `src/lib/auth.ts`).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${URL_SITE}/sitemap.xml`,
  };
}
