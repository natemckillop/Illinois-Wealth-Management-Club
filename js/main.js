(function () {
  "use strict";

  /* Mobile nav toggle */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (!toggle || !links) return;
    toggle.addEventListener("click", function () {
      var open = toggle.classList.toggle("is-open");
      links.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.classList.remove("is-open");
        links.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Solidify header on scroll */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Reveal-on-scroll via IntersectionObserver */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal:not(.is-observed), .reveal-stagger:not(.is-observed), .reveal-scale:not(.is-observed)");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-visible", "is-observed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    targets.forEach(function (t) { t.classList.add("is-observed"); io.observe(t); });
  }

  /* Split hero heading words into spans for staggered entrance */
  function initHeroWords() {
    document.querySelectorAll("[data-hero-split]").forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span class="hero-word"><span style="animation-delay:' +
          (0.2 + i * 0.055) + 's">' + w + "&nbsp;</span></span>";
      }).join("");
    });
  }

  /* Animated count-up for stat numbers */
  function initCounters() {
    var counters = document.querySelectorAll("[data-count-to]");
    if (!counters.length || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        var el = entry.target;
        var to = parseInt(el.getAttribute("data-count-to"), 10) || 0;
        var suffix = el.getAttribute("data-count-suffix") || "";
        var dur = 1500;
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var progress = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * to) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  }

  /* Accordion (FAQ) */
  function initAccordion() {
    document.querySelectorAll(".accordion-item").forEach(function (item) {
      var trigger = item.querySelector(".accordion-trigger");
      var panel = item.querySelector(".accordion-panel");
      if (!trigger || !panel) return;
      trigger.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.parentElement.querySelectorAll(".accordion-item.is-open").forEach(function (open) {
          if (open !== item) {
            open.classList.remove("is-open");
            open.querySelector(".accordion-panel").style.maxHeight = null;
          }
        });
        item.classList.toggle("is-open", !isOpen);
        panel.style.maxHeight = !isOpen ? panel.scrollHeight + "px" : null;
      });
    });
  }

  /* Static-success forms (no backend wired yet) */
  function initForms() {
    document.querySelectorAll("[data-static-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var submitBtn = form.querySelector('button[type="submit"]');
        var success = form.querySelector(".form-success");
        var labelDefault = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending…";
        }
        window.setTimeout(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = labelDefault;
          }
          if (success) success.classList.add("is-visible");
          form.reset();
        }, 700);
      });
    });
  }

  /* Smooth-scroll for in-page anchor links, accounting for fixed header */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href").slice(1);
        var target = id && document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* Back-to-top button */
  function initBackToTop() {
    var btn = document.querySelector(".mobile-back-top");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("is-visible", window.scrollY > 900);
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* Mark current-page nav link active */
  function initActiveNav() {
    var path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
      var href = a.getAttribute("href").split("#")[0];
      if (href === path) a.classList.add("is-active");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initHeaderScroll();
    initReveal();
    initHeroWords();
    initCounters();
    initAccordion();
    initForms();
    initAnchorScroll();
    initBackToTop();
    initActiveNav();
  });
})();
