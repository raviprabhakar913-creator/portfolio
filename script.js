/**
 * ============================================================================
 * JAVASCRIPT: Creative & Interactive Engine
 * Portfolio of Ravi Shankar — B.Tech CSE (Cybersecurity) @ SRMU
 * Features:
 *   1. Dynamic IST Clock Ticker
 *   2. Subtle Desktop Custom Cursor & Magnetic Hover States
 *   3. 3D Tilt Telemetry Interaction on Hero Terminal Card
 *   4. Interactive Optical Laser Security Simulator Widget (with Web Audio Synth)
 *   5. Scroll-Triggered Entrance Reveals (IntersectionObserver)
 *   6. Smart Navigation ScrollSpy & Transforming Header
 *   7. Dark / Light Theme Engine with LocalStorage Memory
 *   8. Mobile Navigation Drawer & Focus Management
 *   9. Email Clipboard Copy Engine with Tactile Feedback
 *  10. Defensive Client-Side Form Validation & Dispatch Simulation
 *  11. Floating Back-to-Top Button
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  initLiveClock();
  initCustomCursor();
  initHeroTiltInteraction();
  initInteractiveLaserSimulator();
  initScrollReveal();
  initScrollSpy();
  initThemeEngine();
  initMobileNavigation();
  initEmailClipboard();
  initContactFormValidation();
  initBackToTop();
  setFooterYear();
});

/**
 * ----------------------------------------------------------------------------
 * 1. REAL-TIME IST CLOCK TICKER
 * ----------------------------------------------------------------------------
 */
function initLiveClock() {
  const clockElement = document.getElementById("liveClock");
  if (!clockElement) return;

  const updateClock = () => {
    const now = new Date();
    // Format in IST (Indian Standard Time, UTC+5:30)
    const options = {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    try {
      const timeString = new Intl.DateTimeFormat("en-GB", options).format(now);
      clockElement.textContent = `${timeString} IST`;
    } catch (e) {
      // Fallback
      clockElement.textContent = now.toTimeString().split(" ")[0] + " IST";
    }
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * ----------------------------------------------------------------------------
 * 2. SUBTLE CUSTOM CURSOR & MAGNETIC HOVER STATES (Desktop Only)
 * ----------------------------------------------------------------------------
 */
function initCustomCursor() {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");

  // Only run if desktop pointer device
  if (!dot || !ring || window.matchMedia("(pointer: coarse)").matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderRing);
    }
  });

  // Smooth lerp for outer ring
  const renderRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    const diff = Math.abs(mouseX - ringX) + Math.abs(mouseY - ringY);
    if (diff > 0.1) {
      requestAnimationFrame(renderRing);
    } else {
      isMoving = false;
    }
  };

  // Expand ring on interactive elements
  const interactiveSelectors = 'a, button, input, textarea, .bento-card, .matrix-card, .project-spotlight-card';
  document.querySelectorAll(interactiveSelectors).forEach((elem) => {
    elem.addEventListener("mouseenter", () => ring.classList.add("cursor-active"));
    elem.addEventListener("mouseleave", () => ring.classList.remove("cursor-active"));
  });
}

/**
 * ----------------------------------------------------------------------------
 * 3. 3D TILT TELEMETRY ON HERO TERMINAL CARD
 * ----------------------------------------------------------------------------
 */
function initHeroTiltInteraction() {
  const card = document.getElementById("heroInteractiveCard");
  if (!card || window.matchMedia("(pointer: coarse)").matches) return;

  const handleMouseMove = (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  card.addEventListener("mousemove", handleMouseMove);
  card.addEventListener("mouseleave", handleMouseLeave);
}

/**
 * ----------------------------------------------------------------------------
 * 4. INTERACTIVE LASER BENCH SIMULATOR WIDGET (With Web Audio Sound Pulse)
 * ----------------------------------------------------------------------------
 */
function initInteractiveLaserSimulator() {
  const stage = document.getElementById("interactiveBeamStage");
  const triggerBtn = document.getElementById("toggleLaserObstructionBtn");
  const telemetry = document.getElementById("benchTelemetry");
  const btnIcon = document.getElementById("obstructionBtnIcon");
  const btnLabel = document.getElementById("obstructionBtnLabel");

  if (!stage || !triggerBtn) return;

  let isObstructed = false;
  let audioCtx = null;

  // Synthesize a brief 2.4kHz piezoelectric tone using Web Audio API
  const playPiezoAlarmClick = () => {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      if (audioCtx) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(2400, audioCtx.currentTime); // 2.4 kHz piezo buzzer freq

        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
      }
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  triggerBtn.addEventListener("click", () => {
    isObstructed = !isObstructed;

    if (isObstructed) {
      stage.classList.add("obstructed");
      if (btnIcon) btnIcon.textContent = "🔓";
      if (btnLabel) btnLabel.textContent = "RESET PERIMETER (CLEAR BEAM)";
      if (telemetry) {
        telemetry.innerHTML = 'STATE: <span class="state-alarm">ALERT: BEAM BREACHED &bull; BC547 SATURATED</span>';
      }
      playPiezoAlarmClick();
    } else {
      stage.classList.remove("obstructed");
      if (btnIcon) btnIcon.textContent = "✋";
      if (btnLabel) btnLabel.textContent = "CLICK TO BLOCK BEAM (TEST ALARM)";
      if (telemetry) {
        telemetry.innerHTML = 'STATE: <span class="state-ok">BEAM CONTINUOUS &bull; PERIMETER SECURE</span>';
      }
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 5. SCROLL-TRIGGERED ENTRANCE REVEALS (IntersectionObserver)
 * ----------------------------------------------------------------------------
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length) return;

  // Immediate reveal for elements already in viewport on load
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -80px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    // Add micro-stagger for elements sharing same parent
    const delay = (index % 3) * 0.1;
    el.style.transitionDelay = `${delay}s`;
    observer.observe(el);
  });
}

/**
 * ----------------------------------------------------------------------------
 * 6. SCROLLSPY & SMART NAVIGATION INDICATOR
 * ----------------------------------------------------------------------------
 */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const siteHeader = document.getElementById("siteHeader");

  if (!sections.length) return;

  // Header shrink on scroll
  window.addEventListener("scroll", () => {
    if (siteHeader) {
      if (window.scrollY > 40) {
        siteHeader.style.boxShadow = "var(--shadow-subtle)";
      } else {
        siteHeader.style.boxShadow = "none";
      }
    }
  });

  const spyOptions = {
    root: null,
    rootMargin: "-25% 0px -55% 0px",
    threshold: 0,
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, spyOptions);

  sections.forEach((sec) => spyObserver.observe(sec));
}

/**
 * ----------------------------------------------------------------------------
 * 7. THEME ENGINE (Dark / Light with LocalStorage)
 * ----------------------------------------------------------------------------
 */
function initThemeEngine() {
  const themeBtn = document.getElementById("themeToggleBtn");
  const htmlRoot = document.documentElement;

  // Default to dark theme unless user selected otherwise
  const storedTheme = localStorage.getItem("portfolio-theme") || "dark";
  htmlRoot.setAttribute("data-theme", storedTheme);

  if (!themeBtn) return;

  themeBtn.addEventListener("click", () => {
    const currentTheme = htmlRoot.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    htmlRoot.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });
}

/**
 * ----------------------------------------------------------------------------
 * 8. MOBILE NAVIGATION DRAWER
 * ----------------------------------------------------------------------------
 */
function initMobileNavigation() {
  const trigger = document.getElementById("mobileMenuTrigger");
  const drawer = document.getElementById("mobileDrawer");
  const drawerLinks = document.querySelectorAll("[data-nav-target]");

  if (!trigger || !drawer) return;

  const toggleDrawer = () => {
    const isActive = trigger.classList.toggle("active");
    drawer.classList.toggle("active");
    trigger.setAttribute("aria-expanded", String(isActive));
    drawer.setAttribute("aria-hidden", String(!isActive));
    document.body.style.overflow = isActive ? "hidden" : "";
  };

  const closeDrawer = () => {
    trigger.classList.remove("active");
    drawer.classList.remove("active");
    trigger.setAttribute("aria-expanded", "false");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  trigger.addEventListener("click", toggleDrawer);

  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

/**
 * ----------------------------------------------------------------------------
 * 9. EMAIL CLIPBOARD COPY ENGINE
 * ----------------------------------------------------------------------------
 */
function initEmailClipboard() {
  const copyBtn = document.getElementById("copyEmailActionBtn");
  const copyFeedback = document.getElementById("copyFeedbackMessage");
  const btnText = document.getElementById("copyBtnText");

  if (!copyBtn) return;

  const targetEmail = copyBtn.getAttribute("data-email") || "raviprabhakar913@gmail.com";

  copyBtn.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetEmail);
      } else {
        const input = document.createElement("input");
        input.value = targetEmail;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }

      if (btnText) btnText.textContent = "✓ Email Copied to Clipboard!";
      if (copyFeedback) copyFeedback.textContent = `Address ${targetEmail} is ready to paste.`;
      copyBtn.style.borderColor = "var(--accent-emerald)";

      setTimeout(() => {
        if (btnText) btnText.textContent = "Copy Email to Clipboard";
        if (copyFeedback) copyFeedback.textContent = "";
        copyBtn.style.borderColor = "";
      }, 3500);
    } catch (err) {
      if (copyFeedback) {
        copyFeedback.textContent = `Please copy manually: ${targetEmail}`;
        copyFeedback.style.color = "var(--accent-crimson)";
      }
    }
  });
}

/**
 * ----------------------------------------------------------------------------
 * 10. DEFENSIVE FORM VALIDATION & DISPATCH SIMULATION
 * ----------------------------------------------------------------------------
 */
function initContactFormValidation() {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("userName");
  const emailInput = document.getElementById("userEmail");
  const messageInput = document.getElementById("userMessage");
  const submitBtn = document.getElementById("submitFormBtn");
  const toast = document.getElementById("dispatchToast");

  if (!form || !nameInput || !emailInput || !messageInput) return;

  const nameError = document.getElementById("nameErrorHint");
  const emailError = document.getElementById("emailErrorHint");
  const messageError = document.getElementById("messageErrorHint");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setFieldError = (input, hint, msg) => {
    input.classList.add("has-error");
    if (hint) hint.textContent = msg;
  };

  const clearFieldError = (input, hint) => {
    input.classList.remove("has-error");
    if (hint) hint.textContent = "";
  };

  nameInput.addEventListener("input", () => clearFieldError(nameInput, nameError));
  emailInput.addEventListener("input", () => clearFieldError(emailInput, emailError));
  messageInput.addEventListener("input", () => clearFieldError(messageInput, messageError));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setFieldError(nameInput, nameError, "Operator name is required.");
      isValid = false;
    } else {
      clearFieldError(nameInput, nameError);
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      setFieldError(emailInput, emailError, "Return communication email is required.");
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      setFieldError(emailInput, emailError, "Please provide a valid email format.");
      isValid = false;
    } else {
      clearFieldError(emailInput, emailError);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setFieldError(messageInput, messageError, "Please enter your message context.");
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      setFieldError(messageInput, messageError, "Transmission requires at least 10 characters.");
      isValid = false;
    } else {
      clearFieldError(messageInput, messageError);
    }

    if (!isValid) return;

    // Simulate encrypted dispatch
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "<span>Encrypting &amp; Transmitting...</span>";

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (toast) {
        toast.className = "dispatch-toast success";
        toast.textContent = `Transmission prepared for Ravi Shankar (raviprabhakar913@gmail.com). Thank you, ${nameInput.value.trim()}!`;

        form.reset();

        setTimeout(() => {
          toast.className = "dispatch-toast";
          toast.textContent = "";
        }, 7000);
      }
    }, 1200);
  });
}

/**
 * ----------------------------------------------------------------------------
 * 11. FLOATING BACK TO TOP BUTTON
 * ----------------------------------------------------------------------------
 */
function initBackToTop() {
  const topBtn = document.getElementById("floatingTopBtn");
  if (!topBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      topBtn.classList.add("is-active");
    } else {
      topBtn.classList.remove("is-active");
    }
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/**
 * ----------------------------------------------------------------------------
 * 12. FOOTER COPYRIGHT YEAR
 * ----------------------------------------------------------------------------
 */
function setFooterYear() {
  const yearEl = document.getElementById("footerYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
