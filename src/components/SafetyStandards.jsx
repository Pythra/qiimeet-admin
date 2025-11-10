import React from 'react';
import { Link } from 'react-router-dom';

const SafetyStandards = () => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      lineHeight: '1.6',
      color: '#333'
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #EC066A'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#EC066A',
          margin: '0 0 10px 0',
          fontWeight: '700'
        }}>
          Safety Standards: Protection Against CSAE
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          margin: '0'
        }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        border: '1px solid '#e9ecef'
      }}>
        <h2 style={{ color: '#EC066A', marginTop: '0' }}>Quick Navigation</h2>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          <li><a href="#commitment" style={{ color: '#EC066A', textDecoration: 'none' }}>Our Commitment</a></li>
          <li><a href="#prohibited" style={{ color: '#EC066A', textDecoration: 'none' }}>Prohibited Content & Conduct</a></li>
          <li><a href="#reporting" style={{ color: '#EC066A', textDecoration: 'none' }}>Reporting & Escalation</a></li>
          <li><a href="#moderation" style={{ color: '#EC066A', textDecoration: 'none' }}>Detection & Moderation</a></li>
          <li><a href="#age-safety" style={{ color: '#EC066A', textDecoration: 'none' }}>Age Restrictions & Child Safety</a></li>
          <li><a href="#law" style={{ color: '#EC066A', textDecoration: 'none' }}>Law Enforcement Cooperation</a></li>
          <li><a href="#resources" style={{ color: '#EC066A', textDecoration: 'none' }}>Resources & Support</a></li>
          <li><a href="#contact" style={{ color: '#EC066A', textDecoration: 'none' }}>Contact Information</a></li>
        </ul>
      </div>

      <section id="commitment" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          1. Our Commitment
        </h2>
        <p>
          Qiimeet maintains a zero‑tolerance policy toward Child Sexual Abuse and Exploitation (CSAE).
          We prohibit any content, conduct, or activity that sexualizes, exploits, harms, or endangers
          children. We act swiftly to remove violating content, restrict offending accounts, and
          notify appropriate authorities when required.
        </p>
      </section>

      <section id="prohibited" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          2. Prohibited Content & Conduct
        </h2>
        <ul>
          <li>Any sexual content involving minors (real or simulated), including images, videos, text, or links.</li>
          <li>Sexualization of minors, grooming behaviors, or solicitation of sexual imagery from minors.</li>
          <li>Sharing, requesting, or distributing CSAM (Child Sexual Abuse Material).</li>
          <li>Attempting to circumvent our safety systems or encourage others to do so.</li>
        </ul>
      </section>

      <section id="reporting" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          3. Reporting & Escalation
        </h2>
        <p>
          Users can report suspected CSAE directly in‑app via profile and chat reporting, or by
          contacting us using the details below. Reports are triaged with highest priority and reviewed
          by trained moderators. We remove content that violates these standards and may disable and ban accounts.
        </p>
        <p>
          When we have a good‑faith belief that a child is at risk or that CSAM is involved, we will
          make the appropriate reports to relevant authorities per applicable law.
        </p>
      </section>

      <section id="moderation" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          4. Detection & Moderation
        </h2>
        <ul>
          <li>Combination of automated signals and human review to detect potential CSAE content.</li>
          <li>Rate limits and behavioral signals to identify grooming or predatory patterns.</li>
          <li>Continuous model and ruleset improvements informed by abuse trends.</li>
          <li>Appeals process for users to contest enforcement decisions.</li>
        </ul>
      </section>

      <section id="age-safety" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          5. Age Restrictions & Child Safety
        </h2>
        <ul>
          <li>Qiimeet is strictly for users 18 years and older.</li>
          <li>We take action on accounts suspected to be operated by or targeting minors.</li>
          <li>We provide guidance in‑app for safe interactions and how to report concerns.</li>
        </ul>
      </section>

      <section id="law" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          6. Law Enforcement Cooperation
        </h2>
        <p>
          We cooperate with law enforcement requests consistent with applicable law and our privacy
          obligations. We preserve and disclose information when legally required to do so.
        </p>
      </section>

      <section id="resources" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          7. Resources & Support
        </h2>
        <ul>
          <li>Report online child exploitation: consult your local authority resources.</li>
          <li>If you or someone you know is in immediate danger, contact local emergency services.</li>
        </ul>
      </section>

      <section id="contact" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          8. Contact Information
        </h2>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ margin: '5px 0' }}><strong>Safety & Trust:</strong> safety@qiimeet.com</p>
          <p style={{ margin: '5px 0' }}><strong>Support:</strong> support@qiimeet.com</p>
          <p style={{ margin: '5px 0' }}><strong>Address:</strong> Qiimeet Safety Team, Nigeria</p>
        </div>
      </section>

      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid #e9ecef'
      }}>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#EC066A',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d1055a'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#EC066A'}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SafetyStandards;


