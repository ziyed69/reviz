import Link from "next/link";

export function Header() {
  return (
    <header className="site-header container">
      <Link href="/" className="logo">
        Re<span>viz</span>
        <span className="logo-tag">IA étudiant</span>
      </Link>
      <nav className="nav-links">
        <Link href="/exemple">Démo</Link>
        <Link href="/app" className="btn btn-primary nav-cta">
          Ouvrir l&apos;app
        </Link>
      </nav>
    </header>
  );
}
