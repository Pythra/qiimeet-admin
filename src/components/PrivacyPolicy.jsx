import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          Privacy Policy
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
        border: '1px solid #e9ecef'
      }}>
        <h2 style={{ color: '#EC066A', marginTop: '0' }}>Quick Navigation</h2>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          <li><a href="#information-collection" style={{ color: '#EC066A', textDecoration: 'none' }}>Information We Collect</a></li>
          <li><a href="#how-we-use" style={{ color: '#EC066A', textDecoration: 'none' }}>How We Use Your Information</a></li>
          <li><a href="#data-sharing" style={{ color: '#EC066A', textDecoration: 'none' }}>Data Sharing</a></li>
          <li><a href="#data-security" style={{ color: '#EC066A', textDecoration: 'none' }}>Data Security</a></li>
          <li><a href="#your-rights" style={{ color: '#EC066A', textDecoration: 'none' }}>Your Rights</a></li>
          <li><a href="#contact-us" style={{ color: '#EC066A', textDecoration: 'none' }}>Contact Us</a></li>
        </ul>
      </div>

      <section id="information-collection" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          1. Information We Collect
        </h2>
        
        <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '10px' }}>Personal Information</h3>
        <ul style={{ marginBottom: '20px' }}>
          <li><strong>Account Information:</strong> Phone number, email address, username, and profile details</li>
          <li><strong>Profile Data:</strong> Photos, bio, interests, lifestyle preferences, and demographic information</li>
          <li><strong>Location Data:</strong> Approximate location (city/state) and precise location for matching purposes</li>
          <li><strong>Communication Data:</strong> Chat messages, images, and audio recordings shared with other users</li>
          <li><strong>Financial Information:</strong> Transaction history, wallet balance, and payment records</li>
        </ul>

        <h3 style={{ color: '#333', fontSize: '1.3rem', marginBottom: '10px' }}>Technical Information</h3>
        <ul style={{ marginBottom: '20px' }}>
          <li><strong>Device Information:</strong> Device identifiers, operating system, and app version</li>
          <li><strong>Usage Data:</strong> App interactions, feature usage, and performance metrics</li>
          <li><strong>Log Data:</strong> Crash reports, error logs, and diagnostic information</li>
        </ul>
      </section>

      <section id="how-we-use" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          2. How We Use Your Information
        </h2>
        
        <ul style={{ marginBottom: '20px' }}>
          <li><strong>Service Provision:</strong> To provide and maintain our dating and social connection services</li>
          <li><strong>Matching:</strong> To suggest compatible users based on your preferences and location</li>
          <li><strong>Communication:</strong> To facilitate messaging and connection features between users</li>
          <li><strong>Payments:</strong> To process subscription payments and connection fees</li>
          <li><strong>Safety:</strong> To verify user identities and prevent fraud or abuse</li>
          <li><strong>Improvement:</strong> To analyze usage patterns and improve our services</li>
          <li><strong>Support:</strong> To provide customer support and respond to inquiries</li>
        </ul>
      </section>

      <section id="data-sharing" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          3. Data Sharing and Disclosure
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          We do not sell your personal information. We may share your information in the following circumstances:
        </p>
        
        <ul style={{ marginBottom: '20px' }}>
          <li><strong>With Other Users:</strong> Profile information and messages you choose to share</li>
          <li><strong>Service Providers:</strong> Third-party services for payment processing, cloud storage, and analytics</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
          <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
          <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
        </ul>
      </section>

      <section id="data-security" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          4. Data Security
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          We implement appropriate security measures to protect your personal information:
        </p>
        
        <ul style={{ marginBottom: '20px' }}>
          <li><strong>Encryption:</strong> All data is encrypted in transit using HTTPS/TLS</li>
          <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
          <li><strong>Secure Storage:</strong> Data stored in secure cloud environments with regular backups</li>
          <li><strong>Monitoring:</strong> Continuous monitoring for security threats and vulnerabilities</li>
          <li><strong>Authentication:</strong> Multi-factor authentication for administrative access</li>
        </ul>
      </section>

      <section id="your-rights" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          5. Your Rights and Choices
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          You have the following rights regarding your personal information:
        </p>
        
        <ul style={{ marginBottom: '20px' }}>
          <li><strong>Access:</strong> Request access to your personal data</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
          <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
          <li><strong>Restriction:</strong> Limit how we process your data</li>
          <li><strong>Objection:</strong> Object to certain types of data processing</li>
        </ul>
        
        <p style={{ marginBottom: '15px' }}>
          To exercise these rights, please contact us using the information provided below.
        </p>
      </section>

      <section id="data-retention" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          6. Data Retention
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          We retain your personal information for as long as necessary to provide our services and comply with legal obligations:
        </p>
        
        <ul style={{ marginBottom: '20px' }}>
          <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
          <li><strong>Deleted Accounts:</strong> Data deleted within 30 days of account deletion</li>
          <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
          <li><strong>Backup Data:</strong> Backup copies may exist for up to 90 days</li>
        </ul>
      </section>

      <section id="children-privacy" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          7. Children's Privacy
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          Our service is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.
        </p>
      </section>

      <section id="changes" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          8. Changes to This Privacy Policy
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically for any changes.
        </p>
      </section>

      <section id="contact-us" style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#EC066A', fontSize: '1.8rem', marginBottom: '15px' }}>
          9. Contact Us
        </h2>
        
        <p style={{ marginBottom: '15px' }}>
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <p style={{ margin: '5px 0' }}><strong>Email:</strong> privacy@qiimeet.com</p>
          <p style={{ margin: '5px 0' }}><strong>Support:</strong> support@qiimeet.com</p>
          <p style={{ margin: '5px 0' }}><strong>Address:</strong> Qiimeet Privacy Team, Nigeria</p>
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

export default PrivacyPolicy;
