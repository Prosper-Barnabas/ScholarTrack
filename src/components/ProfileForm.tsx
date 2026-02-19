import { useState } from 'react';
import type { StudentProfile } from '../types';
import { Input } from './FormElements';
import { Button } from './Button';
import { Card } from './Card';
import { User } from 'lucide-react';

export function ProfileForm({ onSubmit, initialData }: { onSubmit: (data: StudentProfile) => void; initialData?: StudentProfile | null }) {
  const [formData, setFormData] = useState<StudentProfile>(initialData || {
    fullName: '',
    email: '',
    phoneNumber: '',
    levelOfStudy: 'Undergraduate',
    fieldOfStudy: '',
    gpa: '',
    stateOfOrigin: '',
    interestedLocation: 'Nigeria',
    financialNeed: 'Medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <User className="h-5 w-5 text-academic-blue" />
          <h2 className="text-lg font-semibold">Your Information</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="WhatsApp Number"
            type="tel"
            placeholder="e.g. +2348012345678"
            required
            className="md:col-span-2"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          {initialData ? 'Update Info' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
