// login.jsx — Performa authentication page
const { useState: useS } = React;

const EyeIcon = ({ open }) => (
  <svg style={{ width:'20px', height:'20px' }} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {open
      ? <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
    }
  </svg>
);

function LoginPage() {
  const [email, setEmail]       = useS('');
  const [password, setPassword] = useS('');
  const [remember, setRemember] = useS(false);
  const [showPass, setShowPass] = useS(false);
  const [loading, setLoading]   = useS(false);
  const [error, setError]       = useS('');

  const submit = e => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) { setError('Email and password are required.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = 'HR Dashboard.html';
    }, 1400);
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* ── Left brand panel ── */}
      <div className="login-brand" style={{
        flex:'0 0 44%', display:'flex', flexDirection:'column',
        background:'linear-gradient(155deg, #0c0f23 0%, #141830 55%, #1c2040 100%)',
        padding:'3rem', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'-180px', right:'-160px', width:'520px', height:'520px', borderRadius:'50%', background:'radial-gradient(circle, rgba(70,95,255,0.25) 0%, transparent 68%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-100px', left:'-100px', width:'360px', height:'360px', borderRadius:'50%', background:'radial-gradient(circle, rgba(70,95,255,0.14) 0%, transparent 68%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(70,95,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(70,95,255,0.07) 1px, transparent 1px)', backgroundSize:'48px 48px' }}/>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', position:'relative' }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'#465fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(70,95,255,0.45)' }}>
            <svg viewBox="0 0 24 24" style={{ width:'20px', height:'20px' }} fill="none">
              <path d="M5 17l4-9 3 6 3-4 4 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily:'Geist,sans-serif', fontSize:'16px', fontWeight:700, color:'#fff', letterSpacing:'-0.02em', lineHeight:1 }}>Performa</p>
            <p style={{ fontFamily:'Geist,sans-serif', fontSize:'11px', fontWeight:500, color:'rgba(255,255,255,0.38)', letterSpacing:'0.09em', textTransform:'uppercase', marginTop:'3px' }}>HR Console</p>
          </div>
        </div>

        {/* Tagline + features */}
        <div style={{ marginTop:'auto', marginBottom:'auto', position:'relative' }}>
          <h1 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontWeight:600, fontSize:'clamp(30px,3.2vw,46px)', lineHeight:1.08, color:'#fff', letterSpacing:'-0.03em', marginBottom:'22px' }}>
            Performance,<br/>Simplified.
          </h1>
          <p style={{ fontFamily:'Geist,sans-serif', fontSize:'15px', lineHeight:1.65, color:'rgba(255,255,255,0.52)', maxWidth:'310px' }}>
            One platform for appraisal cycles, KRA templates, and team performance visibility.
          </p>
          <div style={{ marginTop:'42px', display:'flex', flexDirection:'column', gap:'16px' }}>
            {['360° appraisal workflows','Real-time cycle tracking','Score distribution & calibration'].map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'22px', height:'22px', borderRadius:'50%', flexShrink:0, background:'rgba(70,95,255,0.28)', border:'1px solid rgba(100,125,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg viewBox="0 0 24 24" style={{ width:'11px', height:'11px' }} fill="none"><path d="m5 12.5 4 4L19 7" stroke="#a0b4ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ fontFamily:'Geist,sans-serif', fontSize:'14px', color:'rgba(255,255,255,0.62)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily:'Geist,sans-serif', fontSize:'12px', color:'rgba(255,255,255,0.22)', position:'relative' }}>© 2026 Performa · All rights reserved</p>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-page,#f4f1ea)', padding:'2rem' }}>
        <div style={{ width:'100%', maxWidth:'400px' }}>
          {/* Mobile-only logo */}
          <div className="login-mobile-logo" style={{ display:'none', alignItems:'center', gap:'10px', marginBottom:'32px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'#465fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg viewBox="0 0 24 24" style={{ width:'18px', height:'18px' }} fill="none"><path d="M5 17l4-9 3 6 3-4 4 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p style={{ fontFamily:'Geist,sans-serif', fontSize:'16px', fontWeight:700, color:'var(--text-strong,#14182a)', letterSpacing:'-0.02em' }}>Performa</p>
          </div>

          <div style={{ marginBottom:'38px' }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontWeight:600, fontSize:'27px', color:'var(--text-strong,#14182a)', letterSpacing:'-0.025em', marginBottom:'8px' }}>
              Sign in to your account
            </h2>
            <p style={{ fontFamily:'Geist,sans-serif', fontSize:'14.5px', color:'var(--text-muted,#5b6178)' }}>Enter your credentials to access HR Console.</p>
          </div>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
            {error && (
              <div style={{ padding:'12px 16px', borderRadius:'10px', background:'#fbe4e1', border:'1px solid #fda29b', color:'#7e1c14', fontSize:'14px', fontFamily:'Geist,sans-serif' }}>
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
              <label style={{ fontFamily:'Geist,sans-serif', fontSize:'13px', fontWeight:600, color:'var(--text-strong,#14182a)' }}>Email address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com" autoComplete="email"
                style={{ height:'46px', padding:'0 16px', borderRadius:'12px', border:'1.5px solid var(--border,#e2dccb)', background:'var(--bg-elevated,#ffffff)', color:'var(--text-strong,#14182a)', fontFamily:'Geist,sans-serif', fontSize:'15px', width:'100%', boxSizing:'border-box', outline:'none' }}
              />
            </div>

            {/* Password */}
            <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <label style={{ fontFamily:'Geist,sans-serif', fontSize:'13px', fontWeight:600, color:'var(--text-strong,#14182a)' }}>Password</label>
                <a href="Forgot Password.html" style={{ fontFamily:'Geist,sans-serif', fontSize:'13px', color:'#465fff', textDecoration:'none', fontWeight:500 }}>Forgot password?</a>
              </div>
              <div style={{ position:'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password" autoComplete="current-password"
                  style={{ height:'46px', padding:'0 48px 0 16px', borderRadius:'12px', border:'1.5px solid var(--border,#e2dccb)', background:'var(--bg-elevated,#ffffff)', color:'var(--text-strong,#14182a)', fontFamily:'Geist,sans-serif', fontSize:'15px', width:'100%', boxSizing:'border-box', outline:'none' }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:'4px', minHeight:'auto', color:'var(--text-muted,#5b6178)', display:'flex', alignItems:'center' }}>
                  <EyeIcon open={showPass}/>
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', userSelect:'none' }}>
              <div
                role="checkbox" aria-checked={remember} tabIndex={0}
                onClick={() => setRemember(r => !r)}
                onKeyDown={e => e.key === ' ' && setRemember(r => !r)}
                style={{ width:'20px', height:'20px', borderRadius:'6px', flexShrink:0, border: remember ? 'none' : '1.5px solid var(--border-strong,#cdc5af)', background: remember ? '#465fff' : 'var(--bg-elevated,#ffffff)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.18s ease' }}
              >
                {remember && <svg viewBox="0 0 24 24" style={{ width:'12px', height:'12px' }} fill="none"><path d="m5 12.5 4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontFamily:'Geist,sans-serif', fontSize:'14px', color:'var(--text-body,#2f3548)' }}>Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{ height:'48px', borderRadius:'12px', border:'none', background: loading ? '#8b96e0' : '#465fff', color:'#fff', fontFamily:'Geist,sans-serif', fontSize:'15px', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing:'-0.01em', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', boxShadow: loading ? 'none' : '0 2px 12px rgba(70,95,255,0.38)' }}>
              {loading
                ? (<><svg style={{ width:'18px', height:'18px', animation:'login-spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/><path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> Signing in…</>)
                : 'Sign in'
              }
            </button>
          </form>

          <p style={{ marginTop:'32px', textAlign:'center', fontFamily:'Geist,sans-serif', fontSize:'13px', color:'var(--text-faint,#8b91a3)' }}>
            Need access?{' '}<a href="#" style={{ color:'#465fff', textDecoration:'none', fontWeight:500 }}>Contact your HR team</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes login-spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-brand { display: none !important; }
          .login-mobile-logo { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LoginPage />);
