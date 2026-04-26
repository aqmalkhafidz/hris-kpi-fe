// my-account.jsx — Staff account settings (limited self-edit)
const { useState, useRef } = React;

const STAFF = {
  name: 'Aqmal Pratama', initials: 'AP',
  email: 'aqmal.pratama@company.com', employeeId: 'EMP-2847',
  department: 'Engineering', division: 'Technology',
  position: 'Software Engineer', manager: 'Rifky Oktaviano',
  joinDate: 'Mar 15, 2023',
  phone: '+62 812-3456-7890',
  emergencyName: 'Budi Pratama', emergencyPhone: '+62 821-9876-5432', emergencyRelation: 'Father',
};

const EyeIcon = ({ open }) => (
  <svg style={{ width:'18px', height:'18px' }} viewBox="0 0 24 24" fill="none">
    {open
      ? <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
    }
  </svg>
);

const labelStyle = { fontFamily:'Geist,sans-serif', fontSize:'12.5px', fontWeight:600, color:'var(--text-muted,#5b6178)', letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:'6px', display:'block' };

function Field({ label, value, disabled, type='text', onChange, rightEl }) {
  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position:'relative' }}>
        <input
          type={type} value={value} disabled={disabled}
          onChange={onChange ? e => onChange(e.target.value) : undefined}
          style={{
            height:'44px', padding:`0 ${rightEl?'44px':'14px'} 0 14px`, borderRadius:'10px',
            border:'1.5px solid var(--border,#e2dccb)',
            background: disabled ? 'var(--bg-subtle,#ede9df)' : 'var(--bg-elevated,#ffffff)',
            color: disabled ? 'var(--text-muted,#5b6178)' : 'var(--text-strong,#14182a)',
            fontFamily:'Geist,sans-serif', fontSize:'14.5px', width:'100%', boxSizing:'border-box',
            outline:'none', cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        {rightEl && <div style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)' }}>{rightEl}</div>}
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div style={{ background:'var(--bg-card,#fbfaf6)', border:'1px solid var(--border,#e2dccb)', borderRadius:'16px', overflow:'hidden', boxShadow:'0 1px 2px rgba(20,18,8,.04), 0 0 0 1px rgba(20,18,8,.03)' }}>
      <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid var(--border,#e2dccb)' }}>
        <p style={{ fontFamily:'Geist,sans-serif', fontSize:'15px', fontWeight:600, color:'var(--text-strong,#14182a)', letterSpacing:'-0.01em' }}>{title}</p>
        {subtitle && <p style={{ fontFamily:'Geist,sans-serif', fontSize:'12.5px', color:'var(--text-muted,#5b6178)', marginTop:'2px' }}>{subtitle}</p>}
      </div>
      <div style={{ padding:'22px 24px' }}>{children}</div>
    </div>
  );
}

function SaveButton({ loading, label='Save changes', savedLabel='Saved', loadingLabel='Saving…' }) {
  const [saved, setSaved] = useState(false);
  return { saved, setSaved, btn: (
    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
      <button type="submit" disabled={loading} style={{ height:'40px', padding:'0 20px', borderRadius:'10px', border:'none', background: loading ? '#8b96e0' : '#465fff', color:'#fff', fontFamily:'Geist,sans-serif', fontSize:'14px', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'7px' }}>
        {loading ? (<><svg style={{ width:'15px', height:'15px', animation:'ma-spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/><path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>{loadingLabel}</>) : label}
      </button>
      {saved && <span style={{ display:'flex', alignItems:'center', gap:'5px', fontFamily:'Geist,sans-serif', fontSize:'13.5px', fontWeight:500, color:'#039855' }}><svg viewBox="0 0 24 24" style={{ width:'15px', height:'15px' }} fill="none"><path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>{savedLabel}</span>}
    </div>
  )};
}

function PhotoSection() {
  const [preview, setPreview] = useState(null);
  const ref = useRef(null);
  const pick = e => { const f = e.target.files[0]; if (f) setPreview(URL.createObjectURL(f)); };
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'20px' }}>
      <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'#eaf0ff', border:'2px solid var(--border,#e2dccb)', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {preview
          ? <img src={preview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          : <span style={{ fontFamily:'Geist,sans-serif', fontSize:'22px', fontWeight:600, color:'#465fff' }}>{STAFF.initials}</span>
        }
      </div>
      <div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={() => ref.current.click()} type="button" style={{ height:'36px', padding:'0 16px', borderRadius:'8px', border:'1.5px solid var(--border-strong,#cdc5af)', background:'var(--bg-elevated,#ffffff)', fontFamily:'Geist,sans-serif', fontSize:'13.5px', fontWeight:500, color:'var(--text-body,#2f3548)', cursor:'pointer' }}>
            Change photo
          </button>
          {preview && <button onClick={() => setPreview(null)} type="button" style={{ height:'36px', padding:'0 14px', borderRadius:'8px', border:'none', background:'none', fontFamily:'Geist,sans-serif', fontSize:'13.5px', color:'var(--text-muted,#5b6178)', cursor:'pointer' }}>Remove</button>}
        </div>
        <p style={{ marginTop:'6px', fontFamily:'Geist,sans-serif', fontSize:'12.5px', color:'var(--text-faint,#8b91a3)' }}>JPG, PNG or GIF · max 2 MB</p>
        <input ref={ref} type="file" accept="image/*" onChange={pick} style={{ display:'none' }}/>
      </div>
    </div>
  );
}

function ContactSection() {
  const [phone, setPhone]     = useState(STAFF.phone);
  const [emName, setEmName]   = useState(STAFF.emergencyName);
  const [emPhone, setEmPhone] = useState(STAFF.emergencyPhone);
  const [emRel, setEmRel]     = useState(STAFF.emergencyRelation);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);

  const save = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 900);
  };
  return (
    <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
      <Field label="Mobile phone" value={phone} onChange={setPhone}/>
      <div style={{ borderTop:'1px solid var(--border,#e2dccb)', paddingTop:'16px' }}>
        <p style={{ fontFamily:'Geist,sans-serif', fontSize:'13px', fontWeight:600, color:'var(--text-body,#2f3548)', marginBottom:'14px' }}>Emergency contact</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
          <Field label="Full name"    value={emName}  onChange={setEmName}/>
          <Field label="Relationship" value={emRel}   onChange={setEmRel}/>
        </div>
        <div style={{ marginTop:'14px' }}>
          <Field label="Phone number" value={emPhone} onChange={setEmPhone}/>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <button type="submit" disabled={loading} style={{ height:'40px', padding:'0 20px', borderRadius:'10px', border:'none', background: loading ? '#8b96e0' : '#465fff', color:'#fff', fontFamily:'Geist,sans-serif', fontSize:'14px', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'7px' }}>
          {loading ? (<><svg style={{ width:'15px', height:'15px', animation:'ma-spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/><path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>Saving…</>) : 'Save changes'}
        </button>
        {saved && <span style={{ display:'flex', alignItems:'center', gap:'5px', fontFamily:'Geist,sans-serif', fontSize:'13.5px', fontWeight:500, color:'#039855' }}><svg viewBox="0 0 24 24" style={{ width:'15px', height:'15px' }} fill="none"><path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Saved</span>}
      </div>
    </form>
  );
}

function PasswordSection() {
  const [cur, setCur]         = useState('');
  const [next, setNext]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState('');

  const strength = pw => {
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const str = strength(next);
  const strMeta = [null,{label:'Weak',color:'#f04438'},{label:'Fair',color:'#f79009'},{label:'Good',color:'#12b76a'},{label:'Strong',color:'#039855'}][str] || null;

  const save = e => {
    e.preventDefault(); setError('');
    if (!cur) { setError('Current password is required.'); return; }
    if (next.length < 8) { setError('New password must be at least 8 characters.'); return; }
    if (next !== confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false); setSaved(true); setCur(''); setNext(''); setConfirm('');
      setTimeout(() => setSaved(false), 3500);
    }, 1000);
  };

  return (
    <form onSubmit={save} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
      {error && <div style={{ padding:'11px 14px', borderRadius:'9px', background:'#fbe4e1', border:'1px solid #fda29b', color:'#7e1c14', fontSize:'13.5px', fontFamily:'Geist,sans-serif' }}>{error}</div>}
      <Field label="Current password" value={cur} type={showCur?'text':'password'} onChange={setCur}
        rightEl={<button type="button" onClick={() => setShowCur(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, minHeight:'auto', color:'var(--text-muted,#5b6178)', display:'flex' }}><EyeIcon open={showCur}/></button>}
      />
      <div>
        <Field label="New password" value={next} type={showNext?'text':'password'} onChange={setNext}
          rightEl={<button type="button" onClick={() => setShowNext(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, minHeight:'auto', color:'var(--text-muted,#5b6178)', display:'flex' }}><EyeIcon open={showNext}/></button>}
        />
        {next && (
          <div style={{ marginTop:'8px', display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ flex:1, height:'4px', borderRadius:'4px', background:'var(--border,#e2dccb)', overflow:'hidden' }}>
              <div style={{ height:'100%', borderRadius:'4px', background: strMeta?.color || '#e2dccb', width:`${str * 25}%`, transition:'width 0.3s ease, background 0.3s ease' }}/>
            </div>
            {strMeta && <span style={{ fontFamily:'Geist,sans-serif', fontSize:'12px', fontWeight:500, color:strMeta.color, minWidth:'40px' }}>{strMeta.label}</span>}
          </div>
        )}
      </div>
      <Field label="Confirm new password" value={confirm} type="password" onChange={setConfirm}/>
      <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
        <button type="submit" disabled={loading} style={{ height:'40px', padding:'0 20px', borderRadius:'10px', border:'none', background: loading ? '#8b96e0' : '#465fff', color:'#fff', fontFamily:'Geist,sans-serif', fontSize:'14px', fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', gap:'7px' }}>
          {loading ? (<><svg style={{ width:'15px', height:'15px', animation:'ma-spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/><path d="M12 3a9 9 0 0 1 9 9" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>Updating…</>) : 'Update password'}
        </button>
        {saved && <span style={{ display:'flex', alignItems:'center', gap:'5px', fontFamily:'Geist,sans-serif', fontSize:'13.5px', fontWeight:500, color:'#039855' }}><svg viewBox="0 0 24 24" style={{ width:'15px', height:'15px' }} fill="none"><path d="m5 12.5 4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Password updated</span>}
      </div>
    </form>
  );
}

function MyAccountPage() {
  return (
    <PageShell active="settings" user={{ name:STAFF.name, role:STAFF.position, initials:STAFF.initials }}>
      <div>
        <h1 style={{ fontFamily:'Fraunces,serif', fontStyle:'italic', fontWeight:600, fontSize:'26px', color:'var(--text-strong,#14182a)', letterSpacing:'-0.025em', marginBottom:'4px' }}>My Account</h1>
        <p style={{ fontFamily:'Geist,sans-serif', fontSize:'14px', color:'var(--text-muted,#5b6178)' }}>Manage your profile photo, contact details, and password.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'22px', alignItems:'start' }}>
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <Card title="Profile photo">
            <PhotoSection/>
          </Card>

          <Card title="Personal information" subtitle="Managed by HR · contact HR Support to update these fields.">
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <Field label="Full name"      value={STAFF.name}       disabled/>
              <Field label="Employee ID"    value={STAFF.employeeId} disabled/>
              <Field label="Email"          value={STAFF.email}      disabled/>
              <Field label="Join date"      value={STAFF.joinDate}   disabled/>
              <Field label="Department"     value={STAFF.department} disabled/>
              <Field label="Division"       value={STAFF.division}   disabled/>
              <Field label="Position"       value={STAFF.position}   disabled/>
              <Field label="Direct manager" value={STAFF.manager}    disabled/>
            </div>
            <div style={{ marginTop:'14px', display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', background:'var(--bg-subtle,#ede9df)', borderRadius:'9px' }}>
              <svg viewBox="0 0 24 24" style={{ width:'15px', height:'15px', flexShrink:0 }} fill="none"><circle cx="12" cy="12" r="9" stroke="#5b6178" strokeWidth="1.5"/><path d="M12 11v5M12 8v.5" stroke="#5b6178" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <p style={{ fontFamily:'Geist,sans-serif', fontSize:'12.5px', color:'var(--text-muted,#5b6178)' }}>
                Submit a request to <a href="#" style={{ color:'#465fff', fontWeight:500, textDecoration:'none' }}>HR Support</a> to update these details.
              </p>
            </div>
          </Card>

          <Card title="Contact details" subtitle="Update your mobile number and emergency contact.">
            <ContactSection/>
          </Card>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
          <Card title="Change password" subtitle="Use letters, numbers, and symbols for a strong password.">
            <PasswordSection/>
          </Card>

          <Card title="Active sessions">
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                { device:'MacBook Pro · Chrome', location:'Jakarta, Indonesia', time:'Now', current:true, isPhone:false },
                { device:'iPhone 15 · Safari',   location:'Jakarta, Indonesia', time:'2 hours ago', current:false, isPhone:true },
              ].map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:'var(--bg-subtle,#ede9df)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg viewBox="0 0 24 24" style={{ width:'16px', height:'16px' }} fill="none">
                      {s.isPhone
                        ? <><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>
                        : <><rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
                      }
                    </svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontFamily:'Geist,sans-serif', fontSize:'13.5px', fontWeight:500, color:'var(--text-strong,#14182a)', display:'flex', alignItems:'center', gap:'6px' }}>
                      {s.device}
                      {s.current && <span style={{ fontSize:'11px', background:'#e3f5e9', color:'#039855', padding:'1px 7px', borderRadius:'20px', fontWeight:500 }}>Current</span>}
                    </p>
                    <p style={{ fontFamily:'Geist,sans-serif', fontSize:'12.5px', color:'var(--text-faint,#8b91a3)', marginTop:'1px' }}>{s.location} · {s.time}</p>
                  </div>
                  {!s.current && (
                    <button style={{ background:'none', border:'1px solid var(--border,#e2dccb)', borderRadius:'7px', padding:'4px 10px', fontFamily:'Geist,sans-serif', fontSize:'12.5px', color:'var(--text-muted,#5b6178)', cursor:'pointer', minHeight:'auto', whiteSpace:'nowrap' }}>
                      Sign out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <style>{`@keyframes ma-spin { to { transform: rotate(360deg); } }`}</style>
    </PageShell>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MyAccountPage />);
