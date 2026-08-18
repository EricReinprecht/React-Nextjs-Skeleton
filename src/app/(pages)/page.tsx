"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

import "@styles/pages/landing.scss";

const Home = () => {
    const locale = useLocale();

    return (
        <div className="landing-page">
            <div className="landing-noise" aria-hidden="true" />
            <div className="landing-orb orb-one" aria-hidden="true" />
            <div className="landing-orb orb-two" aria-hidden="true" />

            <div className="landing-marquee top" aria-hidden="true">
                <div>LIVE MUSIC • OPEN AIR • CLUB NIGHTS • FESTIVALS • GOOD PEOPLE • LIVE MUSIC • OPEN AIR • CLUB NIGHTS •</div>
            </div>

            <section className="landing-hero">
                <div className="landing-copy">
                    <div className="landing-kicker"><span /> Dein nächster guter Abend beginnt hier</div>
                    <h1>
                        Du suchst<br />
                        <span>ein Event?</span>
                    </h1>
                    <p>Keine endlosen Tabs. Kein FOMO. Nur Partys, Konzerte und Nächte, über die morgen noch alle reden.</p>

                    <div className="landing-actions">
                        <Link className="landing-browse-button" href={`/${locale}/browse`}>
                            <span>Events entdecken</span>
                            <span className="landing-button-arrow" aria-hidden="true">↗</span>
                        </Link>
                        <div className="landing-proof">
                            <div className="landing-faces" aria-hidden="true"><span>A</span><span>M</span><span>J</span></div>
                            <p><strong>15+ Events</strong><br />warten auf dich</p>
                        </div>
                    </div>
                </div>

                <div className="landing-art" aria-label="Event Highlights">
                    <div className="landing-sun" aria-hidden="true"><span>GO</span></div>

                    <article className="landing-poster poster-main">
                        <span className="poster-number">01</span>
                        <div className="poster-stamp">THIS<br />WEEK</div>
                        <div className="poster-copy"><small>VIENNA · 22:00</small><strong>FEEL<br />THE<br />NIGHT</strong></div>
                    </article>

                    <article className="landing-poster poster-back">
                        <span>OPEN AIR</span>
                        <strong>SOUND<br />& SUN</strong>
                        <small>ALL DAY LONG</small>
                    </article>

                    <div className="landing-ticket-chip">TICKETS<br /><strong>→ HERE</strong></div>
                    <div className="landing-star" aria-hidden="true">✦</div>
                </div>
            </section>

            <div className="landing-marquee bottom" aria-hidden="true">
                <div>FIND IT • BOOK IT • LIVE IT • FIND IT • BOOK IT • LIVE IT • FIND IT • BOOK IT • LIVE IT •</div>
            </div>
        </div>
    );
};

export default Home;
