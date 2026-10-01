// Kadro Cepte marka logosu. Marka renkleri logo için sabittir.
export function Logo({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} role="img" aria-label="Kadro Cepte">
      <rect width="512" height="512" rx="120" fill="#4F46E5" />
      <path d="M150 112h66v116l104-116h82L294 232l116 168h-82l-82-122-30 32v90h-66z" fill="#FFFFFF" />
      <circle cx="392" cy="392" r="34" fill="#F97316" />
    </svg>
  );
}
