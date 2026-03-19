import { VocabWord } from '../types';

export const VOCABULARY: VocabWord[] = [
  // ── פסוק א ──────────────────────────────────────────────────────────
  { id: 'vayikra',    hebrew: 'וַיִּקְרָא',     yiddish: 'און ער האט גערופן',        emoji: '📢', category: 'general', pasukId: 'pasuk-1', highlight: 'וַיִּקְרָא' },
  { id: 'ohelmoed',   hebrew: 'אֹהֶל מוֹעֵד',   yiddish: 'אוהל מועד',                emoji: '⛺', category: 'general', pasukId: 'pasuk-1', highlight: 'אֹהֶל מוֹעֵד' },

  // ── פסוק ב ──────────────────────────────────────────────────────────
  { id: 'adam',       hebrew: 'אָדָם',           yiddish: 'א מענטש',                  emoji: '🧑', category: 'general', pasukId: 'pasuk-2', highlight: 'אָדָם' },
  { id: 'korban',     hebrew: 'קָרְבָּן',         yiddish: 'א קרבן',                   emoji: '🐂', category: 'olah',    pasukId: 'pasuk-2', highlight: 'קָרְבָּן' },
  { id: 'bakar',      hebrew: 'הַבָּקָר',         yiddish: 'פון די רינדער',            emoji: '🐄', category: 'olah',    pasukId: 'pasuk-2', highlight: 'הַבָּקָר' },
  { id: 'tzon',       hebrew: 'הַצֹּאן',          yiddish: 'פון די שאף',               emoji: '🐑', category: 'olah',    pasukId: 'pasuk-2', highlight: 'הַצֹּאן' },

  // ── פסוק ג ──────────────────────────────────────────────────────────
  { id: 'olah',       hebrew: 'עֹלָה',            yiddish: 'א קרבן עולה',              emoji: '🔥', category: 'olah',    pasukId: 'pasuk-3', highlight: 'עֹלָה' },
  { id: 'zachar',     hebrew: 'זָכָר',            yiddish: 'א זכר',                    emoji: '♂️', category: 'olah',    pasukId: 'pasuk-3', highlight: 'זָכָר' },
  { id: 'tamim',      hebrew: 'תָּמִים',           yiddish: 'א גאנצער אהן א פעלער',    emoji: '✅', category: 'olah',    pasukId: 'pasuk-3', highlight: 'תָּמִים' },
  { id: 'petach',     hebrew: 'פֶּתַח',           yiddish: 'די טיהר',                  emoji: '🚪', category: 'general', pasukId: 'pasuk-3', highlight: 'פֶּתַח' },
  { id: 'lirtzono',   hebrew: 'לִרְצֹנוֹ',        yiddish: 'צו זיין גוטן ווילן',        emoji: '🙌', category: 'olah',   pasukId: 'pasuk-3', highlight: 'לִרְצֹנוֹ' },

  // ── פסוק ד ──────────────────────────────────────────────────────────
  { id: 'vesamach',   hebrew: 'וְסָמַךְ',         yiddish: 'און ער זאל אנשפארן',       emoji: '🤲', category: 'olah',    pasukId: 'pasuk-4', highlight: 'וְסָמַךְ' },
  { id: 'yado',       hebrew: 'יָדוֹ',            yiddish: 'זיין האנט',                emoji: '🤚', category: 'olah',    pasukId: 'pasuk-4', highlight: 'יָדוֹ' },
  { id: 'rosh',       hebrew: 'רֹאשׁ',            yiddish: 'דעם קאפ',                  emoji: '👆', category: 'olah',    pasukId: 'pasuk-4', highlight: 'רֹאשׁ' },
  { id: 'venirtzah',  hebrew: 'וְנִרְצָה',        yiddish: 'עס וועט ווערין באוויליגט', emoji: '✨', category: 'olah',   pasukId: 'pasuk-4', highlight: 'וְנִרְצָה' },
  { id: 'lechaper',   hebrew: 'לְכַפֵּר',          yiddish: 'צו פארגעבן',               emoji: '🙏', category: 'general', pasukId: 'pasuk-4', highlight: 'לְכַפֵּר' },

  // ── פסוק ה ──────────────────────────────────────────────────────────
  { id: 'veshachat',  hebrew: 'וְשָׁחַט',         yiddish: 'ער זאל שעכטן',             emoji: '🔪', category: 'olah',    pasukId: 'pasuk-5', highlight: 'וְשָׁחַט' },
  { id: 'hakohenim',  hebrew: 'הַכֹּהֲנִים',       yiddish: 'די כהנים',                 emoji: '👨‍💼', category: 'general', pasukId: 'pasuk-5', highlight: 'הַכֹּהֲנִים' },
  { id: 'hadam',      hebrew: 'הַדָּם',            yiddish: 'די בלוט',                  emoji: '🩸', category: 'olah',    pasukId: 'pasuk-5', highlight: 'הַדָּם' },
  { id: 'vezarku',    hebrew: 'וְזָרְקוּ',         yiddish: 'און זיי זאלן שפריצן',      emoji: '💦', category: 'olah',    pasukId: 'pasuk-5', highlight: 'וְזָרְקוּ' },
  { id: 'hamizbeiach',hebrew: 'הַמִּזְבֵּחַ',      yiddish: 'דעם מזבח',                 emoji: '⛩️', category: 'general', pasukId: 'pasuk-5', highlight: 'הַמִּזְבֵּחַ' },
  { id: 'saviv',      hebrew: 'סָבִיב',           yiddish: 'ארום און ארום',            emoji: '🔄', category: 'olah',    pasukId: 'pasuk-5', highlight: 'סָבִיב' },

  // ── Extra words (future lessons) ────────────────────────────────────
  { id: 'hakohen',    hebrew: 'הַכֹּהֵן',          yiddish: 'דער כהן',                  emoji: '👨‍💼', category: 'general' },
  { id: 'eish',       hebrew: 'אֵשׁ',              yiddish: 'פייער',                    emoji: '🔥', category: 'olah' },
  { id: 'eitzim',     hebrew: 'עֵצִים',            yiddish: 'העלצער',                   emoji: '🪵', category: 'olah' },
  { id: 'reichnichoach', hebrew: 'רֵיחַ נִיחוֹחַ', yiddish: 'א געשמאקן ריח',           emoji: '✨', category: 'olah' },
  { id: 'tzafona',    hebrew: 'צָפֹנָה',           yiddish: 'אויף צפון זייט',           emoji: '⬆️', category: 'olah' },
  { id: 'izim',       hebrew: 'עִזִּים',            yiddish: 'ציגן',                     emoji: '🐐', category: 'olah' },
  { id: 'kvasim',     hebrew: 'כְּשָׂבִים',         yiddish: 'שעפּסן',                   emoji: '🐏', category: 'olah' },
];

export function getWordById(id: string): VocabWord | undefined {
  return VOCABULARY.find(w => w.id === id);
}

export function getDistractors(wordId: string, pasukId: string | undefined, count = 3): VocabWord[] {
  // Prefer distractors from the same pasuk (more challenging), fall back to all
  const samePasuk = VOCABULARY.filter(w => w.id !== wordId && w.pasukId === pasukId);
  const others = VOCABULARY.filter(w => w.id !== wordId && w.pasukId !== pasukId);
  const pool = [...samePasuk, ...others];
  return pool.sort(() => Math.random() - 0.5).slice(0, count);
}
