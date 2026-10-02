// FORCE SCROLL TO TOP ON REFRESH
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('onbeforeunload', function () {
  window.scrollTo(0, 0);
});

window.addEventListener('load', function () {
  window.scrollTo(0, 0);
  // Double check after a frame
  requestAnimationFrame(() => window.scrollTo(0, 0));
});

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* VIEW PROJECTS SMOOTH SCROLL */
const viewProjectsBtn = document.querySelector('a[href="#projects"]');
if (viewProjectsBtn) {
  viewProjectsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    gsap.to(window, {
      duration: 0.8, // Fast scroll
      scrollTo: "#projects",
      ease: "power2.inOut"
    });
  });
}


// Remove Theme Toggle (Enforce Dark Mode)
const toggleBtn = document.getElementById("theme-toggle");
if (toggleBtn) toggleBtn.style.display = "none";

/* TERMINAL TYPING EFFECT */
const terminalLines = [
  "Wait...",
  "Initializing Secure Connection...",
  "Access Granted.",
  "Welcome, Guest."
];

let line = 0, char = 0;
const typed = document.getElementById("typed-text");

function type() {
  if (line < terminalLines.length) {
    if (char < terminalLines[line].length) {
      typed.textContent += terminalLines[line][char++];
      setTimeout(type, 70);
    } else {
      setTimeout(() => {
        if (line < terminalLines.length - 1) {
          typed.textContent = "";
          char = 0;
          line++;
          type();
        }
      }, 1500);
    }
  }
}
type();

/* PARALLAX BACKGROUND - SLOW MOVE */
gsap.to(".bg-blob", {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 2
  },
  y: 300,
  scale: 1.1,
  rotation: 45
});

/* HERO ANIMATIONS - SLOW & FLUID */
const heroTl = gsap.timeline();
heroTl.from(".terminal > *", {
  opacity: 0,
  y: 50,
  stagger: 0.3,
  duration: 2.5,
  ease: "power3.out"
})
  .from(".hero-image-container", {
    opacity: 0,
    scale: 0.8,
    rotation: 5,
    duration: 2.5,
    ease: "power2.out"
  }, "-=2");

/* SECTION ANIMATIONS (SLOW REVERSABLE) */
const sections = document.querySelectorAll("section:not(#hero)");

sections.forEach(section => {
  // Animate headings
  let heading = section.querySelector("h2");
  if (heading) {
    gsap.from(heading, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
      },
      opacity: 0,
      x: -50,
      duration: 1.5,
      ease: "power2.out"
    });
  }

  // Animate children specific to section types (excluding skills for custom handling)
  const items = section.querySelectorAll(".about-line, .job, .project-card");
  if (items.length > 0) {
    gsap.from(items, {
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse"
      },
      opacity: 0,
      y: 80,
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out"
    });
  }
});

/* SKILLS CATEGORY ANIMATION (Subsection Trigger) */
const skillCategories = document.querySelectorAll(".skills-category");
skillCategories.forEach(category => {
  const elements = category.querySelectorAll("h3, .skill");
  gsap.from(elements, {
    scrollTrigger: {
      trigger: category,
      start: "top 85%",
      end: "bottom 20%",
      toggleActions: "play reverse play reverse"
    },
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.5,
    ease: "power2.out"
  });
});

/* CYCLING SUBTITLE UNDERLINE */
const highlights = document.querySelectorAll(".highlight");
let currentIndex = 0;

if (highlights.length > 0) {
  setInterval(() => {
    highlights.forEach(h => h.classList.remove("active"));
    highlights[currentIndex].classList.add("active");
    currentIndex = (currentIndex + 1) % highlights.length;
  }, 1500); // Change every 1.5s
}

/* DYNAMIC PROJECTS */
const projects = [
  {
    title: "CityHop",
    desc: "A realtime taxi booking app with nearest taxi allotment andlive tracking for rural areas.",
    tech: ["Java", "Firebase", "Google Maps API"],
    link: "https://github.com/sohan34/CityHop---A-rural-taxi-solution.git",
    video: "assets/videos/cityhop.mp4"
  },
  {
    title: "ConnectSphere",
    desc: "A platform build to connect Alumni with Students for career guidance and job placement.",
    tech: ["Java", "Firebase", "Android Studio"],
    link: "https://github.com/sohan34/ConnectSphere.git",
    video: "assets/videos/connectsphere.mp4"
  },
  {
    title: "Policy-reminder",
    desc: "A policy reminder app for employees or housewives to keep track of their policies.",
    tech: ["Kotlin", "Firebase", "Android Studio"],
    link: "https://github.com/sohan34/Policy-Reminder.git",
    video: "assets/videos/policy-reminder.mp4"
  }
];

const projectList = document.getElementById("project-list");
if (projectList) {
  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card glass-panel";

    // Create card content
    card.innerHTML = `
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div style="margin-top:auto">
        <small style="color:var(--primary); font-family:'JetBrains Mono'">${p.tech.join(" • ")}</small><br>
        <a href="${p.link}" class="project-link">View GitHub -></a>
      </div>
      
      <!-- MOBILE PREVIEW -->
      <div class="mobile-device">
        <div class="mobile-notch"></div>
        <div class="mobile-screen">
            ${p.video ? `<video src="${p.video}" loop muted playsinline class="video-placeholder" style="object-fit:cover; width:100%; height:100%"></video>` : `<div class="video-placeholder">▶ Video Preview</div>`}
        </div>
      </div>
    `;
    projectList.appendChild(card);

    // Hover Animation
    const mobile = card.querySelector(".mobile-device");
    const video = card.querySelector("video");

    card.addEventListener("mouseenter", () => {
      gsap.to(mobile, {
        scale: 1,
        autoAlpha: 1,
        x: -20, // Shift slightly left
        y: -50, // Shift up
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      if (video) video.play();
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(mobile, {
        scale: 0,
        autoAlpha: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.in"
      });
      if (video) { video.pause(); video.currentTime = 0; }
    });
  });
}

/* SCROLL ICON ANIMATION */
gsap.to(".scroll-icon", {
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1, // Smooth interaction
  },
  y: () => document.body.scrollHeight - window.innerHeight, // Travel full height
  rotation: 360 * 2, // Spin twice fully
  rotationY: 180, // 3D Flip effect
  ease: "none"
});

/* CUSTOM CURSOR LOGIC */
const cursorDot = document.querySelector(".cursor-dot");
const cursorCircle = document.querySelector(".cursor-circle");

// Initial position off-screen
let mouseX = -100, mouseY = -100;
let circleX = -100, circleY = -100;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot moves instantly
  gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0 });
});

// Circle moves with delay (lag effect)
gsap.ticker.add(() => {
  circleX += (mouseX - circleX) * 0.15;
  circleY += (mouseY - circleY) * 0.15;
  gsap.set(cursorCircle, { x: circleX, y: circleY });
});

// Interactive Elements Hover
const interactiveElements = document.querySelectorAll("a, button, .project-card, .skill, .job, .about-line");

interactiveElements.forEach(el => {
  el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
});
/* RESUME MODAL LOGIC */
const resumeModal = document.getElementById("resume-modal");
const closeModalBtn = document.querySelector(".close-modal");
const resumeFrame = document.getElementById("resume-frame");
const downloadResumeBtns = document.querySelectorAll('a[href*="portfolio.pdf"]');

function openResumeModal(pdfUrl) {
  if (resumeModal) {
    resumeFrame.src = pdfUrl;
    resumeModal.classList.add("active");
    gsap.fromTo(".modal-content",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
    );
  }
}

function closeResumeModal() {
  if (resumeModal) {
    resumeModal.classList.remove("active");
    setTimeout(() => {
      resumeFrame.src = ""; // Clear src to stop loading
    }, 300);
  }
}

// Attach event listeners to all resume download buttons (except the one inside the modal)
// Attach event listeners to all resume download buttons (except the one inside the modal)
downloadResumeBtns.forEach(btn => {
  if (!btn.closest(".modal-actions")) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openResumeModal(btn.getAttribute("href"));
    });
  }
});

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeResumeModal);
}

// Close on outside click
if (resumeModal) {
  resumeModal.addEventListener("click", (e) => {
    if (e.target === resumeModal) {
      closeResumeModal();
    }
  });
}

// Close on Esc key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeResumeModal();
  }
});


async function loadProfileStats() {
  const profiles = [
    {
      url: "https://leetcode-stats.tashif.codes/sohan_34",
      totalId: "leetcode-total",
      breakdownId: "leetcode-breakdown",
      platform: "LeetCode"
    },
    {
      url: "https://gfg-stats.tashif.codes/sohanchavan34",
      totalId: "gfg-total",
      breakdownId: "gfg-score",
      platform: "GFG"
    }
  ];

  for (const profile of profiles) {
    const total = document.getElementById(profile.totalId);
    const extra = document.getElementById(profile.breakdownId);

    try {
      const response = await fetch(profile.url);

      if (!response.ok) {
        throw new Error("Profile service unavailable");
      }

      const result = await response.json();
      const data = result.data ?? result;

      if (profile.platform === "LeetCode") {
        const solved =
          data.totalSolved ??
          data.submitStats?.acSubmissionNum?.find(
            item => item.difficulty === "All"
          )?.count;

        if (solved == null) throw new Error("Missing stats");

        total.textContent = `${solved} problems solved`;

        if (extra) {
          const easy = data.easySolved ??
            data.submitStats?.acSubmissionNum?.find(
              item => item.difficulty === "Easy"
            )?.count;
          const medium = data.mediumSolved ??
            data.submitStats?.acSubmissionNum?.find(
              item => item.difficulty === "Medium"
            )?.count;
          const hard = data.hardSolved ??
            data.submitStats?.acSubmissionNum?.find(
              item => item.difficulty === "Hard"
            )?.count;

          extra.textContent =
            [easy, medium, hard].every(n => n != null)
              ? `Easy ${easy} · Medium ${medium} · Hard ${hard}`
              : "Difficulty breakdown unavailable";
        }
      } else {
        const solved = data.totalSolved;

        if (solved == null) throw new Error("Missing stats");

        total.textContent = `${solved} problems solved`;

        if (extra) {
          extra.textContent = data.currentRating != null
            ? `Coding rating: ${data.currentRating}`
            : data.score != null
              ? `Coding score: ${data.score}`
              : "More stats on profile";
        }
      }
    } catch (error) {
      total.textContent = "Stats temporarily unavailable";
      if (extra) extra.textContent = "View the profile for current data.";
      console.warn(`${profile.platform} stats:`, error);
    }
  }
}

loadProfileStats();

