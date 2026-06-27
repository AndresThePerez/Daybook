export default function Card({ as: As = 'div', className = '', children, ...props }) {
  return (
    <As className={`bg-surface border border-hairline rounded-card shadow-card ${className}`} {...props}>
      {children}
    </As>
  );
}
