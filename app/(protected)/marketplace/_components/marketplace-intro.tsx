"use client";

import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { getMessages } from "@/lib/i18n/messages";
import type { createIntroAnimation } from "./marketplace-intro-animation";
import { MarketplaceIntroLogo } from "./marketplace-intro-logo";
import {
  IntroConversationScene,
  IntroDiscoveryScene,
  IntroSolutionScene,
} from "./marketplace-intro-scenes";
import styles from "./marketplace-intro.module.css";

const introStorageKey = "mozzarella:welcome:v1";
let dismissedInSession = false;

const introScenes = [
  IntroConversationScene,
  IntroDiscoveryScene,
  IntroSolutionScene,
];

const IntroCaption: FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className={styles.caption}>
      <h3>
        <span className="sr-only">{title}</span>
        <span aria-hidden="true">
          {title.split(" ").map((word, wordIndex) => (
            <span key={wordIndex}>
              <span className={styles.word} data-intro-word>
                {word}
              </span>{" "}
            </span>
          ))}
        </span>
      </h3>
      <p className={styles.description} data-intro-description>
        {description}
      </p>
    </div>
  );
};

export const MarketplaceIntro: FC = () => {
  const { intro } = getMessages().marketplace;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const animationRef = useRef<ReturnType<typeof createIntroAnimation> | null>(
    null,
  );
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const [exiting, setExiting] = useState(false);
  const shouldPause = paused || documentHidden;
  const pauseRef = useRef(shouldPause);
  pauseRef.current = shouldPause;

  const dismiss = useCallback(() => {
    dismissedInSession = true;
    try {
      window.localStorage.setItem(introStorageKey, "true");
    } catch {
      // Client navigation still respects dismissal when storage is blocked.
    }
    setVisible(false);
  }, []);

  const finish = () => {
    if (reducedMotion || !animationRef.current) {
      dismiss();
      return;
    }
    setExiting(true);
    animationRef.current.finish();
  };

  useEffect(() => {
    if (dismissedInSession) return;
    try {
      if (window.localStorage.getItem(introStorageKey) === "true") return;
    } catch {
      // Storage restrictions must never prevent access to the marketplace.
    }

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setDocumentHidden(document.hidden);
    updateMotion();
    updateVisibility();
    setVisible(true);
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || reducedMotion) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    let cancelled = false;

    // Returning visitors never need to download the animation engine.
    void import("./marketplace-intro-animation")
      .then(({ createIntroAnimation }) => {
        if (cancelled) return;
        const animation = createIntroAnimation(dialog, {
          onStepChange: setStep,
          onComplete: dismiss,
        });
        animationRef.current = animation;
        animation.setPaused(pauseRef.current);
      })
      .catch(() => {
        if (!cancelled) setReducedMotion(true);
      });

    return () => {
      cancelled = true;
      animationRef.current?.revert();
      animationRef.current = null;
    };
  }, [visible, reducedMotion, dismiss]);

  useEffect(() => {
    animationRef.current?.setPaused(shouldPause);
  }, [shouldPause]);

  useEffect(() => {
    if (reducedMotion && exiting) dismiss();
  }, [reducedMotion, exiting, dismiss]);

  if (!visible) return null;
  const currentStep = reducedMotion ? intro.steps.length - 1 : step;

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="intro-title"
      aria-describedby="intro-description"
      data-reduced-motion={reducedMotion}
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
    >
      <div className={styles.scrim} data-intro-scrim aria-hidden="true" />
      <div className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark} data-intro-logo>
            <MarketplaceIntroLogo />
          </div>
          <span className={styles.eyebrow}>{intro.label}</span>
        </div>
        <div className={styles.controls}>
          {!reducedMotion && (
            <button
              type="button"
              className={styles.pause}
              aria-label={paused ? intro.resume : intro.pause}
              aria-pressed={paused}
              disabled={exiting}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play /> : <Pause />}
            </button>
          )}
          <button
            type="button"
            className={styles.skip}
            onClick={finish}
            disabled={exiting}
          >
            {intro.skip}
          </button>
        </div>
      </div>
      <h2 id="intro-title" className="sr-only">
        {intro.title}
      </h2>
      <p id="intro-description" className="sr-only">
        {intro.description}
      </p>
      <div className={styles.stage}>
        <div className={styles.atmosphere} aria-hidden="true" />
        {introScenes.map((Scene, index) => {
          const scene = intro.steps[index];

          return (
            <section
              className={styles.act}
              data-intro-act={index}
              key={scene.label}
              aria-hidden={index !== currentStep}
            >
              <Scene />
              <IntroCaption
                title={reducedMotion ? intro.title : scene.title}
                description={
                  reducedMotion ? intro.description : scene.description
                }
              />
              {index === intro.steps.length - 1 && (
                <button
                  type="button"
                  className={styles.continue}
                  data-intro-cta
                  onClick={finish}
                  disabled={exiting}
                >
                  {intro.continue}
                  <ArrowLeft className="ltr:rotate-180" />
                </button>
              )}
            </section>
          );
        })}
      </div>
      <div className={styles.footer}>
        <ol className={styles.steps}>
          {intro.steps.map((scene, index) => (
            <li
              key={scene.label}
              data-active={index === currentStep}
              data-complete={index < currentStep}
              aria-current={index === currentStep ? "step" : undefined}
            >
              <span className={styles.stepTrack} aria-hidden="true">
                <span
                  className={styles.stepProgress}
                  data-intro-progress={index}
                />
              </span>
              <span className={styles.stepLabel}>{scene.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </dialog>
  );
};
