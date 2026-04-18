import type { Metadata } from 'next'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const metadata: Metadata = {
  title: 'Contact — WrestlePulse',
  description: 'Get in touch with the WrestlePulse team.',
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="static-page-main">
        <div className="static-page-container">
          <h1 className="static-page-title">Contact Us</h1>

          <section className="static-page-section">
            <p>
              We&apos;d love to hear from you - whether you have a news tip, spotted an error,
              want to contribute, or just want to talk wrestling.
            </p>
          </section>

          <section className="static-page-section">
            <h2>Email</h2>
            <p>
              Reach us at{' '}
              <a href="mailto:editor@wrestlepulse.in" className="inline-link contact-email">
                editor@wrestlepulse.in
              </a>
            </p>
          </section>

          <section className="static-page-section">
            <h2>News Tips</h2>
            <p>
              Got a scoop or spotted something we missed? Send it to{' '}
              <a href="mailto:editor@wrestlepulse.in" className="inline-link">
                editor@wrestlepulse.in
              </a>{' '}
              and we&apos;ll look into it.
            </p>
          </section>

          <section className="static-page-section">
            <h2>Write for Us</h2>
            <p>
              Passionate about wrestling and want to contribute? We&apos;re always open to new
              voices. Send us a short introduction and a sample piece to{' '}
              <a href="mailto:editor@wrestlepulse.in" className="inline-link">
                editor@wrestlepulse.in
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
