/* =========================================================
   LUMIÈRE HOME JAVASCRIPT
   LEVEL 26 — INTERACTIVE BIRTHDAY WORLD
   FINAL SECRET STAR SYSTEM
========================================================= */

/* =========================================================
   LIGHT PARTICLES
========================================================= */

const lightParticles = document.getElementById("lightParticles");

function createLightParticle() {
  if (!lightParticles) {
    return;
  }

  const particle = document.createElement("span");

  particle.classList.add("light-particle");

  particle.style.left = Math.random() * 100 + "%";

  const duration = 4 + Math.random() * 5;

  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = "0s";

  lightParticles.appendChild(particle);

  setTimeout(
    () => {
      particle.remove();
    },
    duration * 1000 + 500,
  );
}

/* Initial particles */

for (let i = 0; i < 8; i++) {
  createLightParticle();
}

/* Continuous particles */

setInterval(createLightParticle, 700);

/* =========================================================
   MODALS
========================================================= */

const allModals = document.querySelectorAll(".modal");

const menuButtons = document.querySelectorAll(".menu-button[data-modal]");

const closeButtons = document.querySelectorAll(".close-modal");

/* =========================================================
   OPEN MODALS
========================================================= */

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modalID = button.dataset.modal;

    const modal = document.getElementById(modalID);

    if (!modal) {
      return;
    }

    /* -----------------------------------------------
       JOURNEY HAS ITS OWN FLOW
    ------------------------------------------------ */

    if (modalID === "journeyModal") {
      startJourney();
      return;
    }

    /* -----------------------------------------------
       NORMAL MODAL
    ------------------------------------------------ */

    modal.classList.add("show");

    modal.setAttribute("aria-hidden", "false");

    /* -----------------------------------------------
       BIRTHDAY LETTER
    ------------------------------------------------ */

    if (modalID === "letterModal") {
      setTimeout(() => {
        typeLetter();
      }, 300);
    }
  });
});

/* =========================================================
   CLOSE MODALS
========================================================= */

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");

    if (!modal) {
      return;
    }

    closeModal(modal);
  });
});

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove("show");

  modal.setAttribute("aria-hidden", "true");
}

/* =========================================================
   CLICK OUTSIDE MODAL
========================================================= */

allModals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

/* =========================================================
   JOURNEY ELEMENTS
========================================================= */

const journeyModal = document.getElementById("journeyModal");

const journeyReveal = document.getElementById("journeyReveal");

const journeyLevels = document.querySelectorAll(".journey-level");

const unlockLevel = document.getElementById("unlockLevel");

const unlockTitle = document.getElementById("unlockTitle");

const storyText = document.getElementById("storyText");

const journeyProgressFill = document.getElementById("journeyProgressFill");

const journeyProgressText = document.getElementById("journeyProgressText");

const journeyContinueReveal = document.getElementById("journeyContinueReveal");

const journeyContinue = document.getElementById("journeyContinue");

/* =========================================================
   JOURNEY DATA
========================================================= */

const journeyData = Array.from(journeyLevels).map((level) => {
  return {
    level: level.dataset.level,

    title: level.dataset.title,

    text: level.dataset.text,

    textSize: level.dataset.textSize || "14px",

    titleSize: level.dataset.titleSize || "18px",
  };
});

/* =========================================================
   JOURNEY VARIABLES
========================================================= */

let currentJourney = 0;

let typingTimer = null;

let journeyTransitioning = false;

/* =========================================================
   START JOURNEY
========================================================= */

function startJourney() {
  /* -----------------------------------------------
     RESET JOURNEY STATE
  ------------------------------------------------ */

  currentJourney = 0;

  journeyTransitioning = false;

  stopStoryTyping();

  resetJourneyLevels();

  resetJourneyContinue();

  /* -----------------------------------------------
     RESET REVEAL
  ------------------------------------------------ */

  if (journeyReveal) {
    journeyReveal.classList.remove("show");
    journeyReveal.classList.remove("flash");
    journeyReveal.classList.remove("ready");
    journeyReveal.classList.remove("level-26");

    journeyReveal.setAttribute("aria-hidden", "true");
  }

  /* -----------------------------------------------
     RESET JOURNEY MODAL
  ------------------------------------------------ */

  if (journeyModal) {
    journeyModal.classList.remove("show");

    journeyModal.setAttribute("aria-hidden", "true");
  }

  /* -----------------------------------------------
     START FIRST LEVEL
  ------------------------------------------------ */

  setTimeout(() => {
    showJourneyStep();
  }, 250);
}

/* =========================================================
   RESET JOURNEY LEVELS
========================================================= */

function resetJourneyLevels() {
  journeyLevels.forEach((level) => {
    level.classList.remove("active");
    level.classList.remove("completed");
  });

  if (journeyProgressFill) {
    journeyProgressFill.style.width = "16.66%";
  }

  if (journeyProgressText) {
    journeyProgressText.textContent = `JOURNEY 01 / ${String(
      journeyData.length,
    ).padStart(2, "0")}`;
  }
}

/* =========================================================
   RESET CONTINUE BUTTON
========================================================= */

function resetJourneyContinue() {
  if (!journeyContinueReveal) {
    return;
  }

  journeyContinueReveal.disabled = true;

  if (journeyReveal) {
    journeyReveal.classList.remove("ready");
  }
}

/* =========================================================
   SHOW CONTINUE BUTTON
========================================================= */

function showJourneyContinue() {
  if (!journeyContinueReveal) {
    return;
  }

  journeyContinueReveal.disabled = false;

  if (journeyReveal) {
    journeyReveal.classList.add("ready");
  }
}

/* =========================================================
   SHOW JOURNEY STEP
========================================================= */

function showJourneyStep() {
  stopStoryTyping();

  journeyTransitioning = false;

  const journey = journeyData[currentJourney];

  /* -----------------------------------------------
     NO MORE LEVELS
  ------------------------------------------------ */

  if (!journey) {
    finishJourney();
    return;
  }

  /* -----------------------------------------------
     RESET CONTINUE
  ------------------------------------------------ */

  resetJourneyContinue();

  /* -----------------------------------------------
     UPDATE TIMELINE
  ------------------------------------------------ */

  journeyLevels.forEach((level, index) => {
    level.classList.remove("active");

    if (index < currentJourney) {
      level.classList.add("completed");
    } else {
      level.classList.remove("completed");
    }
  });

  /* Current level */

  if (journeyLevels[currentJourney]) {
    journeyLevels[currentJourney].classList.add("active");
  }

  /* -----------------------------------------------
     UPDATE PROGRESS
  ------------------------------------------------ */

  const progress = ((currentJourney + 1) / journeyData.length) * 100;

  if (journeyProgressFill) {
    journeyProgressFill.style.width = `${progress}%`;
  }

  if (journeyProgressText) {
    journeyProgressText.textContent = `JOURNEY ${String(
      currentJourney + 1,
    ).padStart(2, "0")} / ${String(journeyData.length).padStart(2, "0")}`;
  }

  /* -----------------------------------------------
     PREPARE REVEAL
  ------------------------------------------------ */

  if (!journeyReveal) {
    return;
  }

  journeyReveal.classList.remove("show");
  journeyReveal.classList.remove("flash");
  journeyReveal.classList.remove("ready");
  journeyReveal.classList.remove("level-26");

  journeyReveal.setAttribute("aria-hidden", "false");

  /* -----------------------------------------------
     LEVEL 26 SPECIAL CLASS
  ------------------------------------------------ */

  if (String(journey.level) === "26") {
    journeyReveal.classList.add("level-26");
  }

  /* -----------------------------------------------
     TEXT SIZES
  ------------------------------------------------ */

  if (storyText) {
    storyText.style.fontSize = journey.textSize;
  }

  if (unlockTitle) {
    unlockTitle.style.fontSize = journey.titleSize;
  }

  /* -----------------------------------------------
     CONTENT
  ------------------------------------------------ */

  if (unlockLevel) {
    unlockLevel.textContent = `LEVEL ${journey.level}`;
  }

  if (unlockTitle) {
    unlockTitle.textContent = journey.title;
  }

  if (storyText) {
    storyText.textContent = "";
  }

  /* -----------------------------------------------
     RESTART ANIMATION
  ------------------------------------------------ */

  void journeyReveal.offsetWidth;

  journeyReveal.classList.add("show");
  journeyReveal.classList.add("flash");

  setTimeout(() => {
    if (journeyReveal) {
      journeyReveal.classList.remove("flash");
    }
  }, 800);

  /* -----------------------------------------------
     TYPE STORY
  ------------------------------------------------ */

  typeStory(journey.text, () => {
    showJourneyContinue();
  });
}

/* =========================================================
   TYPE STORY
========================================================= */

function typeStory(text, callback) {
  stopStoryTyping();

  let index = 0;

  if (storyText) {
    storyText.textContent = "";
  }

  typingTimer = setInterval(() => {
    if (!storyText) {
      stopStoryTyping();
      return;
    }

    storyText.textContent += text.charAt(index);

    index++;

    /* -----------------------------------------------
       STORY COMPLETE
    ------------------------------------------------ */

    if (index >= text.length) {
      stopStoryTyping();

      if (callback) {
        callback();
      }
    }
  }, 35);
}

/* =========================================================
   STOP STORY TYPING
========================================================= */

function stopStoryTyping() {
  if (typingTimer) {
    clearInterval(typingTimer);
    typingTimer = null;
  }
}

/* =========================================================
   FINISH CURRENT STORY
========================================================= */

function finishCurrentStory() {
  if (!typingTimer) {
    return false;
  }

  stopStoryTyping();

  const journey = journeyData[currentJourney];

  if (journey && storyText) {
    storyText.textContent = journey.text;
  }

  showJourneyContinue();

  return true;
}

/* =========================================================
   NEXT JOURNEY
========================================================= */

function nextJourney() {
  /* Prevent double clicks */

  if (journeyTransitioning) {
    return;
  }

  /* Finish typing first */

  if (typingTimer) {
    finishCurrentStory();
    return;
  }

  journeyTransitioning = true;

  currentJourney++;

  /* -----------------------------------------------
     JOURNEY COMPLETE
  ------------------------------------------------ */

  if (currentJourney >= journeyData.length) {
    finishJourney();
    return;
  }

  /* -----------------------------------------------
     NEXT LEVEL
  ------------------------------------------------ */

  showJourneyStep();
}

/* =========================================================
   JOURNEY CONTINUE BUTTON
========================================================= */

if (journeyContinueReveal) {
  journeyContinueReveal.addEventListener("click", () => {
    if (journeyContinueReveal.disabled) {
      return;
    }

    nextJourney();
  });
}

/* =========================================================
   JOURNEY REPLAY
========================================================= */

if (journeyContinue) {
  journeyContinue.addEventListener("click", () => {
    startJourney();
  });
}

/* =========================================================
   FINISH JOURNEY
========================================================= */

function finishJourney() {
  stopStoryTyping();

  journeyTransitioning = false;

  /* -----------------------------------------------
     HIDE LEVEL REVEAL
  ------------------------------------------------ */

  if (journeyReveal) {
    journeyReveal.classList.remove("show");

    journeyReveal.classList.remove("ready");

    journeyReveal.classList.remove("level-26");

    journeyReveal.setAttribute("aria-hidden", "true");
  }

  /* -----------------------------------------------
     SHOW COMPLETION MODAL
  ------------------------------------------------ */

  setTimeout(() => {
    if (journeyModal) {
      journeyModal.classList.add("show");

      journeyModal.setAttribute("aria-hidden", "false");
    }

    /* -------------------------------------------
       COMPLETE TIMELINE
    -------------------------------------------- */

    journeyLevels.forEach((level) => {
      level.classList.remove("active");

      level.classList.add("completed");
    });

    /* -------------------------------------------
       COMPLETE PROGRESS
    -------------------------------------------- */

    if (journeyProgressFill) {
      journeyProgressFill.style.width = "100%";
    }

    if (journeyProgressText) {
      journeyProgressText.textContent = "JOURNEY COMPLETE ★";
    }

    resetJourneyContinue();

    completeJourneyQuest();
  }, 500);
}

/* =========================================================
   COMPLETE JOURNEY QUEST
========================================================= */

function completeJourneyQuest() {
  const quest = document.getElementById("journeyQuest");

  if (!quest) {
    return;
  }

  quest.classList.add("completed");

  const check = quest.querySelector(".quest-check");

  if (check) {
    check.textContent = "✓";
  }

  updateQuestCount();
}

/* =========================================================
   QUEST COUNTER
========================================================= */

function updateQuestCount() {
  const quests = document.querySelectorAll(".quest-item");

  const completed = document.querySelectorAll(".quest-item.completed").length;

  const total = quests.length;

  const questCount = document.getElementById("questCount");

  if (questCount) {
    questCount.textContent = `${completed} / ${total}`;
  }

  /* -----------------------------------------------
     ALL QUESTS COMPLETE
  ------------------------------------------------ */

  if (total > 0 && completed === total) {
    unlockFinalStar();
  }
}

/* =========================================================
   BIRTHDAY LETTER
========================================================= */

const letterContent = document.getElementById("letterContent");

const birthdayMessage = `Dear Jake,

Today marks another chapter.

Twenty-six years of memories,
lessons, challenges, dreams,
mistakes, victories,
and moments that made you
who you are today.

The journey wasn't always easy,
but every level brought
something worth learning.

And now...

LEVEL 26.

A new chapter begins.

There are still places to go,
things to build,
people to meet,
and dreams to chase.

The next part of the story
has not been written yet.

So keep moving.

Keep learning.

Keep creating.

And most importantly,
keep enjoying the journey.

Happy 26th Birthday.

Welcome to the next level.

— Jake`;

let letterStarted = false;

/* =========================================================
   TYPE LETTER
========================================================= */

function typeLetter() {
  if (!letterContent) {
    return;
  }

  /* Already finished */

  if (letterStarted) {
    return;
  }

  letterStarted = true;

  let index = 0;

  /* Make sure letter starts empty */

  letterContent.textContent = "";

  const timer = setInterval(() => {
    if (!letterContent) {
      clearInterval(timer);
      return;
    }

    letterContent.textContent += birthdayMessage.charAt(index);

    index++;

    /* -----------------------------------------------
       LETTER COMPLETE
    ------------------------------------------------ */

    if (index >= birthdayMessage.length) {
      clearInterval(timer);

      completeLetterQuest();
    }
  }, 25);
}

/* =========================================================
   COMPLETE LETTER QUEST
========================================================= */

function completeLetterQuest() {
  const quest = document.getElementById("letterQuest");

  if (!quest) {
    return;
  }

  quest.classList.add("completed");

  const check = quest.querySelector(".quest-check");

  if (check) {
    check.textContent = "✓";
  }

  const questText = quest.querySelector(".quest-text");

  if (questText) {
    questText.textContent = "READ THE BIRTHDAY LETTER";
  }

  updateQuestCount();
}

/* =========================================================
   BIRTHDAY CAKE
========================================================= */

const cake = document.querySelector(".cake");

const cakeArea = document.querySelector(".cake-area");

const cakeGlow = document.querySelector(".cake-glow");

const cakeFlames = document.querySelectorAll(".flame");

let cakeActivated = false;

/* =========================================================
   ACTIVATE CAKE
========================================================= */

function activateCake() {
  if (cakeActivated || !cake) {
    return;
  }

  cakeActivated = true;

  /* Cake animation */

  cake.classList.add("cake-celebrate");

  /* Cake area */

  if (cakeArea) {
    cakeArea.classList.add("wish-complete");
  }

  /* Extinguish flames */

  cakeFlames.forEach((flame) => {
    flame.classList.add("flame-out");
  });

  /* Glow */

  if (cakeGlow) {
    cakeGlow.classList.add("cake-celebration-glow");
  }

  /* Celebration */

  createCakeCelebration();

  /* Quest */

  completeCakeQuest();
}

/* =========================================================
   CAKE CLICK
========================================================= */

if (cake) {
  cake.addEventListener("click", activateCake);

  cake.setAttribute("tabindex", "0");

  cake.setAttribute("role", "button");

  cake.setAttribute("aria-label", "Make a birthday wish");

  cake.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      activateCake();
    }
  });
}

/* =========================================================
   CAKE CELEBRATION
========================================================= */

function createCakeCelebration() {
  if (!cakeArea) {
    return;
  }

  const symbols = ["✦", "✧", "★", "·"];

  for (let i = 0; i < 18; i++) {
    const spark = document.createElement("span");

    spark.classList.add("cake-celebration-spark");

    spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    spark.style.setProperty("--spark-x", `${Math.random() * 260 - 130}px`);

    spark.style.setProperty("--spark-y", `${Math.random() * 100 - 50}px`);

    spark.style.animationDelay = `${Math.random() * 0.25}s`;

    cakeArea.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 1800);
  }
}

/* =========================================================
   COMPLETE CAKE QUEST
========================================================= */

function completeCakeQuest() {
  const quest = document.getElementById("cakeQuest");

  if (!quest) {
    return;
  }

  quest.classList.add("completed");

  const check = quest.querySelector(".quest-check");

  if (check) {
    check.textContent = "✓";
  }

  const questText = quest.querySelector(".quest-text");

  if (questText) {
    questText.textContent = "MAKE A WISH";
  }

  updateCakeMessage();

  updateQuestCount();
}

/* =========================================================
   CAKE MESSAGE
========================================================= */

function updateCakeMessage() {
  if (!cakeArea) {
    return;
  }

  const message = cakeArea.querySelector(".cake-message");

  if (!message) {
    return;
  }

  message.textContent = "WISH COMPLETE • QUEST COMPLETE";
}

/* =========================================================
   FINAL SECRET STAR
========================================================= */

const hiddenStar = document.getElementById("hiddenStar");

const finalSecret = document.getElementById("finalSecret");

const finalClose = document.getElementById("finalClose");

let finalStarUnlocked = false;

/* =========================================================
   INITIAL STAR STATE
========================================================= */

if (hiddenStar) {
  hiddenStar.classList.add("locked");

  hiddenStar.setAttribute("aria-label", "Final secret locked");

  hiddenStar.setAttribute("title", "Complete all quests to unlock");
}

/* =========================================================
   UNLOCK FINAL STAR
========================================================= */

function unlockFinalStar() {
  if (finalStarUnlocked || !hiddenStar) {
    return;
  }

  finalStarUnlocked = true;

  hiddenStar.classList.remove("locked");

  hiddenStar.classList.add("unlocked");

  hiddenStar.setAttribute("aria-label", "Final secret unlocked");

  hiddenStar.setAttribute("title", "FINAL SECRET UNLOCKED");

  /* -----------------------------------------------
     FOOTER MESSAGE
  ------------------------------------------------ */

  const footer = document.querySelector(".world-footer span:last-child");

  if (footer) {
    footer.textContent = "★ FINAL SECRET UNLOCKED ★";
  }
}

/* =========================================================
   CLICK STAR
========================================================= */

if (hiddenStar) {
  hiddenStar.addEventListener("click", () => {
    if (!finalStarUnlocked) {
      return;
    }

    openFinalSecret();
  });

  /* Keyboard support */

  hiddenStar.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!finalStarUnlocked) {
        return;
      }

      openFinalSecret();
    }
  });
}

/* =========================================================
   OPEN FINAL SECRET
========================================================= */

function openFinalSecret() {
  if (!finalSecret || !finalStarUnlocked) {
    return;
  }

  /* -----------------------------------------------
     Star animation
  ------------------------------------------------ */

  if (hiddenStar) {
    hiddenStar.classList.add("star-unlocking");
  }

  /* -----------------------------------------------
     Open secret
  ------------------------------------------------ */

  setTimeout(() => {
    if (!finalSecret) {
      return;
    }

    finalSecret.classList.add("show");

    finalSecret.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  }, 500);
}

/* =========================================================
   CLOSE FINAL SECRET
========================================================= */

if (finalClose) {
  finalClose.addEventListener("click", () => {
    closeFinalSecret();
  });
}

function closeFinalSecret() {
  if (!finalSecret) {
    return;
  }

  finalSecret.classList.remove("show");

  finalSecret.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (hiddenStar) {
    hiddenStar.classList.remove("star-unlocking");

    hiddenStar.classList.add("unlocked");
  }
}

/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  /* -----------------------------------------------
       Close normal modals
    ------------------------------------------------ */

  allModals.forEach((modal) => {
    closeModal(modal);
  });

  /* -----------------------------------------------
       Stop journey reveal
    ------------------------------------------------ */

  if (journeyReveal) {
    journeyReveal.classList.remove("show");

    journeyReveal.classList.remove("ready");

    journeyReveal.classList.remove("flash");

    journeyReveal.classList.remove("level-26");

    journeyReveal.setAttribute("aria-hidden", "true");
  }

  /* -----------------------------------------------
       Stop typing
    ------------------------------------------------ */

  stopStoryTyping();

  /* -----------------------------------------------
       Reset journey transition
    ------------------------------------------------ */

  journeyTransitioning = false;

  /* -----------------------------------------------
       Close final secret
    ------------------------------------------------ */

  if (finalSecret && finalSecret.classList.contains("show")) {
    closeFinalSecret();
  }
});

/* =========================================================
   AUDIO FALLBACK
========================================================= */

const birthdayAudio = document.getElementById("birthdayAudio");

const audioError = document.getElementById("audioError");

if (birthdayAudio && audioError) {
  birthdayAudio.addEventListener("error", () => {
    birthdayAudio.style.display = "none";

    audioError.style.display = "block";
  });
}

/* =========================================================
   INITIALIZATION
========================================================= */

updateQuestCount();

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateQuestCount();
});
