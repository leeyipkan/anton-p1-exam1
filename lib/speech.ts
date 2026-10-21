type NavWithSession = Navigator & { audioSession?: { type: string } };

function isAppleTouch() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iPhone = /iPad|iPhone|iPod/.test(ua);
  const iPadDesktop = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iPhone || iPadDesktop;
}

/** iPhone will not speak from a timer or from a page update. The tap itself has to start the voice. */
export function speaksOnTapOnly() {
  return isAppleTouch();
}

function allowPlayback() {
  const session = (navigator as NavWithSession).audioSession;
  if (session) session.type = "playback";
}

function englishVoice(synth: SpeechSynthesis) {
  const voices = synth.getVoices();
  return (
    voices.find((item) => item.lang.toLowerCase().startsWith("en-gb")) ??
    voices.find((item) => item.lang.toLowerCase().startsWith("en"))
  );
}

let keepAlive = 0;

function watchForPause() {
  if (keepAlive || typeof window === "undefined") return;
  // iPhone pauses the voice on its own and never starts it again.
  keepAlive = window.setInterval(() => {
    const synth = window.speechSynthesis;
    if (synth?.speaking && synth.paused) synth.resume();
  }, 250);
}

export function primeSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  allowPlayback();
  window.speechSynthesis.getVoices();
  window.speechSynthesis.resume();
  watchForPause();
}

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  const line = text.trim();
  if (!line) return false;
  const synth = window.speechSynthesis;
  primeSpeech();

  const utterance = new SpeechSynthesisUtterance(line);
  utterance.lang = "en-GB";
  utterance.rate = 0.86;
  utterance.volume = 1;
  const voice = englishVoice(synth);
  if (voice) utterance.voice = voice;

  const start = () => {
    synth.resume();
    synth.speak(utterance);
  };

  // Waiting for voices, or calling cancel() and speak() together, makes iPhone drop the sound.
  if (isAppleTouch()) {
    if (synth.speaking || synth.pending) {
      synth.cancel();
      window.setTimeout(start, 120);
    } else {
      start();
    }
    return true;
  }

  synth.cancel();
  start();
  return true;
}
