import { revalidatePath } from "next/cache";

/**
 * إبطال الذاكرة المؤقتة لجميع الصفحات العامة
 * يُستدعى بعد أي عملية إضافة/تعديل/حذف في لوحة الإدارة
 */
export function revalidateSite() {
  // الصفحة الرئيسية بجميع اللغات
  revalidatePath("/", "layout");
  revalidatePath("/ar");
  revalidatePath("/en");
}