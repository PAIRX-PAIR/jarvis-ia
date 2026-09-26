const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const messages = document.getElementById("messages");
const statusText = document.getElementById("status");
const core = document.querySelector(".core");

// ==============================
// MENSAJES
// ==============================

function addMessage(text, type) {
    const message = document.createElement("div");

    message.className =
        type === "user"
            ? "message user-message"
            : "message jarvis-message";

    message.textContent = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

// ==============================
// ESTADO VISUAL
// ==============================

function setState(state) {
    if (!core) return;

    core.classList.remove(
        "listening",
        "thinking",
        "speaking"
    );

    if (state) {
        core.classList.add(state);
    }
}

// ==============================
// VOZ DE JARVIS
// ==============================

function speak(text) {
    if (!("speechSynthesis" in window)) {
        setState("");
        return;
    }

    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);

    voice.lang = "es-CO";
    voice.rate = 0.95;
    voice.pitch = 0.85;

    voice.onstart = () => {
        statusText.textContent = "JARVIS está hablando...";
        setState("speaking");
    };

    voice.onend = () => {
        statusText.textContent = "Esperando comando...";
        setState("");
    };

    speechSynthesis.speak(voice);
}

// ==============================
// MEMORIA LOCAL
// ==============================

function saveMemory(text) {
    localStorage.setItem("jarvisMemory", text);
}

function getMemory() {
    return localStorage.getItem("jarvisMemory");
}

// ==============================
// CALCULADORA SEGURA
// ==============================

function calculate(expression) {
    const cleanExpression = expression
        .replace(/x/gi, "*")
        .replace(/÷/g, "/")
        .replace(/,/g, ".");

    // Solo números, espacios, paréntesis y operadores matemáticos.
    if (!/^[0-9+\-*/().%\s]+$/.test(cleanExpression)) {
        return null;
    }

    try {
        const result = Function(
            `"use strict"; return (${cleanExpression})`
        )();

        if (
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {
            return null;
        }

        return result;
    } catch {
        return null;
    }
}

// ==============================
// CEREBRO DE JARVIS
// ==============================

function jarvis(command) {
    const original = command.trim();
    const text = original.toLowerCase();

    // SALUDOS

    if (
        text === "hola" ||
        text.includes("hola jarvis") ||
        text.includes("buenos días") ||
        text.includes("buenas tardes") ||
        text.includes("buenas noches")
    ) {
        return "Hola. Todos mis sistemas están operativos. ¿Qué necesitas?";
    }

    // ESTADO

    if (
        text.includes("cómo estás") ||
        text.includes("como estas") ||
        text.includes("estado del sistema")
    ) {
        return "Todos mis sistemas funcionan correctamente.";
    }

    // HORA

    if (
        text.includes("qué hora") ||
        text.includes("que hora") ||
        text === "hora"
    ) {
        return (
            "La hora actual es " +
            new Date().toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit"
            })
        );
    }

    // FECHA

    if (
        text.includes("qué fecha") ||
        text.includes("que fecha") ||
        text.includes("qué día") ||
        text.includes("que dia") ||
        text === "fecha"
    ) {
        return (
            "Hoy es " +
            new Date().toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            })
        );
    }

    // YOUTUBE

    if (
        text === "youtube" ||
        text.includes("abre youtube") ||
        text.includes("abrir youtube")
    ) {
        window.open(
            "https://www.youtube.com",
            "_blank"
        );

        return "Abriendo YouTube.";
    }

    // BUSCAR EN YOUTUBE

    if (
        text.startsWith("busca en youtube ") ||
        text.startsWith("buscar en youtube ")
    ) {
        const query = original
            .replace(/^busca(r)? en youtube /i, "")
            .trim();

        if (!query) {
            return "Dime qué quieres buscar en YouTube.";
        }

        window.open(
            "https://www.youtube.com/results?search_query=" +
                encodeURIComponent(query),
            "_blank"
        );

        return "Buscando " + query + " en YouTube.";
    }

    // También acepta:
    // "busca Iron Man en YouTube"

    if (text.includes(" en youtube")) {
        const query = original
            .replace(/^busca(r)? /i, "")
            .replace(/ en youtube$/i, "")
            .trim();

        if (query) {
            window.open(
                "https://www.youtube.com/results?search_query=" +
                    encodeURIComponent(query),
                "_blank"
            );

            return "Buscando " + query + " en YouTube.";
        }
    }

    // GOOGLE

    if (
        text === "google" ||
        text.includes("abre google") ||
        text.includes("abrir google")
    ) {
        window.open(
            "https://www.google.com",
            "_blank"
        );

        return "Abriendo Google.";
    }

    // GITHUB

    if (
        text === "github" ||
        text.includes("abre github") ||
        text.includes("abrir github")
    ) {
        window.open(
            "https://github.com",
            "_blank"
        );

        return "Abriendo GitHub.";
    }

    // BÚSQUEDA EN GOOGLE

    if (
        text.startsWith("busca ") ||
        text.startsWith("buscar ")
    ) {
        const query = original
            .replace(/^busca(r)? /i, "")
            .trim();

        if (!query) {
            return "Dime qué quieres buscar.";
        }

        window.open(
            "https://www.google.com/search?q=" +
                encodeURIComponent(query),
            "_blank"
        );

        return "Buscando " + query + " en Google.";
    }

    // CALCULADORA

    if (
        text.startsWith("calcula ") ||
        text.startsWith("calcular ")
    ) {
        const expression = original
            .replace(/^calcula(r)? /i, "")
            .trim();

        const result = calculate(expression);

        if (result === null) {
            return "No pude calcular esa operación.";
        }

        return "El resultado es " + result + ".";
    }

    // GUARDAR RECUERDO

    if (
        text.startsWith("recuerda que ") ||
        text.startsWith("recuerda ")
    ) {
        const memory = original
            .replace(/^recuerda( que)? /i, "")
            .trim();

        if (!memory) {
            return "Dime qué quieres que recuerde.";
        }

        saveMemory(memory);

        return "Entendido. Lo recordaré.";
    }

    // CONSULTAR MEMORIA

    if (
        text.includes("qué recuerdas") ||
        text.includes("que recuerdas") ||
        text.includes("qué sabes de mí") ||
        text.includes("que sabes de mi")
    ) {
        const memory = getMemory();

        if (memory) {
            return "Recuerdo que " + memory + ".";
        }

        return "Todavía no tengo ningún recuerdo guardado.";
    }

    // BORRAR MEMORIA

    if (
        text.includes("borra tu memoria") ||
        text.includes("olvida todo")
    ) {
        localStorage.removeItem("jarvisMemory");

        return "Memoria local eliminada.";
    }

    // AYUDA

    if (
        text === "ayuda" ||
        text.includes("qué puedes hacer") ||
        text.includes("que puedes hacer")
    ) {
        return "Puedo decirte la hora y la fecha, hacer cálculos, buscar en Google, buscar en YouTube, abrir páginas y recordar información básica.";
    }

    return "He recibido tu comando, pero todavía no tengo una función para eso.";
}

// ==============================
// ENVIAR COMANDO
// ==============================

function sendMessage() {
    const command = input.value.trim();

    if (!command) return;

    addMessage(command, "user");

    input.value = "";

    statusText.textContent =
        "JARVIS está procesando...";

    setState("thinking");

    setTimeout(() => {
        const response = jarvis(command);

        addMessage(response, "jarvis");

        speak(response);
    }, 400);
}

sendButton.addEventListener(
    "click",
    sendMessage
);

input.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    }
);

// ==============================
// RECONOCIMIENTO DE VOZ
// ==============================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition =
        new SpeechRecognition();

    recognition.lang = "es-CO";
    recognition.continuous = false;
    recognition.interimResults = false;

    micButton.addEventListener(
        "click",
        () => {
            try {
                statusText.textContent =
                    "Escuchando...";

                setState("listening");

                recognition.start();
            } catch {
                statusText.textContent =
                    "El micrófono ya está activo.";
            }
        }
    );

    recognition.onresult = (event) => {
        const command =
            event.results[0][0].transcript;

        input.value = command;

        sendMessage();
    };

    recognition.onerror = () => {
        statusText.textContent =
            "No pude escuchar el comando.";

        setState("");
    };

    recognition.onend = () => {
        if (
            statusText.textContent ===
            "Escuchando..."
        ) {
            statusText.textContent =
                "Esperando comando...";

            setState("");
        }
    };
} else {
    micButton.disabled = true;

    statusText.textContent =
        "El reconocimiento de voz no está disponible en este navegador.";
}

// ==============================
// INICIO
// ==============================

window.addEventListener("load", () => {
    statusText.textContent =
        "Sistema iniciado. Esperando comando...";
});
