import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaInstagram, FaGithub, FaEnvelope, FaCalendar, FaBook } from "react-icons/fa6";
import styles from "./page.module.css";

export default function Contact() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Contact</h1>
        </div>
        <div className={styles.body}>
          <div className={styles.links}>
            <h2>Socials</h2>
            <ul className={styles.list}>
              <li>
                <Link href="https://x.com/Luoencz" target="_blank" rel="noopener noreferrer">
                  <FaXTwitter className={styles.icon} />
                  <span>Twitter / X</span>
                </Link>
              </li>
              <li>
                <Link href="https://substack.com/@luoencz" target="_blank" rel="noopener noreferrer">
                  <FaBook className={styles.icon} />
                  <span>Substack</span>
                </Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/in/theo-ryzhenkov" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className={styles.icon} />
                  <span>LinkedIn</span>
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/luoencz/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className={styles.icon} />
                  <span>Instagram</span>
                </Link>
              </li>
              <li>
                <Link href="https://www.lesswrong.com/users/luoencz" target="_blank" rel="noopener noreferrer">
                  <FaBook className={styles.icon} />
                  <span>LessWrong</span>
                </Link>
              </li>
              <li>
                <Link href="https://github.com/luoencz" target="_blank" rel="noopener noreferrer">
                  <FaGithub className={styles.icon} />
                  <span>GitHub</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.links}>
            <h2>Contact</h2>
            <ul className={styles.list}>
              <li>
                <a href="mailto:theo@the-o.space">
                  <FaEnvelope className={styles.icon} />
                  <span>theo@the-o.space</span>
                </a>
              </li>
              <li>
                <Link href="https://fantastical.app/the-o" target="_blank" rel="noopener noreferrer">
                  <FaCalendar className={styles.icon} />
                  <span>Schedule a call</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
