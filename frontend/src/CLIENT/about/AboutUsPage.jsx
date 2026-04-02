import React from 'react'
import AboutUsBanner from './AboutUsBanner'
import './aboutus.css'
import { about_data } from './aboutusData'

const AboutUsPage = () => (
  <div className='container arcana-about-page'>
    <AboutUsBanner />
    <div className='row g-4'>
      {about_data.map(({ id, title, description }) => (
        <div className='col-lg-4' key={id}>
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '2rem', height: '100%',
            borderTop: '3px solid var(--gold-muted)', transition: 'var(--transition)'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderTopColor = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderTopColor = 'var(--gold-muted)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--gold)', marginBottom: '1.2rem' }}>
              {title}
            </h2>
            <div>
              {description.split('\n\n').map((para, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '0.75rem', fontSize: '0.97rem' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)
export default AboutUsPage
