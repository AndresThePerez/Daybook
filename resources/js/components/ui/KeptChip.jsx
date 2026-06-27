export default function KeptChip() {
  return (
    <span className="inline-flex items-center gap-1.5 self-end rounded-full border border-[#BFD6DC] bg-[#EAF3F4] px-2.5 py-1 text-xs font-medium text-kept">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="5" r="2.5" /><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3" />
      </svg>
      Kept
    </span>
  );
}
