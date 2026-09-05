/* ==================================================
   LUMIÈRE — LEVEL 26
   MAIN JAVASCRIPT
================================================== */

/* ==================================================
   INTRO ELEMENTS
================================================== */

const introScreen = document.getElementById("introScreen");

const ambientGlow = document.getElementById("ambientGlow");

const lightSource = document.getElementById("lightSource");

const lightHalo = document.querySelector(".light-halo");

const introContent = document.querySelector(".intro-content");

const introStars = document.getElementById("introStars");

const lightStatus = document.getElementById("lightStatus");

const lightPercent = document.getElementById("lightPercent");

const introProgressFill = document.querySelector(".intro-progress-fill");

/* ==================================================
   INTRO VARIABLES
================================================== */

let lightProgress = 0;

let lightInterval = null;

let introFinished = false;

const lightMessages = [
  "AWAKENING THE LIGHT...",

  "GATHERING THE SPARK...",

  "THE LIGHT IS GROWING...",

  "ILLUMINATING THE WORLD...",

  "ALMOST THERE...",

  "LUMIÈRE IS READY.",
];

/* ==================================================
   INTRO TIPS
================================================== */

const introTipEl = document.getElementById("introTip");

const introTips = [
  "TIP: THE CAKE GRANTS WISHES.",

  "FUN FACT: LEVEL 26 HIDES A SECRET.",

  "REMEMBER TO CHECK YOUR QUESTS.",

  "LOADING 26 YEARS OF MEMORIES...",

  "TIP: NOT ALL STARS ARE IN THE SKY.",

  "HINT: MUSIC MAKES EVERYTHING BETTER.",
];

let introTipIndex = 0;

let introTipInterval = null;

/*
 * Show the next tip, fading the old one out first.
 */

function showNextIntroTip() {
  if (!introTipEl) {
    return;
  }

  introTipEl.classList.remove("show");

  setTimeout(() => {
    introTipEl.textContent = introTips[introTipIndex];

    introTipIndex = (introTipIndex + 1) % introTips.length;

    introTipEl.classList.add("show");
  }, 300);
}

/*
 * Start rotating tips every ~1.8s while the
 * light animation plays.
 */

function startIntroTips() {
  if (!introTipEl) {
    return;
  }

  showNextIntroTip();

  introTipInterval = setInterval(showNextIntroTip, 1800);
}

/*
 * Stop rotating tips once the intro finishes.
 */

function stopIntroTips() {
  if (introTipInterval) {
    clearInterval(introTipInterval);

    introTipInterval = null;
  }
}

/* ==================================================
   LOGIN ELEMENTS
================================================== */

const loginScreen = document.getElementById("loginScreen");

const playerName = document.getElementById("playerName");

const accessCode = document.getElementById("accessCode");

const startButton = document.getElementById("startButton");

const errorMessage = document.getElementById("errorMessage");

/* ==================================================
   LEVEL REVEAL
================================================== */

const levelReveal = document.getElementById("levelReveal");

const continueButton = document.getElementById("continueButton");

const pageTransition = document.getElementById("pageTransition");



const CREDENTIAL_HASH =
  "0c3878574077f24aa13c6aa2b6d2e3db861e32292581c0438e6cdb181c8aaca4";

/*
 * Hash a string with SHA-256 using the browser's
 * built-in Web Crypto API and return it as a lowercase
 * hex string.
 */

async function sha256Hex(text) {
  const encoder = new TextEncoder();

  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/* ==================================================
   INTRO START
================================================== */

function startIntro() {
  if (introContent) {
    setTimeout(() => {
      introContent.style.opacity = "1";

      introContent.style.transform = "translateY(0)";
    }, 300);
  }

  startLightAnimation();

  startIntroTips();
}

/* ==================================================
   LIGHT ANIMATION
================================================== */

function startLightAnimation() {
  if (
    !introScreen ||
    !ambientGlow ||
    !lightHalo ||
    !lightStatus ||
    !lightPercent
  ) {
    showLoginScreen();

    return;
  }

  lightInterval = setInterval(() => {
    /*
     * Slowly increase light.
     */

    lightProgress += Math.floor(Math.random() * 3) + 1;

    /*
     * Prevent going above 100.
     */

    if (lightProgress >= 100) {
      lightProgress = 100;
    }

    /*
     * Update percentage.
     */

    lightPercent.textContent = lightProgress + "%";

    /*
     * Update progress bar.
     */

    if (introProgressFill) {
      introProgressFill.style.width = lightProgress + "%";
    }

    /* ==================================================
               LIGHT INTENSITY
            ================================================== */

    const glowSize = 300 + lightProgress * 5;

    const haloSize = 80 + lightProgress * 3;

    const glowOpacity = 0.08 + (lightProgress / 100) * 0.35;

    const haloOpacity = 0.15 + (lightProgress / 100) * 0.85;

    /*
     * Ambient glow.
     */

    ambientGlow.style.width = glowSize + "px";

    ambientGlow.style.height = glowSize + "px";

    ambientGlow.style.opacity = glowOpacity;

    /*
     * Halo.
     */

    lightHalo.style.width = haloSize + "px";

    lightHalo.style.height = haloSize + "px";

    lightHalo.style.opacity = haloOpacity;

    /* ==================================================
               STATUS MESSAGES
            ================================================== */

    if (lightProgress < 20) {
      lightStatus.textContent = lightMessages[0];
    } else if (lightProgress < 40) {
      lightStatus.textContent = lightMessages[1];
    } else if (lightProgress < 60) {
      lightStatus.textContent = lightMessages[2];
    } else if (lightProgress < 80) {
      lightStatus.textContent = lightMessages[3];
    } else if (lightProgress < 95) {
      lightStatus.textContent = lightMessages[4];
    } else {
      lightStatus.textContent = lightMessages[5];
    }

    /* ==================================================
               STARS
            ================================================== */

    if (lightProgress >= 40 && introStars) {
      introStars.style.opacity = "1";

      const stars = introStars.querySelectorAll("span");

      stars.forEach((star, index) => {
        setTimeout(() => {
          star.style.opacity = "0.8";
        }, index * 100);
      });
    }

    /* ==================================================
               TITLE GLOW
            ================================================== */

    if (lightProgress >= 60) {
      const introTitle = document.querySelector(".intro-title");

      if (introTitle) {
        introTitle.style.textShadow =
          "0 0 10px #ffffff, 0 0 30px #dcb4ff, 0 0 70px rgba(183,125,255,.8)";
      }
    }

    /* ==================================================
               COMPLETE
            ================================================== */

    if (lightProgress >= 100) {
      finishIntro();
    }
  }, 130);
}

/* ==================================================
   FINISH INTRO
================================================== */

function finishIntro() {
  if (introFinished) {
    return;
  }

  introFinished = true;

  clearInterval(lightInterval);

  lightInterval = null;

  stopIntroTips();

  if (lightPercent) {
    lightPercent.textContent = "100%";
  }

  if (lightStatus) {
    lightStatus.textContent = "LUMIÈRE IS READY.";
  }

  if (introProgressFill) {
    introProgressFill.style.width = "100%";
  }

  /*
   * Bright flash.
   */

  if (introScreen) {
    introScreen.style.background = "#f4efff";
  }

  /*
   * Hide intro.
   */

  setTimeout(() => {
    if (introScreen) {
      introScreen.classList.add("hide");
    }

    showLoginScreen();
  }, 600);
}

/* ==================================================
   SHOW LOGIN
================================================== */

function showLoginScreen() {
  if (!loginScreen) {
    return;
  }

  loginScreen.classList.add("show");

  /*
   * Focus player name.
   */

  setTimeout(() => {
    if (playerName) {
      playerName.focus();
    }
  }, 700);
}

/* ==================================================
   LOGIN BUTTON
================================================== */

if (startButton) {
  startButton.addEventListener("click", startGame);
}

/* ==================================================
   ENTER KEY
================================================== */

if (playerName) {
  playerName.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (accessCode) {
        accessCode.focus();
      }
    }
  });
}

if (accessCode) {
  accessCode.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });
}

/* ==================================================
   LOGIN FUNCTION
================================================== */

async function startGame() {
  if (!playerName || !accessCode || !startButton || !errorMessage) {
    return;
  }

  const name = playerName.value.trim().toUpperCase();

  const code = accessCode.value.trim();

  /*
   * Clear previous error.
   */

  errorMessage.textContent = "";

 

  startButton.disabled = true;

  const attemptHash = await sha256Hex(`${name}:${code}`);

  /* ==================================================
       CORRECT LOGIN
    ================================================== */

  if (attemptHash === CREDENTIAL_HASH) {
    /*
     * Update button.
     */

    startButton.innerHTML = `
            <span class="button-icon">✓</span>
            <span>ACCESS GRANTED</span>
            <span class="button-arrow">→</span>
        `;

    /*
     * Small delay before
     * level reveal.
     */

    setTimeout(() => {
      showLevelReveal();
    }, 800);
  } else {
    /* ==================================================
       WRONG LOGIN
    ================================================== */
    errorMessage.textContent = "ACCESS DENIED... CHECK PLAYER NAME OR CODE.";

    shakeLogin();

    /*
     * Re-enable button for another attempt.
     */

    startButton.disabled = false;

    /*
     * Clear code for another attempt.
     */

    if (accessCode) {
      accessCode.value = "";

      accessCode.focus();
    }
  }
}

/* ==================================================
   LOGIN SHAKE
================================================== */

function shakeLogin() {
  const loginBox = document.querySelector(".login-box");

  if (!loginBox) {
    return;
  }

  loginBox.animate(
    [
      {
        transform: "translateX(0)",
      },

      {
        transform: "translateX(-8px)",
      },

      {
        transform: "translateX(8px)",
      },

      {
        transform: "translateX(-6px)",
      },

      {
        transform: "translateX(6px)",
      },

      {
        transform: "translateX(0)",
      },
    ],

    {
      duration: 350,
      easing: "ease-in-out",
    },
  );
}

/* ==================================================
   SHOW LEVEL REVEAL
================================================== */

function showLevelReveal() {
  /*
   * Hide login.
   */

  if (loginScreen) {
    loginScreen.classList.remove("show");
  }

  /*
   * Show reveal.
   */

  if (levelReveal) {
    levelReveal.classList.add("show");
  }

  /*
   * Count the level number up from 0.
   */

  animateLevelCountUp();
}

/* ==================================================
   LEVEL NUMBER COUNT-UP
   ==================================================
================================================== */

function animateLevelCountUp() {
  const levelNumberEl = document.querySelector(".level-number");

  if (!levelNumberEl) {
    return;
  }

  const target = parseInt(levelNumberEl.textContent.trim(), 10);

  if (Number.isNaN(target)) {
    return;
  }

 
  const startDelay = 650;

  const duration = 900;



  levelNumberEl.textContent = "0";

  setTimeout(() => {
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;

      const progress = Math.min(elapsed / duration, 1);

      /*
       * Ease-out so it starts fast and
       * settles gently on the final number.
       */

      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(eased * target);

      levelNumberEl.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        levelNumberEl.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }, startDelay);
}

/* ==================================================
   CONTINUE TO HOME
================================================== */

if (continueButton) {
  continueButton.addEventListener("click", () => {
    continueButton.disabled = true;

    continueButton.innerHTML = `
                <span>ENTERING WORLD...</span>
                <strong>→</strong>
            `;


    if (pageTransition) {
      pageTransition.classList.add("active");

      pageTransition.setAttribute("aria-hidden", "false");

      setTimeout(() => {
        window.location.href = "home.html";
      }, 1100);
    } else {
      /*
       * Fallback in case the overlay
       * element isn't present.
       */

      setTimeout(() => {
        window.location.href = "home.html";
      }, 500);
    }
  });
}

/* ==================================================
   ESC KEY
================================================== */

document.addEventListener("keydown", (event) => {
  /*
   * Do not allow ESC to skip
   * the access sequence.
   */

  if (event.key === "Escape") {
    return;
  }
});

/* ==================================================
   START
================================================== */

document.addEventListener("DOMContentLoaded", () => {
  startIntro();
});
