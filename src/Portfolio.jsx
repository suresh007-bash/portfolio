import { useState, useEffect, useRef } from "react";
import emailjs from "emailjs-com";
import SnowflakeCursor from "./SnowflakeCursor";

// Initialize EmailJS - Replace with your Public Key from emailjs.com
emailjs.init("Is5ZfJQe3AHnXIHVl");

const data = {
  name: "Suresh Gopi V",
  title: "Aspiring Full Stack Developer",
  bio: "Hands-on experience in frontend & backend development, real-time projects, and strong problem-solving practice through competitive programming and internships.",
  contact: {
    phone: "+919791990242",
    email: "sureshgopy07@gmail.com",
    location: "Tirunelveli, Tamil Nadu",
    github: "https://github.com/suresh007-bash",
    linkedin: "https://www.linkedin.com/in/suresh-gopi-7a7220321",
  },
  skills: ["Problem Solving", "Teamwork", "Communication", "Continuous Learning"],
  languages: ["Java", "C", "C++", "React JS", "SQL"],
  interests: ["Full Stack Development", "Competitive Programming", "Artificial Intelligence"],
  education: [
    { year: "2023–2027", degree: "B.E Computer Science & Engineering", place: "National Engineering College, Kovilpatti", grade: "6.87 CGPA" },
    { year: "2022–2023", degree: "HSC", place: "Reach Matriculation HSS, Moolaikaraipatti", grade: "88%" },
    { year: "2021–2022", degree: "SSLC", place: "Reach Matriculation HSS, Moolaikaraipatti", grade: "Pass" },
  ],
  internships: [
    { role: "Web Development Intern", company: "Prodigy", desc: "Worked on frontend and backend modules of web applications." },
    { role: "Full Stack Development Intern", company: "CodSoft", desc: "Developed full-stack applications and improved backend logic implementation." },
  ],
  projects: [
    { name: "Plant Disease Prediction", icon: "🌿", desc: "AI-driven system for early detection of plant diseases using image analysis.", tags: ["AI", "Image Analysis", "Python"] },
    { name: "Smart Parking System", icon: "🅿️", desc: "Efficient parking system using IoT devices to optimize space utilization.", tags: ["IoT", "Embedded", "Hardware"] },
    { name: "Food Management + AI Diet Planner", icon: "🥗", desc: "AI-assisted food management and diet planning application with a user-friendly interface.", tags: ["AI", "React", "Full Stack"] },
  ],
  certifications: [
    "Introduction to Cloud Computing – AWS Academy",
    "Introduction to Industry 4.0 – NPTEL",
    "Social Network Analysis – NPTEL",
    "MERN Stack Development (Advanced) – Udemy",
  ],
  achievements: [
    "Solved 1500+ programming problems on Skillrack",
    "1st Prize – Technical Escape Room, Saveetha Engineering College",
    "Participated in Smart India Hackathon (SIH)",
    "Participated in ANVESHANA Hackathon, Sasi Institute of Technology",
  ],
};

const NAV_ITEMS = ["About", "Skills", "Projects", "Education", "Experience", "Contact"];

function useScrollSpy() {
  const [active, setActive] = useState("About");
  useEffect(() => {
    const handler = () => {
      let current = "About";
      NAV_ITEMS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = Math.ceil(target / 60);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(start);
          }, 20);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email");
      return;
    }

    // Send email via EmailJS
    emailjs
      .send(
        "service_idzoasc", // Service ID provided by user
        "template_d3z1vk9", // Template ID provided by user
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: "sureshgopy07@gmail.com",
        }
      )
      .then((response) => {
        setSubmitted(true);
        setTimeout(() => onClose(), 2000);
      })
      .catch((error) => {
        setError("Failed to send message. Please try again.");
        console.error(error);
      });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
      <div style={{ background: "#050A0F", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 12, padding: 40, maxWidth: 500, width: "90%" }}>
        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#00E5FF", marginBottom: 8 }}>Thank You!</h2>
            <p style={{ color: "#8899AA" }}>Your message has been received. I'll get back to you soon!</p>
          </div>
        ) : (
          <>
            <h2 style={{ color: "#00E5FF", marginBottom: 24 }}>Send Me a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#8899AA", marginBottom: 6, fontSize: "0.85rem" }}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#E8F4F8", fontFamily: "inherit", fontSize: "0.95rem" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#8899AA", marginBottom: 6, fontSize: "0.85rem" }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#E8F4F8", fontFamily: "inherit", fontSize: "0.95rem" }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#8899AA", marginBottom: 6, fontSize: "0.85rem" }}>Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="4" style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#E8F4F8", fontFamily: "inherit", fontSize: "0.95rem", resize: "none" }} />
              </div>
              {error && <p style={{ color: "#FF6B6B", marginBottom: 16, fontSize: "0.85rem" }}>⚠️ {error}</p>}
              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" style={{ flex: 1, padding: "12px 20px", background: "#00E5FF", color: "#050A0F", fontWeight: 700, border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.9rem" }}>Send Message</button>
                <button type="button" onClick={onClose} style={{ flex: 1, padding: "12px 20px", background: "transparent", color: "#E8F4F8", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, cursor: "pointer", fontSize: "0.9rem" }}>Close</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const active = useScrollSpy();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Syne', sans-serif", background: "#050A0F", color: "#E8F4F8", minHeight: "100vh", overflowX: "hidden", cursor: "none" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050A0F; }
        ::-webkit-scrollbar-thumb { background: #00E5FF; border-radius: 2px; }
        html { scroll-behavior: smooth; }

        .custom-cursor { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999; mix-blend-mode: screen; }
        .custom-cursor-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(0,229,255,0.95); box-shadow: 0 0 10px rgba(0,229,255,0.8); transition: transform 0.15s ease-out, opacity 0.2s ease; }
        .custom-cursor-ring { width: 44px; height: 44px; border-radius: 50%; border: 1.6px solid rgba(0,229,255,0.55); backdrop-filter: blur(2px); transition: transform 0.18s ease-out, opacity 0.2s ease, border-color 0.18s ease-out; }
        .custom-cursor-ring:hover-target { border-color: rgba(255,255,255,0.8); }

        .nav-link { cursor: pointer; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; color: #8899AA; transition: color 0.2s; padding: 4px 0; }
        .nav-link:hover, .nav-link.active { color: #00E5FF; }
        .nav-link.active { border-bottom: 1px solid #00E5FF; }

        .hero-tag { display: inline-block; font-family: 'Space Mono', monospace; font-size: 0.7rem; color: #00E5FF; background: rgba(0,229,255,0.08); border: 1px solid rgba(0,229,255,0.25); padding: 4px 12px; border-radius: 2px; letter-spacing: 0.15em; margin-bottom: 20px; }

        .glow-text { background: linear-gradient(135deg, #E8F4F8 0%, #00E5FF 50%, #7B6CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
        .card:hover { border-color: rgba(0,229,255,0.3); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,255,0.05); }

        .tag { display: inline-block; font-family: 'Space Mono', monospace; font-size: 0.65rem; padding: 3px 10px; background: rgba(123,108,246,0.15); border: 1px solid rgba(123,108,246,0.3); border-radius: 2px; color: #B8A9FF; letter-spacing: 0.08em; }

        .skill-bar-outer { height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; margin-top: 6px; }
        .skill-bar-inner { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #00E5FF, #7B6CF6); animation: fillBar 1.5s ease forwards; transform-origin: left; }
        @keyframes fillBar { from { width: 0; } }

        .stat-box { text-align: center; padding: 24px 16px; }
        .stat-num { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, #00E5FF, #7B6CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        .timeline-dot { width: 10px; height: 10px; border-radius: 50%; background: #00E5FF; flex-shrink: 0; box-shadow: 0 0 12px rgba(0,229,255,0.6); margin-top: 5px; }
        .timeline-line { width: 1px; background: rgba(0,229,255,0.2); flex-grow: 1; margin: 4px auto; }

        .contact-link { display: flex; align-items: center; gap: 12px; padding: 14px 18px; border-radius: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); text-decoration: none; color: inherit; transition: all 0.2s; }
        .contact-link:hover { background: rgba(0,229,255,0.06); border-color: rgba(0,229,255,0.3); }

        .section-label { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: #00E5FF; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
        .section-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 800; line-height: 1.1; margin-bottom: 48px; }

        .hero-grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }

        .mobile-menu { position: fixed; inset: 0; background: rgba(5,10,15,0.97); z-index: 999; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 32px; }
        .mobile-nav-link { font-size: 1.5rem; font-weight: 700; cursor: pointer; color: #8899AA; letter-spacing: 0.05em; transition: color 0.2s; }
        .mobile-nav-link:hover { color: #00E5FF; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-1 { animation-delay: 0.1s; opacity: 0; }
        .fade-up-2 { animation-delay: 0.25s; opacity: 0; }
        .fade-up-3 { animation-delay: 0.4s; opacity: 0; }
        .fade-up-4 { animation-delay: 0.55s; opacity: 0; }

        .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: #00E5FF; color: #050A0F; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.05em; border: none; border-radius: 4px; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-primary:hover { background: #33EAFF; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,229,255,0.3); }
        .btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; background: transparent; color: #E8F4F8; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.05em; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer; transition: all 0.2s; text-decoration: none; }
        .btn-outline:hover { border-color: #00E5FF; color: #00E5FF; transform: translateY(-2px); }

        .neon-avatar-shell { position: relative; display: inline-block; z-index: 1; }
        .neon-ring { position: absolute; inset: -20px; border-radius: 50%; background: conic-gradient(from 0deg, rgba(0,229,255,0.4), rgba(123,108,246,0.35), rgba(0,229,255,0.25), rgba(123,108,246,0.2)); filter: blur(20px); pointer-events: none; animation: spin 6s linear infinite; }
        .neon-dot { position: absolute; top: 50%; left: 50%; width: 16px; height: 16px; border-radius: 50%; background: radial-gradient(circle, rgba(0,255,255,0.95) 0%, rgba(0,255,255,0.2) 55%, transparent 100%); box-shadow: 0 0 20px rgba(0,255,255,0.85), 0 0 40px rgba(123,108,246,0.35); transform: translate(-50%, -50%) rotate(0deg) translateX(145px); transform-origin: center; animation: orbit 4s linear infinite; pointer-events: none; }
        .neon-ring-border { position: absolute; inset: -12px; border-radius: 50%; border: 1.5px solid rgba(0,229,255,0.35); filter: blur(1px); pointer-events: none; }
        .neon-avatar-frame { position: relative; width: 280px; height: 280px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, rgba(0,229,255,0.45), rgba(123,108,246,0.55)); }
        .neon-avatar-frame img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbit { from { transform: translate(-50%, -50%) rotate(0deg) translateX(145px); } to { transform: translate(-50%, -50%) rotate(360deg) translateX(145px); } }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          .hero-name { font-size: 2.8rem !important; }
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .stat-row { grid-template-columns: 1fr 1fr !important; }
        }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; z-index: 1001; }
        .hamburger span { width: 24px; height: 2px; background: #E8F4F8; border-radius: 1px; transition: all 0.3s; }
      `}</style>
      <SnowflakeCursor />
      {/* Background */}
      <div className="hero-grid-bg" />
      <div className="hero-orb" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)", top: -100, right: -100 }} />
      <div className="hero-orb" style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(123,108,246,0.08) 0%, transparent 70%)", bottom: 200, left: -100 }} />

      {/* Navbar */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(5,10,15,0.85)", backdropFilter: "blur(20px)", padding: "0 clamp(16px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.85rem", color: "#00E5FF", letterSpacing: "0.1em" }}>
            SG<span style={{ color: "#7B6CF6" }}>._v</span>
          </div>
          <div className="desktop-nav" style={{ display: "flex", gap: 32 }}>
            {NAV_ITEMS.map((item) => (
              <span key={item} className={`nav-link ${active === item ? "active" : ""}`} onClick={() => scrollTo(item)}>{item}</span>
            ))}
          </div>
          <a onClick={() => setContactOpen(true)} className="btn-primary" style={{ fontSize: "0.75rem", padding: "8px 18px", display: "inline-flex", cursor: "pointer" }}>Hire Me</a>
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {NAV_ITEMS.map((item) => (
            <span key={item} className="mobile-nav-link" onClick={() => scrollTo(item)}>{item}</span>
          ))}
        </div>
      )}

      {/* Hero */}
      <section id="About" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px clamp(16px, 5vw, 80px) 60px", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 60, alignItems: "center" }} className="two-col">
            <div>
              <div className="fade-up fade-up-1">
                <span className="hero-tag">Available for Opportunities</span>
              </div>
              <h1 className="fade-up fade-up-2" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", fontWeight: 800, lineHeight: 1.05, marginBottom: 24, whiteSpace: "nowrap" }} id="hero-name">
                <span className="glow-text">{data.name}</span>
              </h1>
              <p className="fade-up fade-up-3" style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "#8899AA", lineHeight: 1.8, maxWidth: 520, marginBottom: 36 }}>
                {data.bio}
              </p>
              <div className="fade-up fade-up-4" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <a href={data.contact.github} target="_blank" rel="noreferrer" className="btn-primary">View GitHub →</a>
                <a onClick={() => setContactOpen(true)} className="btn-outline" style={{ cursor: "pointer" }}>Contact Me</a>
              </div>
            </div>

            {/* Avatar card */}
            <div className="fade-up fade-up-3 neon-avatar-shell" style={{ textAlign: "center" }}>
              <div className="neon-ring" />
              <div className="neon-ring-border" />
              <div className="neon-dot" />
              <div className="neon-avatar-frame">
                <img src="/profile.jpg" alt="Suresh Gopi V" />
              </div>
              <div style={{ position: "absolute", bottom: 8, right: 8, width: 20, height: 20, background: "#22C55E", borderRadius: "50%", border: "3px solid #050A0F" }} />
              <p style={{ marginTop: 16, fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", color: "#8899AA" }}>📍 {data.contact.location}</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, marginTop: 80, background: "rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }} className="stat-row">
            {[
              { num: 1500, suffix: "+", label: "Problems Solved" },
              { num: 3, suffix: "", label: "Projects Built" },
              { num: 2, suffix: "", label: "Internships" },
              { num: 4, suffix: "", label: "Certifications" },
            ].map((s) => (
              <div key={s.label} className="stat-box" style={{ background: "rgba(5,10,15,0.9)" }}>
                <div className="stat-num"><AnimatedCounter target={s.num} suffix={s.suffix} /></div>
                <div style={{ fontSize: "0.75rem", color: "#8899AA", marginTop: 4, letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="Skills" style={{ padding: "100px clamp(16px, 5vw, 80px)", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">What I Know</div>
          <h2 className="section-title">Skills & <span className="glow-text">Expertise</span></h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="three-col">
            {/* Languages */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, color: "#00E5FF" }}>Languages</h3>
              {[["Java", 85], ["C", 80], ["C++", 75], ["React JS", 80], ["SQL", 70]].map(([lang, pct]) => (
                <div key={lang} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span>{lang}</span><span style={{ color: "#8899AA", fontFamily: "'Space Mono', monospace", fontSize: "0.7rem" }}>{pct}%</span>
                  </div>
                  <div className="skill-bar-outer"><div className="skill-bar-inner" style={{ width: `${pct}%` }} /></div>
                </div>
              ))}
            </div>

            {/* Soft Skills */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, color: "#7B6CF6" }}>Soft Skills</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {data.skills.map((s) => (
                  <div key={s} style={{ padding: "10px 16px", background: "rgba(123,108,246,0.1)", border: "1px solid rgba(123,108,246,0.25)", borderRadius: 8, fontSize: "0.85rem" }}>{s}</div>
                ))}
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginTop: 28, marginBottom: 16, color: "#7B6CF6" }}>Interests</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.interests.map((i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.85rem" }}>
                    <span style={{ color: "#00E5FF" }}>▸</span>{i}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="card" style={{ padding: 28 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20, color: "#F59E0B" }}>Certifications</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {data.certifications.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: "0.82rem", lineHeight: 1.5 }}>
                    <span style={{ color: "#F59E0B", fontSize: "1rem", flexShrink: 0 }}>🏅</span>
                    <span style={{ color: "#C0D4E0" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="Projects" style={{ padding: "100px clamp(16px, 5vw, 80px)", background: "rgba(255,255,255,0.01)", position: "relative" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">What I've Built</div>
          <h2 className="section-title">Featured <span className="glow-text">Projects</span></h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="three-col">
            {data.projects.map((p, i) => (
              <div key={i} className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -20, right: -20, fontSize: "5rem", opacity: 0.06 }}>{p.icon}</div>
                <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 12, fontSize: "1.05rem", lineHeight: 1.3 }}>{p.name}</h3>
                <p style={{ fontSize: "0.84rem", color: "#8899AA", lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="Education" style={{ padding: "100px clamp(16px, 5vw, 80px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Academic Journey</div>
          <h2 className="section-title">Education <span className="glow-text">Background</span></h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {data.education.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 24 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                  <div className="timeline-dot" />
                  {i < data.education.length - 1 && <div className="timeline-line" style={{ height: 60 }} />}
                </div>
                <div className="card" style={{ padding: "20px 24px", marginBottom: i < data.education.length - 1 ? 16 : 0, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "1rem" }}>{e.degree}</h3>
                      <p style={{ fontSize: "0.82rem", color: "#8899AA", marginTop: 4 }}>{e.place}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#00E5FF", background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", padding: "3px 10px", borderRadius: 3 }}>{e.year}</div>
                      <div style={{ marginTop: 6, fontSize: "0.85rem", fontWeight: 700, color: "#7B6CF6" }}>{e.grade}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="Experience" style={{ padding: "100px clamp(16px, 5vw, 80px)", background: "rgba(255,255,255,0.01)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="section-label">Where I've Worked</div>
          <h2 className="section-title">Internship <span className="glow-text">Experience</span></h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24, marginBottom: 60 }} className="two-col">
            {data.internships.map((intern, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>{intern.role}</h3>
                    <p style={{ color: "#00E5FF", fontSize: "0.85rem", marginTop: 4, fontFamily: "'Space Mono', monospace" }}>{intern.company}</p>
                  </div>
                  <span style={{ fontSize: "1.5rem" }}>💼</span>
                </div>
                <p style={{ fontSize: "0.84rem", color: "#8899AA", lineHeight: 1.7 }}>{intern.desc}</p>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="section-label">Milestones</div>
          <h3 style={{ fontWeight: 700, fontSize: "1.4rem", marginBottom: 24 }}>Achievements</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }} className="two-col">
            {data.achievements.map((a, i) => (
              <div key={i} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>🏆</span>
                <span style={{ fontSize: "0.85rem", color: "#C0D4E0", lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="Contact" style={{ padding: "100px clamp(16px, 5vw, 80px) 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>Let's <span className="glow-text">Connect</span></h2>
          <p style={{ color: "#8899AA", fontSize: "1rem", lineHeight: 1.8, marginBottom: 56, maxWidth: 480, margin: "0 auto 56px" }}>
            I'm actively looking for internship and full-time opportunities. Whether you have a project, a question, or just want to say hi — my inbox is open!
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, textAlign: "left", marginBottom: 40 }} className="two-col">
            {[
              { icon: "📧", label: "Email", value: data.contact.email, href: `mailto:${data.contact.email}` },
              { icon: "📱", label: "Phone", value: data.contact.phone, href: `tel:${data.contact.phone}` },
              { icon: "🐙", label: "GitHub", value: "suresh007-bash", href: data.contact.github },
              { icon: "💼", label: "LinkedIn", value: "suresh-gopi", href: data.contact.linkedin },
            ].map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-link">
                <span style={{ fontSize: "1.3rem" }}>{c.icon}</span>
                <div>
                  <div style={{ fontSize: "0.7rem", color: "#8899AA", marginBottom: 2, letterSpacing: "0.08em" }}>{c.label}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <a onClick={() => setContactOpen(true)} className="btn-primary" style={{ fontSize: "1rem", padding: "16px 40px", cursor: "pointer" }}>
            Say Hello 👋
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "24px clamp(16px, 5vw, 80px)", textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", color: "#3A4A5A", letterSpacing: "0.1em" }}>
          SURESH GOPI V — BUILT WITH REACT — {new Date().getFullYear()}
        </p>
      </footer>

      {/* Contact Form Modal */}
      {contactOpen && <ContactForm onClose={() => setContactOpen(false)} />}
    </div>
  );
}
