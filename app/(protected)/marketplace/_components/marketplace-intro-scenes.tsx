import type { FC } from "react";
import { Check, CodeXml, Lightbulb, Pizza, Sparkles } from "lucide-react";
import { getMessages } from "@/lib/i18n/messages";
import styles from "./marketplace-intro.module.css";

export const IntroConversationScene: FC = () => {
  const { intro } = getMessages().marketplace;

  return (
    <div className={styles.chatStage} aria-hidden="true">
      <div className={styles.customerAvatar} data-intro-art="customer-avatar">
        <span className={styles.chatAvatar}>👩‍🍳</span>
        <span>
          <strong>{intro.customerName}</strong>
          <span className={styles.role}>{intro.customerRole}</span>
        </span>
      </div>
      <div className={styles.customerBubble} data-intro-art="customer">
        {intro.customerMessage}
      </div>
      <div className={styles.typing} data-intro-art="typing">
        <i />
        <i />
        <i />
      </div>
      <div className={styles.developerBubble} data-intro-art="reply">
        {intro.developerMessage}
      </div>
      <div className={styles.developerAvatar} data-intro-art="developer-avatar">
        <span className={styles.chatAvatar}>
          <CodeXml />
        </span>
        <span>
          <strong>{intro.developerName}</strong>
          <span className={styles.role}>{intro.developerRole}</span>
        </span>
      </div>
      <span
        className={[styles.satellite, styles.pizzaSatellite].join(" ")}
        data-intro-art="pizza"
      >
        <Pizza />
      </span>
      <span
        className={[styles.satellite, styles.codeSatellite].join(" ")}
        data-intro-art="code-icon"
      >
        <CodeXml />
      </span>
    </div>
  );
};

export const IntroDiscoveryScene: FC = () => {
  const { intro } = getMessages().marketplace;

  return (
    <div className={styles.artStage} aria-hidden="true">
      <div className={styles.bulbGlow} />
      <span className={styles.need} data-intro-art="need">
        {intro.need}
      </span>
      <div className={styles.bulb} data-intro-art="bulb">
        <Lightbulb strokeWidth={1.5} />
      </div>
      <div className={styles.insight} data-intro-art="insight">
        <Check />
        <span>{intro.insight}</span>
      </div>
      <span className={styles.ideaSpark} data-intro-art="spark-one">
        <Sparkles />
      </span>
    </div>
  );
};

export const IntroSolutionScene: FC = () => {
  const { intro } = getMessages().marketplace;

  return (
    <div className={styles.artStage} aria-hidden="true">
      <div className={styles.codeWindow} data-intro-art="code">
        <div className={styles.codeHeader}>
          <span>{intro.codeLabel}</span>
          <span className={styles.windowDots}>
            <i />
            <i />
            <i />
          </span>
        </div>
        <code dir="ltr">{intro.code}</code>
        <div className={styles.codeResult}>
          <Check />
          <span>{intro.resultLabel}</span>
        </div>
      </div>
      <span className={styles.successBadge} data-intro-art="success">
        <Check strokeWidth={3} />
      </span>
      <div className={styles.receipt} data-intro-art="receipt">
        <span>👩‍🍳</span>
        <span>{intro.result}</span>
      </div>
      <span className={styles.solutionSpark} data-intro-art="solution-spark">
        <Sparkles />
      </span>
    </div>
  );
};
