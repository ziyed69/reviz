import Link from "next/link";

export function Header() {
  return (
    <header className="site-header container">
      <Link href="/" className="logo">
        Re<span>viz</span>
      </Link>
      <nav style={{ display: "flex", gap: "1.25rem" }}>
        <Link href="/exemple">Exemple</Link>
        <Link href="/app" className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>
          Essayer
        </Link>
      </nav>
    </header>
  );
}
