// forgot-password.jsx — Performa password reset page
const { useState: useS } = React;

function ForgotPasswordPage() {
  const [email, setEmail]     = useS('');
  const [loading, setLoading] = useS(false);
  const [sent, setSent]       = useS(false);
  const [error, setError]     = useS('');

  const submit = e => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1200);
  };

  const card = {
    width:'100%', maxWidth:'420px',
    background:'var(--bg-card,#fbfaf6)',
    borderRadius:'20px',
    border:'1px solid var(--border,#e2dccb)',
    padding:'40px',
    boxShadow:'0 2px 4px rgba(20,18,8,.04), 0 12px 28px -10px rgba(20,18,8,.09), 0 0 0 1px rgba(20,18,8,.04)',
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-page,#f4f1ea)', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:'420px', display:'flex', flexDirection:'column' }}>

        {/* Back link */}
        <a href="Login.html" style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontFamily:'Geist,sans-serif', fontSize:'14px', color:'var(--text-muted,#5b6178)', textDecoration:'none', marginBottom:'28px', width:'fit-content' }}>
          <svg viewBox="0 0 24 24" style={{ width:'16px', height:'16px' }} fill="none">
            <path d="M19 12H5m0 0 6-6m-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to sign in
        </a>

        <div style={card}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'32px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#465fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(70,95,255,0.38)' }}>
              <svg viewBox="0 0 24 24" style={{ width:'18px', height:'18px' }} fill="none">
                <path d="M5 17l4-9 3 6 3-4 4 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{ fontFamily:'Geist,sans-serif', fontSize:'15px', fontWeight:700, color:'var(--text-strong,#14182a)', letterSpacing:'-0.015em' }}>Performa</p>
          </div>

          {!sent ? (
            <>
              <div style={{ marginBottom:'32px' }}>
                <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'#eaf0ff', border:'1px solid #c2d6ff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px' }}>
                  <svg viewBox="0 0 24 24" style={{ width:'24px', height:'24px' }} fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="#465fff" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#465fff" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="12" cy="16" r="1.5" fill="#465fff"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontWeight:600, fontSize:'26px', color:'var(--text-strong,#14182a)', letterSpacing:'-0.025em', marginBottom:'8px' }}>
                  Forgot your password?
                </h2>
                <p style={{ fontFamily:'Geist,sans-serif', fontSize:'14.5px', lineHeight:1.65, color:'var(--text-muted,#5b6178)' }}>
                  No problem. Enter your work email and we'll send a reset link.
                </p>
              </div>

              <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                {error && (
                  <div style={{ padding:'12px 16px', borderRadius:'10px', background:'#fbe4e1', border:'1px solid #fda29b', color:'#7e1c14', fontSize:'14px', fontFamily:'Geist,sans-serif' }}>
                    {error}
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                  <label style={{ fontFamily:'Geist,sans-serif', fontSize:'13px', fontWeight:600, color:'var(--text-strong,#14182a)' }}>Email address</label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com" autoComplete="email"
                    style={{ height:'46px', padding:'0 16px', borderRadius:'12px', border:'1.5px solid var(--border,#e2dccb)', background:'var(--bg-elevated,#ffffff)', color:'var(--text-strong,#14182a)', fontFamily:'Geist,sans-serif', fontSize:'15px', width:'100%', boxSizing:'border-box', outline:'none' }}
                  />
                </div>
                <button type="submit" disabled={loading} style={{ height:'48px', borderRadius:'12px', border:'none', background: loading ? '#8b96e0' : '#465fff', color:'#fff', fontFamily:'Geist,sans-serif', fontSize:'15px', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', boxShadow: loading ? 'none' : '0 2px 12px rgba(70,95,255,0.38)' }}>
                  {loading
                    ? (<><svg style={{ width:'18px', height:'18px', animation:'fp-spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/><path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> Sending…</>)
                    : 'Send reset link'
                  }
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'8px 0 4px' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'#e3f5e9', border:'1px solid #a6f4c5', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
                <svg viewBox="0 0 24 24" style={{ width:'28px', height:'28px' }} fill="none">
                  <path d="m5 12.5 4 4L19 7" stroke="#039855" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontWeight:600, fontSize:'24px', color:'var(--text-strong,#14182a)', letterSpacing:'-0.025em', marginBottom:'12px' }}>
                Check your email
              </h2>
              <p style={{ fontFamily:'Geist,sans-serif', fontSize:'14.5px', lineHeight:1.65, color:'var(--text-muted,#5b6178)', marginBottom:'32px' }}>
                We sent a reset link to{' '}
                <strong style={{ color:'var(--text-strong,#14182a)', fontWeight:600 }}>{email}</strong>.
                <br/>It should arrive within a minute.
              </p>
              <a href="Login.html" style={{ display:'inline-flex', height:'44px', padding:'0 28px', borderRadius:'12px', background:'#465fff', color:'#fff', alignItems:'center', justifyContent:'center', fontFamily:'Geist,sans-serif', fontSize:'14.5px', fontWeight:600, textDecoration:'none', boxShadow:'0 2px 10px rgba(70,95,255,0.35)' }}>
                Back to sign in
              </a>
              <p style={{ marginTop:'20px', fontFamily:'Geist,sans-serif', fontSize:'13px', color:'var(--text-faint,#8b91a3)' }}>
                Didn't get it?{' '}
                <button onClick={() => { setSent(false); setEmail(''); }} style={{ background:'none', border:'none', color:'#465fff', cursor:'pointer', fontFamily:'Geist,sans-serif', fontSize:'13px', fontWeight:500, padding:0, minHeight:'auto' }}>
                  Try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ForgotPasswordPage />);
