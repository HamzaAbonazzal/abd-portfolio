import { getTranslations } from "next-intl/server";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const t = await getTranslations("admin.projects");

  return (
    <>
      <AdminHeader title={t("addNew")} />
      <div className="p-6 max-w-4xl">
        <ProjectForm />
      </div>
    </>
  );
}