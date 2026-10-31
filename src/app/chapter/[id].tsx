import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChapterBlocks from '../../components/ChapterBlocks';
import { findChapter } from '../../data/chapters';
import { useLearned } from '../../learned';
import { mono, useTheme, type Theme } from '../../theme';

export default function ChapterScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const t = useTheme();
  const s = useMemo(() => makeStyles(t), [t]);
  const insets = useSafeAreaInsets();
  const { chaptersDone, toggleChapter } = useLearned();

  const chapter = findChapter(id);
  if (!chapter || !chapter.ready) {
    return <View style={[s.root, s.center]}><Text style={s.body}>這一章還在準備中。</Text></View>;
  }
  const done = chaptersDone.has(chapter.id);

  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView style={s.root} contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 40 }]}>
        <View style={{ gap: 4 }}>
          <Text style={s.eyebrow}>CH.{String(chapter.no).padStart(2, '0')} · {chapter.en}</Text>
          <Text style={s.h1}>{chapter.title}</Text>
          <Text style={s.lede}>{chapter.sum}</Text>
        </View>
        <ChapterBlocks blocks={chapter.blocks} />
        <Pressable onPress={() => toggleChapter(chapter.id)} style={[s.btn, done && { borderColor: t.good }]}
          accessibilityRole="button" accessibilityState={{ checked: done }}>
          <Text style={[s.btnText, done && { color: t.good }]}>{done ? '✓ 本章已學會' : '標記本章為已學會'}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const makeStyles = (t: Theme) => StyleSheet.create({
  root: { flex: 1, backgroundColor: t.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 16 },
  eyebrow: { fontFamily: mono, fontSize: 11, letterSpacing: 1.8, color: t.ink3 },
  h1: { fontSize: 30, fontWeight: '800', color: t.ink },
  lede: { fontSize: 15, lineHeight: 24, color: t.ink2 },
  body: { fontSize: 15, color: t.ink2 },
  btn: { alignSelf: 'flex-start', borderWidth: 1, borderColor: t.rule, backgroundColor: t.panel, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16 },
  btnText: { fontSize: 15, fontWeight: '600', color: t.ink },
});
