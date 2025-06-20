"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "../../lib/utils";

const words_es =
  "Inteligencia Artificial para el diagnóstico del carcinoma hepatocelular";
const words_en =
  "Artificial Intelligence for the diagnosis of hepatocellular carcinoma";

interface TextEffectDemoProps {
  lang: "es" | "eng";
}

export function TextEffectDemo({ lang }: TextEffectDemoProps) {
  const text = lang === "es" ? words_es : words_en;

  return <TextGenerateEffect duration={4} filter={false} words={text} />;
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration,
        delay: stagger(0.2),
      },
    );
  }, [scope, animate, filter, duration]);

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="text-2xl leading-snug tracking-wide text-black dark:text-white">
          <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
              <motion.span
                key={word + idx}
                className="opacity-0 dark:text-white text-white"
                style={{ filter: filter ? "blur(10px)" : "none" }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
