"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { staticTools } from "@/lib/staticData";
import ToolIcon from "@/components/ui/ToolIcon";

export default function Tools() {
  const t = useTranslations("skills");

  return (
    <section className="py-20 relative">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-light-text dark:text-dark-text">
            {t("tools")}
          </h3>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {staticTools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group p-6 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-light-bg dark:bg-dark-bg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-light-border dark:border-dark-border">
                <ToolIcon
                  toolKey={tool.key}
                  color={tool.color}
                  className="w-8 h-8"
                />
              </div>
              <p className="text-sm font-semibold text-light-text dark:text-dark-text">
                {tool.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}