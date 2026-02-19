import type { Scholarship } from '../types';
import { Button } from './Button';
import { X, ExternalLink, CheckCircle2, FileText, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

export function ScholarshipDetail({
  scholarship,
  onClose,
  aiSummary
}: {
  scholarship: Scholarship;
  onClose: () => void;
  aiSummary?: string;
}) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-2xl"
        >
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
            <h2 className="font-display text-xl font-bold text-slate-900">Scholarship Details</h2>
            <button onClick={onClose} className="rounded-full p-2 hover:bg-slate-100" aria-label="Close scholarship details">
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h1 className="mb-2 font-display text-2xl font-bold text-academic-blue sm:text-3xl">{scholarship.name}</h1>
              <p className="text-lg font-medium text-slate-500">{scholarship.sponsor}</p>
            </div>

            {aiSummary && (
              <div className="mb-8 rounded-xl bg-blue-50 p-6 border border-blue-100">
                <div className="mb-3 flex items-center gap-2 text-academic-blue">
                  <Info className="h-5 w-5" />
                  <h3 className="font-bold">AI Quick Summary</h3>
                </div>
                <div className="markdown-body text-blue-900">
                  <Markdown>{aiSummary}</Markdown>
                </div>
              </div>
            )}

            <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    Description
                  </h3>
                  <p className="leading-relaxed text-slate-600">{scholarship.fullDescription}</p>
                </section>

                <section>
                  <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    Eligibility Requirements
                  </h3>
                  <ul className="space-y-3">
                    {scholarship.eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-academic-green" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="space-y-8">
                <section className="rounded-xl bg-slate-50 p-6">
                  <h3 className="mb-4 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider text-slate-500">
                    Required Documents
                  </h3>
                  <ul className="space-y-3">
                    {scholarship.documents.map((doc, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <div className="space-y-3">
                  <Button className="w-full" onClick={() => window.open(scholarship.applicationLink, '_blank')}>
                    Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-center text-xs text-slate-400">
                    You will be redirected to the official sponsor website.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
