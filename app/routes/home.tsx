import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ResumeCard from "~/components/ResumeCard";
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

  return (
    <main className="flex flex-col p-4 gap-8 min-h-dvh basis-full">
      <Navbar />
      <section className="main-section">
        <div className="page-heading md:py-16">
          <h1 className="w-full">Seguimiento de sus Solicitudes y Calificaciones de Currículum</h1>
          {!loadingResumes && resumes?.length === 0 ? (
            <h2>Sube tu primer resumé para obtener feedback.</h2>
          ) : (
            <h2>Revise sus envíos y verifique los comentarios impulsados ​​por IA.</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" alt="resume gif scan" className="w-52" />
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Subir CV
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
