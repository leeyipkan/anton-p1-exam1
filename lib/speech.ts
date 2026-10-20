export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const say = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-GB";
    utterance.rate = 0.86;
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((item) => item.lang.toLowerCase().startsWith("en-gb")) ??
      voices.find((item) => item.lang.toLowerCase().startsWith("en"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  };
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener("voiceschanged", say, { once: true });
    return true;
  }
  say();
  return true;
}
