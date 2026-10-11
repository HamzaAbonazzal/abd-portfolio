import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Tools from "@/components/sections/Tools";
import Stats from "@/components/sections/Stats";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import { getProjects, getSkills, getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [projects, skills, profile] = await Promise.all([
    getProjects(),
    getSkills(),
    getProfile(),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="relative">
        <Hero profile={profile} />
        <About />
        <Stats profile={profile} />
        <Skills skills={skills} />
        <Tools />
        <Projects projects={projects} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}