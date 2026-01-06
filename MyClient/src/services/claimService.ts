export async function createClaim(payload: { assignmentId: string; reason: string; userId?: string }) {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return fetch('/api/claims', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
}
