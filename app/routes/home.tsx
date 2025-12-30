import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer by Papulo" },
    { name: "description", content: "Analyze your resume with AI-powered insights." },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover p-4 min-h-dvh">
      <Navbar />
      <section className="main-section">
        <div className="page-heading md:py-16">
          <h1 className="w-full">Seguimiento de sus Solicitudes y Calificaciones de Currículum</h1>

        </div>
      </section>
    </main>
  );
}
