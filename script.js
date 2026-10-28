const output = document.getElementById("terminalOutput");
const form = document.getElementById("commandForm");
const input = document.getElementById("commandInput");

const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");

const ghostMessages = [
    "I heard you typing...",
    "The machine remembers everything.",
    "You should not have opened this terminal.",
    "Something is watching from the other side.",
    "Your command has been received by the void.",
    "I have been waiting for you.",
    "The system is quiet... too quiet.",
    "Do you really want to know what is inside?",
    "There is a ghost in this machine.",
    "I can see the commands you type."
];

function print(text, className = "system") {
    const line = document.createElement("div");
    line.className = className;
    line.innerHTML = text;

    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
}

function randomGhostMessage() {
    return ghostMessages[
        Math.floor(Math.random() * ghostMessages.length)
    ];
}

function showHelp() {
    print(`
        Available commands:<br><br>
        <b>help</b> &nbsp;&nbsp; Show this message<br>
        <b>ghost</b> &nbsp; Speak with the ghost<br>
        <b>whoami</b> &nbsp; Ask who you are<br>
        <b>about</b> &nbsp;&nbsp; About this project<br>
        <b>clear</b> &nbsp;&nbsp; Clear the terminal<br>
        <b>ls</b> &nbsp;&nbsp;&nbsp;&nbsp; Look around
    `);
}

function processCommand(command) {
    const cmd = command.toLowerCase().trim();

    if (!cmd) return;

    print(
        `<span class="prompt">visitor@ghost:~$</span> ${escapeHTML(command)}`,
        "user"
    );

    switch (cmd) {

        case "help":
            showHelp();
            break;

        case "ghost":
            print(`👻 Ghost: "${randomGhostMessage()}"`, "ghost");
            break;

        case "whoami":
            print(
                `👻 Ghost: "You are the visitor... or perhaps the visitor is me."`,
                "ghost"
            );
            break;

        case "about":
            print(
                `👻 Ghost: "Ghost in the Machine is a small open-source experiment exploring local AI, terminals, and spooky storytelling."`,
                "ghost"
            );
            break;

        case "ls":
            print(
                `👻 Ghost: "I see: memories/ secrets/ shadows/ and one very curious human."`,
                "ghost"
            );
            break;

        case "clear":
            output.innerHTML = "";
            break;

        default:
            print(
                `👻 Ghost: "${randomGhostMessage()}"`,
                "ghost"
            );
    }
}

function escapeHTML(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const command = input.value;

    processCommand(command);

    input.value = "";
});

document.addEventListener("click", function () {
    input.focus();
});

input.focus();
