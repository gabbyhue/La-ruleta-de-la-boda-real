const gameState = {
    turn: 1,
    phase: 'input', // 'input', 'reveal', 'end'
    variables: {
        intruder: null,
        challenger: null,
        dancer: null, // Turn 3 selection
        screamer: null,
        spouse: null,
        leftovers: [], // Those NOT picked in Turn 2
        intruderLeft: false, // Turn 3 logic flag
        groomLeft: false,    // Turn 3 logic flag
        brideLeft: false     // Turn 3 logic flag
    }
};

// Full Game Data
// Added 'img' property for logic
const TURNS = {
    1: {
        title: "The Interruption",
        scene: "The organ music swells. The Bride and Groom stand at the altar. Suddenly, the church doors burst open!",
        prompt: "WHO bursts in?",
        choices: [
            { id: "ex", label: "The Groom's Ex-Girlfriend", text: "the Groom's Ex-Girlfriend", img: "assets/icon_ex.png" },
            { id: "bishop", label: "The Bishop", text: "the Bishop", img: "assets/icon_bishop.png" },
            { id: "bear", label: "A loose circus bear", text: "the loose circus bear", img: "assets/icon_bear.png" }
        ],
        saveAs: "intruder"
    },
    2: {
        title: "The Reaction",
        scene: "The congregation gasps. Someone steps forward to defend the Bride!",
        prompt: "WHO steps forward?",
        choices: [
            { id: "flower_girl", label: "The Flower Girl", text: "the Flower Girl", img: "assets/icon_flower.png" },
            { id: "guard", label: "The Royal Guard", text: "the Royal Guard", img: "assets/icon_guard.png" },
            { id: "grandma", label: "The Bride's 90-year-old Grandmother", text: "the Bride's 90-year-old Grandmother", img: "assets/icon_grandma.png" }
        ],
        saveAs: "challenger",
        saveLeftoversAs: "leftovers" // Special logic to save unpicked ones
    },
    3: {
        title: "The Realization (The Double Exit)",
        scene: "The break-dance battle is reaching its peak. Suddenly, the music cuts out. One of the main participants looks down at their feet moved.",
        prompt: "WHO stops the battle and leaves?",
        // Dynamic Choices generated in render logic
        saveAs: "dancer"
    },
    4: {
        title: "The Decision",
        scene: "With the room in chaos, there is an awkward silence. Someone decides this nonsense has gone on long enough.",
        prompt: "WHO makes a demand?",
        choices: [
            { id: "mother", label: "The Mother of the Bride", text: "the Mother of the Bride", img: "assets/icon_mother.png" },
            { id: "caterer", label: "The Hungry Caterer", text: "the Hungry Caterer", img: "assets/icon_caterer.png" },
            { id: "priest", label: "The Priest", text: "the Priest", img: "assets/icon_priest.png" }
        ],
        saveAs: "screamer"
    },
    5: {
        title: "The Wedding (The Replacement)",
        scene: "Terrified by the screaming, someone runs to the altar.",
        prompt: "WHO runs?",
        // Dynamic Choices generated in render logic
        saveAs: "spouse"
    }
};

const UI = {
    sceneText: document.getElementById('scene-text'),
    promptText: document.getElementById('prompt-text'),
    choicesContainer: document.getElementById('choices-container'),
    turnNumber: document.getElementById('turn-number'),
    gameContainer: document.getElementById('game-container'),
    btnBack: document.getElementById('btn-back'),
    btnHome: document.getElementById('btn-home')
};

function startGame() {
    UI.gameContainer.classList.remove('end-game-mode'); // Reset layout
    gameState.turn = 1;
    gameState.phase = 'input';
    gameState.variables = {
        intruder: null,
        challenger: null,
        dancer: null,
        screamer: null,
        spouse: null,
        leftovers: [],
        intruderLeft: false,
        groomLeft: false,
        brideLeft: false
    };
    renderTurn(1);
    setupNavigation();
}

function setupNavigation() {
    UI.btnHome.onclick = () => {
        if (confirm("Restart the game?")) {
            startGame();
        }
    };

    UI.btnBack.onclick = goBack;
}

function goBack() {
    if (gameState.phase === 'reveal') {
        renderTurn(gameState.turn);
    }
    else if (gameState.phase === 'input') {
        if (gameState.turn > 1) {
            gameState.turn--;
            renderReveal(gameState.turn);
        }
    }
    // No back from End Screen for simplicity
}

function handleChoice(choiceObj, turnNum) {
    const turnData = TURNS[turnNum];
    if (turnData.saveAs) {
        gameState.variables[turnData.saveAs] = choiceObj;
    }

    if (turnNum === 2) {
        const pickedId = choiceObj.id;
        const allOptions = turnData.choices;
        gameState.variables.leftovers = allOptions.filter(opt => opt.id !== pickedId);
    }

    if (turnNum === 3) {
        const dancer = gameState.variables.dancer;
        const intruder = gameState.variables.intruder;

        gameState.variables.intruderLeft = false;
        gameState.variables.brideLeft = false;
        gameState.variables.groomLeft = false;

        if (dancer.id === intruder.id) {
            gameState.variables.intruderLeft = true;
            gameState.variables.brideLeft = true;
        } else {
            if (dancer.id === 'bride') gameState.variables.brideLeft = true;
            if (dancer.id === 'groom') gameState.variables.groomLeft = true;
        }
    }

    renderReveal(turnNum);
}

function renderReveal(completedTurnNum) {
    gameState.phase = 'reveal';
    const nextTurnNum = completedTurnNum + 1;

    let revealText = "";

    // Turn 1 Reveal
    if (completedTurnNum === 1) {
        revealText = `"Suddenly, <span class='highlight'>${gameState.variables.intruder.text}</span> bursts in! And immediately confesses their undying love for the Groom."`;
    }
    // Turn 2 Reveal
    else if (completedTurnNum === 2) {
        revealText = `"<span class='highlight'>${gameState.variables.challenger.text}</span> steps forward and challenges <span class='highlight'>${gameState.variables.intruder.text}</span> to a break-dance battle to settle the dispute."`;
    }
    // Turn 3 Reveal
    else if (completedTurnNum === 3) {
        const dancer = gameState.variables.dancer;
        const intruder = gameState.variables.intruder;

        if (dancer.id === intruder.id) {
            revealText = `"Suddenly, <span class='highlight'>${intruder.text}</span> stops the battle because their moves were terrible and runs to dance school. Seeing this, The Bride yells 'This is ridiculous!' and storms out too."`;
        } else {
            revealText = `"Suddenly, <span class='highlight'>${dancer.text}</span> stops the battle because their moves were terrible and runs out to enroll in dance lessons immediately."`;
        }
    }
    // Turn 4 Reveal
    else if (completedTurnNum === 4) {
        revealText = `"<span class='highlight'>${gameState.variables.screamer.text}</span> steps onto the altar and screams 'I DON'T CARE WHO MARRIES WHO, WE ARE EATING CAKE IN 10 MINUTES!'"`;
    }
    // Turn 5 Reveal (Leads to End)
    else if (completedTurnNum === 5) {
        renderFullStory(); // Go to full story
        return;
    }

    updateScene(revealText);
    UI.promptText.textContent = "What happens next?";
    UI.turnNumber.textContent = completedTurnNum;
    UI.choicesContainer.innerHTML = '';

    const btn = document.createElement('button');
    btn.className = 'choice-btn continue-btn';
    btn.textContent = "Continue";
    btn.onclick = () => {
        gameState.turn = nextTurnNum;
        renderTurn(nextTurnNum);
    };
    UI.choicesContainer.appendChild(btn);
}

function renderTurn(turnNum) {
    gameState.phase = 'input';
    UI.turnNumber.textContent = turnNum > 5 ? 5 : turnNum;
    UI.choicesContainer.innerHTML = '';

    const turnData = TURNS[turnNum];
    updateScene(turnData.scene);
    UI.promptText.textContent = turnData.prompt;

    // Manage Navigation Visibility
    if (turnNum === 1) {
        UI.btnBack.style.display = 'none';
        UI.btnHome.style.display = 'none';
    } else {
        UI.btnBack.style.display = 'flex';
        UI.btnHome.style.display = 'flex';
    }

    let choicesInfo = [];

    if (turnNum === 3) {
        let intruderLabel = gameState.variables.intruder.label;
        if (intruderLabel.startsWith("A ")) {
            intruderLabel = intruderLabel.replace("A ", "The ");
        }

        choicesInfo = [
            { id: "bride", label: "The Bride", text: "the Bride", img: "assets/icon_bride.png" },
            { id: "groom", label: "The Groom", text: "the Groom", img: "assets/icon_groom.png" },
            { id: gameState.variables.intruder.id, label: intruderLabel + " (Intruder)", text: gameState.variables.intruder.text, img: gameState.variables.intruder.img }
        ];
    }
    else if (turnNum === 5) {
        choicesInfo = [];
        if (!gameState.variables.groomLeft) choicesInfo.push({ id: "groom", label: "The Groom", text: "the Groom", img: "assets/icon_groom.png" });
        if (!gameState.variables.intruderLeft) choicesInfo.push({ id: gameState.variables.intruder.id, label: gameState.variables.intruder.label, text: gameState.variables.intruder.text, img: gameState.variables.intruder.img });
        gameState.variables.leftovers.forEach(lo => choicesInfo.push(lo));
    } else {
        choicesInfo = turnData.choices;
    }

    choicesInfo.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';

        // Icon Image
        const img = document.createElement('img');
        img.src = c.img;
        img.className = 'choice-icon';
        img.alt = c.label;

        // Label Text
        const span = document.createElement('span');
        span.className = 'choice-label';
        span.textContent = c.label;

        btn.appendChild(img);
        btn.appendChild(span);

        btn.onclick = () => handleChoice(c, turnNum);
        UI.choicesContainer.appendChild(btn);
    });
}

function renderFullStory() {
    gameState.phase = 'end';
    UI.turnNumber.textContent = "FIN";
    UI.promptText.textContent = "The End";

    // Switch to single column layout
    UI.gameContainer.classList.add('end-game-mode');


    // Construct the full narrative
    const v = gameState.variables;

    // Wedding Photo removed per user request

    let storyHTML = `
        <div style="text-align: left; font-size: 1.1rem; line-height: 1.6; max-height: 300px; overflow-y: auto; padding-right: 15px;">
            <p>The organ music swelled. The Bride and Groom stood at the altar. Suddenly, <span class='highlight'>${v.intruder.text}</span> burst in! And immediately confessed their undying love for the Groom.</p>
            <br>
            <p>The congregation gasped. <span class='highlight'>${v.challenger.text}</span> stepped forward and challenged <span class='highlight'>${v.intruder.text}</span> to a break-dance battle to settle the dispute.</p>
            <br>
            <p>The break-dance battle reached its peak. Suddenly, <span class='highlight'>${v.dancer.text}</span> stopped the battle because their moves were awesome and ran out. 
            ${(v.dancer.id === v.intruder.id) ? "Seeing this, The Bride yelled 'This is ridiculous!' and stormed out too." : ""}
            </p>
            <br>
            <p>With the room in chaos, <span class='highlight'>${v.screamer.text}</span> stepped onto the altar and screamed 'I DON'T CARE WHO MARRIES WHO, WE ARE EATING CAKE IN 10 MINUTES!'</p>
            <br>
            <p>Terrified by the screaming, and in a panic, <span class='highlight'>${v.spouse.text}</span> grabbed <span class='highlight'>${v.challenger.text}</span> by the hand to finish the wedding. They exchanged rings made of tin foil and were pronounced 'Partners in Crime'.</p>
        </div>
        <br>
        <h3 style="color: #FDB931; text-align: center;">CONGRATULATIONS! What a Wedding!</h3>
    `;

    UI.sceneText.classList.remove('fade-in');
    UI.sceneText.innerHTML = storyHTML;
    void UI.sceneText.offsetWidth;
    UI.sceneText.classList.add('fade-in');

    UI.choicesContainer.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'choice-btn restart-btn';
    btn.textContent = "Play Again";
    btn.onclick = () => location.reload();
    UI.choicesContainer.appendChild(btn);
}

function updateScene(text) {
    UI.sceneText.innerHTML = text;
    UI.sceneText.classList.remove('fade-in');
    void UI.sceneText.offsetWidth; // trigger reflow
    UI.sceneText.classList.add('fade-in');
}

// Start
startGame();
