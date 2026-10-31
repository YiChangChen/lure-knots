import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import type { DiagramId } from '../data/chapters';
import type { Theme } from '../theme';

/* 簡化示意圖，共用 380 × 200 畫布。只畫外型與關鍵部位，不按比例。 */
const W = 380;
const H = 200;

export default function GearDiagram({ id, theme: t, label }: { id: DiagramId; theme: Theme; label: string }) {
  const txt = (x: number, y: number, s: string, a: 'start' | 'middle' | 'end' = 'middle') => (
    <SvgText x={x} y={y} fontSize={12} fill={t.ink2} textAnchor={a}>{s}</SvgText>
  );
  const pointer = (x0: number, y0: number, x1: number, y1: number) => (
    <Line x1={x0} y1={y0} x2={x1} y2={y1} stroke={t.ink3} strokeWidth={1} />
  );

  let body;
  if (id === 'spinning') {
    body = (
      <G>
        {/* 竿 */}
        <Path d="M10 60 L370 40" stroke={t.metal} strokeWidth={5} strokeLinecap="round" />
        {/* 機身 */}
        <Rect x={150} y={66} width={70} height={46} rx={14} fill={t.panel2} stroke={t.metal} strokeWidth={2} />
        <Line x1={185} y1={58} x2={185} y2={66} stroke={t.metal} strokeWidth={4} />
        {/* 捲線軸（朝向竿尖，固定不轉） */}
        <Rect x={222} y={76} width={34} height={26} rx={5} fill={t.surface} stroke={t.main} strokeWidth={2.5} />
        <Path d="M226 82 H252 M226 89 H252 M226 96 H252" stroke={t.main} strokeWidth={1.5} />
        {/* 收線臂 */}
        <Path d="M262 70 C246 60 238 80 238 89 C238 98 246 118 262 108" fill="none" stroke={t.tag} strokeWidth={3} strokeLinecap="round" />
        {/* 搖把 */}
        <Path d="M150 92 H118 L112 124" fill="none" stroke={t.metal} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={112} cy={128} r={7} fill={t.tag} />
        {/* 線 */}
        <Path d="M262 70 C300 66 330 54 372 46" fill="none" stroke={t.leader} strokeWidth={1.5} />
        {pointer(240, 102, 280, 150)}{txt(282, 166, '捲線軸：固定不轉', 'start')}
        {pointer(250, 66, 250, 28)}{txt(250, 22, '收線臂（繞線用）')}
        {pointer(112, 136, 90, 166)}{txt(90, 182, '搖把')}
      </G>
    );
  } else if (id === 'baitcasting') {
    body = (
      <G>
        <Path d="M10 120 L370 100" stroke={t.metal} strokeWidth={5} strokeLinecap="round" />
        <Rect x={150} y={68} width={90} height={44} rx={12} fill={t.panel2} stroke={t.metal} strokeWidth={2} />
        <Line x1={195} y1={112} x2={195} y2={122} stroke={t.metal} strokeWidth={4} />
        {/* 捲線軸（側視為圓，會旋轉） */}
        <Circle cx={195} cy={90} r={16} fill={t.surface} stroke={t.main} strokeWidth={2.5} />
        <Circle cx={195} cy={90} r={5} fill={t.main} />
        <Path d="M183 78 A16 16 0 0 1 207 78" fill="none" stroke={t.tag} strokeWidth={2} />
        {/* 搖把 */}
        <Path d="M240 90 H266 L270 60" fill="none" stroke={t.metal} strokeWidth={3} strokeLinecap="round" />
        <Circle cx={270} cy={54} r={7} fill={t.tag} />
        {/* 線 */}
        <Path d="M195 74 C250 70 320 108 372 104" fill="none" stroke={t.leader} strokeWidth={1.5} />
        {pointer(195, 74, 150, 36)}{txt(150, 28, '捲線軸：會旋轉')}
        {pointer(195, 108, 150, 150)}{txt(150, 166, '拋投時用拇指壓住軸控制放線')}
        {pointer(270, 48, 300, 28)}{txt(302, 24, '搖把', 'start')}
      </G>
    );
  } else {
    body = (
      <G>
        {/* 竿與捲線器 */}
        <Path d="M10 50 L90 50" stroke={t.metal} strokeWidth={5} strokeLinecap="round" />
        <Circle cx={50} cy={78} r={16} fill={t.panel2} stroke={t.metal} strokeWidth={2} />
        {/* 母線 */}
        <Path d="M90 50 C150 50 150 100 200 100" fill="none" stroke={t.main} strokeWidth={4.5} strokeLinecap="round" />
        {/* 連接結 */}
        <Circle cx={200} cy={100} r={8} fill={t.surface} stroke={t.ink} strokeWidth={2} />
        {/* 子線 */}
        <Path d="M208 100 L290 100" fill="none" stroke={t.leader} strokeWidth={4.5} strokeLinecap="round" />
        {/* 假餌 */}
        <Path d="M290 100 C300 88 330 88 346 100 C330 112 300 112 290 100 Z" fill={t.lure} stroke={t.metal} strokeWidth={2} />
        <Circle cx={336} cy={98} r={2} fill={t.ink} />
        {txt(125, 44, '母線（主線）')}
        {pointer(200, 108, 200, 140)}{txt(200, 156, '連接結')}
        {txt(250, 130, '子線（前導線）')}
        {pointer(318, 112, 318, 140)}{txt(318, 156, '假餌')}
      </G>
    );
  }

  return (
    <Svg width="100%" viewBox={`0 0 ${W} ${H}`} accessibilityLabel={label} accessible>
      {body}
    </Svg>
  );
}
