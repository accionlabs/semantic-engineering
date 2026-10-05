import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource-variable/bricolage-grotesque';

/** Resolves once every face used in the film has loaded, so no frame is captured with a fallback font. */
export const fontsReady = () =>
  Promise.all([
    "400 20px 'IBM Plex Sans'", "500 20px 'IBM Plex Sans'", "600 20px 'IBM Plex Sans'",
    "400 20px 'IBM Plex Mono'", "500 20px 'IBM Plex Mono'", "700 20px 'Bricolage Grotesque Variable'",
  ].map((f) => document.fonts.load(f))).then(() => document.fonts.ready);
