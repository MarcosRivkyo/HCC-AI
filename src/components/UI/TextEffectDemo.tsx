"use client";
import { TextGenerateEffect } from "./text-generate-effect";
 
const words = `Inteligencia Artificial para el diagnóstico del carcinoma hepatocelular`;
 
export function TextEffectDemo() {
  return <TextGenerateEffect duration={4} filter={false} words={words} />;
}