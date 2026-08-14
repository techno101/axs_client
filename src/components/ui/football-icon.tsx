export function FootballIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="32" cy="32" r="28" fill="#f5f7f2" stroke="#0b0e13" strokeWidth="2" />
      <path d="M32 6 L39 18 L54 22 L42 31 L44 46 L32 39 L20 46 L22 31 L10 22 L25 18 Z" fill="none" stroke="#0b0e13" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 6 L32 39 M32 6 L42 31 M32 6 L22 31 M32 39 L54 22 M32 39 L10 22 M32 39 L44 46 M32 39 L20 46" stroke="#0b0e13" strokeWidth="1.4" opacity="0.55" />
    </svg>
  );
}
