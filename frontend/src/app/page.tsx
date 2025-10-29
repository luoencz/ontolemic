import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Ontolemic</h1>
          <p>"Pertaining to assumptions about being"</p>
        </div>
        <div className={styles.body}>
          <p>
            Hello, friend. I'm Theo, aka Luoencz. I like to think of myself as a
            cartographer, examining reality through informative lenses
            available to me, and aiming to grow towards awareness. 
            This journey has led me into all sorts of territories,
            starting with theatre and modern dance and just continuing with
            alignment research and rationality. Ontolemic is my travel journal,
            featuring scribbles, descriptions of my discoveries, and
            guesses about realms yet uncharted. Come aboard.
          </p>
          <hr className={styles.hr} />
          <div className={styles.nav}>
            <Link href="/about">About</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/project">Projects</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
