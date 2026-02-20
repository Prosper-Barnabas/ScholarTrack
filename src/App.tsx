import { useState, useMemo } from 'react';
import type { Scholarship, MatchResult, StudentProfile } from './types';
import { Input, Select } from './components/FormElements';
import { Card } from './components/Card';
import { MOCK_SCHOLARSHIPS } from './data';
import { SignInModal } from './components/SignInModal';
import { ScholarshipCard } from './components/ScholarshipCard';
import { ScholarshipDetail } from './components/ScholarshipDetail';
import { Button } from './components/Button';
import { GraduationCap, Search, Sparkles, BookMarked, Target, Clock, ShieldCheck, Users, BookOpen, Globe, ChevronRight, Mail, User, Library, ClipboardEdit } from 'lucide-react';
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
  const [academicProfile, setAcademicProfile] = useState<StudentProfile | null>(null);
  const [activeDetailedSection, setActiveDetailedSection] = useState<'personal' | 'additional' | 'olevel' | 'undergraduate'>('personal');
  const [view, setView] = useState<'landing' | 'scholarships' | 'results' | 'deadlines' | 'profile' | 'mydetails' | 'saved'>(() => {
    try {
      const saved = localStorage.getItem('scholartrack_session');
      return saved ? 'scholarships' : 'landing';
    } catch { return 'landing'; }
  });
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Secondary' | 'Undergraduate' | 'Masters'>('All');

  const handleSignIn = (data: { fullName: string; email: string }) => {
    setProfile(data);
    setShowSignIn(false);
    setView('scholarships');
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
                <h2 className="text-3xl font-bold text-slate-900 font-serif">Browse Available Scholarships</h2>
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
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 font-serif">Scholarship Deadline Tracker</h2>
                <p className="mt-2 text-slate-500">Stay organized and never miss an application deadline.</p>
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
                <div className="space-y-12">
                  {/* Categorize Scholarships */}
                  {(() => {
                    const categorized = savedScholarships.reduce((acc, s) => {
                      const deadline = new Date(s.deadline);
                      const today = new Date();
                      const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                      if (diffDays <= 0) acc.past.push(s);
                      else if (diffDays <= 14) acc.urgent.push(s);
                      else acc.upcoming.push(s);
                      return acc;
                    }, { urgent: [] as Scholarship[], upcoming: [] as Scholarship[], past: [] as Scholarship[] });

                    return (
                      <>
                        {/* Urgent Section */}
                        {categorized.urgent.length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-red-100 pb-2">
                              <Target className="h-5 w-5 text-red-500" />
                              <h3 className="text-xl font-bold text-red-700">Urgent Deadlines (Next 14 Days)</h3>
                            </div>
                            <div className="grid gap-6">
                              {categorized.urgent.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(s => {
                                const diffDays = Math.ceil((new Date(s.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                const pctRemaining = Math.max(0, Math.min(100, (diffDays / 60) * 100)); // Scaled to 60 days

                                return (
                                  <Card key={s.id} className="relative overflow-hidden group hover:shadow-lg transition-all border-red-100 bg-red-50/30">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                      <div className="flex-1 space-y-3">
                                        <div>
                                          <h4 className="text-lg font-bold text-slate-900 leading-tight">{s.name}</h4>
                                          <p className="text-sm text-slate-500 font-medium">{s.sponsor}</p>
                                        </div>
                                        <div className="space-y-1.5 w-full max-w-md">
                                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-red-600">
                                            <span>Time Remaining</span>
                                            <span>{diffDays} days</span>
                                          </div>
                                          <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden">
                                            <motion.div
                                              initial={{ width: 0 }}
                                              animate={{ width: `${100 - pctRemaining}%` }}
                                              className="h-full bg-red-500 rounded-full"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                          <p className="text-sm font-bold text-slate-900">{new Date(s.deadline).toLocaleDateString('en-NG', { month: 'long', day: 'numeric' })}</p>
                                          <p className="text-xs text-red-500 font-semibold italic">Action Required ASAP</p>
                                        </div>
                                        <Button size="sm" className="bg-red-600 hover:bg-red-700 shadow-sm" onClick={() => setSelectedScholarship(s)}>Manage</Button>
                                      </div>
                                    </div>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Upcoming Section */}
                        {categorized.upcoming.length > 0 && (
                          <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                              <ShieldCheck className="h-5 w-5 text-academic-blue" />
                              <h3 className="text-xl font-bold text-slate-800">Upcoming Opportunities</h3>
                            </div>
                            <div className="grid gap-4">
                              {categorized.upcoming.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()).map(s => {
                                const diffDays = Math.ceil((new Date(s.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                return (
                                  <div key={s.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-academic-blue hover:shadow-md transition-all group">
                                    <div className="flex gap-4">
                                      <div className="h-10 w-10 flex-shrink-0 bg-slate-50 flex items-center justify-center rounded-lg group-hover:bg-academic-blue/5 transition-colors">
                                        <BookMarked className="h-5 w-5 text-slate-400 group-hover:text-academic-blue" />
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-slate-900">{s.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs text-slate-500">{s.sponsor}</span>
                                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                                          <span className="text-xs font-bold text-academic-blue italic">{diffDays} days left</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-start gap-4">
                                      <span className="text-sm font-semibold text-slate-600 sm:hidden">Deadline: {new Date(s.deadline).toLocaleDateString()}</span>
                                      <div className="hidden sm:block text-right">
                                        <p className="text-sm font-bold text-slate-700">{new Date(s.deadline).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                      </div>
                                      <Button variant="outline" size="sm" onClick={() => setSelectedScholarship(s)}>Details</Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Past Section */}
                        {categorized.past.length > 0 && (
                          <div className="space-y-6 pt-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                              <Search className="h-5 w-5 text-slate-400" />
                              <h3 className="text-lg font-bold text-slate-500">Expired Deadlines</h3>
                            </div>
                            <div className="grid gap-3">
                              {categorized.past.map(s => (
                                <div key={s.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-100 border border-slate-200">
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-slate-600 truncate">{s.name}</h4>
                                    <p className="text-xs text-slate-400">Ended {new Date(s.deadline).toLocaleDateString()}</p>
                                  </div>
                                  <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setSelectedScholarship(s)}>Review</Button>
                                </div>
                              ))}
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
                <h2 className="text-3xl font-bold text-slate-900 font-serif">Academic Profile Explorer</h2>
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
                      runMatching(updatedDetails);
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
                  <h2 className="text-3xl font-bold">Recommended for You</h2>
                  <p className="mt-2 text-slate-500">Top scholarships based on your profile</p>
                </div>
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
                {['Find Scholarships', 'Create Profile', 'Deadline Tracker', 'Saved List'].map(link => (
                  <li key={link}>
                    <button className="text-sm text-slate-300 transition-colors hover:text-white">{link}</button>
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
