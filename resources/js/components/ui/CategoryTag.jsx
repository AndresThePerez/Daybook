import Badge from './Badge';

const COLORS = {
  work: '#4C6FB1', personal: '#8A6DB0', shopping: '#C77D4A',
  health: '#4F9E83', finance: '#B0894C', education: '#6E7E55',
};

export default function CategoryTag({ name }) {
  const color = COLORS[String(name).toLowerCase()] ?? '#97A0B0';
  return <Badge color={color}>{name}</Badge>;
}
