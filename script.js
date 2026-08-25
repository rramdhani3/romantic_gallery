/* =========================================================
   OUR LITTLE ARCHIVE
   Shared JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setupImageFallbacks();
  setupScrollReveal();
  setupCountdown();
  setupPageTransition();
  setupParallax();
});

/* ---------------------------------------------------------
   Image fallback
   --------------------------------------------------------- */
function setupImageFallbacks() {
  document.querySelectorAll(".photo-frame, .gallery-item").forEach(container => {
    const img = container.querySelector("img");
    if (!img) return;

    const hideFallback = () => {
      const fallback = container.querySelector(".image-fallback");
      if (fallback) fallback.style.display = "none";
    };

    const showFallback = () => {
      if (container.classList.contains("gallery-item")) {
        container.style.background = `
          radial-gradient(circle at 30% 25%, rgba(255,255,255,.65), transparent 35%),
          linear-gradient(135deg, var(--accent-soft), var(--blob))
        `;
      } else {
        const fallback = container.querySelector(".image-fallback");
        if (fallback) fallback.style.display = "grid";
      }
      img.style.display = "none";
    };

    img.addEventListener("load", hideFallback);
    img.addEventListener("error", showFallback);

    if (img.complete) {
      img.naturalWidth ? hideFallback() : showFallback();
    }
  });
}

/* ---------------------------------------------------------
   Scroll reveal with IntersectionObserver
   --------------------------------------------------------- */
function setupScrollReveal() {
  const elements = document.querySelectorAll(".section-reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -45px 0px"
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   Birthday countdown
   data-birthday format:
   YYYY-MM-DDTHH:MM:SS
   --------------------------------------------------------- */
function setupCountdown() {
  const birthday = document.body.dataset.birthday;
  if (!birthday) return;

  const countdown = document.getElementById("countdown");
  const title = document.getElementById("countdown-title");

  if (!countdown) return;

  const daysEl = countdown.querySelector('[data-unit="days"]');
  const hoursEl = countdown.querySelector('[data-unit="hours"]');
  const minutesEl = countdown.querySelector('[data-unit="minutes"]');
  const secondsEl = countdown.querySelector('[data-unit="seconds"]');

  const birthdaySource = new Date(birthday);

  if (Number.isNaN(birthdaySource.getTime())) {
    title.textContent = "Set your birthday date";
    return;
  }

  function getNextBirthday() {
    const now = new Date();

    let next = new Date(
      now.getFullYear(),
      birthdaySource.getMonth(),
      birthdaySource.getDate(),
      birthdaySource.getHours(),
      birthdaySource.getMinutes(),
      birthdaySource.getSeconds()
    );

    if (next <= now) {
      next.setFullYear(next.getFullYear() + 1);
    }

    return next;
  }

  function update() {
    const now = new Date();
    const target = getNextBirthday();
    let diff = target.getTime() - now.getTime();

    if (diff < 0) diff = 0;

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(diff / day);
    const hours = Math.floor((diff % day) / hour);
    const minutes = Math.floor((diff % hour) / minute);
    const seconds = Math.floor((diff % minute) / second);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");

    const dateText = target.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long"
    });

    title.textContent = `until ${dateText}`;
  }

  update();
  setInterval(update, 1000);
}

/* ---------------------------------------------------------
   Soft page transition
   --------------------------------------------------------- */
function setupPageTransition() {
  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = link.getAttribute("href");

      if (!target || target.startsWith("#") || link.target === "_blank") return;

      event.preventDefault();
      document.body.classList.add("page-leaving");

      setTimeout(() => {
        window.location.href = target;
      }, 280);
    });
  });
}

/* ---------------------------------------------------------
   Very subtle mouse parallax for the hero photo
   --------------------------------------------------------- */
function setupParallax() {
  const wrap = document.querySelector(".hero-photo-wrap");
  if (!wrap || window.matchMedia("(max-width: 850px)").matches) return;

  wrap.addEventListener("mousemove", event => {
    const rect = wrap.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const photo = wrap.querySelector(".hero-photo");
    if (photo) {
      photo.style.transform =
        `rotate(${x * 3}deg) translate(${x * 7}px, ${y * 7}px)`;
    }
  });

  wrap.addEventListener("mouseleave", () => {
    const photo = wrap.querySelector(".hero-photo");
    if (photo) photo.style.transform = "";
  });
}
