import Navbar from "~/components/ui/Navbar";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ResumeCard from "~/components/resume/ResumeCard";
import { usePuterStore } from "~/lib/pure";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Resume Analyzer by Papulo" },
    { name: "description", content: "Analyze your resume with AI-powered insights." },
  ];
}

export default function Home() {

  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  const handleDeleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <main className="flex flex-col p-4 gap-8 min-h-dvh">
      <Navbar />
      <section className="main-section ">
        <div className="page-heading">
          <h1>Seguimiento de sus Solicitudes y Calificaciones de Currículum</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>Sube tu primer resumé para obtener feedback.</h2>
          ) : (
            <h2>Revise sus envíos y verifique los comentarios impulsados ​​por IA.</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <video autoPlay loop muted playsInline>
              <source src="/images/resume-scan-2.mp4" type="video/mp4" />
            </video>
          </div>
        )}

        {!loadingResumes && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Link to="/upload" className="primary-button w-fit btn-lg text-xl font-bold">
              Subir Resumen o CV
            </Link>
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={handleDeleteResume} />
            ))}
          </div>
        )}

      </section>
    </main>
  );
}
