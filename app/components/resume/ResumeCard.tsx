import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ScoreCircle from './ScoreCircle';
import { usePuterStore } from '~/lib/pure';

interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
}

function ResumeCard({ resume, onDelete }: Readonly<ResumeCardProps>) {
  const {
    id,
    companyName,
    jobTitle,
    feedback,
    imagePath
  } = resume;

  const { fs, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string>('');

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    }

    loadResume();
  }, [imagePath]);


  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to the details page
    if (!window.confirm("¿Estás seguro de que quieres eliminar este análisis?")) return;

    try {
      // 1. Delete image from FS
      if (imagePath) {
        await fs.delete(imagePath);
      }

      // 2. Delete record from KV
      await kv.delete(`resume:${id}`);

      // 3. Notify parent to update state
      onDelete(id);
    } catch (error) {
      console.error("Error deleting resume:", error);
      alert("Hubo un error al eliminar el análisis.");
    }
  }

  return (
    <div>
      <button aria-label='boton para eliminar analisis' className='btn btn-error mb-2 rounded-full' onClick={handleDelete}>
        Eliminar análisis
      </button>
      <Link to={`/resume/${id}`} className="resume-card ">
        <div className="resume-card-header">
          <div className="flex flex-col gap-2">
            {companyName && <h2 className="text-black! font-bold wrap-break-word">{companyName}</h2>}
            {jobTitle && <h3 className="text-lg wrap-break-word text-gray-500">{jobTitle}</h3>}
            {!companyName && !jobTitle && <h2 className="text-black! font-bold">Resume</h2>}
          </div>
          <div className="shrink-0">
            <ScoreCircle score={feedback.overallScore} />
          </div>
        </div>
        {resumeUrl && (
          <div className="animate-in fade-in duration-1000 overflow-hidden">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full aspect-square object-contain"
              loading="lazy"
            />
          </div>
        )}
      </Link>
    </div>
  )
}

export default ResumeCard