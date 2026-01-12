export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //calificación basada en la aptitud para el ATS
        tips: {
          type: "bueno" | "mejorar";
          tip: string; //unos 3 a 4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //maximo 100
        tips: {
          type: "bueno" | "mejorar";
          tip: string; //conviértalo en un "título" corto para la explicación real
          explanation: string; //explícalo en detalle aquí
        }[]; //unos 3 a 4 tips
      };
      content: {
        score: number; //maximo 100
        tips: {
          type: "bueno" | "mejorar";
          tip: string; //conviértalo en un "título" corto para la explicación real
          explanation: string; //explícalo en detalle aquí
        }[]; //unos 3 a 4 tips
      };
      structure: {
        score: number; //maximo 100
        tips: {
          type: "bueno" | "mejorar";
          tip: string; //conviértalo en un "título" corto para la explicación real
          explanation: string; //explícalo en detalle aquí
        }[]; //unos 3 a 4 tips
      };
      skills: {
        score: number; //maximo 100
        tips: {
          type: "bueno" | "mejorar";
          tip: string; //conviértalo en un "título" corto para la explicación real
          explanation: string; //explícalo en detalle aquí
        }[]; //unos 3 a 4 tips
      };
    }`;

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle: string;
  jobDescription: string;
}) =>
  `Eres un experto en ATS (Sistema de seguimiento de candidatos) y análisis de currículums.
  Por favor, analiza y califica este currículum y sugiere cómo mejorarlo.
  La calificación puede ser baja si el currículum es malo.
  Sé minucioso y detallado. No tengas miedo de señalar errores o áreas de mejora.
  Si hay mucho por mejorar, no dudes en dar puntuaciones bajas. El objetivo es ayudar al usuario a mejorar su currículum.
  Si está disponible, utiliza la descripción del puesto al que el usuario está postulando para brindar una devolución más detallada.
  Si se proporciona, ten en cuenta la descripción del puesto.
  El título del puesto es: ${jobTitle}
  La descripción del puesto es: ${jobDescription}
  Proporciona la devolución utilizando el siguiente formato: ${AIResponseFormat}
  Devuelve el análisis como un objeto JSON, sin ningún otro texto y sin usar backticks.
  No incluyas ningún otro texto ni comentarios.`;