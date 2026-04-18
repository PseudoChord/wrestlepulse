import type { Metadata } from 'next'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const metadata: Metadata = {
  title: 'About — WrestlePulse',
  description: 'Learn about WrestlePulse, India\'s home for professional wrestling journalism.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="static-page-main">
        <div className="static-page-container">
          <h1 className="static-page-title">About WrestlePulse</h1>

          <section className="static-page-section">
            <h2>Who We Are</h2>
            <p>
              WrestlePulse is India&apos;s dedicated home for professional wrestling journalism.
              We cover WWE, AEW, and the growing Indian wrestling scene with the passion and
              depth that fans deserve.
            </p>
          </section>

          <section className="static-page-section">
            <h2>Our Mission</h2>
            <p>
              Wrestling journalism in India has always been an afterthought and we&apos;re here
              to change that. WrestlePulse delivers timely news, results, opinion pieces, and
              analysis written for Indian fans, in an Indian voice.
            </p>
            <p>
              Whether it&apos;s the latest title change, a deep-dive into a legendary career, or
              covering homegrown talent, we&apos;re committed to telling stories that matter to
              the Indian wrestling community.
            </p>
          </section>

          <section className="static-page-section">
            <h2>What We Cover</h2>
            <ul className="static-page-list">
              <li><strong>WWE</strong> — Raw, SmackDown, premium live events, and superstar news</li>
              <li><strong>AEW</strong> — Dynamite, Collision, and the broader AEW universe</li>
              <li><strong>Results</strong> — Fast, accurate match-by-match results from every major show</li>
              <li><strong>Opinion</strong> — Analysis, rankings, and takes from our writers</li>
              <li><strong>India</strong> — Indian wrestling talent, promotions, and events</li>
            </ul>
          </section>

          <section className="static-page-section">
            <h2>Get In Touch</h2>
            <p>
              Have a tip, correction, or just want to talk wrestling?{' '}
              <a href="/contact" className="inline-link">Contact us</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
