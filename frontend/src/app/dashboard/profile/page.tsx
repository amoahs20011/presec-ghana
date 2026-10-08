'use client';

import { useToast } from '@/components/ui/Toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { Alumni } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [programme, setProgramme] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [currentProfession, setCurrentProfession] = useState('');
  const [currentEmployer, setCurrentEmployer] = useState('');
  const [industry, setIndustry] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [bio, setBio] = useState('');
  const [availableForMentorship, setAvailableForMentorship] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;
    if (!user) {
      router.replace('/login?redirect=/dashboard/profile');
      return;
    }

    async function load() {
      setLoading(true);
      try {
        const data = await api.get<Alumni>('/alumni/me', true);
        setAlumni(data);
        setProfilePhotoUrl(
          (data as any).user?.profilePhotoUrl ||
            (user as any)?.profilePhotoUrl ||
            null,
        );
        setProgramme(data.programme || '');
        setGraduationYear(
          data.graduationYear ? String(data.graduationYear) : '',
        );
        setCurrentProfession(data.currentProfession || '');
        setCurrentEmployer(data.currentEmployer || '');
        setIndustry(data.industry || '');
        setLocationCity(data.locationCity || '');
        setLocationCountry(data.locationCountry || '');
        setSkillsText((data.skills || []).join(', '));
        setBio(data.bio || '');
        setAvailableForMentorship(data.isAvailableForMentorship || false);
      } catch (err) {
        console.error('Failed to load profile', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [mounted, authLoading, user, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload: any = {
        programme: programme || null,
        graduationYear: graduationYear ? Number(graduationYear) : null,
        currentProfession: currentProfession || null,
        currentEmployer: currentEmployer || null,
        industry: industry || null,
        locationCity: locationCity || null,
        locationCountry: locationCountry || null,
        skills: skillsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        bio: bio || null,
        isAvailableForMentorship: availableForMentorship,
      };



      await api.put('/alumni/me', payload, true);
      await refreshUser();
      setMessage('Profile updated successfully');
    } catch (err: any) {
      console.error('Save failed', err);
      setError(err?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  if (!mounted || authLoading || loading) {
    return (
      <div className="container py-20 text-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="py-12 bg-[#0F172A] min-h-[60vh]">
      <div className="container max-w-3xl">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-white hover:underline"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white mt-2">
            Edit Profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Update your alumni information. This helps classmates find you.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ✗ {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* PHOTO */}
          <Card>
            <CardBody>
              <h2 className="font-bold text-white mb-4">
                Profile Photo
              </h2>
              <ImageUploader
                value={profilePhotoUrl}
                onChange={setProfilePhotoUrl}
                folder="profiles"
                label=""
                shape="circle"
                hint="Your photo will appear in the alumni directory."
              />
            </CardBody>
          </Card>

          {/* BASIC */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-bold text-white">
                School Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Programme
                  </label>
                  <input
                    type="text"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    placeholder="e.g. General Arts"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="e.g. 2008"
                    min="1950"
                    max="2050"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* PROFESSIONAL */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-bold text-white">
                Professional Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Current Profession
                  </label>
                  <input
                    type="text"
                    value={currentProfession}
                    onChange={(e) => setCurrentProfession(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Employer
                  </label>
                  <input
                    type="text"
                    value={currentEmployer}
                    onChange={(e) => setCurrentEmployer(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Information Technology"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* LOCATION */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-bold text-white">Location</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="e.g. Accra"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={locationCountry}
                    onChange={(e) => setLocationCountry(e.target.value)}
                    placeholder="e.g. Ghana"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* SKILLS + BIO */}
          <Card>
            <CardBody className="space-y-4">
              <h2 className="font-bold text-white">About You</h2>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="Comma separated, e.g. Python, Leadership, Public Speaking"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate each skill with a comma.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </CardBody>
          </Card>

          {/* MENTORSHIP */}
          <Card>
            <CardBody>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableForMentorship}
                  onChange={(e) =>
                    setAvailableForMentorship(e.target.checked)
                  }
                  className="mt-1"
                />
                <div>
                  <div className="font-semibold text-white">
                    Available for Mentorship
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Let younger alumni and current students contact you for
                    guidance.
                  </div>
                </div>
              </label>
            </CardBody>
          </Card>

          {/* SAVE */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
