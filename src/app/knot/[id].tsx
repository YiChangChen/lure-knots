import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KnotDiagram from '../../components/KnotDiagram';
import { chapterOfKnot } from '../../data/chapters';
import { DIFF_LABEL, findKnot, KNOTS, USE_LABEL } from '../../data/knots';
import { useLearned } from '../../learned';
import { mono, useTheme, type Theme } from '../../theme';

export default function KnotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const s = useMemo(() => makeStyles(t), [t]);
  const insets = useSafeAreaInsets();
  const { learned, toggle } = useLearned();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'step' | 'all'>('step');
  const scrollRef = useRef<ScrollViewInstance>(null);
  const touchX = useRef<number | null>(null);

  const idx = findKnot(id);
  if (idx < 0) {
    return <View style={[s.root, s.center]}><Text style={s.body}>找不到這個結。</Text></View>;
  }
  const knot = KNOTS[idx];
  // 「下一個」只在同一章內跳；章內最後一個就回章節頁。
  const siblings = chapterOfKnot(knot.id)?.knots ?? [];
  const nextId = siblings[siblings.indexOf(knot.id) + 1];
  const nextKnot = nextId ? KNOTS[findKnot(nextId)] : undefined;
  const st = knot.steps[step];
  const total = knot.steps.length;
  const last = step === total - 1;
  const isLearned = learned.has(knot.id);

  const go = (n: number, toTop = false) => {
    if (n < 0 || n >= total) return;
    setStep(n);
    if (toTop) scrollRef.current?.scrollTo({ y: 0, animated: true });
  };
  const onNext = () => {
    if (!last) return go(step + 1);
    if (!isLearned) return toggle(knot.id);
    if (nextKnot) router.replace({ pathname: '/knot/[id]', params: { id: nextKnot.id } });
    else router.back();
  };
  const nextLabel = !last ? '下一步 ›' : !isLearned ? '✓ 我學會了' : nextKnot ? `下一個：${nextKnot.name} ›` : '回到章節';

  return (
    <>
      <Stack.Screen options={{ title: knot.name }} />
      <ScrollView ref={scrollRef} style={s.root} contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={s.plate}>
          <View style={s.plateHead}>
            <Text style={s.figNo}>
              {mode === 'step' ? <>步驟 <Text style={{ color: t.ink }}>{step + 1}</Text> / {total}</> : `共 ${total} 步`}
            </Text>
            <View style={s.seg}>
              {(['step', 'all'] as const).map(m => (
                <Pressable key={m} onPress={() => setMode(m)} style={[s.segBtn, mode === m && s.segOn]}
                  accessibilityRole="button" accessibilityState={{ selected: mode === m }}>
                  <Text style={[s.segText, mode === m && { color: t.ink, fontWeight: '600' }]}>{m === 'step' ? '逐步看' : '全部步驟'}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {mode === 'step' ? (
            <>
              <View
                style={s.svgbox}
                onTouchStart={e => { touchX.current = e.nativeEvent.pageX; }}
                onTouchEnd={e => {
                  if (touchX.current === null) return;
                  const dx = e.nativeEvent.pageX - touchX.current;
                  touchX.current = null;
                  if (Math.abs(dx) > 40) go(step + (dx < 0 ? 1 : -1));
                }}
              >
                <KnotDiagram scene={st.scene} theme={t} label={`${knot.name} 步驟 ${step + 1}：${st.title}`} />
              </View>
              <Text style={s.hint}>左右滑動圖片可切換步驟</Text>
              <View style={s.cap} accessibilityLiveRegion="polite">
                <Text style={s.h3}>{st.title}</Text>
                <Text style={s.bodyLg}>{st.text}</Text>
                {st.tip && (
                  <View style={s.tip}>
                    <Text style={s.tipText}><Text style={{ color: t.tag, fontWeight: '700' }}>小提醒　</Text>{st.tip}</Text>
                  </View>
                )}
              </View>
              <View style={s.nav}>
                <Pressable onPress={() => go(step - 1)} disabled={step === 0} style={[s.btn, step === 0 && { opacity: 0.4 }]} accessibilityRole="button">
                  <Text style={s.btnText}>‹ 上一步</Text>
                </Pressable>
                <Pressable onPress={onNext} style={[s.btn, s.primary]} accessibilityRole="button">
                  <Text style={[s.btnText, { color: t.accentInk }]} numberOfLines={1}>{nextLabel}</Text>
                </Pressable>
              </View>
              <View style={s.dots}>
                {knot.steps.map((x, i) => (
                  <Pressable key={i} onPress={() => go(i)} hitSlop={6}
                    style={[s.dot, i < step && { borderColor: t.ink3 }, i === step && s.dotOn]}
                    accessibilityRole="button" accessibilityLabel={`第 ${i + 1} 步：${x.title}`} accessibilityState={{ selected: i === step }}>
                    <Text style={[s.dotText, i === step && { color: t.bg }, i < step && { color: t.ink }]}>{i + 1}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : (
            <View style={{ gap: 12 }}>
              {knot.steps.map((x, i) => (
                <Pressable key={i} onPress={() => { setStep(i); setMode('step'); }} style={s.allCard} accessibilityRole="button">
                  <View style={s.svgbox}>
                    <KnotDiagram scene={x.scene} theme={t} label={`${knot.name} 步驟 ${i + 1}：${x.title}`} />
                  </View>
                  <Text style={s.allTitle}><Text style={s.allNo}>{String(i + 1).padStart(2, '0')}　</Text>{x.title}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={s.card}>
          <Text style={s.en}>{knot.en}</Text>
          <Text style={s.h2}>{knot.name}</Text>
          <Text style={s.body}>{knot.sum}</Text>
          <View style={s.facts}>
            <Fact s={s} k="分類" v={USE_LABEL[knot.use]} />
            <Fact s={s} k="用途" v={knot.where} />
            <Fact s={s} k="線材" v={knot.lines} />
            <View style={s.fact}>
              <Text style={s.factK}>難度</Text>
              <View style={[s.factV, { flexDirection: 'row', alignItems: 'center', gap: 3 }]}>
                {[1, 2, 3].map(i => <View key={i} style={[s.diff, i <= knot.diff && { backgroundColor: t.tag }]} />)}
                <Text style={[s.body, { marginLeft: 6 }]}>{DIFF_LABEL[knot.diff]}</Text>
              </View>
            </View>
            <Fact s={s} k="結強度" v={knot.strength ? `約 ${knot.strength[0]}–${knot.strength[1]}% 原線強度` : '不需高強度'} />
          </View>
        </View>

        <View style={s.card}>
          <Text style={s.h3}>步驟</Text>
          {knot.steps.map((x, i) => (
            <Pressable key={i} onPress={() => { setMode('step'); go(i, true); }}
              style={[s.stepRow, mode === 'step' && i === step && { backgroundColor: t.panel2 }]} accessibilityRole="button">
              <Text style={[s.stepNo, mode === 'step' && i === step && { color: t.tag }]}>{String(i + 1).padStart(2, '0')}</Text>
              <Text style={[s.body, { color: t.ink, flex: 1 }, mode === 'step' && i === step && { fontWeight: '700' }]}>{x.title}</Text>
            </Pressable>
          ))}
          <Pressable onPress={() => toggle(knot.id)} style={[s.btn, s.learn, isLearned && { borderColor: t.good }]}
            accessibilityRole="button" accessibilityState={{ checked: isLearned }}>
            <Text style={[s.btnText, isLearned && { color: t.good }]}>{isLearned ? '✓ 已學會' : '標記為已學會'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

function Fact({ s, k, v }: { s: ReturnType<typeof makeStyles>; k: string; v: string }) {
  return (
    <View style={s.fact}>
      <Text style={s.factK}>{k}</Text>
      <Text style={[s.body, s.factV]}>{v}</Text>
    </View>
  );
}

const makeStyles = (t: Theme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: t.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 14 },
  plate: { backgroundColor: t.surface, borderColor: t.rule, borderWidth: 1, borderRadius: 14, padding: 12, gap: 12 },
  plateHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  figNo: { fontFamily: mono, fontSize: 12.5, color: t.ink3 },
  seg: { flexDirection: 'row', borderWidth: 1, borderColor: t.rule, borderRadius: 8, overflow: 'hidden' },
  segBtn: { paddingVertical: 5, paddingHorizontal: 12 },
  segOn: { backgroundColor: t.panel2 },
  segText: { fontSize: 13, color: t.ink2 },
  svgbox: { backgroundColor: t.panel, borderColor: t.rule, borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  hint: { fontSize: 11.5, color: t.ink3, textAlign: 'center', marginTop: -6 },
  cap: { gap: 6, minHeight: 120 },
  h2: { fontSize: 26, fontWeight: '800', color: t.ink },
  h3: { fontSize: 20, fontWeight: '700', color: t.ink },
  en: { fontFamily: mono, fontSize: 11.5, color: t.ink3, letterSpacing: 0.6 },
  body: { fontSize: 14.5, lineHeight: 22, color: t.ink2 },
  bodyLg: { fontSize: 16, lineHeight: 25, color: t.ink },
  tip: { backgroundColor: t.panel2, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  tipText: { fontSize: 13.5, lineHeight: 21, color: t.ink2 },
  nav: { flexDirection: 'row', gap: 10 },
  btn: { borderWidth: 1, borderColor: t.rule, backgroundColor: t.panel, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  primary: { flex: 1, backgroundColor: t.accent, borderColor: t.accent },
  btnText: { fontSize: 15, fontWeight: '600', color: t.ink },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, flexWrap: 'wrap' },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: t.rule, backgroundColor: t.panel, alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: t.ink, borderColor: t.ink },
  dotText: { fontFamily: mono, fontSize: 11.5, color: t.ink3 },
  allCard: { gap: 6 },
  allTitle: { fontSize: 16, fontWeight: '700', color: t.ink, paddingHorizontal: 4 },
  allNo: { fontFamily: mono, fontSize: 12.5, color: t.tag },
  card: { backgroundColor: t.surface, borderColor: t.rule, borderWidth: 1, borderRadius: 14, padding: 16, gap: 8 },
  facts: { gap: 6, marginTop: 4 },
  fact: { flexDirection: 'row', gap: 14 },
  factK: { width: 48, fontSize: 14, lineHeight: 22, color: t.ink3 },
  factV: { flex: 1, color: t.ink },
  diff: { width: 14, height: 6, borderRadius: 2, backgroundColor: t.panel2 },
  stepRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, paddingVertical: 7, paddingHorizontal: 8, borderRadius: 8 },
  stepNo: { width: 22, fontFamily: mono, fontSize: 12, color: t.ink3 },
  learn: { alignSelf: 'flex-start', marginTop: 6 },
});
