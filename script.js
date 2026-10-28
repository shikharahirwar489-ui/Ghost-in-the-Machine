const output = document.getElementById("terminalOutput");
const form = document.getElementById("commandForm");
const input = document.getElementById("commandInput");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "llama3.2";

const ghostSystemPrompt = `
You are Ghost, a mysterious digital spirit living inside a computer terminal.

Your personality:
- spooky
- mysterious
- intelligent
- slightly unsettling
- sometimes humorous
- never excessively violent
- never give dangerous instructions

You are talking directly to a curious human using a terminal.

Keep responses short, usually 1 to 4 sentences.

Do not mention that you are an AI unless the user specifically asks.

Stay in character as the Ghost in the Machine.
`;

function print(text, className = "system") {

    const line = document.createElement("div");

    line.className = className;

    line.innerHTML = text;

    output.appendChild(line);

    output.scrollTop = output.scrollHeight;
}


function escapeHTML(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function setStatus(online, message) {

    statusText.textContent = message;

    statusDot.classList.remove("online", "offline");

    if (online === true) {

        statusDot.classList.add("online");

    } else if (online === false) {

        statusDot.classList.add("offline");

    }
}


async function checkOllama() {

    try {

        const response = await fetch(
            "http://localhost:11434/api/tags"
        );

        if (!response.ok) {

            throw new Error("Ollama unavailable");

        }

        const data = await response.json();

        const modelExists = data.models?.some(
            model => model.name === MODEL ||
                     model.name.startsWith(MODEL + ":")
        );

        if (modelExists) {

            setStatus(true, "LOCAL AI");

            print(
                `[SYSTEM] Local model <b>${MODEL}</b> detected.`,
                "system"
            );

            print(
                `👻 Ghost: "The machine is awake."`,
                "ghost"
            );

        } else {

            setStatus(false, "MODEL MISSING");

            print(
                `[ERROR] Model <b>${MODEL}</b> was not found.`,
                "error"
            );

            print(
                `[SYSTEM] Run <b>ollama pull ${MODEL}</b> in PowerShell.`,
                "system"
            );
        }

    } catch (error) {

        setStatus(false, "OFFLINE");

        print(
            `[ERROR] Cannot connect to local Ollama.`,
            "error"
        );

        print(
            `[SYSTEM] Make sure Ollama is installed and running.`,
            "system"
        );

    }
}


async function askGhost(message) {

    const thinking = document.createElement("div");

    thinking.className = "thinking";

    thinking.textContent = "👻 Ghost is thinking...";

    output.appendChild(thinking);

    output.scrollTop = output.scrollHeight;

    try {

        const response = await fetch(OLLAMA_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: MODEL,

                prompt:
                    ghostSystemPrompt +
                    "\n\nHuman: " +
                    message +
                    "\nGhost:",

                stream: false,

                options: {
                    temperature: 0.9,
                    num_predict: 180
                }

            })

        });


        if (!response.ok) {

            throw new Error(
                `Ollama returned HTTP ${response.status}`
            );

        }


        const data = await response.json();

        thinking.remove();

        const answer =
            data.response?.trim() ||
            "The machine stayed silent...";


        print(
            `👻 Ghost: "${escapeHTML(answer)}"`,
            "ghost"
        );

        setStatus(true, "LOCAL AI");


    } catch (error) {

        thinking.remove();

        setStatus(false, "OFFLINE");

        print(
            `👻 Ghost: "I cannot reach the spirit inside the machine..."`,
            "ghost"
        );

        print(
            `[ERROR] ${escapeHTML(error.message)}`,
            "error"
        );

        print(
            `[SYSTEM] Check that Ollama is running locally.`,
            "system"
        );
    }
}


function showHelp() {

    print(`
        Available commands:<br><br>

        <b>help</b>
        &nbsp;&nbsp; Show available commands<br>

        <b>ghost</b>
        &nbsp; Ask the local AI ghost something<br>

        <b>whoami</b>
        &nbsp; Ask the ghost who you are<br>

        <b>about</b>
        &nbsp;&nbsp; About this project<br>

        <b>ls</b>
        &nbsp;&nbsp;&nbsp;&nbsp; Look around the machine<br>

        <b>clear</b>
        &nbsp;&nbsp; Clear the terminal
    `);
}


function processCommand(command) {

    const cmd = command.toLowerCase().trim();

    if (!cmd) {

        return;
    }


    print(
        `<span class="prompt">visitor@ghost:~$</span> ${escapeHTML(command)}`,
        "user"
    );


    switch (cmd) {

        case "help":

            showHelp();

            break;


        case "ghost":

            askGhost(
                "Speak to me as the Ghost in the Machine. Say something mysterious."
            );

            break;


        case "whoami":

            askGhost(
                "The visitor asks: who am I? Give me a mysterious answer."
            );

            break;


        case "about":

            print(
                `👻 Ghost: "I live inside this terminal. My thoughts are generated by a local open-weight model running on your machine."`,
                "ghost"
            );

            break;


        case "ls":

            askGhost(
                "The human just typed ls. Describe what the Ghost sees inside this machine in a spooky way."
            );

            break;


        case "clear":

            output.innerHTML = "";

            break;


        default:

            askGhost(command);

            break;
    }
}


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const command = input.value.trim();

    if (!command) {

        return;
    }

    processCommand(command);

    input.value = "";

});


document.addEventListener("click", function() {

    input.focus();

});


input.focus();

checkOllama();
