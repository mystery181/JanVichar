"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, login } = useAuth();

  return (
    <>
      <section className="hero">
        <div className="container">
          <h2>Empowering Citizens, Strengthening Democracy</h2>
          <p>
            File a Public Interest Litigation (PIL) easily and monitor its progress. Your voice matters in shaping a better India.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link href="/create-pil" className="btn-primary">
                File a PIL Now
              </Link>
            ) : (
              <button onClick={login} className="btn-primary" style={{ cursor: "pointer", border: "none" }}>
                File a PIL Now
              </button>
            )}
            <Link href="/learn" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="existing-pils">
        <div className="container">
          <h3>Recently Filed Public Interest Litigations</h3>
          <p className="section-subtitle">Explore some of the active PILs filed by concerned citizens.</p>
          <div className="pils-grid">
            {/* PIL Card 1 */}
            <div className="pil-card">
              <div className="pil-status status-filed">Filed</div>
              <h4>Yamuna River Cleaning</h4>
              <p className="pil-desc">
                Petition to enforce stricter industrial waste disposal norms to save the Yamuna river ecosystem.
              </p>
              <div className="pil-meta">
                <span>
                  <strong>CNR:</strong> DLHC010012342024
                </span>
                <Link href="/tracker" className="btn-text">
                  Track &rarr;
                </Link>
              </div>
            </div>
            {/* PIL Card 2 */}
            <div className="pil-card">
              <div className="pil-status status-hearing">Hearing</div>
              <h4>Urban Tree Cover Protection</h4>
              <p className="pil-desc">
                Challenging the indiscriminate felling of old trees for metro construction without replanting.
              </p>
              <div className="pil-meta">
                <span>
                  <strong>CNR:</strong> DLHC010034562024
                </span>
                <Link href="/tracker" className="btn-text">
                  Track &rarr;
                </Link>
              </div>
            </div>
            {/* PIL Card 3 */}
            <div className="pil-card">
              <div className="pil-status status-process">Scrutiny</div>
              <h4>Govt School Infrastructure</h4>
              <p className="pil-desc">Demanding immediate repair of dilapidated school buildings in rural districts.</p>
              <div className="pil-meta">
                <span>
                  <strong>CNR:</strong> DLHC010056782024
                </span>
                <Link href="/tracker" className="btn-text">
                  Track &rarr;
                </Link>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/tracker" className="btn-primary">
              View All PILs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
