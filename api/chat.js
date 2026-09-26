
export default async function handler(req, res) {
  // Solo permitimos solicitudes POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "No se recibió ningún mensaje"
      });
    }

    // La API key está guardada de forma segura en Vercel
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "OPENAI_API_KEY no está configurada"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },

        body: JSON.stringify({
          model: "gpt-5.6-luna",

          instructions: `
Eres JARVIS, un asistente personal de inteligencia artificial.

Tu personalidad es:
- Profesional
- Inteligente
- Tranquila
- Directa
- Elegante
- Similar a un asistente futurista

Habla principalmente en español.

Tu usuario puede hablarte mediante voz o texto.

Responde de forma clara y relativamente corta porque tus respuestas
normalmente serán leídas en voz alta.

Cuando sea apropiado, dirígete al usuario como "señor".

No digas que eres ChatGPT.
Tu nombre dentro de esta aplicación es JARVIS.
          `,

          input: message,
          max_output_tokens: 500
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);

      return res.status(response.status).json({
        error: data?.error?.message || "Error al conectar con la IA"
      });
    }

    // Extraemos el texto de la respuesta
    let reply = "";

    if (data.output_text) {
      reply = data.output_text;
    } else if (Array.isArray(data.output)) {
      for (const item of data.output) {
        if (!Array.isArray(item.content)) continue;

        for (const content of item.content) {
          if (content.type === "output_text" && content.text) {
            reply += content.text;
          }
        }
      }
    }

    if (!reply) {
      reply = "No pude generar una respuesta en este momento.";
    }

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("JARVIS backend error:", error);

    return res.status(500).json({
      error: "Ocurrió un error interno en JARVIS"
    });
  }
}
