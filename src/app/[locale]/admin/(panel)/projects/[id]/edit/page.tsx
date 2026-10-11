import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";
import { getProjectById } from "@/lib/data";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("admin.projects");
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const initialData = {
    title: project.title,
    description: project.description,
    category: project.category,
    coverImage: project.coverImage,
    tools: (project.tools || []).join(", "),
    liveUrl: project.liveUrl || "",
    behanceUrl: project.behanceUrl || "",
    featured: project.featured || false,
    order: project.order || 0,
  };

  return (
    <>
      <AdminHeader title={t("edit")} />
      <div className="p-6 max-w-4xl">
        <ProjectForm initialData={initialData} projectId={id} />
      </div>
    </>
  );
}