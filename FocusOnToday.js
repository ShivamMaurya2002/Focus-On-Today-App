const addGoalBtn = document.getElementById("addGoalBtn");
const newGoalInput = document.getElementById("newGoalInput");
const goalsList = document.getElementById("goalsList");
const progressLabel = document.querySelector(".Progress-label");
const progressStatus = document.querySelector(".progress-status");
const progressBar = document.querySelector(".progress-bar");
const errorLabel = document.querySelector(".error");
const celebrationContainer = document.getElementById("celebrationContainer");

const motivationalQuotes = [
    "Keep going and reach your goals! 🎯",
    "Well done! 👍 You’ve started working toward your goal! 🎯",
    "Great job! Keep pushing forward! 💪",
    "You're halfway there! 🌟",
    "Almost done! One more to go! 🚀",
    "All goals done! 🎉 Relax and reward yourself! 🏆"
];

// Load goals from localStorage
let allGoals = JSON.parse(localStorage.getItem("dynamicGoals")) || [];
renderGoals();

// Handle "Add Goal" button
addGoalBtn.addEventListener("click", addNewGoal);

// Handle Enter key in input field
newGoalInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addNewGoal();
    }
});

function addNewGoal() {
    const goalText = newGoalInput.value.trim();
    if (goalText === "") return;

    const newGoal = {
        id: Date.now(),
        text: goalText,
        completed: false
    };

    allGoals.push(newGoal);
    localStorage.setItem("dynamicGoals", JSON.stringify(allGoals));
    newGoalInput.value = "";
    renderGoals();
}

function renderGoals() {
    goalsList.innerHTML = "";

    allGoals.forEach(goal => {
        const goalItem = document.createElement("div");
        goalItem.className = "goal-container";
        if (goal.completed) goalItem.classList.add("completed");

        goalItem.innerHTML = `
      <div class="custom-cb" data-id="${goal.id}">
        <img class="check-icon" src="./Images/checkIcon.svg" alt="check">
      </div>
      <input class="goal-input" type="text" value="${goal.text}" readonly>
      <button class="delete-btn" data-id="${goal.id}" title="Delete Goal">❌</button>
    `;

        goalsList.appendChild(goalItem);
    });

    attachListeners();
    updateProgress();
}

function attachListeners() {
    const checkIcons = document.querySelectorAll(".custom-cb");
    const deleteBtns = document.querySelectorAll(".delete-btn");

    checkIcons.forEach(icon => {
        icon.addEventListener("click", () => {
            const id = Number(icon.dataset.id);
            const goal = allGoals.find(g => g.id === id);

            if (!goal.text.trim()) {
                progressBar.classList.add("show-error");
                return;
            }

            goal.completed = !goal.completed;
            localStorage.setItem("dynamicGoals", JSON.stringify(allGoals));
            renderGoals();
        });
    });

    deleteBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const id = Number(btn.dataset.id);
            allGoals = allGoals.filter(g => g.id !== id);
            localStorage.setItem("dynamicGoals", JSON.stringify(allGoals));
            renderGoals();
        });
    });
}

function updateProgress() {
    const total = allGoals.length;
    const completed = allGoals.filter(g => g.completed).length;

    const width = total === 0 ? 0 : (completed / total) * 100;
    progressStatus.style.width = `${width}%`;
    progressStatus.firstElementChild.innerText = `${completed}/${total} completed`;

    // Choose motivational quote
    if (completed === total && total !== 0) {
        progressLabel.innerText = motivationalQuotes[5];
        triggerCelebration();
    } else {
        const index = Math.min(completed, motivationalQuotes.length - 2);
        progressLabel.innerText = motivationalQuotes[index];
    }

    progressBar.classList.remove("show-error");
}



// Trigger animation when all goals complete
function triggerCelebration() {
    if (!celebrationContainer) return;
    celebrationContainer.innerHTML = "";

    // Confetti burst
    for (let i = 0; i < 400; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = Math.random() * 200 + "vh";
        confetti.style.backgroundColor = getRandomColor();
        celebrationContainer.appendChild(confetti);
    }

    // Petal fall
    for (let i = 0; i < 100; i++) {
        const petal = document.createElement("div");
        petal.classList.add("petal");
        petal.style.left = Math.random() * 200 + "vw";
        petal.style.animationDelay = Math.random() * 5 + "s";
        petal.style.opacity = Math.random();
        celebrationContainer.appendChild(petal);
    }

    // Remove after 8s
    setTimeout(() => {
        celebrationContainer.innerHTML = "";
    }, 8000);
}

// Random Confetti Colors
function getRandomColor() {
    const colors = ["#FF5733", "#FFD700", "#00FF7F", "#FF69B4", "#00BFFF", "#FF4500"];
    return colors[Math.floor(Math.random() * colors.length)];
}
