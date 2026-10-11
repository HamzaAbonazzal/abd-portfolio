import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  FolderKanban,
  Wrench,
  MessageSquare,
  Mail,
  ArrowRight,
  Plus,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { getDashboardStats, getRecentMessages } from "@/lib/data";

export default async function DashboardPage() {
  const t = await getTranslations("admin.dashboard");
  const locale = await getLocale();
  const [stats, messages] = await Promise.all([
    getDashboardStats(),
    getRecentMessages(5),
  ]);

  const statCards = [
    {
      icon: FolderKanban,
      label: t("stats.projects"),
      value: stats.projects,
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Wrench,
      label: t("stats.skills"),
      value: stats.skills,
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: MessageSquare,
      label: t("stats.messages"),
      value: stats.messages,
      color: "from-green-500 to-green-600",
    },
    {
      icon: Mail,
      label: t("stats.unreadMessages"),
      value: stats.unread,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <>
      <AdminHeader title={t("title")} />

      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">
            {t("welcome")} 👋
          </h2>
          <p className="text-light-muted dark:text-dark-muted mt-1">
            {t("overview")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="relative p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border overflow-hidden group hover:border-primary/50 transition-all"
              >
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition`}
                />
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-light-text dark:text-dark-text">
                    {stat.value}
                  </p>
                  <p className="text-sm text-light-muted dark:text-dark-muted mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
            {t("quickActions")}
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition shadow-lg shadow-primary/30"
            >
              <Plus className="w-4 h-4" />
              {t("addProject")}
            </Link>
            <Link
              href="/admin/skills"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border text-light-text dark:text-dark-text text-sm font-semibold hover:border-primary/50 transition"
            >
              <Plus className="w-4 h-4" />
              {t("addSkill")}
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
              {t("recentMessages")}
            </h3>
            <Link
              href="/admin/messages"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {t("viewAll")}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="text-light-muted dark:text-dark-muted text-sm py-8 text-center">
              {t("noMessages")}
            </p>
          ) : (
            <div className="space-y-2">
              {messages.map((msg: any) => (
                <div
                  key={msg._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {msg.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-light-text dark:text-dark-text truncate">
                      {msg.name}
                    </p>
                    <p className="text-xs text-light-muted dark:text-dark-muted truncate">
                      {msg.subject}
                    </p>
                  </div>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}