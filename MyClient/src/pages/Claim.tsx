import React, { useState } from 'react';
import { createClaim } from '../services/claimService';

const Claim: React.FC = () => {
  const [assignmentId, setAssignmentId] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await createClaim({ assignmentId, reason });
      if (res.ok) {
        setStatus('Claim submitted successfully');
        setAssignmentId('');
        setReason('');
      } else {
        const data = await res.json();
        setStatus(data.error || 'Failed to submit claim');
      }
    } catch (err) {
      console.error(err);
      setStatus('Network or server error');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Submit Claim</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Assignment ID</label>
          <br />
          <input value={assignmentId} onChange={e => setAssignmentId(e.target.value)} required />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Reason</label>
          <br />
          <textarea value={reason} onChange={e => setReason(e.target.value)} required />
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="submit">Send Claim</button>
        </div>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Claim;
