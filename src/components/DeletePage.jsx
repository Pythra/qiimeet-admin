import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../env';

const DeletePage = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/data-deletion-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          reason
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        setError('Failed to submit request. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '8px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#155724', margin: '0 0 15px 0' }}>
            Request Submitted Successfully
          </h2>
          <p style={{ color: '#155724', margin: '0 0 20px 0' }}>
            Your data deletion request has been submitted. We will process your request within 30 days and send you a confirmation email.
          </p>
          <p style={{ color: '#155724', margin: '0' }}>
            If you have any questions, please contact us at privacy@qiimeet.com
          </p>
        </div>
        
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#EC066A',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '600px',
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
          Data Deletion Request
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#666',
          margin: '0'
        }}>
          Request deletion of your personal data from Qiimeet
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <h3 style={{ color: '#856404', margin: '0 0 10px 0' }}>Important Information</h3>
        <ul style={{ color: '#856404', margin: '0', paddingLeft: '20px' }}>
          <li>This action is <strong>irreversible</strong> - all your data will be permanently deleted</li>
          <li>Processing time: Up to 30 days from request submission</li>
          <li>You will receive a confirmation email once the deletion is complete</li>
          <li>Some data may be retained for legal compliance purposes</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#f8f9fa',
        padding: '30px',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your registered email address"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Phone Number *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            placeholder="Enter your registered phone number"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#333'
          }}>
            Reason for Deletion (Optional)
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select a reason (optional)</option>
            <option value="privacy-concerns">Privacy concerns</option>
            <option value="no-longer-using">No longer using the service</option>
            <option value="found-partner">Found a partner</option>
            <option value="technical-issues">Technical issues</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '20px',
            color: '#721c24'
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: '#e2e3e5',
          border: '1px solid #d6d8db',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            cursor: 'pointer',
            fontSize: '14px',
            color: '#495057'
          }}>
            <input
              type="checkbox"
              required
              style={{
                marginRight: '10px',
                marginTop: '2px'
              }}
            />
            <span>
              I understand that this action is irreversible and will permanently delete all my personal data, 
              including profile information, messages, photos, and account history. I confirm that I want 
              to proceed with the data deletion request.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isSubmitting ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Deletion Request'}
        </button>
      </form>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ color: '#333', margin: '0 0 15px 0' }}>What Happens Next?</h3>
        <ol style={{ margin: '0', paddingLeft: '20px', color: '#666' }}>
          <li>We will verify your identity using the provided email and phone number</li>
          <li>Your request will be processed within 30 days</li>
          <li>All your personal data will be permanently deleted from our systems</li>
          <li>You will receive a confirmation email once the deletion is complete</li>
          <li>Some anonymized data may be retained for legal compliance</li>
        </ol>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #e9ecef'
      }}>
        <p style={{ color: '#666', margin: '0 0 15px 0' }}>
          Need help or have questions?
        </p>
        <p style={{ color: '#666', margin: '0' }}>
          Contact us at <strong>privacy@qiimeet.com</strong>
        </p>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '30px'
      }}>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            marginRight: '10px'
          }}
        >
          Back to Home
        </Link>
        <Link 
          to="/privacy-policy" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#EC066A',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: '600'
          }}
        >
          View Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default DeletePage;




