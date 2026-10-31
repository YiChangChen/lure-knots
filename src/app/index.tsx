import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CHAPTERS, READY_CHAPTERS } from '../data/chapters';
import { useLearned } from '../learned';
import { mono, useTheme, type Theme } from '../theme';

export default function Home() {
  const t = useTheme();
  const s = useMemo(() => makeStyles(t), [t]);
  const insets = useSafeAreaInsets();
  const { chaptersDone } = useLearned();
  const doneCount = READY_CHAPTERS.filter(c => chaptersDone.has(c.id)).length;

  return (
    <ScrollView style={s.root} contentContainerStyle={[s.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}>
      <View style={s.mast}>
        <Text style={s.eyebrow}>LURE FISHING · BEGINNER GUIDE</Text>
        <Text style={s.h1}>路亞入門<Text style={{ color: t.tag }}>教學</Text></Text>
        <Text style={s.lede}>從路亞和手竿的差別，到選竿、選捲線器、綁線和綁結，一章一章帶你入門。</Text>
        <View style={s.progress}>
          <View style={s.track}><View style={[s.fill, { width: `${(doneCount / READY_CHAPTERS.length) * 100}%` }]} /></View>
          <Text style={s.small}>已學會 <Text style={s.num}>{doneCount}</Text> / {READY_CHAPTERS.length} 章</Text>
        </View>
      </View>

      {CHAPTERS.map(c => (
        <Pressable key={c.id} disabled={!c.ready}
          onPress={() => router.push({ pathname: '/chapter/[id]', params: { id: c.id } })}
          style={({ pressed }) => [s.card, !c.ready && { opacity: 0.55 }, pressed && { backgroundColor: t.panel }]}
          accessibilityRole="button" accessibilityState={{ disabled: !c.ready }}
          accessibilityLabel={`第 ${c.no} 章，${c.title}${c.ready ? '' : '，即將推出'}`}>
          <Text style={s.no}>{String(c.no).padStart(2, '0')}</Text>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={s.h3}>{c.title}</Text>
            <Text style={s.body}>{c.sum}</Text>
          </View>
          {!c.ready ? <Text style={s.soon}>即將推出</Text> : chaptersDone.has(c.id) ? <Text style={s.ok}>✓</Text> : <Text style={{ color: t.tag }}>→</Text>}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const makeStyles = (t: Theme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: t.bg },
  content: { paddingHorizontal: 16, gap: 12 },
  mast: { gap: 6, marginBottom: 8 },
  eyebrow: { fontFamily: mono, fontSize: 11, letterSpacing: 1.8, color: t.ink3 },
  h1: { fontSize: 38, fontWeight: '800', color: t.ink, letterSpacing: 1 },
  h3: { fontSize: 17, fontWeight: '700', color: t.ink },
  lede: { fontSize: 15, lineHeight: 24, color: t.ink2 },
  body: { fontSize: 13.5, lineHeight: 20, color: t.ink2 },
  small: { fontSize: 12.5, lineHeight: 19, color: t.ink3 },
  num: { fontFamily: mono, color: t.ink, fontWeight: '600' },
  progress: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  track: { width: 120, height: 6, borderRadius: 3, backgroundColor: t.panel2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: t.good },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: t.surface, borderColor: t.rule, borderWidth: 1, borderRadius: 14, padding: 16 },
  no: { fontFamily: mono, fontSize: 18, color: t.tag, width: 28 },
  soon: { fontSize: 12, color: t.ink3 },
  ok: { fontSize: 16, color: t.good, fontWeight: '700' },
});
