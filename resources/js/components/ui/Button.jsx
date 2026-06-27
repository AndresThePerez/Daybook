const STYLES = {
  primary: 'bg-ink text-white hover:bg-black',
  ghost: 'bg-transparent text-ink hover:bg-sunken',
  danger: 'bg-transparent text-ember-low border border-ember-low/40 hover:bg-ember-low/10',
};

export default function Button({ variant = 'primary', type = 'button', className = '', children, ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-medium shadow-card
        transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2
        focus-visible:ring-offset-paper disabled:opacity-50 ${STYLES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
