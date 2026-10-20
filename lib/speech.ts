export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.86;
  const voice =
    window.speechSynthesis
      .getVoices()
      .find((item) => item.lang.toLowerCase().startsWith("en-gb")) ??
    window.speechSynthesis
      .getVoices()
      .find((item) => item.lang.toLowerCase().startsWith("en"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}
