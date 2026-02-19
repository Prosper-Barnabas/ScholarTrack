import { useState, useMemo } from 'react';
import type { Scholarship, StudentProfile, MatchResult } from './types';
import { MOCK_SCHOLARSHIPS } from './data';
import { ProfileForm } from './components/ProfileForm';
import { ScholarshipCard } from './components/ScholarshipCard';
import { ScholarshipDetail } from './components/ScholarshipDetail';
import { Button } from './components/Button';
import { GraduationCap, Search, Sparkles, BookMarked, ArrowLeft, Target, Clock, ShieldCheck, Users, BookOpen, Globe, ChevronRight, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [isMatching, setIsMatching] = useState(false);
  const [view, setView] = useState<'landing' | 'profile' | 'results' | 'saved'>('landing');

  const handleProfileSubmit = async (data: StudentProfile) => {
    setProfile(data);
    setIsMatching(true);
    setView('results');

    // Simulate AI matching for now to ensure UI works
    // In a real app, we'd call getScholarshipMatches(data, MOCK_SCHOLARSHIPS)
    setTimeout(() => {
      const mockMatches: MatchResult[] = MOCK_SCHOLARSHIPS.slice(0, 5).map((s, i) => ({
        scholarshipId: s.id,
        matchPercentage: 95 - i * 5,
        priority: i === 0 ? 'High Fit' : 'Moderate Fit',
        reason: `Based on your ${data.fieldOfStudy} background and ${data.gpa} GPA, this is an excellent match.`
      }));
      setMatches(mockMatches);
      setIsMatching(false);
    }, 2000);
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

          <nav className="flex items-center gap-4">
            {profile ? (
              <div
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-academic-blue transition-colors hover:bg-academic-blue hover:text-white"
                onClick={() => setView('profile')}
              >
                <span className="font-bold">{profile.fullName[0]}</span>
              </div>
            ) : (
              <Button size="sm" className="md:px-6 md:py-3 md:text-base" onClick={() => setView('profile')}>Get Started</Button>
            )}
          </nav>
        </div>
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
                  <Button size="lg" className="gap-2 px-8 py-5 text-base md:px-10 md:py-6 md:text-lg" onClick={() => setView('profile')}>
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
                <Button size="lg" className="gap-2 px-8 py-5 text-base md:px-12 md:py-6 md:text-lg" onClick={() => setView('profile')}>
                  Create Your Profile <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.section>
          )}

          {view === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-auto max-w-3xl"
            >
              <button
                onClick={() => setView('landing')}
                className="mb-8 flex items-center gap-2 font-semibold text-slate-500 hover:text-academic-blue"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </button>
              <h2 className="mb-8 text-3xl font-bold">Complete Your Academic Profile</h2>
              <ProfileForm onSubmit={handleProfileSubmit} initialData={profile} />
            </motion.div>
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
                  <p className="mt-2 text-slate-500">Based on your academic profile and preferences</p>
                </div>
                <Button variant="outline" onClick={() => setView('profile')}>Edit Profile</Button>
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
    </div>
  );
}

export default App;
