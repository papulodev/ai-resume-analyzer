interface Suggestion {
  type: "bueno" | "mejorar";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

function Ats({ score, suggestions }: Readonly<ATSProps>) {

  const scoreIsGreen = score > 69;
  const gradientIsYellow = score > 49 ? 'from-yellow-100' : 'from-red-100';
  const iconIsYellow = score > 49 ? '/icons/ats-warning.svg' : '/icons/ats-bad.svg';
  const subtitleIsYellow = score > 49 ? 'Buen inicio' : 'Necesita mejorar';

  // Determine background gradient based on score
  const gradientClass = scoreIsGreen ? 'from-green-100' : gradientIsYellow;

  // Determine icon based on score
  const iconSrc = scoreIsGreen ? '/icons/ats-good.svg' : iconIsYellow;

  // Determine subtitle based on score
  const subtitle = scoreIsGreen ? 'Excelente!' : subtitleIsYellow;

  return (
    <div className={`bg-linear-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">Puntuación ATS - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-4">
          Esta puntuación representa el rendimiento probable de su currículum en los sistemas de seguimiento de candidatos utilizados por los empleadores.
        </p>

        {/* Suggestions list */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index + suggestion.type} className="flex items-start gap-3">
              <img
                src={suggestion.type === "bueno" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "bueno" ? "Check" : "Warning"}
                className="w-5 h-5 mt-1"
              />
              <p className={suggestion.type === "bueno" ? "text-green-700" : "text-amber-700"}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Closing encouragement */}
      <p className="text-gray-700 italic">
        Continúe perfeccionando su currículum para mejorar sus posibilidades de pasar los filtros ATS y llegar a manos de los reclutadores.
      </p>
    </div>
  )
}

export default Ats