import { useState, useMemo } from 'react';
import type { Scholarship, MatchResult, StudentProfile } from './types';
import { Input, Select } from './components/FormElements';
import { Card } from './components/Card';
import { MOCK_SCHOLARSHIPS } from './data';
import { SignInModal } from './components/SignInModal';
import { ScholarshipCard } from './components/ScholarshipCard';
import { ScholarshipDetail } from './components/ScholarshipDetail';
import { Button } from './components/Button';
import { GraduationCap, Search, Sparkles, BookMarked, Target, Clock, ShieldCheck, Users, BookOpen, Globe, ChevronRight, Mail, User, Library, ClipboardEdit, CalendarPlus, MessageCircle, Bell, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [profile, setProfile] = useState<{ fullName: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('scholartrack_session');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isMatching, setIsMatching] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [academicProfile, setAcademicProfile] = useState<StudentProfile | null>(() => {
    try {
      const session = localStorage.getItem('scholartrack_session');
      if (session) {
        const { email } = JSON.parse(session);
        const saved = localStorage.getItem(`scholartrack_profile_${email}`);
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    } catch { return null; }
  });
  const [activeDetailedSection, setActiveDetailedSection] = useState<'personal' | 'additional' | 'olevel' | 'undergraduate'>('personal');
  const [view, setView] = useState<'landing' | 'scholarships' | 'results' | 'deadlines' | 'profile' | 'mydetails' | 'saved'>(() => {
    try {
      const saved = localStorage.getItem('scholartrack_session');
      return saved ? 'scholarships' : 'landing';
    } catch { return 'landing'; }
  });
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Secondary' | 'Undergraduate' | 'Masters'>('All');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  });

  const handleSignIn = (data: { fullName: string; email: string }) => {
    setProfile(data);
    setShowSignIn(false);
    setView('scholarships');

    // Load persisted profile for this user
    try {
      const saved = localStorage.getItem(`scholartrack_profile_${data.email}`);
      if (saved) {
        setAcademicProfile(JSON.parse(saved));
      } else {
        setAcademicProfile(null);
      }
    } catch { setAcademicProfile(null); }
  };

  const handleSignOut = () => {
    localStorage.removeItem('scholartrack_session');
    setProfile(null);
    setAcademicProfile(null);
    setMatches([]);
    setView('landing');
  };

  const runMatching = async (details: StudentProfile) => {
    setAcademicProfile(details);
    setIsMatching(true);
    setView('results');

    try {
      // Try real AI matching first
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
        const { getScholarshipMatches } = await import('./services/aiService');
        const aiMatches = await getScholarshipMatches(details, MOCK_SCHOLARSHIPS);
        if (aiMatches.length > 0) {
          setMatches(aiMatches);
          setIsMatching(false);
          return;
        }
      }
    } catch (err) {
      console.warn('AI matching failed, using fallback:', err);
    }

    // Fallback: smart mock matching based on profile data
    const mockMatches: MatchResult[] = MOCK_SCHOLARSHIPS
      .filter(s => s.eligibleLevel.includes(details.levelOfStudy))
      .slice(0, 5)
      .map((s, i) => ({
        scholarshipId: s.id,
        matchPercentage: 95 - i * 8,
        priority: i < 2 ? 'High Fit' : i < 4 ? 'Moderate Fit' : 'Stretch',
        reason: `Based on your ${details.undergraduateDetails?.courseOfStudy || details.fieldOfStudy || 'academic'} background${details.undergraduateDetails?.currentCgpa ? ` and ${details.undergraduateDetails.currentCgpa} CGPA` : ''}, this scholarship from ${s.sponsor} is a strong match for your profile.`
      }));
    setMatches(mockMatches);
    setIsMatching(false);
  };

  const handleGetStarted = () => {
    if (profile) {
      setView('results');
    } else {
      setShowSignIn(true);
    }
  };

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const matchedScholarships = useMemo(() => {
    return matches.map(m => ({
      scholarship: MOCK_SCHOLARSHIPS.find(s => s.id === m.scholarshipId)!,
      matchInfo: m
    })).filter(item => item.scholarship);
  }, [matches]);

  const savedScholarships = useMemo(() => {
    return MOCK_SCHOLARSHIPS.filter(s => savedIds.has(s.id));
  }, [savedIds]);

  const getGoogleCalendarUrl = (s: Scholarship) => {
    const deadline = new Date(s.deadline);
    const dateStr = deadline.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const nextDay = new Date(deadline);
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = nextDay.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const title = encodeURIComponent(`📋 ${s.name} — Application Deadline`);
    const details = encodeURIComponent(`Scholarship: ${s.name}\nSponsor: ${s.sponsor}\nLocation: ${s.location}\n\nApply here: ${s.applicationLink}\n\nReminder set via ScholarTrack`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${endStr}&details=${details}`;
  };

  const getWhatsAppUrl = (s: Scholarship) => {
    const deadline = new Date(s.deadline);
    const diffDays = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const msg = encodeURIComponent(
      `🎓 *Scholarship Reminder*\n\n` +
      `📌 *${s.name}*\n` +
      `🏢 Sponsor: ${s.sponsor}\n` +
      `📍 Location: ${s.location}\n` +
      `📅 Deadline: ${deadline.toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })}` +
      (diffDays > 0 ? ` (${diffDays} days left)` : ' (Expired)') +
      `\n\n🔗 Apply: ${s.applicationLink}\n\n_Sent via ScholarTrack_`
    );
    return `https://wa.me/?text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => setView('landing')}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-academic-blue text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">ScholarTrack</h1>

            </div>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {profile ? (
              <>
                <div className="hidden items-center gap-1 md:flex">
                  {[
                    { label: 'Scholarships', v: 'scholarships' as const, icon: Library },
                    { label: 'Best Matches', v: 'results' as const, icon: Sparkles },
                    { label: 'My Details', v: 'mydetails' as const, icon: ClipboardEdit },
                    { label: 'Deadlines', v: 'deadlines' as const, icon: Clock },
                  ].map(item => (
                    <button
                      key={item.v}
                      onClick={() => setView(item.v)}
                      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${view === item.v
                        ? 'bg-academic-blue/10 text-academic-blue'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
                <div
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-academic-blue transition-colors hover:bg-academic-blue hover:text-white"
                  onClick={() => setView('profile')}
                  title="Profile"
                >
                  <span className="font-bold">{profile.fullName[0]}</span>
                </div>
              </>
            ) : (
              <Button size="sm" className="md:px-6 md:py-3 md:text-base" onClick={handleGetStarted}>Get Started</Button>
            )}
          </nav>
        </div>

        {/* Mobile nav bar — only shown when logged in */}
        {profile && (
          <div className="flex border-t border-slate-100 md:hidden">
            {[
              { label: 'Scholarships', v: 'scholarships' as const, icon: Library },
              { label: 'Matches', v: 'results' as const, icon: Sparkles },
              { label: 'Details', v: 'mydetails' as const, icon: ClipboardEdit },
              { label: 'Profile', v: 'profile' as const, icon: User },
            ].map(item => (
              <button
                key={item.v}
                onClick={() => setView(item.v)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${view === item.v
                  ? 'text-academic-blue'
                  : 'text-slate-400'
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.section
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16 md:space-y-24"
            >
              {/* Hero */}
              <div className="flex flex-col items-center text-center pt-8">
                <h2 className="mb-6 text-4xl font-black leading-tight text-slate-900 md:text-6xl">
                  Find the Right <span className="text-academic-blue">Scholarship</span> for Your Journey
                </h2>
                <p className="mb-10 max-w-2xl text-lg text-slate-600 md:text-xl">
                  ScholarTrack connects Nigerian students with scholarships they actually qualify for — powered by intelligent matching, not endless searching.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="gap-2 px-8 py-5 text-base md:px-10 md:py-6 md:text-lg" onClick={handleGetStarted}>
                    Get Started <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Core Features */}
              <div>
                <div className="mb-12 text-center">
                  <p className="mb-2 text-sm font-bold uppercase tracking-widest text-academic-blue">Core Features</p>
                  <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Everything You Need in One Place</h3>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { icon: Target, title: 'Smart Matching', desc: 'Our AI analyzes your profile — GPA, field of study, location — to recommend scholarships you\'re most likely to get.' },
                    { icon: Search, title: 'Curated Database', desc: 'Access verified scholarships from top sponsors like MTN, Shell, Chevening, and more — all in one place.' },
                    { icon: Clock, title: 'Deadline Alerts', desc: 'Never miss an application window. Track deadlines and get reminders via WhatsApp or Google Calendar.' },
                    { icon: ShieldCheck, title: 'Eligibility Check', desc: 'Instantly see if you meet the requirements before spending time on an application.' }
                  ].map((feature, i) => (
                    <div key={i} className="glass-card flex flex-col p-8 transition-transform hover:-translate-y-2">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-academic-blue/10 text-academic-blue">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h4>
                      <p className="text-sm leading-relaxed text-slate-500">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who It's For */}
              <div className="rounded-2xl bg-academic-blue p-6 text-white sm:rounded-3xl sm:p-10 md:p-16">
                <div className="mb-12 text-center">
                  <p className="mb-2 text-sm font-bold uppercase tracking-widest text-academic-gold">Who It's For</p>
                  <h3 className="text-2xl font-bold md:text-3xl">Built for Nigerian Students at Every Level</h3>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {[
                    { icon: BookOpen, level: 'Secondary Students', desc: 'Preparing for university? Find early scholarships and bursaries to kickstart your academic career.' },
                    { icon: Users, level: 'Undergraduates', desc: 'Whether you\'re in 100 level or final year, discover funding from MTN, Shell, SEPLAT, NLNG and more.' },
                    { icon: Globe, level: 'Postgraduate Scholars', desc: 'Pursuing a Master\'s abroad? Get matched with Chevening, Commonwealth, Agip, and other international awards.' }
                  ].map((item, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                        <item.icon className="h-6 w-6 text-academic-gold" />
                      </div>
                      <h4 className="mb-2 text-lg font-bold">{item.level}</h4>
                      <p className="text-sm leading-relaxed text-blue-100">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* How It Works */}
              <div>
                <div className="mb-12 text-center">
                  <p className="mb-2 text-sm font-bold uppercase tracking-widest text-academic-blue">How It Works</p>
                  <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">Your Scholarship in 4 Simple Steps</h3>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  {[
                    { step: '01', icon: User, title: 'Create Your Profile', desc: 'Sign up and fill in your academic details — name, level of study, GPA, field, and location.' },
                    { step: '02', icon: Search, title: 'Browse Scholarships', desc: 'Explore our database of 20+ verified scholarships from top Nigerian and international sponsors.' },
                    { step: '03', icon: Sparkles, title: 'Get AI Matches', desc: 'Our AI engine analyzes your profile and ranks scholarships by how well they fit your background.' },
                    { step: '04', icon: Clock, title: 'Apply & Track', desc: 'Save your top picks, set Google Calendar reminders, and share deadlines via WhatsApp — never miss a deadline.' }
                  ].map((item, i) => (
                    <div key={i} className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                      <div className="mb-3 text-4xl font-black text-academic-blue/10">{item.step}</div>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-academic-blue text-white shadow-md">
                        <item.icon className="h-7 w-7" />
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h4>
                      <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg sm:rounded-3xl sm:p-10 md:p-16">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-academic-blue text-white shadow-lg">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-slate-900 md:text-3xl">Ready to Find Your Scholarship?</h3>
                <p className="mb-8 max-w-lg text-lg text-slate-500">
                  Create your free profile in under 2 minutes. Get matched with scholarships tailored to your academic background.
                </p>
                <Button size="lg" className="gap-2 px-8 py-5 text-base md:px-12 md:py-6 md:text-lg" onClick={handleGetStarted}>
                  Create Your Profile <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.section>
          )}

          {/* Scholarships - Browse All */}
          {view === 'scholarships' && (
            <motion.section
              key="scholarships"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight md:text-4xl">Browse Available Scholarships</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-8 flex flex-wrap gap-2">
                {(['All', 'Secondary', 'Undergraduate', 'Masters'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${categoryFilter === cat
                      ? 'bg-academic-blue text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-academic-blue/40 hover:text-academic-blue'
                      }`}
                  >
                    {cat === 'Masters' ? 'Postgraduate' : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_SCHOLARSHIPS
                  .filter(s => categoryFilter === 'All' || s.eligibleLevel.includes(categoryFilter))
                  .map((s) => (
                    <ScholarshipCard
                      key={s.id}
                      scholarship={s}
                      isSaved={savedIds.has(s.id)}
                      onToggleSave={toggleSave}
                      onViewDetails={setSelectedScholarship}
                    />
                  ))}
              </div>
            </motion.section>
          )}

          {/* Deadlines */}
          {view === 'deadlines' && (
            <motion.section
              key="deadlines"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight md:text-4xl">Deadline Tracker</h2>
                <p className="mt-2 text-slate-500">Track deadlines, set reminders on Google Calendar, and share via WhatsApp.</p>
              </div>

              {savedScholarships.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-center bg-white shadow-sm">
                  <div className="mb-6 h-16 w-16 bg-slate-50 flex items-center justify-center rounded-full text-slate-300">
                    <Clock className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No deadlines to track</h3>
                  <p className="mt-2 text-slate-500 max-w-xs">Save scholarships while browsing to see their deadlines tracked automatically here.</p>
                  <Button className="mt-8" onClick={() => setView('scholarships')}>Browse Scholarships</Button>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Summary Stats */}
                  {(() => {
                    const now = new Date();
                    const urgentCount = savedScholarships.filter(s => { const d = Math.ceil((new Date(s.deadline).getTime() - now.getTime()) / 86400000); return d > 0 && d <= 14; }).length;
                    const upcomingCount = savedScholarships.filter(s => Math.ceil((new Date(s.deadline).getTime() - now.getTime()) / 86400000) > 14).length;
                    const expiredCount = savedScholarships.filter(s => Math.ceil((new Date(s.deadline).getTime() - now.getTime()) / 86400000) <= 0).length;
                    return (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-xl border border-red-100 bg-red-50/50 p-4 text-center">
                          <p className="text-2xl font-bold text-red-600">{urgentCount}</p>
                          <p className="text-xs font-semibold text-red-500 uppercase tracking-wider mt-1">Urgent</p>
                        </div>
                        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-center">
                          <p className="text-2xl font-bold text-academic-blue">{upcomingCount}</p>
                          <p className="text-xs font-semibold text-academic-blue uppercase tracking-wider mt-1">Upcoming</p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                          <p className="text-2xl font-bold text-slate-400">{expiredCount}</p>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Expired</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Categorized Deadlines */}
                  {(() => {
                    const categorized = savedScholarships.reduce((acc, s) => {
                      const diffDays = Math.ceil((new Date(s.deadline).getTime() - new Date().getTime()) / 86400000);
                      if (diffDays <= 0) acc.past.push(s);
                      else if (diffDays <= 14) acc.urgent.push(s);
                      else acc.upcoming.push(s);
                      return acc;
                    }, { urgent: [] as Scholarship[], upcoming: [] as Scholarship[], past: [] as Scholarship[] });

                    const renderDeadlineCard = (s: Scholarship, variant: 'urgent' | 'upcoming' | 'past') => {
                      const deadline = new Date(s.deadline);
                      const diffTime = deadline.getTime() - currentTime.getTime();
                      const diffDays = Math.ceil(diffTime / 86400000);
                      const pctElapsed = variant === 'urgent' ? Math.max(0, Math.min(100, ((14 - diffDays) / 14) * 100)) : 0;

                      const getTimeLeft = () => {
                        if (diffTime <= 0) return "Expired";
                        const d = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        const h = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const m = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
                        const s = Math.floor((diffTime % (1000 * 60)) / 1000);
                        return `${d}d ${h}h ${m}m ${s}s`;
                      };

                      return (
                        <Card
                          key={s.id}
                          className={`relative overflow-hidden transition-all hover:shadow-lg ${variant === 'urgent'
                            ? 'border-red-300 bg-gradient-to-r from-red-50/60 to-white ring-2 ring-red-500/10 animate-pulse-subtle'
                            : variant === 'past'
                              ? 'border-slate-200 bg-slate-50 opacity-70'
                              : 'border-slate-200 bg-white'
                            }`}
                        >
                          <div className={`absolute top-0 left-0 w-1 h-full ${variant === 'urgent' ? 'bg-red-500' : variant === 'past' ? 'bg-slate-300' : 'bg-academic-blue'}`} />

                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-slate-900 leading-tight">{s.name}</h4>
                                <p className="text-sm text-slate-500 mt-0.5">{s.sponsor}</p>
                              </div>
                              <div className={`rounded-lg px-3 py-1.5 text-center flex-shrink-0 ${variant === 'urgent'
                                ? 'bg-red-100 border border-red-200'
                                : variant === 'past'
                                  ? 'bg-slate-100 border border-slate-200'
                                  : 'bg-blue-50 border border-blue-100'
                                }`}>
                                <p className={`text-sm font-bold ${variant === 'urgent' ? 'text-red-700' : variant === 'past' ? 'text-slate-400' : 'text-academic-blue'}`}>
                                  {deadline.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                                </p>
                                <p className={`text-[10px] font-bold font-mono ${variant === 'urgent' ? 'text-red-500' : variant === 'past' ? 'text-slate-400' : 'text-blue-400'}`}>
                                  {getTimeLeft()}
                                </p>
                              </div>
                            </div>

                            {variant === 'urgent' && (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-red-500">
                                  <span>Time Elapsed</span>
                                  <span>{diffDays} days remaining</span>
                                </div>
                                <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pctElapsed}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                                  />
                                </div>
                              </div>
                            )}

                            {variant !== 'past' ? (
                              <div className="flex flex-wrap gap-2 pt-1">
                                <a href={getGoogleCalendarUrl(s)} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md">
                                  <CalendarPlus className="h-3.5 w-3.5" /> Google Calendar
                                </a>
                                <a href={getWhatsAppUrl(s)} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-green-300 hover:bg-green-50 hover:text-green-700 hover:shadow-md">
                                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                                </a>
                                <a href={s.applicationLink} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-academic-blue hover:bg-academic-blue/5 hover:text-academic-blue hover:shadow-md">
                                  <ExternalLink className="h-3.5 w-3.5" /> Apply Now
                                </a>
                                <button onClick={() => setSelectedScholarship(s)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 hover:shadow-md">
                                  <BookOpen className="h-3.5 w-3.5" /> Details
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2 pt-1">
                                <button onClick={() => setSelectedScholarship(s)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm hover:bg-slate-100">
                                  <BookOpen className="h-3.5 w-3.5" /> Review
                                </button>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    };

                    return (
                      <>
                        {categorized.urgent.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                                <Bell className="h-4 w-4 text-red-600" />
                              </div>
                              <h3 className="text-lg font-bold text-red-700">Urgent — Action Required</h3>
                            </div>
                            <div className="grid gap-4">
                              {categorized.urgent.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(s => renderDeadlineCard(s, 'urgent'))}
                            </div>
                          </div>
                        )}

                        {categorized.upcoming.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <Clock className="h-4 w-4 text-academic-blue" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-800">Upcoming Deadlines</h3>
                            </div>
                            <div className="grid gap-4">
                              {categorized.upcoming.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(s => renderDeadlineCard(s, 'upcoming'))}
                            </div>
                          </div>
                        )}

                        {categorized.past.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                                <Search className="h-4 w-4 text-slate-400" />
                              </div>
                              <h3 className="text-lg font-bold text-slate-500">Expired</h3>
                            </div>
                            <div className="grid gap-3">
                              {categorized.past.map(s => renderDeadlineCard(s, 'past'))}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </motion.section>
          )}

          {/* Profile */}
          {view === 'profile' && profile && (
            <motion.section
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-lg"
            >
              <h2 className="mb-8 text-3xl font-bold">Your Profile</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-academic-blue text-3xl font-bold text-white">
                    {profile.fullName[0]}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{profile.fullName}</h3>
                  <p className="text-slate-500">{profile.email}</p>
                </div>
                <Button variant="outline" className="mt-8 w-full" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </motion.section>
          )}

          {/* My Details - Academic Profile Form */}
          {view === 'mydetails' && profile && (
            <motion.section
              key="mydetails"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-6xl"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight md:text-4xl">Academic Profile Explorer</h2>
                <p className="mt-2 text-slate-500">Complete all sections to unlock more accurate scholarship matches.</p>
              </div>

              <div className="flex flex-col gap-8 md:flex-row">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-2">
                  {[
                    { id: 'personal', label: '1. Personal Details', icon: User },
                    { id: 'additional', label: '2. Additional Information', icon: Sparkles },
                    { id: 'olevel', label: '3. O\'Level Details', icon: BookOpen },
                    { id: 'undergraduate', label: '4. Undergraduate Section', icon: GraduationCap },
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveDetailedSection(section.id as any)}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${activeDetailedSection === section.id
                        ? 'bg-academic-blue text-white shadow-md transform scale-105'
                        : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        }`}
                    >
                      <section.icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  ))}
                </aside>

                {/* Content Area */}
                <div className="flex-1">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      // In a real app we'd merge this with existing state
                      const updatedDetails: StudentProfile = {
                        ...academicProfile,
                        fullName: profile.fullName,
                        email: profile.email,
                        firstName: (fd.get('firstName') as string) || academicProfile?.firstName || '',
                        middleName: (fd.get('middleName') as string) || academicProfile?.middleName || '',
                        surname: (fd.get('surname') as string) || academicProfile?.surname || '',
                        dob: (fd.get('dob') as string) || academicProfile?.dob || '',
                        gender: (fd.get('gender') as string) || academicProfile?.gender || '',
                        maritalStatus: (fd.get('maritalStatus') as string) || academicProfile?.maritalStatus || '',
                        mobileNumber: (fd.get('mobileNumber') as string) || academicProfile?.mobileNumber || '',
                        alternateMobile: (fd.get('alternateMobile') as string) || academicProfile?.alternateMobile || '',
                        preferredEmail: (fd.get('preferredEmail') as string) || academicProfile?.preferredEmail || '',
                        preferredMobile: (fd.get('preferredMobile') as string) || academicProfile?.preferredMobile || '',
                        relatedToGovtOfficial: fd.get('relatedToGovtOfficial') === 'yes',

                        // Additional
                        address: (fd.get('address') as string) || academicProfile?.address || '',
                        countryOfResidence: (fd.get('countryOfResidence') as string) || academicProfile?.countryOfResidence || '',
                        stateOfResidence: (fd.get('stateOfResidence') as string) || academicProfile?.stateOfResidence || '',
                        nationality: (fd.get('nationality') as string) || academicProfile?.nationality || '',
                        countryOfOrigin: (fd.get('countryOfOrigin') as string) || academicProfile?.countryOfOrigin || '',
                        stateOfOrigin: (fd.get('stateOfOrigin') as string) || academicProfile?.stateOfOrigin || '',
                        lgaOfOrigin: (fd.get('lgaOfOrigin') as string) || academicProfile?.lgaOfOrigin || '',
                        communityHometown: (fd.get('communityHometown') as string) || academicProfile?.communityHometown || '',
                        nextOfKinName: (fd.get('nextOfKinName') as string) || academicProfile?.nextOfKinName || '',
                        nextOfKinMobile: (fd.get('nextOfKinMobile') as string) || academicProfile?.nextOfKinMobile || '',
                        nextOfKinRelationship: (fd.get('nextOfKinRelationship') as string) || academicProfile?.nextOfKinRelationship || '',
                        academicRefereeName: (fd.get('academicRefereeName') as string) || academicProfile?.academicRefereeName || '',
                        academicRefereeMobile: (fd.get('academicRefereeMobile') as string) || academicProfile?.academicRefereeMobile || '',
                        academicRefereeRelationship: (fd.get('academicRefereeRelationship') as string) || academicProfile?.academicRefereeRelationship || '',
                        onScholarshipBursary: fd.get('onScholarshipBursary') === 'yes',
                        hasPhysicalDisability: fd.get('hasPhysicalDisability') === 'yes',
                        numberOfSiblings: parseInt(fd.get('numberOfSiblings') as string) || academicProfile?.numberOfSiblings || 0,
                        parentsOccupation: (fd.get('parentsOccupation') as string) || academicProfile?.parentsOccupation || '',
                        parentsMaritalStatus: (fd.get('parentsMaritalStatus') as string) || academicProfile?.parentsMaritalStatus || '',

                        // O Level
                        olevelDetails: {
                          mathematics: (fd.get('maths') as string) || academicProfile?.olevelDetails?.mathematics || '',
                          english: (fd.get('english') as string) || academicProfile?.olevelDetails?.english || '',
                          subject3: { name: (fd.get('subject3_name') as string) || '', grade: (fd.get('subject3_grade') as string) || '' },
                          subject4: { name: (fd.get('subject4_name') as string) || '', grade: (fd.get('subject4_grade') as string) || '' },
                          subject5: { name: (fd.get('subject5_name') as string) || '', grade: (fd.get('subject5_grade') as string) || '' },
                          subject6: { name: (fd.get('subject6_name') as string) || '', grade: (fd.get('subject6_grade') as string) || '' },
                          subject7: { name: (fd.get('subject7_name') as string) || '', grade: (fd.get('subject7_grade') as string) || '' },
                        },

                        // Undergraduate
                        undergraduateDetails: {
                          locationOfInstitution: (fd.get('inst_loc') as string) || academicProfile?.undergraduateDetails?.locationOfInstitution || '',
                          institutionState: (fd.get('inst_state') as string) || academicProfile?.undergraduateDetails?.institutionState || '',
                          institutionName: (fd.get('inst_name') as string) || academicProfile?.undergraduateDetails?.institutionName || '',
                          courseAdmittedFor: (fd.get('course_adm') as string) || academicProfile?.undergraduateDetails?.courseAdmittedFor || '',
                          studyTime: (fd.get('study_time') as any) || 'Full Time',
                          entryMode: (fd.get('entry_mode') as any) || 'JAMB',
                          jambRegNumber: (fd.get('jamb_reg') as string) || academicProfile?.undergraduateDetails?.jambRegNumber || '',
                          jambScore: (fd.get('jamb_score') as string) || academicProfile?.undergraduateDetails?.jambScore || '',
                          yearOfAdmission: (fd.get('adm_year') as string) || academicProfile?.undergraduateDetails?.yearOfAdmission || '',
                          matricNumber: (fd.get('matric') as string) || academicProfile?.undergraduateDetails?.matricNumber || '',
                          courseOfStudy: (fd.get('course_study') as string) || academicProfile?.undergraduateDetails?.courseOfStudy || '',
                          courseDuration: (fd.get('duration') as string) || academicProfile?.undergraduateDetails?.courseDuration || '',
                          currentLevel: (fd.get('curr_level') as string) || academicProfile?.undergraduateDetails?.currentLevel || '',
                          cgpaScale: (fd.get('cgpa_scale') as string) || academicProfile?.undergraduateDetails?.cgpaScale || '',
                          currentCgpa: (fd.get('curr_cgpa') as string) || academicProfile?.undergraduateDetails?.currentCgpa || '',
                          expectedYearOfGraduation: (fd.get('grad_year') as string) || academicProfile?.undergraduateDetails?.expectedYearOfGraduation || '',
                        },

                        // Legacy
                        phoneNumber: (fd.get('mobileNumber') as string) || '',
                        levelOfStudy: 'Undergraduate',
                        fieldOfStudy: (fd.get('course_study') as string) || '',
                        gpa: (fd.get('curr_cgpa') as string) || '',
                        interestedLocation: 'Nigeria',
                        financialNeed: 'Medium'
                      };
                      setAcademicProfile(updatedDetails);
                      if (profile?.email) {
                        localStorage.setItem(`scholartrack_profile_${profile.email}`, JSON.stringify(updatedDetails));
                      }
                      setSaveSuccess(true);
                      setTimeout(() => setSaveSuccess(false), 3000);
                    }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between sticky top-[80px] z-20 bg-slate-50 py-2 border-b border-slate-200 mb-4">
                      <h3 className="text-xl font-bold text-slate-900 capitalize">
                        {activeDetailedSection.replace('_', ' ')} Details
                      </h3>
                      <Button type="submit" size="sm" className="gap-2 shadow-lg">
                        <Sparkles className="h-4 w-4 text-academic-gold" /> Update & Save
                      </Button>
                    </div>

                    <AnimatePresence>
                      {saveSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm"
                        >
                          <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          {activeDetailedSection === 'personal' ? 'Personal Details' :
                            activeDetailedSection === 'additional' ? 'Additional Information' :
                              activeDetailedSection === 'olevel' ? "O'Level Details" :
                                'Undergraduate Section'} updated successfully!
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {activeDetailedSection === 'personal' && (
                        <motion.div
                          key="personal"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <Card className="hover:shadow-lg transition-shadow">
                            <div className="grid gap-4 md:grid-cols-2">
                              <Input label="First Name" name="firstName" defaultValue={academicProfile?.firstName} required />
                              <Input label="Middle Name" name="middleName" defaultValue={academicProfile?.middleName} />
                              <Input label="Surname" name="surname" defaultValue={academicProfile?.surname} required />
                              <Input label="Date of Birth" name="dob" type="date" defaultValue={academicProfile?.dob} required />
                              <Select label="Gender" name="gender" options={[{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }]} defaultValue={academicProfile?.gender} />
                              <Select label="Marital Status" name="maritalStatus" options={[{ label: 'Single', value: 'Single' }, { label: 'Married', value: 'Married' }]} defaultValue={academicProfile?.maritalStatus} />
                              <Input label="Email" name="email" type="email" defaultValue={profile.email} disabled />
                              <Input label="Alternate Email" name="alternateEmail" type="email" defaultValue={academicProfile?.alternateEmail} />
                              <Input label="Mobile Number" name="mobileNumber" defaultValue={academicProfile?.mobileNumber} required />
                              <Input label="Alternate Mobile" name="alternateMobile" defaultValue={academicProfile?.alternateMobile} />
                              <Input label="Preferred Email" name="preferredEmail" defaultValue={academicProfile?.preferredEmail} required />
                              <Input label="Preferred Mobile" name="preferredMobile" defaultValue={academicProfile?.preferredMobile} required />
                              <Select label="Related to Govt Official?" name="relatedToGovtOfficial" options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} defaultValue={academicProfile?.relatedToGovtOfficial ? 'yes' : 'no'} />
                            </div>
                          </Card>
                        </motion.div>
                      )}

                      {activeDetailedSection === 'additional' && (
                        <motion.div
                          key="additional"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <Card className="hover:shadow-lg transition-shadow">
                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-academic-blue pl-3">Residential & Nationality</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <Input label="Address" name="address" defaultValue={academicProfile?.address} required className="md:col-span-2" />
                              <Input label="Country of Residence" name="countryOfResidence" defaultValue={academicProfile?.countryOfResidence} required />
                              <Input label="State of Residence" name="stateOfResidence" defaultValue={academicProfile?.stateOfResidence} required />
                              <Input label="Nationality" name="nationality" defaultValue={academicProfile?.nationality} required />
                              <Input label="Country of Origin" name="countryOfOrigin" defaultValue={academicProfile?.countryOfOrigin} required />
                              <Input label="State of Origin" name="stateOfOrigin" defaultValue={academicProfile?.stateOfOrigin} required />
                              <Input label="LGA of Origin" name="lgaOfOrigin" defaultValue={academicProfile?.lgaOfOrigin} required />
                              <Input label="Community/Hometown" name="communityHometown" defaultValue={academicProfile?.communityHometown} required />
                            </div>
                          </Card>

                          <Card className="hover:shadow-lg transition-shadow">
                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-academic-gold pl-3">Emergency & Academic Contacts</h4>
                            <div className="grid gap-4 md:grid-cols-3">
                              <div className="space-y-4 md:col-span-3 pb-4 border-b border-slate-100">
                                <p className="text-sm font-semibold text-slate-600">Next of Kin Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Input label="Name" name="nextOfKinName" defaultValue={academicProfile?.nextOfKinName} required />
                                  <Input label="Mobile" name="nextOfKinMobile" defaultValue={academicProfile?.nextOfKinMobile} required />
                                  <Input label="Relationship" name="nextOfKinRelationship" defaultValue={academicProfile?.nextOfKinRelationship} required />
                                </div>
                              </div>
                              <div className="space-y-4 md:col-span-3 pt-4">
                                <p className="text-sm font-semibold text-slate-600">Academic Referee Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <Input label="Name" name="academicRefereeName" defaultValue={academicProfile?.academicRefereeName} required />
                                  <Input label="Mobile" name="academicRefereeMobile" defaultValue={academicProfile?.academicRefereeMobile} required />
                                  <Input label="Relationship" name="academicRefereeRelationship" defaultValue={academicProfile?.academicRefereeRelationship} required />
                                </div>
                              </div>
                            </div>
                          </Card>

                          <Card className="hover:shadow-lg transition-shadow">
                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-academic-blue pl-3">Socio-Economic Info</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <Select label="On Existing Scholarship?" name="onScholarshipBursary" options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} defaultValue={academicProfile?.onScholarshipBursary ? 'yes' : 'no'} />
                              <Select label="Physical Disability?" name="hasPhysicalDisability" options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]} defaultValue={academicProfile?.hasPhysicalDisability ? 'yes' : 'no'} />
                              <Input label="Number of Siblings" name="numberOfSiblings" type="number" defaultValue={academicProfile?.numberOfSiblings?.toString()} />
                              <Input label="Parents Occupation" name="parentsOccupation" defaultValue={academicProfile?.parentsOccupation} />
                              <Select label="Parents Marital Status" name="parentsMaritalStatus" options={[{ label: 'Married', value: 'Married' }, { label: 'Divorced', value: 'Divorced' }, { label: 'Widowed', value: 'Widowed' }]} defaultValue={academicProfile?.parentsMaritalStatus} />
                            </div>
                          </Card>
                        </motion.div>
                      )}

                      {activeDetailedSection === 'olevel' && (
                        <motion.div
                          key="olevel"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <Card className="hover:shadow-lg transition-shadow">
                            <div className="grid gap-6">
                              <div className="grid grid-cols-2 gap-4">
                                <Select label="Mathematics" name="maths" options={[{ label: 'A1', value: 'A1' }, { label: 'B2', value: 'B2' }, { label: 'B3', value: 'B3' }, { label: 'C4', value: 'C4' }, { label: 'C5', value: 'C5' }, { label: 'C6', value: 'C6' }, { label: 'D7', value: 'D7' }, { label: 'E8', value: 'E8' }, { label: 'F9', value: 'F9' }]} defaultValue={academicProfile?.olevelDetails?.mathematics} />
                                <Select label="English Language" name="english" options={[{ label: 'A1', value: 'A1' }, { label: 'B2', value: 'B2' }, { label: 'B3', value: 'B3' }, { label: 'C4', value: 'C4' }, { label: 'C5', value: 'C5' }, { label: 'C6', value: 'C6' }, { label: 'D7', value: 'D7' }, { label: 'E8', value: 'E8' }, { label: 'F9', value: 'F9' }]} defaultValue={academicProfile?.olevelDetails?.english} />
                              </div>
                              <div className="space-y-4">
                                <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">Other Subjects (Top 5)</p>
                                {[3, 4, 5, 6, 7].map(num => (
                                  <div key={num} className="grid grid-cols-3 gap-4 items-end bg-slate-50/50 p-3 rounded-lg">
                                    <div className="col-span-2">
                                      <Input
                                        label={`Subject ${num}`}
                                        name={`subject${num}_name`}
                                        placeholder="Subject name"
                                        defaultValue={(academicProfile?.olevelDetails as any)?.[`subject${num}`]?.name}
                                      />
                                    </div>
                                    <Select
                                      label="Grade"
                                      name={`subject${num}_grade`}
                                      options={[{ label: 'A1', value: 'A1' }, { label: 'B2', value: 'B2' }, { label: 'B3', value: 'B3' }, { label: 'C4', value: 'C4' }, { label: 'C5', value: 'C5' }, { label: 'C6', value: 'C6' }, { label: 'D7', value: 'D7' }, { label: 'E8', value: 'E8' }, { label: 'F9', value: 'F9' }]}
                                      defaultValue={(academicProfile?.olevelDetails as any)?.[`subject${num}`]?.grade}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      )}

                      {activeDetailedSection === 'undergraduate' && (
                        <motion.div
                          key="undergraduate"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <Card className="hover:shadow-lg transition-shadow">
                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-academic-blue pl-3">Entry Details</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <Input label="Location of Institution" name="inst_loc" defaultValue={academicProfile?.undergraduateDetails?.locationOfInstitution} required />
                              <Input label="Institution State" name="inst_state" defaultValue={academicProfile?.undergraduateDetails?.institutionState} required />
                              <Input label="Institution Name" name="inst_name" defaultValue={academicProfile?.undergraduateDetails?.institutionName} required className="md:col-span-2" />
                              <Input label="Course Admitted For" name="course_adm" defaultValue={academicProfile?.undergraduateDetails?.courseAdmittedFor} required />
                              <Select label="Study Time" name="study_time" options={[{ label: 'Full Time', value: 'Full Time' }, { label: 'Part Time', value: 'Part Time' }]} defaultValue={academicProfile?.undergraduateDetails?.studyTime} />
                              <Select label="Entry Mode" name="entry_mode" options={[{ label: 'JAMB', value: 'JAMB' }, { label: 'Direct Entry / Poly', value: 'Poly JAMB' }]} defaultValue={academicProfile?.undergraduateDetails?.entryMode} />
                              <Input label="JAMB/Poly Reg Number" name="jamb_reg" defaultValue={academicProfile?.undergraduateDetails?.jambRegNumber} required />
                              <Input label="JAMB/Poly Score" name="jamb_score" defaultValue={academicProfile?.undergraduateDetails?.jambScore} required />
                              <Input label="Year of Admission" name="adm_year" defaultValue={academicProfile?.undergraduateDetails?.yearOfAdmission} required />
                              <Input label="Matric Number" name="matric" defaultValue={academicProfile?.undergraduateDetails?.matricNumber} required />
                            </div>
                          </Card>

                          <Card className="hover:shadow-lg transition-shadow">
                            <h4 className="font-bold text-slate-800 mb-4 border-l-4 border-academic-gold pl-3">Current Academic Status</h4>
                            <div className="grid gap-4 md:grid-cols-2">
                              <Input label="Course of Study" name="course_study" defaultValue={academicProfile?.undergraduateDetails?.courseOfStudy} required />
                              <Input label="Course Duration" name="duration" placeholder="e.g. 4 Years" defaultValue={academicProfile?.undergraduateDetails?.courseDuration} required />
                              <Input label="Current Level" name="curr_level" placeholder="e.g. 300 Level" defaultValue={academicProfile?.undergraduateDetails?.currentLevel} required />
                              <Input label="CGPA Scale" name="cgpa_scale" placeholder="e.g. 4.0 or 5.0" defaultValue={academicProfile?.undergraduateDetails?.cgpaScale} required />
                              <Input label="Current CGPA" name="curr_cgpa" defaultValue={academicProfile?.undergraduateDetails?.currentCgpa} required />
                              <Input label="Expected Year of Graduation" name="grad_year" defaultValue={academicProfile?.undergraduateDetails?.expectedYearOfGraduation} required />
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </div>
            </motion.section>
          )}

          {view === 'results' && (
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 font-serif tracking-tight md:text-4xl">Recommended for You</h2>
                  <p className="mt-2 text-slate-500">Top scholarships based on your profile</p>
                </div>
                {academicProfile && !isMatching && (
                  <Button className="gap-2" onClick={() => runMatching(academicProfile)}>
                    <Sparkles className="h-4 w-4" /> Find My Matches
                  </Button>
                )}
              </div>

              {isMatching ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="mb-6 h-16 w-16 animate-spin rounded-full border-4 border-academic-blue/20 border-t-academic-blue" />
                  <h3 className="text-xl font-bold">Analyzing Scholarships...</h3>
                  <p className="mt-2 text-slate-500 text-center max-w-xs">Our AI is matching your credentials against hundreds of opportunities.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {matchedScholarships.map((item) => (
                    <ScholarshipCard
                      key={item.scholarship.id}
                      scholarship={item.scholarship}
                      matchInfo={item.matchInfo}
                      isSaved={savedIds.has(item.scholarship.id)}
                      onToggleSave={toggleSave}
                      onViewDetails={setSelectedScholarship}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {view === 'saved' && (
            <motion.section
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="mb-12 text-3xl font-bold">Your Saved Scholarships</h2>
              {savedScholarships.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-6 rounded-full bg-slate-100 p-6 text-slate-300">
                    <BookMarked className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">No saved scholarships yet</h3>
                  <p className="mt-2 text-slate-500">Scholarships you bookmark will appear here.</p>
                  <Button className="mt-8" onClick={() => setView('results')}>Explore Matches</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {savedScholarships.map((s) => (
                    <ScholarshipCard
                      key={s.id}
                      scholarship={s}
                      isSaved={true}
                      onToggleSave={toggleSave}
                      onViewDetails={setSelectedScholarship}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedScholarship && (
          <ScholarshipDetail
            scholarship={selectedScholarship}
            onClose={() => setSelectedScholarship(null)}
          />
        )}
      </AnimatePresence>

      {/* Sign In Modal */}
      <AnimatePresence>
        {showSignIn && (
          <SignInModal
            onSubmit={handleSignIn}
            onClose={() => setShowSignIn(false)}
          />
        )}
      </AnimatePresence>

      <footer className="mt-20 border-t border-slate-200 bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-academic-blue text-white">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold">ScholarTrack</span>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Connecting Nigerian students with life-changing scholarship opportunities across the globe.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Mail className="h-4 w-4" />
                <span>hello@scholartrack.ng</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Platform</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Find Scholarships', action: () => setView('scholarships') },
                  { label: 'Create Profile', action: handleGetStarted },
                  { label: 'Deadline Tracker', action: () => setView('deadlines') },
                  { label: 'Saved List', action: () => setView('saved') }
                ].map(item => (
                  <li key={item.label}>
                    <button
                      onClick={item.action}
                      className="text-sm text-slate-300 transition-colors hover:text-white"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scholarship Types */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Scholarships</h4>
              <ul className="space-y-3">
                {['Undergraduate', 'Postgraduate', 'Nigeria-Based', 'International'].map(link => (
                  <li key={link}>
                    <button className="text-sm text-slate-300 transition-colors hover:text-white">{link}</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Resources</h4>
              <ul className="space-y-3">
                {['How It Works', 'Application Tips', 'FAQs', 'Contact Us'].map(link => (
                  <li key={link}>
                    <button className="text-sm text-slate-300 transition-colors hover:text-white">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row">
            <p className="text-sm text-slate-500">© 2026 ScholarTrack. All rights reserved.</p>
            <div className="flex gap-6">
              {['Privacy Policy', 'Terms of Service'].map(link => (
                <button key={link} className="text-sm text-slate-500 transition-colors hover:text-white">{link}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}

export default App;
