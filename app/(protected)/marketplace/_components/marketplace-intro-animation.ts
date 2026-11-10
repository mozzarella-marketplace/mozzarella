import { gsap } from "gsap";

type IntroAnimationCallbacks = {
  onStepChange: (step: number) => void;
  onComplete: () => void;
};

export const createIntroAnimation = (
  root: HTMLDialogElement,
  { onStepChange, onComplete }: IntroAnimationCallbacks,
) => {
  const travel = Math.min(root.clientWidth * 0.28, 220);
  const startOffset =
    getComputedStyle(root).direction === "rtl" ? travel : -travel;
  const logo = root.querySelector<HTMLElement>("[data-intro-logo]");
  const timeline = gsap.timeline({ paused: true });
  let idleAnimation: gsap.core.Tween | undefined;
  let idleStarted = false;
  let playbackPaused = true;
  let finishing = false;

  const context = gsap.context(() => {
    const act = (step: number) => `[data-intro-act="${step}"]`;
    const art = (name: string) => `[data-intro-art="${name}"]`;

    const revealCaption = (step: number, position: number) => {
      timeline
        .fromTo(
          `${act(step)} [data-intro-word]`,
          { yPercent: 90, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.075,
            ease: "power3.out",
          },
          position,
        )
        .fromTo(
          `${act(step)} [data-intro-description]`,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
          position + 0.3,
        );
    };

    const revealArt = (
      name: string,
      position: number,
      movement: gsap.TweenVars,
      duration = 0.65,
      ease = "power3.out",
    ) => {
      timeline
        .from(art(name), { ...movement, duration, ease }, position)
        .fromTo(
          art(name),
          { opacity: 0 },
          { opacity: 1, duration: 0.22, ease: "power1.out" },
          position,
        );
    };

    timeline
      .set("[data-intro-act]", { autoAlpha: 0 })
      .set("[data-intro-progress]", { scaleX: 0 })
      .set("[data-intro-cta]", { autoAlpha: 0 })
      .set(act(0), { autoAlpha: 1 })
      .call(() => onStepChange(0), [], 0)
      .to(
        '[data-intro-progress="0"]',
        { scaleX: 1, duration: 3.6, ease: "none" },
        0,
      );

    revealArt("customer-avatar", 0.12, {
      x: startOffset * 0.4,
      y: -20,
      rotation: 10,
      scale: 0.8,
    });
    revealArt(
      "customer",
      0.25,
      { x: startOffset, y: 20, rotation: 8, scale: 0.9 },
      0.8,
      "back.out(1.15)",
    );
    revealArt(
      "pizza",
      0.35,
      { y: -55, rotation: -35, scale: 0.65 },
      0.85,
      "back.out(1.3)",
    );
    revealArt("developer-avatar", 0.6, {
      x: -startOffset * 0.4,
      y: 20,
      rotation: -10,
      scale: 0.8,
    });
    revealArt("typing", 0.75, { y: 18, scale: 0.65 }, 0.4, "back.out(1.2)");
    timeline.to(
      art("typing"),
      { opacity: 0, scale: 0.85, duration: 0.18, ease: "power1.in" },
      1.15,
    );
    revealArt(
      "reply",
      1.2,
      { x: -startOffset, y: 30, rotation: -6, scale: 0.85 },
      0.7,
      "back.out(1.2)",
    );
    revealArt(
      "code-icon",
      1.35,
      { y: 50, rotation: 25, scale: 0.65 },
      0.75,
      "back.out(1.2)",
    );
    revealCaption(0, 0.5);

    timeline
      .to(
        art("customer"),
        { y: -6, rotation: -0.75, duration: 1.8, ease: "sine.inOut" },
        1.15,
      )
      .to(
        art("reply"),
        { y: -5, rotation: 0.75, duration: 1.4, ease: "sine.inOut" },
        1.9,
      )
      .to(
        art("pizza"),
        { y: -6, rotation: 2, duration: 1.8, ease: "sine.inOut" },
        1.3,
      )
      .to(
        art("code-icon"),
        { y: 6, rotation: -2, duration: 1.2, ease: "sine.inOut" },
        2.1,
      );

    timeline
      .to(
        act(0),
        { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" },
        3.35,
      )
      .set(act(1), { autoAlpha: 1 }, 3.5)
      .call(() => onStepChange(1), [], 3.6)
      .to(
        '[data-intro-progress="1"]',
        { scaleX: 1, duration: 3.5, ease: "none" },
        3.6,
      );

    revealArt(
      "bulb",
      3.55,
      { x: -startOffset * 0.8, y: -35, scale: 0.7 },
      0.8,
      "power4.out",
    );
    timeline.from(
      art("bulb"),
      { rotation: -24, duration: 0.9, ease: "back.out(1.6)" },
      3.55,
    );
    revealArt(
      "need",
      3.8,
      { x: startOffset * 0.3, y: -15, rotation: 8, scale: 0.9 },
      0.6,
    );
    revealArt(
      "spark-one",
      4.15,
      { rotation: -90, scale: 0.2 },
      0.7,
      "back.out(1.4)",
    );
    revealArt(
      "insight",
      4.25,
      { y: 32, rotation: 4, scale: 0.8 },
      0.65,
      "back.out(1.2)",
    );
    revealCaption(1, 4.05);
    timeline.to(art("bulb"), { y: -5, duration: 1.6, ease: "sine.inOut" }, 4.5);

    timeline
      .to(
        act(1),
        { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in" },
        6.85,
      )
      .set(act(2), { autoAlpha: 1 }, 7)
      .call(() => onStepChange(2), [], 7.1)
      .to(
        '[data-intro-progress="2"]',
        { scaleX: 1, duration: 3.4, ease: "none" },
        7.1,
      );

    revealArt(
      "code",
      7,
      { y: 55, rotation: -5, scale: 0.92 },
      0.75,
      "power3.out",
    );
    revealArt(
      "success",
      7.55,
      { y: -28, rotation: -18, scale: 0.35 },
      0.65,
      "back.out(1.65)",
    );
    revealArt(
      "receipt",
      7.95,
      { x: startOffset * 0.45, y: 25, rotation: 5, scale: 0.85 },
      0.7,
      "back.out(1.2)",
    );
    revealArt(
      "solution-spark",
      8.15,
      { rotation: 80, scale: 0.3 },
      0.7,
      "back.out(1.3)",
    );
    revealCaption(2, 7.35);
    timeline.to(
      art("code"),
      { y: -6, rotation: 1, duration: 1.5, ease: "sine.inOut" },
      8.1,
    );

    timeline.fromTo(
      "[data-intro-cta]",
      { autoAlpha: 0, y: 16, scale: 0.95 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      9,
    );

    idleAnimation = gsap.to("[data-intro-cta]", {
      y: -5,
      duration: 1.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      paused: true,
    });
    timeline.call(
      () => {
        idleStarted = true;
        if (!playbackPaused) idleAnimation?.play();
      },
      [],
      9.5,
    );

    if (logo) {
      const frame = root.getBoundingClientRect();
      const logoBounds = logo.getBoundingClientRect();
      timeline.shiftChildren(1.1);
      timeline
        .set(
          logo,
          {
            x:
              frame.left +
              frame.width / 2 -
              logoBounds.left -
              logoBounds.width / 2,
            y:
              frame.top +
              frame.height / 2 -
              logoBounds.top -
              logoBounds.height / 2,
            scale: root.clientWidth < 640 ? 2.5 : 3.2,
            transformOrigin: "50% 50%",
          },
          0,
        )
        .set(
          "[data-intro-cheese], [data-intro-brace]",
          { transformOrigin: "50% 50%" },
          0,
        )
        .to(
          "[data-intro-cheese]",
          { scaleX: 1.28, scaleY: 0.76, duration: 0.24, ease: "power2.out" },
          0.12,
        )
        .to(
          '[data-intro-brace="left"]',
          { x: -24, duration: 0.24, ease: "power2.out" },
          0.12,
        )
        .to(
          '[data-intro-brace="right"]',
          { x: 24, duration: 0.24, ease: "power2.out" },
          0.12,
        )
        .to(
          "[data-intro-cheese]",
          { scaleX: 1, scaleY: 1, duration: 0.55, ease: "elastic.out(1, 0.4)" },
          0.36,
        )
        .to(
          "[data-intro-brace]",
          { x: 0, duration: 0.55, ease: "elastic.out(1, 0.4)" },
          0.36,
        )
        .to(
          logo,
          { x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.inOut" },
          0.65,
        );
    }

    timeline.fromTo(
      "[data-intro-scrim]",
      { opacity: 0.6 },
      { opacity: 1, duration: 0.4, ease: "power1.out" },
      0,
    );
  }, root);

  return {
    timeline,
    setPaused: (paused: boolean) => {
      if (finishing) return;
      playbackPaused = paused;
      timeline.paused(paused);
      if (idleStarted) idleAnimation?.paused(paused);
    },
    finish: () => {
      if (finishing) return;
      finishing = true;
      timeline.kill();
      idleAnimation?.kill();

      context.add(() => {
        gsap
          .timeline({ onComplete })
          .to(
            "[data-intro-cta]",
            { scale: 0.94, duration: 0.12, ease: "power1.out" },
            0,
          )
          .to(
            "[data-intro-act]",
            {
              autoAlpha: 0,
              y: "-=24",
              scale: 0.97,
              duration: 0.35,
              ease: "power2.in",
            },
            0.08,
          )
          .to(
            "[data-intro-scrim]",
            { opacity: 0, duration: 0.55, ease: "power1.inOut" },
            0.05,
          )
          .to(
            "[data-intro-logo]",
            { opacity: 0, duration: 0.35, ease: "power1.in" },
            0.08,
          );
      });
    },
    revert: () => {
      finishing = true;
      timeline.kill();
      context.revert();
    },
  };
};
