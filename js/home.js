/* =========================================================
   LUMIÈRE HOME JAVASCRIPT
   LEVEL 26 — INTERACTIVE BIRTHDAY WORLD
   FINAL SECRET STAR SYSTEM
========================================================= */

/* =========================================================
   GUIDE MASCOT
   
========================================================= */

const mascotBubble = document.getElementById("mascotBubble");

const mascotText = document.getElementById("mascotText");

const mascotOrb = document.getElementById("mascotOrb");

const idleTips = [
  "TRY CLICKING THE CAKE...",
  "THERE'S A LETTER WAITING FOR YOU.",
  "MUSIC MIGHT HELP THE MOOD.",
  "SOMETHING'S HIDDEN NEARBY...",
  "EVERY QUEST TELLS A STORY.",
  "26 LEVELS DOWN. MANY MORE TO GO.",
];

let idleTipIndex = 0;

let mascotHideTimer = null;

let mascotIdleTimer = null;

/*
 * Show a specific message in the speech bubble for
 * roughly `duration` ms, then automatically schedule
 * the next idle tip after it hides.
 */

function showMascotTip(text, duration = 6000) {
  if (!mascotBubble || !mascotText) {
    return;
  }

  mascotText.textContent = text;

  mascotBubble.classList.add("show");

  if (mascotHideTimer) {
    clearTimeout(mascotHideTimer);
  }

  mascotHideTimer = setTimeout(() => {
    mascotBubble.classList.remove("show");
  }, duration);

  scheduleNextIdleTip(duration + 3000);
}

/*
 * Queue up the next idle tip after a delay.
 */

function scheduleNextIdleTip(delay = 9000) {
  if (mascotIdleTimer) {
    clearTimeout(mascotIdleTimer);
  }

  mascotIdleTimer = setTimeout(showNextIdleTip, delay);
}

/*
 * Show the next tip in the idle rotation.
 */

function showNextIdleTip() {
  showMascotTip(idleTips[idleTipIndex], 6000);

  idleTipIndex = (idleTipIndex + 1) % idleTips.length;
}

/*
 * Tapping the orb skips straight to the next tip.
 */

if (mascotOrb) {
  mascotOrb.addEventListener("click", () => {
    showNextIdleTip();
  });
}

/*
 * Kick things off with a welcome message shortly
 * after the page loads (giving the entrance
 * transition time to finish first).
 */

setTimeout(() => {
  showMascotTip("WELCOME BACK, JAKE...", 5000);
}, 1600);

/* =========================================================
   IMPACT EFFECT
   =========================================================
   A quick full-screen flash paired with a brief shake
   of the whole page — used on big moments for extra
   punch (making the wish, opening the final secret).
========================================================= */

const impactFlash = document.getElementById("impactFlash");

function triggerImpact() {
  document.body.classList.remove("screen-shake");

  void document.body.offsetWidth;

  document.body.classList.add("screen-shake");

  if (impactFlash) {
    impactFlash.classList.remove("flash");

    void impactFlash.offsetWidth;

    impactFlash.classList.add("flash");
  }

  setTimeout(() => {
    document.body.classList.remove("screen-shake");
  }, 500);
}

/* =========================================================
   KONAMI CODE EASTER EGG
   =========================================================
   The classic ↑↑↓↓←→←→BA sequence. On success: a big
   celebratory banner, a shower of falling coins, the
   mascot chiming in, and the existing impact effect.
========================================================= */

const konamiSequenceKeyboard = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

/*
 * Touch equivalent: swipe up, up, down, down, left,
 * right, left, right, then two taps (standing in for
 * B and A, since a touchscreen has no B/A buttons).
 */

const konamiSequenceTouch = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "tap",
  "tap",
];

let konamiBuffer = [];

let konamiActive = false;

const konamiBanner = document.getElementById("konamiBanner");

const konamiRain = document.getElementById("konamiRain");

/*
 * Push a gesture/key into the shared buffer and check
 * it against both the keyboard and touch sequences.
 */

function registerKonamiInput(input) {
  const maxLength = Math.max(
    konamiSequenceKeyboard.length,
    konamiSequenceTouch.length,
  );

  konamiBuffer.push(input);

  if (konamiBuffer.length > maxLength) {
    konamiBuffer.shift();
  }

  const matchesSequence = (sequence) => {
    if (konamiBuffer.length < sequence.length) {
      return false;
    }

    const tail = konamiBuffer.slice(konamiBuffer.length - sequence.length);

    return tail.every((value, i) => value === sequence[i]);
  };

  if (
    matchesSequence(konamiSequenceKeyboard) ||
    matchesSequence(konamiSequenceTouch)
  ) {
    konamiBuffer = [];

    triggerKonamiCode();
  }
}

document.addEventListener("keydown", (event) => {
  registerKonamiInput(event.key.toLowerCase());
});

/* =========================================================
   TOUCH / SWIPE DETECTION
   =========================================================
   Tracks touch start/end position to classify each touch
   as a swipe (up/down/left/right) or a tap, feeding the
   same buffer used for the keyboard sequence above.
========================================================= */

let konamiTouchStartX = 0;

let konamiTouchStartY = 0;

let konamiTouchStartTime = 0;

const KONAMI_SWIPE_THRESHOLD = 35;

const KONAMI_TAP_MAX_DISTANCE = 15;

const KONAMI_TAP_MAX_DURATION = 300;

document.addEventListener(
  "touchstart",
  (event) => {
    if (!event.touches || event.touches.length !== 1) {
      return;
    }

    konamiTouchStartX = event.touches[0].clientX;

    konamiTouchStartY = event.touches[0].clientY;

    konamiTouchStartTime = Date.now();
  },
  { passive: true },
);

document.addEventListener(
  "touchend",
  (event) => {
    if (!event.changedTouches || event.changedTouches.length !== 1) {
      return;
    }

    const endX = event.changedTouches[0].clientX;

    const endY = event.changedTouches[0].clientY;

    const deltaX = endX - konamiTouchStartX;

    const deltaY = endY - konamiTouchStartY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const duration = Date.now() - konamiTouchStartTime;

    /*
     * Small, quick movement — treat as a tap
     * (this is what stands in for B and A).
     */

    if (
      distance <= KONAMI_TAP_MAX_DISTANCE &&
      duration <= KONAMI_TAP_MAX_DURATION
    ) {
      registerKonamiInput("tap");

      return;
    }

    /*
     * Otherwise, classify as a swipe in whichever
     * direction had the larger movement, as long as
     * it clears the swipe threshold.
     */

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < KONAMI_SWIPE_THRESHOLD) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      registerKonamiInput(deltaX > 0 ? "arrowright" : "arrowleft");
    } else {
      registerKonamiInput(deltaY > 0 ? "arrowdown" : "arrowup");
    }
  },
  { passive: true },
);

/*
 * Spawn a single falling coin/sparkle at a random
 * horizontal position, removing itself once it's
 * fallen off screen.
 */

function spawnKonamiRainItem() {
  if (!konamiRain) {
    return;
  }

  const symbols = ["🪙", "✦", "✧", "💎"];

  const item = document.createElement("span");

  item.classList.add("konami-rain-item");

  item.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  item.style.left = Math.random() * 100 + "%";

  const duration = 2.5 + Math.random() * 2;

  item.style.animationDuration = `${duration}s`;

  konamiRain.appendChild(item);

  setTimeout(
    () => {
      item.remove();
    },
    duration * 1000 + 200,
  );
}

/*
 * Trigger the full easter-egg celebration.
 */

function triggerKonamiCode() {
  if (konamiActive) {
    return;
  }

  konamiActive = true;

  /* Big impact — flash + shake */

  triggerImpact();

  /* Banner */

  if (konamiBanner) {
    konamiBanner.classList.remove("show");

    void konamiBanner.offsetWidth;

    konamiBanner.classList.add("show");

    konamiBanner.setAttribute("aria-hidden", "false");
  }

  /* Mascot reaction */

  showMascotTip("OOOH, A SECRET CODE!", 4000);

  /* Coin rain — spawn steadily for ~2.5s */

  let rainCount = 0;

  const rainInterval = setInterval(() => {
    spawnKonamiRainItem();

    rainCount++;

    if (rainCount >= 30) {
      clearInterval(rainInterval);
    }
  }, 80);

  /* Reset so it can be triggered again later */

  setTimeout(() => {
    konamiActive = false;

    if (konamiBanner) {
      konamiBanner.setAttribute("aria-hidden", "true");
    }
  }, 3200);
}

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
        playLetterIntro();
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

  showMascotTip("WHAT A JOURNEY!", 4000);

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

const letterCursorEl = document.getElementById("letterCursor");

const letterIntro = document.getElementById("letterIntro");

const letterIntroLabel = document.getElementById("letterIntroLabel");

const birthdayMessage = `Wow.

This is weird.

Writing a letter to myself,
who's basically ancient now.

26? Whoa.

I hope you're still good-looking.

I hope you haven't become boring,
like somehow you got left behind by time.

Please tell me that's not you.

Okay, enough.

Hi.

It's me.
Or… you from six years ago.

I'm 20 right now,
and honestly, I still don't have everything figured out.

I thought maybe by 26,
you'd finally have all the answers.

But if you don't, that's okay.

I just wanted to tell you something.

Thank you.

Thank you for still being here.

For getting up on the mornings
when it was hard to.

For carrying the things
you couldn't explain to anyone.

I know you've had quiet battles.
Battles nobody else could see.

And I don't know what the next six years
will bring you.

I don't know how many things will change,
how many dreams will stay,
or how many you'll have to let go of.

But I hope you kept going.

I hope you kept fighting for us,
even when it felt pointless.

Because right now, at 20,
I'm still dreaming.

I'm still hoping that someday
we'll become someone we're proud of.

So if you're reading this now,
I hope you know—

I'm proud of you.

Not because you figured everything out.

But because you made it this far.

So happy birthday, future me.

Keep going.

Keep fighting.

And whatever happens,
I hope you never forget the dreams,
the hopes, and the person
you used to be.

I'm proud of you.

— Jake, 20

And one more thing...

Don't forget me.
`;

let letterStarted = false;

/* =========================================================
   PLAY LETTER INTRO
   =========================================================
========================================================= */

function playLetterIntro() {
  /* Already played before — just make sure the
     finished letter is visible, no need to replay. */

  if (letterStarted) {
    if (letterIntro) {
      letterIntro.classList.add("show", "decoded");
    }

    if (letterIntroLabel) {
      letterIntroLabel.textContent = "OLD MEMORY FILE DECODED SUCCESSFULLY";
    }

    if (letterContent) {
      letterContent.classList.add("visible");
    }

    if (letterCursorEl) {
      letterCursorEl.classList.add("visible");
    }

    return;
  }

  if (!letterIntro) {
    typeLetter();

    return;
  }

  letterIntro.classList.add("show");

  setTimeout(() => {
    /* Settle into the "decoded" confirmation state —
       stays visible as a small header above the letter. */

    letterIntro.classList.add("decoded");

    if (letterIntroLabel) {
      letterIntroLabel.textContent = "OLD MEMORY FILE DECODED SUCCESSFULLY";
    }

    setTimeout(() => {
      if (letterContent) {
        letterContent.classList.add("visible");
      }

      if (letterCursorEl) {
        letterCursorEl.classList.add("visible");
      }

      typeLetter();
    }, 700);
  }, 1800);
}

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

  showMascotTip("THAT LETTER THOUGH...", 4000);

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

  /* Impact effect */

  triggerImpact();

  /* Mascot reaction */

  showMascotTip("NICE WISH!", 4000);

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

const secretToast = document.getElementById("secretToast");

let finalStarUnlocked = false;

let secretToastTimer = null;

/* =========================================================
   SHOW SECRET TOAST
========================================================= */

function showSecretToast() {
  if (!secretToast) {
    return;
  }

  /*
   * Clear any previous auto-hide timer so repeat
   * triggers don't cut the toast off early.
   */

  if (secretToastTimer) {
    clearTimeout(secretToastTimer);

    secretToastTimer = null;
  }

  secretToast.classList.add("show");

  secretToastTimer = setTimeout(() => {
    hideSecretToast();
  }, 4500);
}

/* =========================================================
   HIDE SECRET TOAST
========================================================= */

function hideSecretToast() {
  if (!secretToast) {
    return;
  }

  secretToast.classList.remove("show");

  if (secretToastTimer) {
    clearTimeout(secretToastTimer);

    secretToastTimer = null;
  }
}

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

  /* -----------------------------------------------
     TOAST NOTIFICATION
  ------------------------------------------------ */

  showSecretToast();

  /* -----------------------------------------------
     MASCOT REACTION
  ------------------------------------------------ */

  showMascotTip("PSST... FIND THE STAR.", 5000);
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
   TOAST CLICK TO DISMISS
========================================================= */

if (secretToast) {
  secretToast.addEventListener("click", () => {
    hideSecretToast();
  });
}

/* =========================================================
   OPEN FINAL SECRET
========================================================= */

function openFinalSecret() {
  if (!finalSecret || !finalStarUnlocked) {
    return;
  }

  /* Dismiss the toast once they've found the star */

  hideSecretToast();

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

    triggerImpact();
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
