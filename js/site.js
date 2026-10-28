(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const desktop = matchMedia("(min-width: 821px)");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  // Reduced-motion users keep the reveals but lose smooth-scroll and velocity effects.
  const motion = hasGsap;
  let lenis;

  /* ---------- social links (edit URLs here) ---------- */
  // An empty URL renders the icon as disabled.
  const SOCIAL = [
    ["Facebook", "https://www.facebook.com/havicof/", '<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"/>'],
    ["YouTube", "https://www.youtube.com/@HavicoWood",'<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z"/>'],
    ["TikTok", "https://www.tiktok.com/@havicowood",'<path d="M16.6 3c.3 2.1 1.6 3.6 3.9 3.8v3a7 7 0 0 1-3.8-1.2v6.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.1a2.6 2.6 0 1 0 1.8 2.4V3z"/>'],
    ["Shopee", "https://shopee.vn/havico",'<path d="M12 2.5a4 4 0 0 0-4 3.8H4.6l1.1 13.4A2.2 2.2 0 0 0 7.9 21.7h8.2a2.2 2.2 0 0 0 2.2-2L19.4 6.3H16a4 4 0 0 0-4-3.8zm0 1.6a2.4 2.4 0 0 1 2.4 2.2H9.6A2.4 2.4 0 0 1 12 4.1zm.1 5.3c1.4 0 2.4.5 2.9 1.2l-1 .9c-.5-.5-1.1-.8-1.9-.8-.8 0-1.3.4-1.3.9 0 1.5 4.6.8 4.6 3.8 0 1.4-1.2 2.6-3.4 2.6-1.4 0-2.6-.5-3.3-1.4l1-1c.6.7 1.4 1 2.3 1 1 0 1.6-.4 1.6-1 0-1.6-4.6-.8-4.6-3.8 0-1.4 1.3-2.4 3.1-2.4z"/>']
  ];
  $$("[data-social]").forEach(box => box.innerHTML = SOCIAL.map(([n, url, path]) => url
    ? `<a href="${url}" target="_blank" rel="noopener" aria-label="${n}" title="${n}"><svg viewBox="0 0 24 24">${path}</svg></a>`
    : `<span class="off" aria-label="${n} – đang cập nhật" title="${n} – đang cập nhật"><svg viewBox="0 0 24 24">${path}</svg></span>`).join(""));

  /* ---------- numbers ---------- */
  const fmt = (el, v) => {
    const d = el.dataset;
    const n = d.plain !== undefined ? String(Math.round(v)) : Math.round(v).toLocaleString("vi-VN");
    el.textContent = (d.prefix || "") + n + (d.suffix || "");
  };
  const countUp = el => {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = +el.dataset.count;
    if (!motion) return fmt(el, end);
    const o = {v: el.dataset.plain !== undefined ? end - 60 : 0};
    gsap.to(o, {v: end, duration: 2.2, ease: "power3.out", onUpdate: () => fmt(el, o.v)});
  };
  if (!motion) $$("[data-count]").forEach(countUp);

  /* ---------- mobile menu ---------- */
  const burger = $(".burger"), mnav = $("#mnav");
  const menu = open => {
    open = open ?? !mnav.classList.contains("open");
    mnav.classList.toggle("open", open); burger.setAttribute("aria-expanded", open);
    open ? lenis?.stop() : lenis?.start();
  };
  burger.onclick = () => menu();

  /* ---------- anchors ---------- */
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = $(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault(); menu(false);
    lenis ? lenis.scrollTo(t, {offset: t.id === "top" ? 0 : -60, duration: 1.6}) : t.scrollIntoView({behavior: reduced ? "auto" : "smooth"});
  });

  /* ---------- tabs ---------- */
  const tabs = $$(".tabs button"), ink = $(".tab-ink");
  const placeInk = b => { ink.style.width = b.offsetWidth + "px"; ink.style.transform = `translateX(${b.offsetLeft - 6}px)`; };
  tabs.forEach(b => b.onclick = () => {
    tabs.forEach(x => x.setAttribute("aria-selected", x === b));
    placeInk(b);
    $$(".panel").forEach(p => {
      const on = p.dataset.panel === b.dataset.tab;
      p.hidden = !on;
      if (on && motion) gsap.fromTo(p.children, {autoAlpha: 0, y: 30}, {autoAlpha: 1, y: 0, duration: .9, stagger: .07, ease: "expo.out"});
    });
    if (hasGsap) ScrollTrigger.refresh();
  });
  placeInk(tabs[0]);
  addEventListener("resize", () => placeInk($(".tabs button[aria-selected=true]")));

  /* ---------- product rail: drag with inertia ---------- */
  const rail = $(".rail"), track = $(".rail-track");
  let x = 0, startX = 0, startPos = 0, lastX = 0, vel = 0, dragging = false;
  const maxX = () => Math.min(0, rail.clientWidth - track.scrollWidth - parseFloat(getComputedStyle(rail).paddingLeft) * 2);
  const setX = v => { x = Math.max(maxX() - 40, Math.min(40, v)); track.style.transform = `translateX(${x}px)`; };
  const settle = () => {
    const target = Math.max(maxX(), Math.min(0, x + vel * 12));
    if (motion) gsap.to({v: x}, {v: target, duration: 1, ease: "expo.out", onUpdate() { setX(this.targets()[0].v); }});
    else setX(target);
  };
  rail.style.touchAction = "pan-y";
  rail.addEventListener("pointerdown", e => { dragging = true; startX = lastX = e.clientX; startPos = x; vel = 0; rail.classList.add("drag"); rail.setPointerCapture(e.pointerId); });
  rail.addEventListener("pointermove", e => { if (!dragging) return; vel = e.clientX - lastX; lastX = e.clientX; setX(startPos + e.clientX - startX); });
  const end = () => { if (!dragging) return; dragging = false; rail.classList.remove("drag"); settle(); };
  rail.addEventListener("pointerup", end); rail.addEventListener("pointercancel", end);
  rail.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); vel = 0; x += e.key === "ArrowRight" ? -300 : 300; setX(x); settle(); }
  });

  /* ---------- doors: click / tap toggles open ---------- */
  const setDoor = (d, open) => {
    d.classList.toggle("open", open);
    const b = $(".door-frame", d);
    b.setAttribute("aria-pressed", open);
    $(".d-hint", b).textContent = open ? "Chạm để đóng" : "Chạm để mở";
  };
  $$(".door").forEach(d => $(".door-frame", d).addEventListener("click", () => setDoor(d, !d.classList.contains("open"))));

  /* ---------- design styles accordion ---------- */
  const inspo = $$("#inspo figure");
  const pick = f => inspo.forEach(x => x.classList.toggle("on", x === f));
  inspo.forEach(f => { f.addEventListener("mouseenter", () => pick(f)); f.addEventListener("click", () => pick(f)); });
  pick(inspo[0]);

  /* ---------- lightbox ---------- */
  const lb = $("#lb"); let lbFrom;
  $$(".pj").forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); lbFrom = a;
    $("img", lb).src = a.getAttribute("href"); $("img", lb).alt = $("img", a).alt; $("p", lb).textContent = a.dataset.cap;
    lb.hidden = false; lenis?.stop(); $(".lb-close", lb).focus();
    if (motion) gsap.fromTo($("img", lb), {scale: .92, autoAlpha: 0}, {scale: 1, autoAlpha: 1, duration: .7, ease: "expo.out"});
  }));
  const closeLb = () => { if (lb.hidden) return; lb.hidden = true; lenis?.start(); lbFrom?.focus(); };
  lb.addEventListener("click", e => { if (e.target === lb || e.target.closest(".lb-close")) closeLb(); });
  addEventListener("keydown", e => { if (e.key === "Escape") { closeLb(); menu(false); } });

  /* ---------- header state (works without GSAP too) ---------- */
  const head = $(".head"), hero = $(".hero");
  let lastY = 0;
  const onScroll = y => {
    head.classList.toggle("solid", y > hero.offsetHeight - 90);
    head.classList.toggle("hide", y > lastY && y > 300 && !mnav.classList.contains("open"));
    lastY = y;
  };
  if (!motion) addEventListener("scroll", () => onScroll(scrollY), {passive: true});

  const loader = $(".loader");
  if (!motion) { loader.remove(); return; }

  /* =================== motion =================== */
  gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis && !reduced) {
    lenis = new Lenis({lerp: .09, wheelMultiplier: 1});
    lenis.on("scroll", ScrollTrigger.update);
    lenis.on("scroll", ({scroll}) => onScroll(scroll));
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else addEventListener("scroll", () => onScroll(scrollY), {passive: true});

  // split headings into masked words
  $$(".split").forEach(el => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(w => `<span class="w"><span>${w.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</span></span>`).join(" ");
  });

  /* loader → hero intro */
  const heroImg = $(".hero-media img");
  gsap.set(".hero-title .ln > span", {yPercent: 115, rotate: 3});
  gsap.set([".hero-eyebrow", ".hero-sub", ".hero-cue"], {autoAlpha: 0, y: 24});
  gsap.set(".hero-stats > div", {autoAlpha: 0, y: 40});
  gsap.set(".head", {yPercent: -100});
  gsap.set(heroImg, {scale: 1.35});
  gsap.set(".hero .f1", {xPercent: -60, yPercent: 40}); gsap.set(".hero .f2", {xPercent: 50, yPercent: -40}); gsap.set(".hero .f3", {xPercent: 40, yPercent: 40});
  lenis?.stop();
  const cnt = {v: 0};
  const intro = gsap.timeline({onComplete: () => lenis?.start()});
  intro
    .to(cnt, {v: 100, duration: 1.6, ease: "power2.inOut", onUpdate: () => $(".loader-count").textContent = String(Math.round(cnt.v)).padStart(2, "0")})
    .to(".loader-line i", {scaleX: 1, duration: 1.6, ease: "power2.inOut"}, 0)
    .from(".loader-in img", {autoAlpha: 0, y: 20, duration: .8, ease: "expo.out"}, 0)
    .to(".loader-in", {autoAlpha: 0, y: -30, duration: .5, ease: "power2.in"})
    .to(loader, {clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 35%)", duration: .7, ease: "power3.in"}, "-=.1")
    .to(loader, {clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)", duration: .45, ease: "power2.out"})
    .set(loader, {display: "none"})
    .to(heroImg, {scale: 1, duration: 2.4, ease: "expo.out"}, "-=.9")
    .to([".hero .f1", ".hero .f2", ".hero .f3"], {xPercent: 0, yPercent: 0, duration: 1.8, ease: "expo.out", stagger: .08}, "<")
    .to(".hero-title .ln > span", {yPercent: 0, rotate: 0, duration: 1.4, ease: "expo.out", stagger: .1}, "<.15")
    .to([".hero-eyebrow", ".hero-sub", ".hero-cue"], {autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .08}, "<.25")
    .to(".hero-stats > div", {autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: .08, onStart: () => $$(".hero-stats [data-count]").forEach(countUp)}, "<.1")
    .to(".head", {yPercent: 0, duration: 1, ease: "expo.out"}, "<");
  // Safety net: if frames never ran (hidden tab, stalled rAF), jump to the end so the page is usable.
  setTimeout(() => { if (intro.progress() < 1) intro.progress(1); }, 5000);

  /* hero leaves */
  const heroST = {trigger: ".hero", start: "top top", end: "bottom top", scrub: true};
  gsap.to(heroImg, {yPercent: 18, scale: 1.08, ease: "none", scrollTrigger: heroST});
  gsap.to(".hero-in", {yPercent: -22, autoAlpha: .2, ease: "none", scrollTrigger: heroST});
  gsap.to(".hero .f1", {xPercent: -30, ease: "none", scrollTrigger: heroST});
  gsap.to(".hero .f2", {yPercent: -40, ease: "none", scrollTrigger: heroST});

  /* infinite loops whose speed follows scroll velocity */
  const loops = [];
  const makeLoop = (trackEl, speed, skew) => {
    trackEl.innerHTML += trackEl.innerHTML; // seamless: two copies, wrap at half
    const st = {x: 0, w: 0, speed, skew};
    const measure = () => st.w = trackEl.scrollWidth / 2;
    measure(); addEventListener("resize", measure); addEventListener("load", measure);
    loops.push([trackEl, st]);
  };
  makeLoop($(".mq-track"), 1.1, true);
  makeLoop($(".logos-track"), .6, false);
  makeLoop($(".giant-track"), .5, false);
  const skewTo = gsap.quickTo(".mq-track", "skewX", {duration: .5, ease: "power3"});
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : 0;
    for (const [el, st] of loops) {
      st.x -= st.speed + Math.abs(v) * .25;
      if (st.x <= -st.w) st.x += st.w;
      gsap.set(el, {x: st.x});
    }
    if (!reduced) skewTo(gsap.utils.clamp(-12, 12, -v * .35));
  });

  /* words + fades */
  $$(".split").forEach(el => gsap.from($$(".w > span", el), {yPercent: 110, rotate: 4, duration: 1.2, ease: "expo.out", stagger: .04, scrollTrigger: {trigger: el, start: "top 88%", once: true}}));
  $$(".fade, .facts > div, .tag").forEach(el => gsap.from(el, {autoAlpha: 0, y: 30, duration: 1.1, ease: "expo.out", scrollTrigger: {trigger: el, start: "top 90%", once: true}}));

  /* blue wipe image reveal */
  $$(".reveal").forEach(fig => {
    const wipe = document.createElement("i");
    wipe.style.cssText = "position:absolute;inset:0;background:var(--blue);transform:scaleX(0);transform-origin:left;z-index:2";
    fig.append(wipe);
    const img = $("img", fig);
    gsap.set(img, {autoAlpha: 0, scale: 1.25});
    gsap.timeline({scrollTrigger: {trigger: fig, start: "top 85%", once: true}})
      .to(wipe, {scaleX: 1, duration: .7, ease: "expo.in"})
      .set(img, {autoAlpha: 1})
      .set(wipe, {transformOrigin: "right"})
      .to(wipe, {scaleX: 0, duration: .9, ease: "expo.out"})
      .to(img, {scale: 1, duration: 1.6, ease: "expo.out"}, "<");
  });
  gsap.from(".ab-badge", {scale: 0, rotate: -90, duration: 1.4, ease: "back.out(1.6)", scrollTrigger: {trigger: ".about-visual", start: "top 70%", once: true}});
  gsap.to(".ab-2", {yPercent: -12, ease: "none", scrollTrigger: {trigger: ".about-visual", start: "top bottom", end: "bottom top", scrub: true}});

  /* section-specific motion that differs by viewport */
  const mm = gsap.matchMedia();
  const tlItems = $$(".tl-item"), yearEl = $(".tl-year");
  const setYear = it => { if (!it) return; tlItems.forEach(x => x.classList.toggle("on", x === it || +x.dataset.year < +it.dataset.year)); yearEl.textContent = it.dataset.year; };

  mm.add("(min-width: 821px)", () => {
    // timeline: pinned horizontal
    const trk = $(".tl-track");
    const dist = () => trk.scrollWidth - innerWidth;
    const tween = gsap.to(trk, {x: () => -dist(), ease: "none", scrollTrigger: {trigger: ".timeline", start: "top top", end: () => "+=" + dist() * 1.2, pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: s => { gsap.set(".tl-line i", {scaleX: s.progress}); const i = Math.min(tlItems.length - 1, Math.floor(s.progress * (tlItems.length + .4))); setYear(tlItems[i]); }}});
    tlItems.forEach(it => gsap.from(it.children, {autoAlpha: 0, y: 40, stagger: .08, duration: 1, ease: "expo.out", scrollTrigger: {trigger: it, containerAnimation: tween, start: "left 85%", once: true}}));
    gsap.from(".tl-photo img", {scale: 1.4, ease: "none", scrollTrigger: {trigger: ".tl-photo", containerAnimation: tween, start: "left right", end: "right right", scrub: true}});

    // capability chapters drive the sticky image
    const stageImgs = $$(".cap-stage img"), no = $(".cap-no");
    $$(".cap-item").forEach((it, i) => ScrollTrigger.create({trigger: it, start: "top 55%", end: "bottom 55%", onToggle: s => {
      if (!s.isActive) return;
      $$(".cap-item").forEach(x => x.classList.toggle("on", x === it));
      stageImgs.forEach((im, j) => im.classList.toggle("on", j === i));
      no.textContent = "0" + (i + 1);
      $$("[data-count]", it).forEach(countUp);
    }}));
  });
  mm.add("(max-width: 820px)", () => {
    gsap.fromTo(".tl-line i", {scaleY: 0}, {scaleY: 1, ease: "none", scrollTrigger: {trigger: ".tl-track", start: "top 70%", end: "bottom 60%", scrub: true}});
    tlItems.forEach(it => ScrollTrigger.create({trigger: it, start: "top 65%", onEnter: () => setYear(it), onLeaveBack: () => setYear(tlItems[tlItems.indexOf(it) - 1])}));
    $$(".cap-item [data-count]").forEach(el => ScrollTrigger.create({trigger: el, start: "top 90%", once: true, onEnter: () => countUp(el)}));
    // phones: each door swings open while it sits in the middle of the screen
    $$(".door").forEach(d => ScrollTrigger.create({trigger: d.querySelector(".door-frame"), start: "top 55%", end: "bottom 35%", onToggle: s => setDoor(d, s.isActive)}));
  });

  /* products */
  gsap.from(".pcard", {autoAlpha: 0, x: 120, duration: 1.4, ease: "expo.out", stagger: .08, scrollTrigger: {trigger: ".rail", start: "top 85%", once: true}});
  gsap.from(".specs li", {autoAlpha: 0, y: 20, duration: 1, ease: "expo.out", stagger: .06, scrollTrigger: {trigger: ".specs", start: "top 92%", once: true}});

  /* projects: clip reveal + inner parallax */
  $$(".pj").forEach((pj, i) => {
    gsap.fromTo(pj, {clipPath: "inset(18% 18% 18% 18%)", autoAlpha: 0}, {clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1, duration: 1.5, ease: "expo.out", delay: (i % 3) * .08, scrollTrigger: {trigger: pj, start: "top 90%", once: true}});
    gsap.fromTo($("img", pj), {yPercent: -8}, {yPercent: 8, ease: "none", scrollTrigger: {trigger: pj, start: "top bottom", end: "bottom top", scrub: true}});
  });
  gsap.from("#inspo figure", {autoAlpha: 0, y: 60, duration: 1.2, ease: "expo.out", stagger: .08, scrollTrigger: {trigger: "#inspo", start: "top 85%", once: true}});

  /* certs */
  gsap.from(".cert", {autoAlpha: 0, y: 70, rotateX: -25, transformOrigin: "50% 100%", duration: 1.3, ease: "expo.out", stagger: .1, scrollTrigger: {trigger: ".cert-cards", start: "top 85%", once: true}});
  if (finePointer) $$(".tilt").forEach(c => {
    const rx = gsap.quickTo(c, "rotateX", {duration: .6, ease: "power3"}), ry = gsap.quickTo(c, "rotateY", {duration: .6, ease: "power3"});
    c.addEventListener("pointermove", e => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 14); rx(-((e.clientY - r.top) / r.height - .5) * 14); });
    c.addEventListener("pointerleave", () => { rx(0); ry(0); });
  });

  /* footer */
  gsap.from(".foot-facets polygon", {xPercent: 40, duration: 1.6, ease: "expo.out", stagger: .1, scrollTrigger: {trigger: ".foot", start: "top 75%", once: true}});
  gsap.from(".orb", {scale: 0, rotate: -120, duration: 1.4, ease: "back.out(1.5)", scrollTrigger: {trigger: ".foot-cta", start: "top 80%", once: true}});
  gsap.from(".foot-grid > div", {autoAlpha: 0, y: 30, duration: 1, ease: "expo.out", stagger: .08, scrollTrigger: {trigger: ".foot-grid", start: "top 92%", once: true}});

  /* nav highlight */
  $$(".nav a").forEach(a => {
    const s = $(a.getAttribute("href"));
    if (s) ScrollTrigger.create({trigger: s, start: "top 50%", end: "bottom 50%", onToggle: t => a.classList.toggle("on", t.isActive)});
  });

  /* cursor + magnetic (fine pointers only) */
  if (finePointer) {
    const cur = $(".cursor"), label = $("span", cur);
    const cx = gsap.quickTo(cur, "x", {duration: .35, ease: "power3"}), cy = gsap.quickTo(cur, "y", {duration: .35, ease: "power3"});
    addEventListener("pointermove", e => { cx(e.clientX); cy(e.clientY); });
    const hints = [[".rail", "Kéo"], [".pj", "Xem"], ["#inspo figure", "Mở"], [".door", "Mở"]];
    hints.forEach(([sel, txt]) => $$(sel).forEach(el => {
      el.addEventListener("pointerenter", () => { label.textContent = txt; cur.classList.add("big"); });
      el.addEventListener("pointerleave", () => cur.classList.remove("big"));
    }));
    $$(".magnetic").forEach(m => {
      const mx = gsap.quickTo(m, "x", {duration: .6, ease: "elastic.out(1,.4)"}), my = gsap.quickTo(m, "y", {duration: .6, ease: "elastic.out(1,.4)"});
      m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .35); my((e.clientY - r.top - r.height / 2) * .35); });
      m.addEventListener("pointerleave", () => { mx(0); my(0); });
    });
  }

  addEventListener("load", () => ScrollTrigger.refresh());
})();
