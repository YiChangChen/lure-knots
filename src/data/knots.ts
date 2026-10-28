export type LineColor = 'main' | 'tag' | 'leader';

export type Op =
  | { t: 'line'; c: LineColor; d: string; arrow?: boolean }
  | { t: 'dbl'; d: string }
  | { t: 'coil'; xs: number; xe: number; y: number; n: number; amp: number; c: LineColor; core?: { y: number; c: LineColor; x0?: number; x1?: number }[] }
  | { t: 'ring' }
  | { t: 'lure' }
  | { t: 'spool'; cx: number; cy: number; r: number; R: number }
  | { t: 'hold'; x: number; y: number }
  | { t: 'knob'; x: number; y: number }
  | { t: 'arrow'; d: string; solid?: boolean }
  | { t: 'label'; x: number; y: number; text: string; a?: 'start' | 'middle' | 'end'; to?: [number, number] }
  | { t: 'dim'; x0: number; x1: number; y: number; text: string }
  | { t: 'cut'; x: number; y: number };

export type Step = { title: string; text: string; tip?: string; scene: Op[] };

export type Knot = {
  id: string;
  name: string;
  en: string;
  use: 'lure' | 'line' | 'reel';
  diff: 1 | 2 | 3;
  strength: [number, number] | null;
  lines: string;
  where: string;
  sum: string;
  steps: Step[];
};

export const USE_LABEL: Record<Knot['use'], string> = { lure: '線接路亞', line: '線接線', reel: '線接捲線器' };
export const DIFF_LABEL = ['', '簡單', '中等', '需要練習'];

/* Scene shorthands. All diagrams share a 380 × 220 canvas; the ring sits at (296, 110). */
const ln = (c: LineColor, d: string, arrow?: boolean): Op => ({ t: 'line', c, d, arrow });
const db = (d: string): Op => ({ t: 'dbl', d });
const cl = (xs: number, xe: number, y: number, n: number, amp: number, c: LineColor, core?: { y: number; c: LineColor; x0?: number; x1?: number }[]): Op =>
  ({ t: 'coil', xs, xe, y, n, amp, c, core });
const ar = (d: string, solid?: boolean): Op => ({ t: 'arrow', d, solid });
const lb = (x: number, y: number, text: string, a?: 'start' | 'middle' | 'end', to?: [number, number]): Op => ({ t: 'label', x, y, text, a, to });
const dm = (x0: number, x1: number, y: number, text: string): Op => ({ t: 'dim', x0, x1, y, text });
const cut = (x: number, y: number): Op => ({ t: 'cut', x, y });
const L: Op = { t: 'lure' };
const R: Op = { t: 'ring' };
const SP: Op = { t: 'spool', cx: 250, cy: 110, r: 30, R: 62 };
const HOLD: Op = { t: 'hold', x: 340, y: 110 };
const pullMain = [ar('M150 156 L56 156', true), lb(103, 178, '拉主線', 'middle')];
const pullLure = [ar('M322 156 L366 156', true), lb(344, 178, '拉路亞', 'middle')];

// Improved clinch
const EYE_MAIN = 'M14 122 L294 122 C301 122 304 118 304 112';
const eyeTag = (x: number) => `M304 112 C304 103 298 99 290 99 L${x} 99`;
const C_LEAD = 'M304 112 C304 103 298 99 290 99 L254 99 C246 99 242 104 240 111';
const C_COIL = cl(240, 140, 122, 6, 11, 'tag', [{ y: 122, c: 'main' }]);
const C_RETURN = 'M140 111 C126 112 122 162 148 162 L262 162 C276 162 278 140 274 126 L271 110';

// Palomar
const P_MAIN = 'M14 112 L290 112 C298 112 302 108 302 104';
const P_TAG = 'M130 121 L290 121 C300 121 307 115 307 106';

// Rapala loop
const RA = 'M14 122 L150 122 C170 122 186 112 186 96 C186 80 160 78 158 96';
const RB = 'M158 96 C156 112 176 122 200 122 L294 122 C301 122 304 118 304 112';
const R_HEAD = 'M304 112 C304 103 298 99 290 99 L280 99';
const R_COIL = cl(140, 64, 122, 4, 11, 'tag', [{ y: 122, c: 'main', x0: 58, x1: 146 }]);

// FG
const F_STAND = 'M372 204 C344 198 318 172 310 140 C306 124 305 108 304 98';
const F_BRAID = cl(304, 128, 110, 10, 12, 'leader', [{ y: 110, c: 'main', x0: 122 }]);
const F_TAGBACK = 'M304 110 C334 110 344 86 322 70 C296 52 160 54 130 68 C118 74 116 82 117 89';

// Arbor
const A_WRAP = 'M250 140 A30 30 0 0 0 250 80 A30 30 0 0 0 220 110 C220 122 212 126 196 126 C188 126 186 132 186 140 L186 152';
const A_UNDER = 'M186 152 C186 164 166 164 166 152 L166 124';
const A_OVER = 'M166 124 C166 112 180 110 182 118 L178 132 C175 138 160 134 130 130';

export const KNOTS: Knot[] = [
  {
    id: 'palomar', name: '帕洛馬結', en: 'Palomar Knot', use: 'lure', diff: 1, strength: [90, 95],
    lines: '尼龍線、碳纖線、PE 線都適用', where: '路亞環眼、別針、鉤子',
    sum: '公認最強、最好學的綁路亞結之一。用對折的雙線受力，PE 線也不容易滑脫。',
    steps: [
      { title: '對折穿過環眼', text: '把線尾對折約 15 公分，讓對折形成的線環穿過路亞的環眼。',
        tip: '環眼太小、雙線穿不過時，改用改良式克林結。',
        scene: [L, ln('main', P_MAIN), ln('tag', P_TAG), R,
          ln('tag', 'M302 104 C302 94 296 88 288 84 L258 56 C246 44 256 26 272 32 C284 37 300 64 305 82 C307 90 307 98 307 106'),
          lb(20, 102, '主線'), lb(122, 126, '線尾', 'end'), dm(130, 282, 152, '對折約 15 cm'),
          lb(196, 30, '對折的線環', 'end', [252, 46])] },
      { title: '用線環打單結', text: '用線環在雙線上打一個單結，讓路亞掛在單結下方。先不要拉緊。',
        scene: [L, ln('main', P_MAIN), ln('tag', P_TAG), R,
          db('M214 134 C216 148 238 150 240 136 L244 100'),
          ln('main', 'M196 112 L282 112'), ln('tag', 'M196 121 L282 121'),
          db('M304 102 C304 88 292 80 276 80 L230 80 C214 80 208 92 210 104 L214 134'),
          db('M244 100 C246 86 264 86 264 100 L258 150 C256 166 252 180 248 192'),
          lb(110, 60, '在雙線上打一個單結', 'middle'), lb(316, 200, '線環', 'middle', [252, 190])] },
      { title: '線環套過路亞', text: '把線環整個套過路亞（或鉤子），讓線環越過路亞後落到單結上方。',
        tip: '有兩、三組三本鉤的米諾，套的時候小心鉤到線環。',
        scene: [L, ln('main', P_MAIN), ln('tag', P_TAG), R,
          db('M304 102 C304 90 292 86 278 86 L254 88 C238 90 232 104 240 116 C252 150 296 160 340 154 C384 148 386 86 346 80 C330 78 320 84 314 92'),
          ar('M262 186 C302 198 346 190 368 172'), lb(140, 198, '讓路亞整個穿過線環', 'middle')] },
      { title: '沾濕、拉緊、剪線', text: '沾濕線結，同時拉主線和線尾，讓結收緊到環眼上。剪掉線尾，留 2–3 mm。',
        scene: [L, ln('main', 'M14 116 L292 116 C299 116 302 112 302 108'), R,
          ln('tag', 'M302 108 C302 98 294 96 286 100 L280 107'),
          cl(280, 254, 116, 3, 9, 'tag', [{ y: 116, c: 'main', x1: 282 }]),
          ln('tag', 'M254 107 C248 102 247 96 250 90'), cut(236, 92),
          lb(250, 50, '線尾留 2–3 mm', 'middle', [250, 88]), ...pullMain, ...pullLure] },
    ],
  },
  {
    id: 'clinch', name: '改良式克林結', en: 'Improved Clinch Knot', use: 'lure', diff: 1, strength: [85, 95],
    lines: '尼龍線、碳纖線（PE 線容易滑，不建議）', where: '路亞環眼、別針、鉤子',
    sum: '最經典的綁鉤結，不必對折，環眼小或線較粗時也綁得上。',
    steps: [
      { title: '線尾穿過環眼', text: '把線尾穿過路亞的環眼（或別針、鉤眼），拉出約 15 公分。',
        scene: [L, ln('main', EYE_MAIN), R, ln('tag', eyeTag(170), true),
          dm(170, 286, 80, '約 15 cm'), lb(20, 148, '主線（往竿子）'), lb(156, 104, '線尾', 'end'),
          lb(296, 158, '環眼', 'middle', [296, 127]), lb(342, 80, '路亞', 'middle')] },
      { title: '繞主線 5–7 圈', text: '線尾回頭纏繞主線 5–7 圈。線越粗圈數越少，20 lb 以上約 5 圈即可。',
        tip: '用手指捏住環眼旁的位置，纏繞時線圈才不會散開。',
        scene: [L, ln('main', EYE_MAIN), R, ln('tag', C_LEAD), C_COIL,
          ln('tag', 'M140 111 C132 104 131 94 140 88', true),
          ar('M232 152 L148 152'), lb(190, 174, '纏繞主線 5–7 圈', 'middle')] },
      { title: '穿進環眼旁的小圈', text: '線尾往回帶，穿進環眼和第一圈之間的小線圈。',
        scene: [L, ln('main', EYE_MAIN), R, ln('tag', C_LEAD), C_COIL,
          ln('tag', C_RETURN, true), ln('main', 'M246 122 L286 122'),
          lb(330, 200, '穿進這個小圈', 'middle', [272, 112])] },
      { title: '再穿過大線圈', text: '線尾從上方穿過上一步形成的大線圈。這一步就是「改良式」的關鍵，可以防止滑脫。',
        scene: [L, ln('main', EYE_MAIN), R, ln('tag', C_LEAD), C_COIL,
          ln('tag', C_RETURN), ln('main', 'M246 122 L286 122'),
          ln('tag', 'M271 110 C269 90 254 88 250 98 C247 106 249 128 250 146', true),
          lb(140, 202, '再穿過下方的大線圈', 'middle', [250, 148])] },
      { title: '沾濕、拉緊、剪線', text: '沾濕線結，同時拉主線與路亞，讓線圈整齊滑到環眼上。剪掉線尾，留 2–3 mm。',
        tip: '線圈如果交疊、沒有排整齊，就剪掉重綁。',
        scene: [L, ln('main', EYE_MAIN), R,
          ln('tag', 'M304 112 C304 103 298 99 290 99 C284 99 281 104 280 114'),
          cl(280, 236, 122, 6, 8, 'tag', [{ y: 122, c: 'main', x1: 286 }]),
          ln('tag', 'M236 114 C230 110 229 104 231 99'), cut(216, 100),
          lb(232, 52, '線尾留 2–3 mm', 'middle', [232, 96]), ...pullMain, ...pullLure] },
    ],
  },
  {
    id: 'rapala', name: '拉帕拉環結', en: 'Rapala Loop Knot', use: 'lure', diff: 2, strength: [85, 90],
    lines: '尼龍線、碳纖線', where: '直接綁米諾、鉛頭鉤、軟餌（不用別針時）',
    sum: '在環眼前留下一個不會縮緊的小線環，路亞能自由擺動，泳姿更自然。',
    steps: [
      { title: '打一個鬆單結', text: '在距線尾約 15 公分處打一個鬆的單結，再把線尾穿過環眼。',
        scene: [L, ln('main', RA), ln('tag', RB), R, ln('tag', 'M304 112 C304 103 298 99 290 99 L236 99', true),
          lb(172, 68, '鬆的單結', 'middle'), lb(20, 146, '主線'), dm(172, 288, 152, '約 15 cm')] },
      { title: '穿回單結', text: '線尾從單結「出來的同一側」穿回單結。單結離環眼越遠，最後的線環越大。',
        scene: [L, ln('tag', 'M280 99 L172 99', true), ln('main', RA), ln('tag', RB), R, ln('tag', R_HEAD),
          lb(110, 198, '線尾從同一側穿回單結', 'middle', [176, 100])] },
      { title: '繞主線 3–5 圈', text: '線尾在主線上纏 3–5 圈。細線繞 5 圈，粗線繞 3 圈。',
        scene: [L, ln('tag', 'M280 99 L172 99'), ln('main', RA), ln('tag', RB), R, ln('tag', R_HEAD),
          ln('tag', 'M172 99 C162 99 150 102 140 111'), R_COIL,
          ln('tag', 'M64 111 C56 104 56 94 66 88', true),
          ar('M134 154 L70 154'), lb(102, 176, '繞主線 3–5 圈', 'middle')] },
      { title: '再穿回單結', text: '線尾再從同一側穿回單結，接著穿過剛才纏繞時形成的小圈。',
        scene: [L, ln('tag', 'M280 99 L172 99'), ln('main', RA), ln('tag', RB), R, ln('tag', R_HEAD),
          ln('tag', 'M172 99 C162 99 150 102 140 111'), R_COIL,
          ln('tag', 'M64 111 C50 96 66 68 112 68 C140 68 158 80 168 94', true),
          lb(250, 50, '再從同一側穿回單結', 'middle', [170, 96])] },
      { title: '拉緊並留下線環', text: '沾濕後先拉線尾，再拉主線與路亞，讓單結收緊但留下活動線環。剪掉多餘線尾。',
        tip: '活動線環讓米諾、軟餌左右擺動更自然。',
        scene: [L, ln('main', 'M14 120 L210 120'),
          cl(204, 170, 120, 4, 8, 'tag', [{ y: 120, c: 'main', x0: 164, x1: 210 }]),
          ln('tag', 'M204 116 C236 108 268 100 290 101 C300 102 304 106 304 112'), R,
          ln('tag', 'M304 112 C304 120 296 124 284 125 C256 126 232 124 206 122'),
          ln('tag', 'M170 112 C164 107 163 101 166 96'), cut(150, 98),
          lb(252, 56, '留下活動線環', 'middle', [252, 104]), ...pullMain, ...pullLure] },
    ],
  },
  {
    id: 'fg', name: 'FG 結', en: 'FG Knot', use: 'line', diff: 3, strength: [90, 95],
    lines: 'PE 主線 ＋ 碳纖或尼龍前導線', where: 'PE 主線接前導線',
    sum: '結又細又強，出竿時穿過導環不卡線，是 PE 接前導線最推薦的結。需要多練幾次。',
    steps: [
      { title: '拉直 PE，交叉前導線', text: '把 PE 主線拉直固定（用牙齒咬住線尾，或掛在固定物上），前導線從 PE 下方交叉放上。',
        tip: 'PE 一定要保持張力，整個編織過程都不能放鬆。',
        scene: [ln('leader', 'M70 200 L262 40'), ln('main', 'M14 110 L250 110'), ln('tag', 'M250 110 L338 110'), HOLD,
          lb(20, 96, 'PE 主線（拉直）'), lb(351, 142, '咬住固定', 'middle'), lb(270, 42, '前導線'),
          lb(118, 204, '前導線從 PE 下方交叉')] },
      { title: '交替纏繞 20–30 次', text: '前導線繞著 PE 上下交替纏繞，上一次、下一次算一次，共 20–30 次。',
        scene: [ln('leader', F_STAND), ln('main', 'M14 110 L304 110'), ln('tag', 'M304 110 L338 110'), HOLD,
          F_BRAID, ln('leader', 'M128 98 L64 98'),
          lb(62, 86, '前導線尾'), lb(20, 132, 'PE 主線'),
          ar('M290 150 L140 150'), lb(216, 172, '上下交替纏繞 20–30 次', 'middle')] },
      { title: '打 2 個半結固定', text: '放開 PE 線尾，用它在 PE 與前導線上打 2 個半結暫時固定。沾濕後用力拉，讓編織段咬住前導線。',
        scene: [ln('leader', F_STAND), ln('main', 'M14 110 L304 110'),
          F_BRAID, ln('leader', 'M128 98 L64 98'), ln('tag', F_TAGBACK),
          cl(117, 95, 104, 2, 15, 'tag', [{ y: 110, c: 'main', x0: 88, x1: 124 }, { y: 98, c: 'leader', x0: 88, x1: 124 }]),
          ln('tag', 'M95 89 C89 80 90 72 98 68', true),
          lb(210, 196, 'PE 線尾打 2 個半結', 'middle', [106, 124])] },
      { title: '剪前導線，繼續打半結', text: '剪掉前導線尾，再用 PE 線尾在主線上打 6–10 個半結，最後打一個雙半結收尾，剪掉 PE 線尾。',
        scene: [ln('leader', F_STAND), ln('main', 'M14 110 L304 110'),
          F_BRAID, ln('leader', 'M128 98 L122 98'), cut(126, 84),
          ln('tag', 'M304 110 C334 110 344 86 322 70 C296 52 160 54 130 68 C118 74 114 86 112 102'),
          cl(112, 52, 110, 6, 8, 'tag', [{ y: 110, c: 'main', x0: 46, x1: 118 }]),
          ln('tag', 'M52 102 C46 96 46 90 50 86'),
          lb(60, 36, '剪掉前導線尾', 'middle'), lb(82, 150, '再打 6–10 個半結', 'middle')] },
      { title: '沾濕拉緊測試', text: '沾濕線結，兩手分別握住 PE 與前導線用力拉。結不滑動才算完成。',
        tip: '綁好的 FG 結應該細而平順，用手指摸過去沒有明顯凸起。',
        scene: [ln('main', 'M14 110 L140 110'),
          cl(140, 96, 110, 6, 6, 'tag', [{ y: 110, c: 'main', x0: 90, x1: 146 }]),
          cl(296, 140, 110, 10, 9, 'leader', [{ y: 110, c: 'main', x0: 134, x1: 302 }]),
          ln('leader', 'M296 101 C304 104 308 110 318 110 L366 110'),
          ar('M70 150 L20 150', true), lb(45, 172, '拉 PE', 'middle'),
          ar('M310 150 L362 150', true), lb(336, 172, '拉前導線', 'middle'),
          lb(218, 60, '兩端同時用力拉', 'middle')] },
    ],
  },
  {
    id: 'uni', name: '雙 Uni 結', en: 'Uni-to-Uni Knot', use: 'line', diff: 2, strength: [80, 90],
    lines: '尼龍線、碳纖線（兩條線徑相近最好）', where: '主線接前導線、斷線後接線',
    sum: '兩條線各打一個 Uni 結再拉合。步驟簡單好記，在船上或岸邊都能快速接線。',
    steps: [
      { title: '兩條線交疊', text: '把 A、B 兩條線的末端反方向交疊約 15 公分。',
        scene: [ln('main', 'M14 104 L290 104'), ln('leader', 'M366 120 L90 120'),
          lb(20, 94, 'A 線'), lb(362, 142, 'B 線', 'end'), dm(90, 290, 166, '重疊約 15 cm')] },
      { title: 'A 線打 Uni 結', text: 'A 線尾往回彎成一個線圈，在線圈內繞兩條線 4–6 圈，拉線尾讓結收緊。',
        scene: [ln('leader', 'M366 120 L84 120'),
          ln('main', 'M14 104 L268 104 C292 104 296 66 268 64 L198 64 C180 64 174 80 176 95'),
          cl(176, 262, 112, 5, 17, 'main', [{ y: 104, c: 'main', x0: 170, x1: 268 }, { y: 120, c: 'leader', x0: 170, x1: 268 }]),
          ln('main', 'M262 95 C268 88 270 80 264 72', true),
          ar('M180 156 L258 156'), lb(220, 180, '在線圈內繞兩條線 4–6 圈', 'middle'), lb(20, 94, 'A 線')] },
      { title: 'B 線打 Uni 結', text: 'B 線尾往另一個方向做同樣的動作：彎成線圈、繞 4–6 圈、收緊。',
        scene: [ln('leader', 'M366 120 L112 120 C86 120 82 70 112 68 L182 68 C200 68 204 82 202 95'),
          ln('main', 'M14 104 L226 104 C234 104 236 108 236 112'),
          cl(236, 272, 120, 5, 8, 'main', [{ y: 120, c: 'leader', x0: 230, x1: 278 }]),
          ln('main', 'M272 112 C278 108 279 102 276 98'),
          cl(202, 120, 112, 5, 17, 'leader', [{ y: 104, c: 'main', x0: 114, x1: 208 }, { y: 120, c: 'leader', x0: 114, x1: 208 }]),
          ln('leader', 'M120 95 C114 88 114 80 120 74', true),
          lb(256, 70, 'A 結已收緊', 'middle', [254, 108]), lb(160, 192, 'B 線往反方向做同樣的事', 'middle'), lb(362, 142, 'B 線', 'end')] },
      { title: '拉合、剪線', text: '沾濕後同時拉 A、B 兩條主線，讓兩個結滑在一起緊貼。剪掉兩邊線尾。',
        scene: [ln('leader', 'M366 120 L196 120 C190 120 187 106 186 96'),
          ln('main', 'M14 104 L190 104 C198 104 202 108 202 112'),
          ln('main', 'M238 112 C244 108 245 102 242 98'),
          cl(202, 238, 120, 5, 8, 'main', [{ y: 120, c: 'leader', x0: 196, x1: 244 }]),
          cl(186, 150, 104, 5, 8, 'leader', [{ y: 104, c: 'main', x0: 144, x1: 192 }]),
          ln('leader', 'M150 96 C144 92 143 86 146 82'),
          cut(258, 92), cut(132, 84),
          ar('M120 156 L28 156', true), lb(74, 178, '拉 A 線', 'middle'),
          ar('M286 156 L362 156', true), lb(324, 178, '拉 B 線', 'middle'),
          lb(194, 48, '兩個結靠攏後剪掉線尾', 'middle')] },
    ],
  },
  {
    id: 'arbor', name: '線杯結', en: 'Arbor Knot', use: 'reel', diff: 1, strength: null,
    lines: '所有線材（PE 建議先墊尼龍底線）', where: '新線綁上捲線器線杯',
    sum: '把新線固定在捲線器線杯上的結。它不需要承受魚的拉力，只要不在線杯上空轉就好。',
    steps: [
      { title: '線繞線杯一圈', text: '先把線穿過竿子導環、打開捲線器的 bail，再把線繞線杯一圈。',
        scene: [SP, ln('main', 'M14 140 L250 140'),
          ln('tag', 'M250 140 A30 30 0 0 0 250 80 A30 30 0 0 0 220 110 C220 122 212 128 196 128 L150 128', true),
          lb(20, 160, '主線（往竿子）'), lb(140, 124, '線尾', 'end'), lb(250, 208, '捲線器線杯', 'middle', [250, 173])] },
      { title: '在主線上打單結', text: '線尾繞過主線，在主線上打一個單結。',
        scene: [SP, ln('main', 'M14 140 L250 140'), ln('tag', A_UNDER), ln('main', 'M156 140 L196 140'),
          ln('tag', A_WRAP), ln('tag', A_OVER + ' L110 130', true),
          lb(110, 60, '線尾在主線上打一個單結', 'middle'), lb(20, 160, '主線')] },
      { title: '末端再打止結', text: '在線尾最末端再打一個單結，當作防止滑脫的止結。',
        scene: [SP, ln('main', 'M14 140 L250 140'), ln('tag', A_UNDER), ln('main', 'M156 140 L196 140'),
          ln('tag', A_WRAP), ln('tag', A_OVER),
          ln('tag', 'M130 130 C110 130 100 112 112 104 C124 98 128 116 114 124 L88 136', true),
          lb(92, 196, '末端再打一個止結', 'middle', [114, 112])] },
      { title: '拉主線收緊', text: '拉主線，讓第一個單結滑到線杯上收緊，止結會把它卡住。剪掉多餘線尾。',
        tip: 'PE 線很滑，容易在線杯上空轉。先捲一層尼龍底線，或在線杯貼一小段膠帶。',
        scene: [SP, ln('main', 'M14 140 L250 140'),
          ln('tag', 'M250 140 A30 30 0 0 0 250 80 A30 30 0 0 0 229 131'),
          cl(228, 212, 140, 2, 8, 'tag', [{ y: 140, c: 'main', x0: 206, x1: 236 }]),
          ln('tag', 'M212 132 C206 128 204 122 206 118'), { t: 'knob', x: 206, y: 114 }, cut(190, 108),
          ar('M150 168 L40 168', true), lb(95, 192, '拉主線，結會滑到線杯上咬緊', 'middle')] },
    ],
  },
];

export const findKnot = (id?: string) => KNOTS.findIndex(k => k.id === id);

export const TIPS = [
  { title: '先沾濕再拉緊', text: '用水或口水潤濕線結。乾拉會摩擦生熱，尼龍線和碳纖線會因此變脆、強度下降。' },
  { title: '慢慢拉到底', text: '先讓線圈排整齊，再穩定施力收緊。猛力一扯容易讓線圈交疊，結反而不牢。' },
  { title: '線尾留 2–3 mm', text: '剪太貼會讓結在受力時滑脫；留太長則容易勾到水草或卡導環。' },
  { title: '綁完先測試', text: '兩手握住主線與路亞用力拉一次。會滑、會變形的結，下水前就重綁。' },
  { title: '經常重綁', text: '中魚、掛底或線結起毛後就剪掉重綁。前導線靠近路亞那段磨損最快。' },
];
