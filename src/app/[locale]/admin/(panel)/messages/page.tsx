import { getTranslations } from "next-intl/server";
import AdminHeader from "@/components/admin/AdminHeader";
import MessagesManager from "@/components/admin/MessagesManager";
import { getRecentMessages } from "@/lib/data";

export default async function AdminMessagesPage() {
  const t = await getTranslations("admin.messages");
  const messages = await getRecentMessages(1000); // جلب كل الرسائل

  return (
    <>
      <AdminHeader title={t("title")} />
      <div className="p-6">
        <MessagesManager messages={messages} />
      </div>
    </>
  );
}