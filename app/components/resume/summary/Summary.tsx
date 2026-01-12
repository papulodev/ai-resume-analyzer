import Category from './Category'
import ScoreGauge from './ScoreGauge'

function Summary({ feedback }: { feedback: Feedback }) {
  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGauge score={feedback.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Su puntuación</h2>
          <p className="text-sm text-gray-500">
            Esta puntuación se calcula en función de las variables enumeradas a continuación.
          </p>
        </div>
      </div>

      <Category title="Tono y Estilo" score={feedback.toneAndStyle.score} />
      <Category title="Contenido" score={feedback.content.score} />
      <Category title="Estructura" score={feedback.structure.score} />
      <Category title="Habilidades" score={feedback.skills.score} />
    </div>
  )
}

export default Summary