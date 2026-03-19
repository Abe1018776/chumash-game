import { VocabWord } from '../types';

export const VOCABULARY: VocabWord[] = [
  // ── פסוק א ──────────────────────────────────────────────────────────
  { id: 'vayikra',      hebrew: 'וַיִּקְרָא',           yiddish: 'און ער האט גערופן',                emoji: '📢', category: 'general', pasukId: 'pasuk-1', highlight: 'וַיִּקְרָא' },
  { id: 'el-moshe',     hebrew: 'אֶל מֹשֶׁה',           yiddish: 'צו משה',                           emoji: '👨', category: 'general', pasukId: 'pasuk-1', highlight: 'אֶל מֹשֶׁה' },
  { id: 'vaydaber',     hebrew: 'וַיְדַבֵּר ה׳',        yiddish: 'און דער אויבערשטער האט גערעדט',   emoji: '🗣️', category: 'general', pasukId: 'pasuk-1', highlight: 'וַיְדַבֵּר יְהֹוָה' },
  { id: 'elav',         hebrew: 'אֵלָיו',               yiddish: 'צו איהם',                          emoji: '👈', category: 'general', pasukId: 'pasuk-1', highlight: 'אֵלָיו' },
  { id: 'meohelmoed',   hebrew: 'מֵאֹהֶל מוֹעֵד',      yiddish: 'פון אוהל מועד',                    emoji: '⛺', category: 'general', pasukId: 'pasuk-1', highlight: 'מֵאֹהֶל מוֹעֵד' },
  { id: 'lemor',        hebrew: 'לֵאמֹר',               yiddish: 'אזוי צו זאגן',                     emoji: '💬', category: 'general', pasukId: 'pasuk-1', highlight: 'לֵאמֹר' },

  // ── פסוק ב ──────────────────────────────────────────────────────────
  { id: 'daber',        hebrew: 'דַּבֵּר',               yiddish: 'רעד',                              emoji: '🗣️', category: 'general', pasukId: 'pasuk-2', highlight: 'דַּבֵּר' },
  { id: 'el-bnei',      hebrew: 'אֶל בְּנֵי יִשְׂרָאֵל', yiddish: 'צו די אידישע קינדער',             emoji: '👧', category: 'general', pasukId: 'pasuk-2', highlight: 'אֶל בְּנֵי יִשְׂרָאֵל' },
  { id: 'veamarta',     hebrew: 'וְאָמַרְתָּ',           yiddish: 'און דו זאלסט זאגן',                emoji: '✋', category: 'general', pasukId: 'pasuk-2', highlight: 'וְאָמַרְתָּ' },
  { id: 'aleihem',      hebrew: 'אֲלֵהֶם',               yiddish: 'צו זיי',                           emoji: '👥', category: 'general', pasukId: 'pasuk-2', highlight: 'אֲלֵהֶם' },
  { id: 'adam',         hebrew: 'אָדָם',                 yiddish: 'א מענטש',                          emoji: '🧑', category: 'general', pasukId: 'pasuk-2', highlight: 'אָדָם' },
  { id: 'ki-yakriv',    hebrew: 'כִּי יַקְרִיב',         yiddish: 'אז ער וועט ברענגען',               emoji: '🐄', category: 'general', pasukId: 'pasuk-2', highlight: 'כִּי יַקְרִיב' },
  { id: 'mikem',        hebrew: 'מִכֶּם',                yiddish: 'פון אייך',                         emoji: '👈', category: 'general', pasukId: 'pasuk-2', highlight: 'מִכֶּם' },
  { id: 'korban',       hebrew: 'קָרְבָּן',               yiddish: 'א קרבן',                           emoji: '🐂', category: 'olah',    pasukId: 'pasuk-2', highlight: 'קָרְבָּן' },
  { id: 'lahashem',     hebrew: 'לַה׳',                  yiddish: 'צו דער אויבערשטער',                emoji: '✡️', category: 'general', pasukId: 'pasuk-2', highlight: 'לַיהֹוָה' },
  { id: 'min-habehema', hebrew: 'מִן הַבְּהֵמָה',        yiddish: 'פון די בהמות',                     emoji: '🐄', category: 'olah',    pasukId: 'pasuk-2', highlight: 'מִן הַבְּהֵמָה' },
  { id: 'min-habakar',  hebrew: 'מִן הַבָּקָר',           yiddish: 'פון די רינדער',                    emoji: '🐄', category: 'olah',    pasukId: 'pasuk-2', highlight: 'מִן הַבָּקָר' },
  { id: 'umin-hatzon',  hebrew: 'וּמִן הַצֹּאן',          yiddish: 'און פון די שאף',                   emoji: '🐑', category: 'olah',    pasukId: 'pasuk-2', highlight: 'וּמִן הַצֹּאן' },
  { id: 'takrivoo',     hebrew: 'תַּקְרִיבוּ',            yiddish: 'זאלט איהר ברענגען',                emoji: '🙌', category: 'general', pasukId: 'pasuk-2', highlight: 'תַּקְרִיבוּ' },
  { id: 'et-korbanchem',hebrew: 'אֶת קָרְבַּנְכֶם',      yiddish: 'אייער קרבן',                       emoji: '🐂', category: 'olah',    pasukId: 'pasuk-2', highlight: 'אֶת קָרְבַּנְכֶם' },

  // ── פסוק ג ──────────────────────────────────────────────────────────
  { id: 'im-olah',      hebrew: 'אִם עֹלָה',             yiddish: 'אויב א קרבן עולה',                 emoji: '🔥', category: 'olah',    pasukId: 'pasuk-3', highlight: 'אִם עֹלָה' },
  { id: 'korbano',      hebrew: 'קָרְבָּנוֹ',             yiddish: 'איז זיין קרבן',                    emoji: '🐂', category: 'olah',    pasukId: 'pasuk-3', highlight: 'קָרְבָּנוֹ' },
  { id: 'bakar-3',      hebrew: 'מִן הַבָּקָר',           yiddish: 'פון די רינדער',                    emoji: '🐄', category: 'olah',    pasukId: 'pasuk-3', highlight: 'מִן הַבָּקָר' },
  { id: 'zachar',       hebrew: 'זָכָר',                  yiddish: 'א זכר',                            emoji: '♂️', category: 'olah',    pasukId: 'pasuk-3', highlight: 'זָכָר' },
  { id: 'tamim',        hebrew: 'תָּמִים',                yiddish: 'א גאנצער אהן א פעלער',             emoji: '✅', category: 'olah',    pasukId: 'pasuk-3', highlight: 'תָּמִים' },
  { id: 'yakrivenu',    hebrew: 'יַקְרִיבֶנּוּ',          yiddish: 'זאל ער איהם דערנענטערן',           emoji: '🙏', category: 'olah',    pasukId: 'pasuk-3', highlight: 'יַקְרִיבֶנּוּ' },
  { id: 'el-petach',    hebrew: 'אֶל פֶּתַח',             yiddish: 'צו די טיהר',                       emoji: '🚪', category: 'general', pasukId: 'pasuk-3', highlight: 'אֶל פֶּתַח' },
  { id: 'ohelmoed-3',   hebrew: 'אֹהֶל מוֹעֵד',          yiddish: 'פון אוהל מועד',                    emoji: '⛺', category: 'general', pasukId: 'pasuk-3', highlight: 'אֹהֶל מוֹעֵד' },
  { id: 'yakriv-oto',   hebrew: 'יַקְרִיב אֹתוֹ',         yiddish: 'זאל ער איהם דערנענטערן',           emoji: '🙌', category: 'olah',    pasukId: 'pasuk-3', highlight: 'יַקְרִיב אֹתוֹ' },
  { id: 'lirtzono',     hebrew: 'לִרְצֹנוֹ',              yiddish: 'צו זיין גוטן ווילן',               emoji: '💛', category: 'olah',    pasukId: 'pasuk-3', highlight: 'לִרְצֹנוֹ' },
  { id: 'lifnei',       hebrew: 'לִפְנֵי ה׳',             yiddish: 'פאר דעם אויבערשטער',               emoji: '✡️', category: 'general', pasukId: 'pasuk-3', highlight: 'לִפְנֵי יְהֹוָה' },

  // ── Extra (used as distractors) ──────────────────────────────────────
  { id: 'hakohen',      hebrew: 'הַכֹּהֵן',               yiddish: 'דער כהן',                          emoji: '👨‍💼', category: 'general' },
  { id: 'vesamach',     hebrew: 'וְסָמַךְ',               yiddish: 'און ער זאל אנשפארן',               emoji: '🤲', category: 'olah' },
  { id: 'venirtzah',    hebrew: 'וְנִרְצָה',              yiddish: 'עס וועט ווערין באוויליגט',          emoji: '✨', category: 'olah' },
  { id: 'veshachat',    hebrew: 'וְשָׁחַט',               yiddish: 'ער זאל שעכטן',                     emoji: '🔪', category: 'olah' },
  { id: 'hadam',        hebrew: 'הַדָּם',                  yiddish: 'די בלוט',                          emoji: '🩸', category: 'olah' },
  { id: 'vezarku',      hebrew: 'וְזָרְקוּ',               yiddish: 'און זיי זאלן שפריצן',              emoji: '💦', category: 'olah' },
  { id: 'hamizbeiach',  hebrew: 'הַמִּזְבֵּחַ',            yiddish: 'דעם מזבח',                         emoji: '⛩️', category: 'general' },
  { id: 'eish',         hebrew: 'אֵשׁ',                   yiddish: 'פייער',                            emoji: '🔥', category: 'olah' },
  { id: 'eitzim',       hebrew: 'עֵצִים',                  yiddish: 'העלצער',                           emoji: '🪵', category: 'olah' },
  { id: 'reichnichoach',hebrew: 'רֵיחַ נִיחוֹחַ',          yiddish: 'א געשמאקן ריח',                   emoji: '✨', category: 'olah' },
  { id: 'tzafona',      hebrew: 'צָפֹנָה',                 yiddish: 'אויף צפון זייט',                   emoji: '⬆️', category: 'olah' },
  { id: 'izim',         hebrew: 'עִזִּים',                  yiddish: 'ציגן',                             emoji: '🐐', category: 'olah' },
  { id: 'kvasim',       hebrew: 'כְּשָׂבִים',              yiddish: 'שעפּסן',                           emoji: '🐏', category: 'olah' },
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
