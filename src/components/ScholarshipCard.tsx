import type { Scholarship } from '../types';
import { Card } from './Card';
import { Button } from './Button';
import { MapPin, Calendar, Building2, GraduationCap, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function ScholarshipCard({
  scholarship,
  onViewDetails,
  onToggleSave,
  isSaved,
  matchInfo
}: {
  scholarship: Scholarship;
  onViewDetails: (s: Scholarship) => void;
  onToggleSave: (id: string) => void;
  isSaved: boolean;
  matchInfo?: {
    matchPercentage: number;
    reason: string;
    priority: string;
  };
}) {
  const isUrgent = () => {
    const deadline = new Date(scholarship.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group relative flex h-full flex-col overflow-hidden border-slate-200 transition-all hover:border-academic-blue/30 hover:shadow-md">
        {matchInfo && (
          <div className="absolute top-0 right-0 rounded-bl-xl bg-academic-green px-3 py-1 text-xs font-bold text-white">
            {matchInfo.matchPercentage}% Match
          </div>
        )}

        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-lg bg-slate-50 p-2 text-academic-blue group-hover:bg-blue-50">
            <Building2 className="h-5 w-5" />
          </div>
          <button
            onClick={() => onToggleSave(scholarship.id)}
            className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-academic-blue"
          >
            {isSaved ? <BookmarkCheck className="h-5 w-5 text-academic-blue" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex-1">
          <h3 className="mb-1 line-clamp-2 font-display text-lg font-bold text-slate-900 group-hover:text-academic-blue">
            {scholarship.name}
          </h3>
          <p className="mb-4 text-sm font-medium text-slate-500">{scholarship.sponsor}</p>

          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <MapPin className="h-3.5 w-3.5" />
              <span>{scholarship.location}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>{scholarship.eligibleLevel.join(', ')}</span>
            </div>
            <div className={cn(
              "flex items-center gap-2 text-xs font-medium",
              isUrgent() ? "text-red-600" : "text-slate-600"
            )}>
              <Calendar className="h-3.5 w-3.5" />
              <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600">
            {scholarship.description}
          </p>
        </div>

        {matchInfo && (
          <div className="mb-6 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 transition-all">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Why You Match</p>
              <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <Sparkles className="h-2.5 w-2.5" />
                <span>{matchInfo.priority}</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-emerald-800">
              {matchInfo.reason}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <div className="h-1 w-1 rounded-full bg-emerald-400" />
                Academic Background
              </span>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <div className="h-1 w-1 rounded-full bg-emerald-400" />
                Level Compatibility
              </span>
            </div>
          </div>
        )}

        <Button
          variant="outline"
          className="w-full border-academic-blue/20 text-academic-blue transition-all duration-200 hover:bg-academic-blue hover:text-white hover:shadow-md"
          onClick={() => onViewDetails(scholarship)}
        >
          View Details
        </Button>
      </Card>
    </motion.div>
  );
}
