import { prepareInstructions } from '../../constants';
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router';
import FileUploader from '~/components/upload/FileUploader';
import Navbar from '~/components/ui/Navbar'
import { convertPdfToImage } from '~/lib/pdf2img';
import { usePuterStore } from '~/lib/pure';
import { generateUUID } from '~/lib/utils';

function Upload() {

  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  }

  const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
    setIsProcessing(true);

    setStatusText('Subiendo el archivo...');
    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile) return setStatusText('Error: Failed to upload file');

    setStatusText('Convirtiendo a imagen...');
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText(imageFile.error || 'Error: Failed to convert PDF to image');

    setStatusText('Subiendo la imagen...');
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText('Error: Failed to upload image');

    setStatusText('Preparando datos...');
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName, jobTitle, jobDescription,
      feedback: '',
    }
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText('Analizando...');

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    )
    if (!feedback) return setStatusText('Error: Failed to analyze resume');

    const feedbackText = typeof feedback.message.content === 'string'
      ? feedback.message.content
      : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText('Análisis completado, redirigiendo...');
    navigate(`/resume/${uuid}`);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest('form');
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get('company-name') as string;
    const jobTitle = formData.get('job-title') as string;
    const jobDescription = formData.get('job-description') as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  }

  return (
    <main className="flex flex-col p-4 gap-8 min-h-dvh">
      <Navbar />

      <Link to="/" className="btn rounded-full w-48 self-center link-primary">
        &larr; Volver al inicio
      </Link>

      <section className="main-section">
        <div className="page-heading">
          <h1>Comentarios inteligentes para el trabajo de tus sueños</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="resume gif scan" className="w-full" />
            </>
          ) : (
            <h2>Envíe su currículum para obtener una puntuación ATS y consejos de mejora</h2>
          )}
          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-start text-base">Nombre de la empresa</legend>
                <input type="text" id="company-name" name="company-name" className="input input-primary w-full text-base" placeholder="Ingrese el nombre de la empresa" required />
                <p className="label text-[14px]">Requerido</p>
              </fieldset>

              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-start text-base">Título profesional</legend>
                <input type="text" id="job-title" name="job-title" className="input input-primary w-full text-base" placeholder="Ingrese el nombre de su título profesional" required />
                <p className="label text-[14px]">Requerido</p>
              </fieldset>

              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-start text-base">Descripción del trabajo</legend>
                <textarea id="job-description" rows={5} name="job-description" className="textarea textarea-primary w-full text-base" placeholder="Ingrese la descripción del trabajo" required>
                </textarea>
                <p className="label text-[14px]">Requerido</p>
              </fieldset>

              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-start text-base">Subir currículum</legend>
                <FileUploader onFileSelect={handleFileSelect} />
                <p className="label text-[14px]">Requerido</p>
              </fieldset>

              <button form="upload-form" className="primary-button" type="submit">
                Analizar Resumen
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default Upload