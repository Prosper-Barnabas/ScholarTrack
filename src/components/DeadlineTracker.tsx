import type { Scholarship, StudentProfile } from '../types';
import { Card } from './Card';
import { Calendar, Clock, ArrowRight, MessageCircle, CalendarPlus } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';

export function DeadlineTracker({
  savedScholarships,
  onViewDetails,
  profile
}: {
  savedScholarships: Scholarship[];
  onViewDetails: (s: Scholarship) => void;
  profile: StudentProfile | null;
}) {
  const getDeadlineStatus = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Closed', color: 'bg-slate-100 text-slate-500', days: diffDays };
    if (diffDays <= 14) return { label: 'Urgent', color: 'bg-red-100 text-red-700', days: diffDays };
    return { label: 'Upcoming', color: 'bg-emerald-100 text-emerald-700', days: diffDays };
  };

  const handleWhatsAppReminder = (scholarship: Scholarship) => {
    if (!profile?.phoneNumber) {
      alert("Please add your WhatsApp number in your profile first.");
      return;
    }

    const message = `Reminder: The deadline for the ${scholarship.name} (${scholarship.sponsor}) is ${new Date(scholarship.deadline).toLocaleDateString()}. Don't forget to apply! Link: ${scholarship.applicationLink}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${profile.phoneNumber.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCalendar = (scholarship: Scholarship) => {
    const deadline = new Date(scholarship.deadline);
    const startDate = deadline.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(deadline.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Scholarship Deadline: ' + scholarship.name)}&dates=${startDate}/${endDate}&details=${encodeURIComponent('Sponsor: ' + scholarship.sponsor + '\n\nApply here: ' + scholarship.applicationLink)}&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
  };

  if (savedScholarships.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-slate-50 p-4">
          <Clock className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No saved scholarships yet</h3>
        <p className="mt-2 text-slate-500">Browse opportunities and save them to track their deadlines here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {savedScholarships.map((scholarship) => {
        const status = getDeadlineStatus(scholarship.deadline);
        return (
          <Card key={scholarship.id} className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-start gap-4">
                <div className={cn("mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg", status.color)}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900">{scholarship.name}</h3>
                  <p className="text-sm text-slate-500">{scholarship.sponsor}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deadline</span>
                  <span className="text-sm font-medium">{new Date(scholarship.deadline).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold", status.color)}>
                      {status.label}
                    </span>
                    {status.days >= 0 && (
                      <span className="text-xs font-medium text-slate-500">
                        {status.days} days left
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                onClick={() => handleWhatsAppReminder(scholarship)}
              >
                <MessageCircle className="h-4 w-4" /> Remind on WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleAddToCalendar(scholarship)}
              >
                <CalendarPlus className="h-4 w-4" /> Add to Calendar
              </Button>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => onViewDetails(scholarship)}>
                Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
