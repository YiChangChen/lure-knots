import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Block } from '../data/chapters';
import { DIFF_LABEL, KNOTS, USE_LABEL } from '../data/knots';
import { useLearned } from '../learned';
import { mono, useTheme, type Theme } from '../theme';
import GearDiagram from './GearDiagram';
import KnotTools from './KnotTools';

const CALLOUT = {
  tip: { label: '小提醒', color: 'tag' },
  warn: { label: '注意', color: 'accent' },
  check: { label: '待校對', color: 'leader' },
} as const;

export default function ChapterBlocks({ blocks }: { blocks: Block[] }) {
  const t = useTheme();
  const s = useMemo(() => makeStyles(t), [t]);
  const { learned } = useLearned();

  return (
    <View style={{ gap: 12 }}>
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'h':
            return <Text key={i} style={s.h2}>{b.text}</Text>;
          case 'p':
            return <Text key={i} style={s.body}>{b.text}</Text>;
          case 'list':
            return (
              <View key={i} style={s.card}>
                {b.items.map((it, j) => (
                  <View key={j} style={s.li}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={[s.body, { flex: 1 }]}>{it}</Text>
                  </View>
                ))}
              </View>
            );
          case 'compare':
            return (
              <View key={i} style={s.card}>
                {b.rows.map((r, j) => (
                  <View key={j} style={[s.crow, j > 0 && s.crowRule]}>
                    <Text style={s.clabel}>{r.label}</Text>
                    {r.cells.map((c, k) => (
                      <View key={k} style={s.cell}>
                        <Text style={s.chead}>{b.heads[k]}</Text>
                        <Text style={[s.body, { flex: 1 }]}>{c}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            );
          case 'callout': {
            const c = CALLOUT[b.kind];
            return (
              <View key={i} style={[s.callout, { borderLeftColor: t[c.color] }]}>
                <Text style={s.calloutText}><Text style={{ color: t[c.color], fontWeight: '700' }}>{c.label}　</Text>{b.text}</Text>
              </View>
            );
          }
          case 'diagram':
            return (
              <View key={i} style={s.card}>
                <View style={s.svgbox}><GearDiagram id={b.id} theme={t} label={b.caption} /></View>
                <Text style={s.small}>{b.caption}</Text>
              </View>
            );
          case 'knots':
            return (
              <View key={i} style={{ gap: 8 }}>
                {b.ids.map(id => {
                  const k = KNOTS.find(x => x.id === id);
                  if (!k) return null;
                  return (
                    <Pressable key={id} style={({ pressed }) => [s.knotCard, pressed && { backgroundColor: t.panel }]}
                      onPress={() => router.push({ pathname: '/knot/[id]', params: { id } })}
                      accessibilityRole="button" accessibilityLabel={`${k.name}，${k.sum}`}>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Text style={s.en}>{k.en}　·　{USE_LABEL[k.use]}</Text>
                        <Text style={s.knotName}>{k.name} <Text style={{ color: t.tag }}>→</Text></Text>
                        <Text style={s.small}>{k.where}　難度：{DIFF_LABEL[k.diff]}</Text>
                      </View>
                      {learned.has(id) && <Text style={s.ok}>✓ 已學會</Text>}
                    </Pressable>
                  );
                })}
              </View>
            );
          case 'knotTools':
            return <KnotTools key={i} />;
        }
      })}
    </View>
  );
}

const makeStyles = (t: Theme) => StyleSheet.create({
  h2: { fontSize: 22, fontWeight: '800', color: t.ink, marginTop: 12 },
  body: { fontSize: 15, lineHeight: 24, color: t.ink2 },
  small: { fontSize: 12.5, lineHeight: 19, color: t.ink3 },
  en: { fontFamily: mono, fontSize: 11, color: t.ink3, letterSpacing: 0.6 },
  card: { backgroundColor: t.surface, borderColor: t.rule, borderWidth: 1, borderRadius: 14, padding: 16, gap: 8 },
  li: { flexDirection: 'row', gap: 8 },
  bullet: { fontSize: 15, lineHeight: 24, color: t.tag },
  crow: { gap: 6 },
  crowRule: { borderTopWidth: 1, borderTopColor: t.rule, paddingTop: 12 },
  clabel: { fontSize: 15, fontWeight: '700', color: t.ink },
  cell: { flexDirection: 'row', gap: 10 },
  chead: { width: 52, fontFamily: mono, fontSize: 12, lineHeight: 24, color: t.main, fontWeight: '600' },
  callout: { backgroundColor: t.panel2, borderLeftWidth: 4, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12 },
  calloutText: { fontSize: 14, lineHeight: 22, color: t.ink2 },
  svgbox: { backgroundColor: t.panel, borderColor: t.rule, borderWidth: 1, borderRadius: 10, overflow: 'hidden' },
  knotCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: t.surface, borderColor: t.rule, borderWidth: 1, borderRadius: 14, padding: 14 },
  knotName: { fontSize: 18, fontWeight: '700', color: t.ink },
  ok: { fontSize: 12.5, color: t.good, fontWeight: '700' },
});
