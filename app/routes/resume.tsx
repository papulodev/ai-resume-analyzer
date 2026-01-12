import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import Ats from "~/components/resume/ATS";
import Details from "~/components/resume/details/Details";
import Summary from "~/components/resume/summary/Summary";
import { usePuterStore } from "~/lib/pure";

export const meta = () => ([
  { title: 'Resume Analyzer | Revision de currículum' },
  { name: 'description', content: 'Detailed overview of your resume' },
])

function Resume() {

  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [isLoading])

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
    }

    loadResume();
  }, [id]);

  return (
    <main className="resumes-section">
      <nav className="resume-nav">
        <Link to="/" className="btn rounded-full w-48 self-center link-primary">
          &larr; Volver al inicio
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse rounded-2xl bg-white/50 backdrop-blur-2xl border border-white/50 transition-colors hover:bg-white/60">
        <section className="feedback-section sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  alt={"resume"}
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl text-black! font-bold">Revisión del currículum</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <Ats score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <video autoPlay loop muted playsInline className="w-full">
              <source src="/images/resume-scan-2.mp4" type="video/mp4" />
            </video>
          )}
        </section>
      </div>
    </main>
  )
}

export default Resume;