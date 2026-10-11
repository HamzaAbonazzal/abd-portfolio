import { getTranslations } from "next-intl/server";
import AdminHeader from "@/components/admin/AdminHeader";
import ProfileForm from "@/components/admin/ProfileForm";
import { getProfile } from "@/lib/data";

export default async function AdminProfilePage() {
  const t = await getTranslations("admin.profile");
  const profile = await getProfile();

  return (
    <>
      <AdminHeader title={t("title")} />
      <div className="p-6">
        <p className="text-light-muted dark:text-dark-muted mb-6">{t("subtitle")}</p>
        <ProfileForm initialData={profile} />
      </div>
    </>
  );
}