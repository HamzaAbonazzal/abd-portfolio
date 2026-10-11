import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "ar" | "en")) {
    locale = routing.defaultLocale;
  }

  // دمج ترجمات الموقع العام + الإدارة
  const siteMessages = (await import(`../messages/${locale}.json`)).default;
  const adminMessages = (await import(`../messages/admin-${locale}.json`))
    .default;

  return {
    locale,
    messages: {
      ...siteMessages,
      admin: adminMessages,
    },
  };
});