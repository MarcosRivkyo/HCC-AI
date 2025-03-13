"use client";
import { TextGenerateEffect } from "./text-generate-effect";

const words = `Inteligencia Artificial para el diagnóstico del carcinoma hepatocelular`;
const words_en = "Artificial Intelligence for the diagnosis of hepatocellular carcinoma";

interface TextEffectDemoProps {
  lang: string;
}

export function TextEffectDemo({ lang }: TextEffectDemoProps) {

  const text = lang === "es" ? words : lang === "eng" ? words_en : words; // Default to Spanish text if no valid lang

  return <TextGenerateEffect duration={4} filter={false} words={text} />;
}