import { memo, type ReactNode } from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import type { LineColor, Op } from '../data/knots';
import type { Theme } from '../theme';

const WIDTH: Record<LineColor, number> = { main: 4.5, tag: 4.5, leader: 6.5 };

// react-native-svg markers are unreliable, so arrowheads are drawn from the path's last segment.
function arrowHead(d: string, size: number, fill: string, key: string) {
  const nums = (d.match(/-?\d*\.?\d+/g) ?? []).map(Number);
  const n = nums.length;
  const [x, y, px, py] = [nums[n - 2], nums[n - 1], nums[n - 4], nums[n - 3]];
  const a = Math.atan2(y - py, x - px);
  const c = Math.cos(a), s = Math.sin(a);
  const tip = [x + c * size * 0.6, y + s * size * 0.6];
  const bx = x - c * size * 0.4, by = y - s * size * 0.4, hw = size * 0.5;
  const pts = [tip, [bx - s * hw, by + c * hw], [bx + s * hw, by - c * hw]].map(p => p.join(',')).join(' ');
  return <Polygon key={key} points={pts} fill={fill} />;
}

function strand(t: Theme, c: LineColor, d: string, key: string, arrow?: boolean) {
  const w = WIDTH[c];
  return (
    <G key={key}>
      <Path d={d} stroke={t.panel} strokeWidth={w + 5} fill="none" strokeLinejoin="round" />
      <Path d={d} stroke={t[c]} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {arrow && arrowHead(d, 13, t[c], 'a')}
    </G>
  );
}

function label(t: Theme, x: number, y: number, text: string, anchor: 'start' | 'middle' | 'end' = 'start') {
  const common = { x, y, fontSize: 12.5, fontWeight: '500' as const, textAnchor: anchor };
  return (
    <G>
      <SvgText {...common} stroke={t.panel} strokeWidth={4} strokeLinejoin="round" fill={t.panel}>{text}</SvgText>
      <SvgText {...common} fill={t.ink2}>{text}</SvgText>
    </G>
  );
}

function renderOp(op: Op, i: number, t: Theme): ReactNode {
  const k = String(i);
  switch (op.t) {
    case 'line':
      return strand(t, op.c, op.d, k, op.arrow);
    case 'dbl':
      return (
        <G key={k}>
          <Path d={op.d} stroke={t.panel} strokeWidth={18} fill="none" strokeLinejoin="round" />
          <Path d={op.d} stroke={t.tag} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Path d={op.d} stroke={t.panel} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      );
    case 'coil': {
      const { xs, xe, y, n, amp, c } = op;
      const w = (xe - xs) / n;
      let back = '', front = '';
      for (let j = 0; j < n; j++) {
        const a = xs + j * w;
        front += `M${a} ${y - amp} C${a + w * 0.35} ${y - amp} ${a + w * 0.15} ${y + amp} ${a + w * 0.5} ${y + amp} `;
        back += `M${a + w * 0.5} ${y + amp} C${a + w * 0.85} ${y + amp} ${a + w * 0.65} ${y - amp} ${a + w} ${y - amp} `;
      }
      const lo = Math.min(xs, xe) - 6, hi = Math.max(xs, xe) + 6;
      return (
        <G key={k}>
          {strand(t, c, back, 'b')}
          {(op.core ?? []).map((cr, j) => strand(t, cr.c, `M${cr.x0 ?? lo} ${cr.y} L${cr.x1 ?? hi} ${cr.y}`, 'c' + j))}
          {strand(t, c, front, 'f')}
        </G>
      );
    }
    case 'ring':
      return (
        <G key={k}>
          <Circle cx={296} cy={110} r={14} stroke={t.panel} strokeWidth={10} fill="none" />
          <Circle cx={296} cy={110} r={14} stroke={t.metal} strokeWidth={4} fill="none" />
        </G>
      );
    case 'lure':
      return (
        <G key={k}>
          <Path d="M310 110 L318 110" stroke={t.metal} strokeWidth={3} strokeLinecap="round" />
          <Path d="M342 123 L342 134 C342 141 350 141 350 134" stroke={t.metal} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <Path d="M316 110 C328 95 352 94 364 104 C368 108 368 112 364 116 C352 126 328 125 316 110 Z" fill={t.lure} stroke={t.ink2} strokeWidth={1.4} />
          <Circle cx={330} cy={107} r={2.6} fill={t.ink} />
        </G>
      );
    case 'spool': {
      const { cx, cy, r, R } = op;
      return (
        <G key={k}>
          <Circle cx={cx} cy={cy} r={R} fill={t.panel2} stroke={t.metal} strokeWidth={2} />
          {Array.from({ length: 6 }, (_, j) => {
            const a = (j * Math.PI) / 3 + 0.5;
            return <Circle key={j} cx={cx + Math.cos(a) * 47} cy={cy + Math.sin(a) * 47} r={5} fill={t.panel} stroke={t.metal} strokeWidth={1} />;
          })}
          <Circle cx={cx} cy={cy} r={r} fill={t.panel} stroke={t.metal} strokeWidth={2} />
          <Circle cx={cx} cy={cy} r={5} fill={t.metal} />
        </G>
      );
    }
    case 'hold':
      return <Rect key={k} x={op.x} y={op.y - 10} width={22} height={20} rx={5} fill={t.panel2} stroke={t.ink3} strokeWidth={1.4} />;
    case 'knob':
      return (
        <G key={k}>
          <Circle cx={op.x} cy={op.y} r={5.5} stroke={t.panel} strokeWidth={4} fill={t.tag} />
        </G>
      );
    case 'arrow': {
      const stroke = op.solid ? t.ink2 : t.ink3;
      return (
        <G key={k}>
          <Path d={op.d} stroke={stroke} strokeWidth={op.solid ? 2.4 : 2} strokeDasharray={op.solid ? undefined : '5 4'} fill="none" strokeLinecap="round" />
          {arrowHead(op.d, 9, stroke, 'a')}
        </G>
      );
    }
    case 'label': {
      let leadLine: ReactNode = null;
      if (op.to) {
        const [tx, ty] = op.to;
        const sy = ty > op.y ? op.y + 5 : op.y - 14;
        leadLine = (
          <G>
            <Path d={`M${op.x} ${sy} L${tx} ${ty}`} stroke={t.ink3} strokeWidth={1} />
            <Circle cx={tx} cy={ty} r={2.2} fill={t.ink3} />
          </G>
        );
      }
      return <G key={k}>{leadLine}{label(t, op.x, op.y, op.text, op.a)}</G>;
    }
    case 'dim': {
      const { x0, x1, y } = op;
      return (
        <G key={k}>
          <Path d={`M${x0} ${y} L${x1} ${y} M${x0} ${y - 5} L${x0} ${y + 5} M${x1} ${y - 5} L${x1} ${y + 5}`} stroke={t.ink3} strokeWidth={1} />
          {label(t, (x0 + x1) / 2, y - 7, op.text, 'middle')}
        </G>
      );
    }
    case 'cut': {
      const { x, y } = op;
      const p = { stroke: t.ink2, strokeWidth: 1.6, fill: t.panel, strokeLinecap: 'round' as const };
      return (
        <G key={k}>
          <Path d={`M${x - 2.5} ${y + 3.5} L${x + 4.5} ${y - 9} M${x + 2.5} ${y + 3.5} L${x - 4.5} ${y - 9}`} {...p} />
          <Circle cx={x - 4} cy={y + 6.5} r={3.2} {...p} />
          <Circle cx={x + 4} cy={y + 6.5} r={3.2} {...p} />
        </G>
      );
    }
  }
}

type Props = { scene: Op[]; theme: Theme; label: string };

function KnotDiagram({ scene, theme, label: a11y }: Props) {
  return (
    <View style={{ width: '100%', aspectRatio: 380 / 220 }} accessible accessibilityRole="image" accessibilityLabel={a11y}>
      <Svg width="100%" height="100%" viewBox="0 0 380 220">
        {scene.map((op, i) => renderOp(op, i, theme))}
      </Svg>
    </View>
  );
}

export default memo(KnotDiagram);
