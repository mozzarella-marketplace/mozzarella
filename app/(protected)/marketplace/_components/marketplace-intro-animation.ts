import { gsap } from "gsap";

type IntroAnimationCallbacks = {
  onStepChange: (step: number) => void;
  onComplete: () => void;
};

const introSelectors = {
  scenes: "[data-intro-act]",
  progress: "[data-intro-progress]",
  callToAction: "[data-intro-cta]",
  logo: "[data-intro-logo]",
  scrim: "[data-intro-scrim]",
  cheese: "[data-intro-cheese]",
  braces: "[data-intro-brace]",
  leftBrace: '[data-intro-brace="left"]',
  rightBrace: '[data-intro-brace="right"]',
};

const getSceneSelector = (step: number) => `[data-intro-act="${step}"]`;
const getArtSelector = (name: string) => `[data-intro-art="${name}"]`;
const getProgressSelector = (step: number) => `[data-intro-progress="${step}"]`;

const addCaptionReveal = (
  timeline: gsap.core.Timeline,
  step: number,
  startsAt: number,
) => {
  const scene = getSceneSelector(step);
  timeline
    .fromTo(
      `${scene} [data-intro-word]`,
      { yPercent: 90, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.075,
        ease: "power3.out",
      },
      startsAt,
    )
    .fromTo(
      `${scene} [data-intro-description]`,
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" },
      startsAt + 0.3,
    );
};

const addArtEntrance = (
  timeline: gsap.core.Timeline,
  name: string,
  startsAt: number,
  movement: gsap.TweenVars,
  duration = 0.65,
  ease = "power3.out",
) => {
  const art = getArtSelector(name);
  timeline
    .from(art, { ...movement, duration, ease }, startsAt)
    .fromTo(
      art,
      { opacity: 0 },
      { opacity: 1, duration: 0.22, ease: "power1.out" },
      startsAt,
    );
};

const addLogoPrologue = (
  timeline: gsap.core.Timeline,
  root: HTMLDialogElement,
  logo: HTMLElement,
) => {
  const frame = root.getBoundingClientRect();
  const logoBounds = logo.getBoundingClientRect();

  timeline
    .set(
      logo,
      {
        x:
          frame.left + frame.width / 2 - logoBounds.left - logoBounds.width / 2,
        y:
          frame.top + frame.height / 2 - logoBounds.top - logoBounds.height / 2,
        scale: root.clientWidth < 640 ? 2.5 : 3.2,
        transformOrigin: "50% 50%",
      },
      0,
    )
    .set(
      `${introSelectors.cheese}, ${introSelectors.braces}`,
      { transformOrigin: "50% 50%" },
      0,
    )
    .to(
      introSelectors.cheese,
      { scaleX: 1.28, scaleY: 0.76, duration: 0.24, ease: "power2.out" },
      0.12,
    )
    .to(
      introSelectors.leftBrace,
      { x: -24, duration: 0.24, ease: "power2.out" },
      0.12,
    )
    .to(
      introSelectors.rightBrace,
      { x: 24, duration: 0.24, ease: "power2.out" },
      0.12,
    )
    .to(
      introSelectors.cheese,
      { scaleX: 1, scaleY: 1, duration: 0.55, ease: "elastic.out(1, 0.4)" },
      0.36,
    )
    .to(
      introSelectors.braces,
      { x: 0, duration: 0.55, ease: "elastic.out(1, 0.4)" },
      0.36,
    )
    .to(
      logo,
      { x: 0, y: 0, scale: 1, duration: 0.55, ease: "power3.inOut" },
      0.65,
    );
};

const addConversationScene = (
  timeline: gsap.core.Timeline,
  startsAt: number,
  inlineOffset: number,
  onStepChange: IntroAnimationCallbacks["onStepChange"],
) => {
  timeline
    .set(introSelectors.scenes, { autoAlpha: 0 }, startsAt)
    .set(introSelectors.progress, { scaleX: 0 }, startsAt)
    .set(introSelectors.callToAction, { autoAlpha: 0 }, startsAt)
    .set(getSceneSelector(0), { autoAlpha: 1 }, startsAt)
    .call(() => onStepChange(0), [], startsAt)
    .to(
      getProgressSelector(0),
      { scaleX: 1, duration: 3.6, ease: "none" },
      startsAt,
    );

  addArtEntrance(timeline, "customer-avatar", startsAt + 0.12, {
    x: inlineOffset * 0.4,
    y: -20,
    rotation: 10,
    scale: 0.8,
  });
  addArtEntrance(
    timeline,
    "customer",
    startsAt + 0.25,
    { x: inlineOffset, y: 20, rotation: 8, scale: 0.9 },
    0.8,
    "back.out(1.15)",
  );
  addArtEntrance(
    timeline,
    "pizza",
    startsAt + 0.35,
    { y: -55, rotation: -35, scale: 0.65 },
    0.85,
    "back.out(1.3)",
  );
  addArtEntrance(timeline, "developer-avatar", startsAt + 0.6, {
    x: -inlineOffset * 0.4,
    y: 20,
    rotation: -10,
    scale: 0.8,
  });
  addArtEntrance(
    timeline,
    "typing",
    startsAt + 0.75,
    { y: 18, scale: 0.65 },
    0.4,
    "back.out(1.2)",
  );
  timeline.to(
    getArtSelector("typing"),
    { opacity: 0, scale: 0.85, duration: 0.18, ease: "power1.in" },
    startsAt + 1.15,
  );
  addArtEntrance(
    timeline,
    "reply",
    startsAt + 1.2,
    { x: -inlineOffset, y: 30, rotation: -6, scale: 0.85 },
    0.7,
    "back.out(1.2)",
  );
  addArtEntrance(
    timeline,
    "code-icon",
    startsAt + 1.35,
    { y: 50, rotation: 25, scale: 0.65 },
    0.75,
    "back.out(1.2)",
  );
  addCaptionReveal(timeline, 0, startsAt + 0.5);

  timeline
    .to(
      getArtSelector("customer"),
      { y: -6, rotation: -0.75, duration: 1.8, ease: "sine.inOut" },
      startsAt + 1.15,
    )
    .to(
      getArtSelector("reply"),
      { y: -5, rotation: 0.75, duration: 1.4, ease: "sine.inOut" },
      startsAt + 1.9,
    )
    .to(
      getArtSelector("pizza"),
      { y: -6, rotation: 2, duration: 1.8, ease: "sine.inOut" },
      startsAt + 1.3,
    )
    .to(
      getArtSelector("code-icon"),
      { y: 6, rotation: -2, duration: 1.2, ease: "sine.inOut" },
      startsAt + 2.1,
    )
    .to(
      getSceneSelector(0),
      { autoAlpha: 0, y: -24, duration: 0.3, ease: "power2.in" },
      startsAt + 3.35,
    );
};

const addDiscoveryScene = (
  timeline: gsap.core.Timeline,
  startsAt: number,
  inlineOffset: number,
  onStepChange: IntroAnimationCallbacks["onStepChange"],
) => {
  timeline
    .set(getSceneSelector(1), { autoAlpha: 1 }, startsAt)
    .call(() => onStepChange(1), [], startsAt + 0.1)
    .to(
      getProgressSelector(1),
      { scaleX: 1, duration: 3.5, ease: "none" },
      startsAt + 0.1,
    );

  addArtEntrance(
    timeline,
    "bulb",
    startsAt + 0.05,
    { x: -inlineOffset * 0.8, y: -35, scale: 0.7 },
    0.8,
    "power4.out",
  );
  timeline.from(
    getArtSelector("bulb"),
    { rotation: -24, duration: 0.9, ease: "back.out(1.6)" },
    startsAt + 0.05,
  );
  addArtEntrance(
    timeline,
    "need",
    startsAt + 0.3,
    { x: inlineOffset * 0.3, y: -15, rotation: 8, scale: 0.9 },
    0.6,
  );
  addArtEntrance(
    timeline,
    "spark-one",
    startsAt + 0.65,
    { rotation: -90, scale: 0.2 },
    0.7,
    "back.out(1.4)",
  );
  addArtEntrance(
    timeline,
    "insight",
    startsAt + 0.75,
    { y: 32, rotation: 4, scale: 0.8 },
    0.65,
    "back.out(1.2)",
  );
  addCaptionReveal(timeline, 1, startsAt + 0.55);
  timeline
    .to(
      getArtSelector("bulb"),
      { y: -5, duration: 1.6, ease: "sine.inOut" },
      startsAt + 1,
    )
    .to(
      getSceneSelector(1),
      { autoAlpha: 0, y: -20, duration: 0.3, ease: "power2.in" },
      startsAt + 3.35,
    );
};

const addSolutionScene = (
  timeline: gsap.core.Timeline,
  startsAt: number,
  inlineOffset: number,
  onStepChange: IntroAnimationCallbacks["onStepChange"],
) => {
  timeline
    .set(getSceneSelector(2), { autoAlpha: 1 }, startsAt)
    .call(() => onStepChange(2), [], startsAt + 0.1)
    .to(
      getProgressSelector(2),
      { scaleX: 1, duration: 3.4, ease: "none" },
      startsAt + 0.1,
    );

  addArtEntrance(
    timeline,
    "code",
    startsAt,
    { y: 55, rotation: -5, scale: 0.92 },
    0.75,
    "power3.out",
  );
  addArtEntrance(
    timeline,
    "success",
    startsAt + 0.55,
    { y: -28, rotation: -18, scale: 0.35 },
    0.65,
    "back.out(1.65)",
  );
  addArtEntrance(
    timeline,
    "receipt",
    startsAt + 0.95,
    { x: inlineOffset * 0.45, y: 25, rotation: 5, scale: 0.85 },
    0.7,
    "back.out(1.2)",
  );
  addArtEntrance(
    timeline,
    "solution-spark",
    startsAt + 1.15,
    { rotation: 80, scale: 0.3 },
    0.7,
    "back.out(1.3)",
  );
  addCaptionReveal(timeline, 2, startsAt + 0.35);
  timeline.to(
    getArtSelector("code"),
    { y: -6, rotation: 1, duration: 1.5, ease: "sine.inOut" },
    startsAt + 1.1,
  );
};

const addCallToAction = (
  timeline: gsap.core.Timeline,
  startsAt: number,
  onIdleStart: () => void,
) => {
  timeline.fromTo(
    introSelectors.callToAction,
    { autoAlpha: 0, y: 16, scale: 0.95 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
    startsAt,
  );

  const idleAnimation = gsap.to(introSelectors.callToAction, {
    y: -5,
    duration: 1.6,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    paused: true,
  });
  timeline.call(onIdleStart, [], startsAt + 0.5);
  return idleAnimation;
};

const addScrimEntrance = (timeline: gsap.core.Timeline) => {
  timeline.fromTo(
    introSelectors.scrim,
    { opacity: 0.6 },
    { opacity: 1, duration: 0.4, ease: "power1.out" },
    0,
  );
};

const createExitTimeline = (onComplete: () => void) =>
  gsap
    .timeline({ onComplete })
    .to(
      introSelectors.callToAction,
      { scale: 0.94, duration: 0.12, ease: "power1.out" },
      0,
    )
    .to(
      introSelectors.scenes,
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
      introSelectors.scrim,
      { opacity: 0, duration: 0.55, ease: "power1.inOut" },
      0.05,
    )
    .to(
      introSelectors.logo,
      { opacity: 0, duration: 0.35, ease: "power1.in" },
      0.08,
    );

export const createIntroAnimation = (
  root: HTMLDialogElement,
  { onStepChange, onComplete }: IntroAnimationCallbacks,
) => {
  const travel = Math.min(root.clientWidth * 0.28, 220);
  const inlineOffset =
    getComputedStyle(root).direction === "rtl" ? travel : -travel;
  const logo = root.querySelector<HTMLElement>(introSelectors.logo);
  const conversationStart = logo ? 1.1 : 0;
  const discoveryStart = conversationStart + 3.5;
  const solutionStart = conversationStart + 7;
  const callToActionStart = conversationStart + 9;
  const timeline = gsap.timeline({ paused: true });
  let idleAnimation: gsap.core.Tween | undefined;
  let idleStarted = false;
  let playbackPaused = true;
  let finishing = false;

  timeline
    .addLabel("conversation", conversationStart)
    .addLabel("discovery", discoveryStart)
    .addLabel("solution", solutionStart)
    .addLabel("call-to-action", callToActionStart)
    .addLabel("hold", conversationStart + 10.5);

  const context = gsap.context(() => {
    if (logo) {
      timeline.addLabel("logo", 0);
      addLogoPrologue(timeline, root, logo);
    }
    addConversationScene(
      timeline,
      conversationStart,
      inlineOffset,
      onStepChange,
    );
    addDiscoveryScene(timeline, discoveryStart, inlineOffset, onStepChange);
    addSolutionScene(timeline, solutionStart, inlineOffset, onStepChange);
    idleAnimation = addCallToAction(timeline, callToActionStart, () => {
      idleStarted = true;
      if (!playbackPaused) idleAnimation?.play();
    });
    addScrimEntrance(timeline);
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
        createExitTimeline(onComplete);
      });
    },
    revert: () => {
      finishing = true;
      timeline.kill();
      context.revert();
    },
  };
};
