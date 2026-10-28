import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KNOTS, TIPS } from '../data/knots';
import { useLearned } from '../learned';
import { mono, useTheme, type Theme } from '../theme';

const FINDER: { to: string; items: [string, string][] }[] = [
  { to: '路亞・鉤・別針', items: [['palomar', '最常用、PE 線也能綁'], ['clinch', '環眼小、線比較粗'], ['rapala', '想讓路亞擺動更自然']] },
  { to: '線', items: [['fg', 'PE 主線接碳纖前導線'], ['uni', '兩條尼龍或碳纖線對接']] },
  { to: '捲線器', items: [['arbor', '新線第一次上線杯']] },
];

const LEGEND: { key: 'main' | 'tag' | 'leader'; text: string }[] = [
  { key: 'main', text: '主線（連到竿子的那段）' },
  { key: 'tag', text: '線尾（你手上移動的那端）' },
  { key: 'leader', text: '前導線／第二條線' },
];

const openKnot = (id: string) => router.push({ pathname: '/knot/[id]', params: { id } });

export default function Home() {
  const t = useTheme();
  const s = useMemo(() => makeStyles(t), [t]);
  const insets = useSafeAreaInsets();
  const { learned } = useLearned();
  const ranked = KNOTS.filter(k => k.strength).sort((a, b) => b.strength![1] - a.strength![1] || b.strength![0] - a.strength![0]);
  const pos = (v: number) => ((v - 70) / 30) * 100;

  return (
    <ScrollView style={s.root} contentContainerStyle={[s.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}>
      <View style={s.mast}>
        <Text style={s.eyebrow}>LURE FISHING · KNOT GUIDE</Text>
        <Text style={s.h1}>路亞綁結<Text style={{ color: t.tag }}>圖解</Text></Text>
        <Text style={s.lede}>路亞最常用的六個結，一步一張圖。從綁路亞、PE 接前導線，到新線上捲線器，照著圖練一次就會。</Text>
        <View style={s.progress}>
          <View style={s.track}><View style={[s.fill, { width: `${(learned.size / KNOTS.length) * 100}%` }]} /></View>
          <Text style={s.small}>已學會 <Text style={s.num}>{learned.size}</Text> / {KNOTS.length} 個結</Text>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.eyebrow}>圖例</Text>
        {LEGEND.map(l => (
          <View key={l.key} style={s.legendRow}>
            <View style={[s.swatch, { backgroundColor: t[l.key], height: l.key === 'leader' ? 6 : 4.5 }]} />
            <Text style={s.legendText}>{l.text}</Text>
          </View>
        ))}
        <View style={s.legendRow}>
          <Text style={[s.swatchArrow, { color: t.ink3 }]}>- - ▸</Text>
          <Text style={s.legendText}>動作方向</Text>
        </View>
      </View>

      <View style={s.section}>
        <Text style={s.eyebrow}>WHICH KNOT</Text>
        <Text style={s.h2}>該綁哪個結？</Text>
        <Text style={s.lede}>先看你要把線接到哪裡，再依情況挑一個結。</Text>
      </View>
      {FINDER.map(g => (
        <View key={g.to} style={s.card}>
          <Text style={s.h3}>線 <Text style={{ color: t.ink3 }}>→</Text> {g.to}</Text>
          <View style={s.tree}>
            {g.items.map(([id, q]) => {
              const k = KNOTS.find(x => x.id === id)!;
              return (
                <Pressable key={id} onPress={() => openKnot(id)} style={({ pressed }) => [s.pick, pressed && { backgroundColor: t.panel }]}
                  accessibilityRole="button" accessibilityLabel={`${k.name}，${q}`}>
                  <View style={s.branchTick} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.q}>{q}</Text>
                    <Text style={s.a}>{k.name} <Text style={{ color: t.tag }}>→</Text></Text>
                  </View>
                  {learned.has(id) && <Text style={s.ok}>✓ 已學會</Text>}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <View style={s.section}>
        <Text style={s.eyebrow}>KNOT STRENGTH</Text>
        <Text style={s.h2}>結強度比較</Text>
        <Text style={s.lede}>綁好的結通常只剩原線強度的八、九成。下表是各結常見的強度範圍。</Text>
      </View>
      <View style={s.card}>
        {ranked.map(k => (
          <Pressable key={k.id} onPress={() => openKnot(k.id)} style={s.srow} accessibilityRole="button"
            accessibilityLabel={`${k.name}，約 ${k.strength![0]} 到 ${k.strength![1]}% 原線強度`}>
            <Text style={s.sname} numberOfLines={1}>{k.name}</Text>
            <View style={s.strack}>
              {[0, 33.333, 66.667, 100].map(g => <View key={g} style={[s.gridline, { left: `${g}%` }]} />)}
              <View style={[s.sbar, {
                left: `${pos(k.strength![0])}%`, width: `${pos(k.strength![1]) - pos(k.strength![0])}%`,
                backgroundColor: k.use === 'line' ? t.leader : t.main,
              }]} />
            </View>
            <Text style={s.sval}>{k.strength![0]}–{k.strength![1]}%</Text>
          </Pressable>
        ))}
        <View style={s.srow}>
          <View style={{ width: 92 }} />
          <View style={[s.strack, { height: 16 }]}>
            {[70, 80, 90, 100].map(v => (
              <Text key={v} style={[s.tick, { left: `${pos(v)}%` }]}>{v}%</Text>
            ))}
          </View>
          <View style={{ width: 62 }} />
        </View>
        <Text style={[s.small, { marginTop: 6 }]}>藍＝線接路亞　紫＝線接線　線杯結不承受魚的拉力，不列入比較。</Text>
      </View>

      <View style={s.section}>
        <Text style={s.eyebrow}>EVERY KNOT</Text>
        <Text style={s.h2}>每個結都適用的五件事</Text>
      </View>
      {TIPS.map(tip => (
        <View key={tip.title} style={s.card}>
          <Text style={s.h3}>{tip.title}</Text>
          <Text style={s.body}>{tip.text}</Text>
        </View>
      ))}

      <Text style={[s.small, { marginTop: 12 }]}>圖解為示意圖，線的粗細與距離未按比例。強度數值為常見測試的大致範圍，會隨線材品牌、線徑與綁結手法改變。</Text>
    </ScrollView>
  );
}

const makeStyles = (t: Theme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: t.bg },
  content: { paddingHorizontal: 16, gap: 12 },
  mast: { gap: 6, marginBottom: 8 },
  eyebrow: { fontFamily: mono, fontSize: 11, letterSpacing: 1.8, color: t.ink3 },
  h1: { fontSize: 38, fontWeight: '800', color: t.ink, letterSpacing: 1 },
  h2: { fontSize: 24, fontWeight: '800', color: t.ink },
  h3: { fontSize: 17, fontWeight: '700', color: t.ink },
  lede: { fontSize: 15, lineHeight: 24, color: t.ink2 },
  body: { fontSize: 14, lineHeight: 22, color: t.ink2 },
  small: { fontSize: 12.5, lineHeight: 19, color: t.ink3 },
  num: { fontFamily: mono, color: t.ink, fontWeight: '600' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  track: { width: 120, height: 6, borderRadius: 3, backgroundColor: t.panel2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: t.good },
  section: { gap: 4, marginTop: 20 },
  card: { backgroundColor: t.surface, borderColor: t.rule, borderWidth: 1, borderRadius: 14, padding: 16, gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  swatch: { width: 36, borderRadius: 3 },
  swatchArrow: { width: 36, fontSize: 12, fontFamily: mono },
  legendText: { fontSize: 14, color: t.ink2 },
  tree: { borderLeftWidth: 2, borderLeftColor: t.rule, marginLeft: 2, paddingLeft: 12, gap: 2 },
  pick: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
  branchTick: { position: 'absolute', left: -12, top: '50%', width: 10, height: 2, backgroundColor: t.rule },
  q: { fontSize: 13, color: t.ink3 },
  a: { fontSize: 18, fontWeight: '700', color: t.ink },
  ok: { fontSize: 12.5, color: t.good, fontWeight: '700' },
  srow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  sname: { width: 92, fontSize: 14.5, fontWeight: '700', color: t.ink },
  strack: { flex: 1, height: 22 },
  gridline: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: t.rule },
  sbar: { position: 'absolute', top: 4, bottom: 4, borderRadius: 4 },
  sval: { width: 62, textAlign: 'right', fontFamily: mono, fontSize: 12.5, color: t.ink2 },
  tick: { position: 'absolute', width: 40, marginLeft: -20, textAlign: 'center', fontFamily: mono, fontSize: 10.5, color: t.ink3 },
});
