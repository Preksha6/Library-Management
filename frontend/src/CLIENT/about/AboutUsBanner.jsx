import React from 'react'

const AboutUsBanner = () => (
  <div style={{
    position: 'relative', height: '300px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '3rem'
  }}>
    <img src='/aboutUsBanner.jpg' alt='About Us'
      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) saturate(0.6)' }} />
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to bottom, transparent 30%, var(--bg-base))',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem'
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase' }}>
        Arcana Library
      </span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontStyle: 'italic', color: 'var(--text-primary)', textAlign: 'center' }}>
        About Us
      </h1>
    </div>
  </div>
)
export default AboutUsBanner
