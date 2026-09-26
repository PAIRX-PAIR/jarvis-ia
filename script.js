const input = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");
const messages = document.getElementById("messages");
const statusText = document.getElementById("status");

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

function speak(text) {

    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const voice = new SpeechSynthesisUtterance(text);

    voice.lang = "es-CO";
    voice.rate = 0.95;
    voice.pitch = 0.9;

    speechSynthesis.speak(voice);
}

function jarvis(command) {

    const text = command.toLowerCase().trim();

    if (text.includes("hola")) {

        return "Hola. Me alegra escucharte. Estoy listo.";

    }

    if (text.includes("hora")) {

        return "La hora actual es " +
            new Date().toLocaleTimeString("es-CO");

    }

    if (text.includes("fecha")) {

        return "Hoy es " +
            new Date().toLocaleDateString("es-CO");

    }

    if (text.includes("youtube")) {

        window.open("https://www.youtube.com", "_blank");

        return "Abriendo YouTube.";

    }

    if (text.includes("google")) {

        window.open("https://www.google.com", "_blank");

        return "Abriendo Google.";

    }

    if (text.includes("github")) {

        window.open("https://github.com", "_blank");

        return "Abriendo GitHub.";

    }

    if (
        text.includes("cómo estás") ||
        text.includes("como estas")
    ) {

        return "Todos mis sistemas funcionan correctamente.";

    }

    return "He recibido tu comando, pero todavía no tengo una función para eso.";
}

function sendMessage() {

    const command = input.value.trim();

    if (!command) return;

    addMessage(command, "user");

    input.value = "";

    statusText.textContent = "JARVIS está procesando...";

    setTimeout(() => {

        const response = jarvis(command);

        addMessage(response, "jarvis");

        speak(response);

        statusText.textContent = "Esperando comando...";

    }, 500);
}

sendButton.addEventListener("click", sendMessage);

input.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        sendMessage();
    }

});


// RECONOCIMIENTO DE VOZ

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.lang = "es-CO";
    recognition.continuous = false;

    micButton.addEventListener("click", () => {

        statusText.textContent = "Escuchando...";

        recognition.start();

    });

    recognition.onresult = (event) => {

        const command =
            event.results[0][0].transcript;

        input.value = command;

        sendMessage();

    };

    recognition.onerror = () => {

        statusText.textContent =
            "No pude escuchar el comando.";

    };

} else {

    micButton.disabled = true;

    statusText.textContent =
        "El reconocimiento de voz no está disponible en este navegador.";

}
