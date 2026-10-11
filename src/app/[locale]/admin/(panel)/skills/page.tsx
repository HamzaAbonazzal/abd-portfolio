import { getTranslations } from "next-intl/server";
import AdminHeader from "@/components/admin/AdminHeader";
import SkillsManager from "@/components/admin/SkillsManager";
import { getSkills } from "@/lib/data";

export default async function AdminSkillsPage() {
  const t = await getTranslations("admin.skills");
  const skills = await getSkills();

  return (
    <>
      <AdminHeader title={t("title")} />
      <div className="p-6">
        <SkillsManager skills={skills} />
      </div>
    </>
  );
}