import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createMiddleware(routing);

const JWT_SECRET = process.env.JWT_SECRET;
const secretKey = JWT_SECRET
  ? new TextEncoder().encode(JWT_SECRET)
  : null;

async function isValidToken(token: string): Promise<boolean> {
  if (!secretKey) return false;
  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // التحقق من أن المسار يبدأ بـ /admin أو /[locale]/admin
  const adminPattern = /^\/(ar|en)\/admin(\/|$)/;
  const isAdminRoute = adminPattern.test(pathname);
  const isLoginPage = /^\/(ar|en)\/admin\/login(\/|$)/.test(pathname);

  if (isAdminRoute && !isLoginPage) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token || !(await isValidToken(token))) {
      // إعادة التوجيه لصفحة تسجيل الدخول مع الحفاظ على اللغة
      const localeMatch = pathname.match(/^\/(ar|en)/);
      const locale = localeMatch ? localeMatch[1] : "ar";
      return NextResponse.redirect(
        new URL(`/${locale}/admin/login`, request.url)
      );
    }
  }

  // إذا كان المستخدم مسجلاً بالفعل ويحاول الوصول لصفحة الدخول
  if (isLoginPage) {
    const token = request.cookies.get("admin_session")?.value;
    if (token && (await isValidToken(token))) {
      const localeMatch = pathname.match(/^\/(ar|en)/);
      const locale = localeMatch ? localeMatch[1] : "ar";
      return NextResponse.redirect(
        new URL(`/${locale}/admin/dashboard`, request.url)
      );
    }
  }

  // تشغيل middleware اللغة لبقية المسارات
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};