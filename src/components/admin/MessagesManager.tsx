"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, X, Loader2, Send } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesManager({ messages }: { messages: Message[] }) {
  const t = useTranslations("admin.messages");
  const locale = useLocale();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = messages.filter((m) => {
    if (filter === "all") return true;
    if (filter === "unread") return !m.read;
    return m.read;
  });

  const toggleRead = async (msg: Message, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await fetch(`/api/admin/messages/${msg._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !msg.read }),
    });
    if (selected?._id === msg._id) {
      setSelected({ ...selected, read: !msg.read });
    }
    router.refresh();
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm(t("deleteConfirm"))) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (selected?._id === id) setSelected(null);
      router.refresh();
    } finally {
      setDeleting(null);
    }
  };

  const openMessage = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      fetch(`/api/admin/messages/${msg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      }).then(() => router.refresh());
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filters: Array<"all" | "unread" | "read"> = ["all", "unread", "read"];
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === f
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted hover:border-primary/50"
            }`}
          >
            {t(`filters.${f}`)}
            {f === "unread" && unreadCount > 0 && (
              <span className="ms-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-center">
          <Mail className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-3" />
          <p className="text-light-muted dark:text-dark-muted">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <div
              key={msg._id}
              onClick={() => openMessage(msg)}
              className={`group p-4 rounded-xl border cursor-pointer transition-all ${
                msg.read
                  ? "bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border"
                  : "bg-primary/5 border-primary/30 hover:border-primary"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.read ? "bg-light-bg dark:bg-dark-bg" : "bg-primary"
                  }`}
                >
                  <span
                    className={`font-bold ${
                      msg.read ? "text-light-muted dark:text-dark-muted" : "text-white"
                    }`}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-semibold truncate ${
                        msg.read
                          ? "text-light-text dark:text-dark-text"
                          : "text-primary"
                      }`}
                    >
                      {msg.name}
                    </p>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-light-muted dark:text-dark-muted truncate">
                    {msg.subject}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-light-muted dark:text-dark-muted hidden md:block">
                    {formatDate(msg.createdAt)}
                  </span>
                  <button
                    onClick={(e) => toggleRead(msg, e)}
                    className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white flex items-center justify-center transition"
                    title={msg.read ? t("markAsUnread") : t("markAsRead")}
                  >
                    {msg.read ? (
                      <Mail className="w-3.5 h-3.5" />
                    ) : (
                      <MailOpen className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => handleDelete(msg._id, e)}
                    disabled={deleting === msg._id}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition disabled:opacity-50"
                  >
                    {deleting === msg._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl bg-light-card dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-light-border dark:border-dark-border">
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text">
                {selected.subject}
              </h3>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-light-muted dark:text-dark-muted mb-1">
                    {t("detail.from")}
                  </p>
                  <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                    {selected.name}
                  </p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-xs text-primary hover:underline"
                    dir="ltr"
                  >
                    {selected.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-light-muted dark:text-dark-muted mb-1">
                    {t("detail.date")}
                  </p>
                  <p className="text-sm text-light-text dark:text-dark-text">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-light-muted dark:text-dark-muted mb-2">
                  {t("detail.message")}
                </p>
                <p className="text-sm text-light-text dark:text-dark-text leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-light-bg dark:bg-dark-bg">
                  {selected.message}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition"
                >
                  <Send className="w-4 h-4" />
                  {t("detail.reply")}
                </a>
                <button
                  onClick={() => handleDelete(selected._id)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-sm font-semibold transition"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}