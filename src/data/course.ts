import { Unit } from '../types';

export const COURSE: Unit[] = [
  {
    id: 'unit-1',
    title: 'קרבן עולה',
    hebrewTitle: 'קָרְבַּן עוֹלָה',
    description: 'פרשת ויקרא — פּסוקים א–ג',
    color: '#009688',
    lessons: [
      {
        id: 'pasuk-1',
        unitId: 'unit-1',
        title: 'פּסוק א',
        description: 'וַיִּקְרָא אֶל מֹשֶׁה...',
        pasukNumber: 1,
        pasukText: 'וַיִּקְרָא אֶל מֹשֶׁה וַיְדַבֵּר יְהֹוָה אֵלָיו מֵאֹהֶל מוֹעֵד לֵאמֹר',
        wordIds: ['vayikra', 'el-moshe', 'vaydaber', 'elav', 'meohelmoed', 'lemor'],
        unlocked: true,
      },
      {
        id: 'pasuk-2',
        unitId: 'unit-1',
        title: 'פּסוק ב',
        description: 'דַּבֵּר אֶל בְּנֵי יִשְׂרָאֵל...',
        pasukNumber: 2,
        pasukText: 'דַּבֵּר אֶל בְּנֵי יִשְׂרָאֵל וְאָמַרְתָּ אֲלֵהֶם אָדָם כִּי יַקְרִיב מִכֶּם קָרְבָּן לַיהֹוָה מִן הַבְּהֵמָה מִן הַבָּקָר וּמִן הַצֹּאן תַּקְרִיבוּ אֶת קָרְבַּנְכֶם',
        wordIds: ['daber', 'el-bnei', 'veamarta', 'aleihem', 'adam', 'ki-yakriv', 'mikem', 'korban', 'lahashem', 'min-habehema', 'min-habakar', 'umin-hatzon', 'takrivoo', 'et-korbanchem'],
        unlocked: false,
      },
      {
        id: 'pasuk-3',
        unitId: 'unit-1',
        title: 'פּסוק ג',
        description: 'אִם עֹלָה קָרְבָּנוֹ...',
        pasukNumber: 3,
        pasukText: 'אִם עֹלָה קָרְבָּנוֹ מִן הַבָּקָר זָכָר תָּמִים יַקְרִיבֶנּוּ אֶל פֶּתַח אֹהֶל מוֹעֵד יַקְרִיב אֹתוֹ לִרְצֹנוֹ לִפְנֵי יְהֹוָה',
        wordIds: ['im-olah', 'korbano', 'bakar-3', 'zachar', 'tamim', 'yakrivenu', 'el-petach', 'ohelmoed-3', 'yakriv-oto', 'lirtzono', 'lifnei'],
        unlocked: false,
      },
    ],
  },
];

// Ordered list of all lesson IDs for unlock logic
export const LESSON_ORDER = COURSE.flatMap(u => u.lessons.map(l => l.id));
