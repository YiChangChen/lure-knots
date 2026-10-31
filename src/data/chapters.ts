export type Block =
  | { t: 'h'; text: string }
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'compare'; heads: string[]; rows: { label: string; cells: string[] }[] }
  | { t: 'callout'; kind: 'tip' | 'warn' | 'check'; text: string }
  | { t: 'diagram'; id: DiagramId; caption: string }
  | { t: 'knots'; ids: string[] }
  | { t: 'knotTools' };

export type DiagramId = 'spinning' | 'baitcasting' | 'line-system';

export type Chapter = {
  id: string;
  no: number;
  title: string;
  en: string;
  sum: string;
  /** false = 第二批章節，首頁顯示「即將推出」 */
  ready: boolean;
  /** 本章收錄的結，依學習順序排列；詳情頁的「下一個」只在這個清單內跳 */
  knots?: string[];
  blocks: Block[];
};

/* 「待校對」提示框：凡是建議值、規格、做法有出入空間的地方都標出來，等作者校對後再移除。 */
const check = (text: string): Block => ({ t: 'callout', kind: 'check', text });

export const CHAPTERS: Chapter[] = [
  {
    id: 'gear',
    no: 1,
    title: '器材總覽與入門預算',
    en: 'GEAR & BUDGET',
    sum: '一套路亞需要哪些東西，先買什麼最划算。',
    ready: false,
    blocks: [],
  },
  {
    id: 'vs-bait',
    no: 2,
    title: '路亞 vs 手竿',
    en: 'LURE VS BAIT FISHING',
    sum: '兩種釣法差在哪，哪一種適合你。',
    ready: true,
    blocks: [
      { t: 'p', text: '「手竿」是傳統釣法：竿子直接綁線，掛上活餌或餌料（例如蚯蚓、麵糰），把鉤子放進水裡等魚來吃。「路亞」（lure，假餌釣法）則是用人工做的假餌，靠你拋出去、收回來的動作，模仿小魚或蟲，引誘魚追咬。' },
      { t: 'compare', heads: ['路亞', '手竿'], rows: [
        { label: '釣餌', cells: ['人工假餌，可重複使用，不用準備活餌', '活餌或餌料，要現買或現調，用完就沒了'] },
        { label: '操作', cells: ['主動：拋出去、收回來，一邊走一邊找魚', '守候：選好釣點，把餌放進水裡等魚上門'] },
        { label: '器材', cells: ['路亞竿加捲線器，線穿過導線環', '手竿通常沒有捲線器，線直接綁在竿尖'] },
        { label: '上手門檻', cells: ['拋投與收線需要練習，綁結要學', '操作簡單，重點在選餌與觀察浮標'] },
        { label: '成本', cells: ['器材與假餌的初期花費較高，之後幾乎不用再買餌', '器材便宜，但餌要持續花錢'] },
        { label: '攜帶性與機動性', cells: ['輕裝，一個小包就能換點', '竿長、要帶餌與椅子，換點較費力'] },
      ] },
      { t: 'callout', kind: 'tip', text: '兩種釣法沒有誰比較好。想邊走邊釣、喜歡主動出擊，選路亞；想放鬆坐著等魚，選手竿。' },
    ],
  },
  {
    id: 'rod-reel',
    no: 3,
    title: '竿與捲線器',
    en: 'RODS & REELS',
    sum: '路亞竿怎麼挑，紡車式與水滴輪差在哪。',
    ready: true,
    knots: ['arbor'],
    blocks: [
      { t: 'h', text: '路亞竿' },
      { t: 'p', text: '路亞竿比手竿短，竿身上有一排導線環（guide，讓釣線通過的小圈），搭配捲線器使用。挑竿時最常看三件事：長度、硬度與調性、好不好攜帶。' },
      { t: 'h', text: '長度' },
      { t: 'list', items: [
        '溪流、小河：選 6 尺到 6 尺 6 的短竿，在草叢或樹木間比較好揮竿。',
        '水庫、大池塘、開闊岸邊：選 7 尺上下（約 6 尺 6 到 7 尺 6），拋得遠，也還好操控。',
      ] },
      { t: 'h', text: '硬度與調性' },
      { t: 'p', text: '硬度（power）用英文縮寫標示，例如 L（輕）、ML（中輕）、M（中）。調性（action）指竿子受力時從哪裡開始彎。' },
      { t: 'list', items: [
        '硬度：L、ML、M 最適合新手，足以應付多數小型到中型的淡水魚，例如吳郭魚、曲腰魚、中小型慈鯛、福壽魚。',
        '調性：選中偏快調（Fast 或 Regular-Fast），軟餌、亮片、小型硬餌都能靈活操作。',
      ] },
      { t: 'h', text: '攜帶方便性' },
      { t: 'p', text: '如果常騎機車或搭大眾運輸出門，可以選 4 節的插接竿（旅竿），收起來很短，好攜帶。' },
      check('魚種名單（吳郭魚、曲腰魚、福壽魚等）請確認用字。'),

      { t: 'h', text: '兩種捲線器' },
      { t: 'p', text: '捲線器（reel）負責收線、放線。入門只需要認識兩種：紡車式，和水滴輪。' },
      { t: 'diagram', id: 'spinning', caption: '紡車式：捲線軸固定朝前，拋投時線從軸頭一圈圈甩出去。' },
      { t: 'diagram', id: 'baitcasting', caption: '水滴輪：捲線軸會跟著旋轉，要用拇指控制放線速度。' },
      { t: 'compare', heads: ['紡車式', '水滴輪'], rows: [
        { label: '構造', cells: ['捲線軸固定，捲線時由轉臂繞線', '捲線軸本身旋轉，裝在竿子上方'] },
        { label: '拋投難度', cells: ['容易，適合新手', '難，放線太快會亂成一團（俗稱炸線、backlash）'] },
        { label: '適合的假餌', cells: ['輕到中等重量都能拋，特別適合很輕的餌', '中等以上重量的餌更順手'] },
        { label: '價格', cells: ['入門款選擇多、價格親民', '同等級通常較貴'] },
        { label: '新手建議', cells: ['首選', '等熟悉路亞後再考慮'] },
      ] },
      { t: 'callout', kind: 'tip', text: '還有鼓式、電動等其他種類，入門先不用管。第一套就買紡車式。' },
      check('捲線器尺寸（例如 2000 型）與入門價格範圍請校對後再補。'),

      { t: 'h', text: '把線上到捲線器' },
      { t: 'p', text: '新線第一步是把線綁在捲線軸（線杯）上，這個結只要固定住線，不需要承受魚的拉力。' },
      { t: 'knots', ids: ['arbor'] },
    ],
  },
  {
    id: 'line-system',
    no: 4,
    title: '母線、子線與連接結',
    en: 'MAIN LINE & LEADER',
    sum: '為什麼要兩條線，兩條線怎麼接在一起。',
    ready: true,
    knots: ['fg', 'uni'],
    blocks: [
      { t: 'p', text: '路亞常用兩條線接起來：捲線器上的叫「母線」（主線，main line），尾端接的一小段叫「子線」（前導線，leader），最後才綁假餌。' },
      { t: 'diagram', id: 'line-system', caption: '母線連到竿子，子線連到假餌，中間用連接結相接。' },
      { t: 'h', text: '為什麼要多接一段子線' },
      { t: 'list', items: [
        '耐磨：魚牙、石頭、水草會磨線，子線通常比母線更耐磨。',
        '不顯眼：有些子線在水裡比較不容易被魚看見。',
        '緩衝：子線較有彈性，能吸收衝擊力。',
        '好更換：子線磨損了只換這一小段，不用換整條母線。',
      ] },
      check('母線與子線常見的材質搭配（PE 配碳纖線、尼龍配尼龍）、粗細比例與子線長度建議值，請校對後再補，這裡先不寫數字。'),

      { t: 'h', text: '連接兩條線的結' },
      { t: 'knots', ids: ['fg', 'uni'] },
      { t: 'h', text: '綁結小工具' },
      { t: 'p', text: '下面是原本的綁結工具：圖例說明、該綁哪個結、強度比較，與每個結都適用的小技巧。' },
      { t: 'knotTools' },
    ],
  },
  {
    id: 'lure-knots',
    no: 5,
    title: '子線綁假餌的結',
    en: 'TYING ON A LURE',
    sum: '子線尾端怎麼把假餌綁牢。',
    ready: true,
    knots: ['palomar', 'clinch', 'rapala'],
    blocks: [
      { t: 'p', text: '假餌的前端有個小環（叫「環眼」，eye），子線要穿過它再打結固定。結打得好不好，直接決定魚咬住時會不會斷線。三個結各有擅長的情況。' },
      { t: 'knots', ids: ['palomar', 'clinch', 'rapala'] },
      { t: 'callout', kind: 'tip', text: '不確定選哪個，就先學帕洛馬結。它步驟少，大多數情況都能用。' },
      { t: 'callout', kind: 'warn', text: '不論哪個結，拉緊前都要先沾濕。乾拉會磨熱線，結容易變弱。' },
      check('「扣環」（snap）的優缺點與使用情境，是否要在本章補一節？請決定。'),
    ],
  },
  {
    id: 'lures',
    no: 6,
    title: '假餌的選擇',
    en: 'CHOOSING LURES',
    sum: '五種入門假餌，各自什麼時候用。',
    ready: false,
    blocks: [],
  },
  {
    id: 'techniques',
    no: 7,
    title: '各種釣法',
    en: 'TECHNIQUES',
    sum: '五種入門釣法：怎麼收線、搭配什麼餌。',
    ready: false,
    blocks: [],
  },
  {
    id: 'safety',
    no: 8,
    title: '安全與釣魚規範',
    en: 'SAFETY & RULES',
    sum: '出門前要知道的安全與禁止事項。',
    ready: false,
    blocks: [],
  },
];

export const findChapter = (id: string) => CHAPTERS.find(c => c.id === id);
export const chapterOfKnot = (knotId: string) => CHAPTERS.find(c => c.knots?.includes(knotId));
export const READY_CHAPTERS = CHAPTERS.filter(c => c.ready);
