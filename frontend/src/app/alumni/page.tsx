'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Award,
  ArrowRight,
  X,
} from 'lucide-react';
import { GradientCard, GradientCardBody } from '@/components/ui/GradientCard';
import { Badge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Alumni, Paginated } from '@/types';

const PROGRAMMES = [
  'General Arts',
  'General Science',
  'Business',
  'Technical',
  'Visual Arts',
  'Home Economics',
];

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [industry, setIndustry] = useState('');
  const [programme, setProgramme] = useState('');
  const [mentorshipOnly, setMentorshipOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  async function fetchAlumni() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (graduationYear) params.set('graduationYear', graduationYear);
      if (industry) params.set('industry', industry);
      if (programme) params.set('programme', programme);
      if (mentorshipOnly) params.set('isAvailableForMentorship', 'true');

      const data = await api.get<Paginated<Alumni>>(
        `/alumni/search?${params.toString()}`,
      );
      setAlumni(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load alumni', err);
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlumni();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearFilters() {
    setQ('');
    setGraduationYear('');
    setIndustry('');
    setProgramme('');
    setMentorshipOnly(false);
    setTimeout(fetchAlumni, 50);
  }

  const hasActiveFilters =
    q || graduationYear || industry || programme || mentorshipOnly;

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative container py-12">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <Badge
            color="gold"
            size="lg"
            className="mb-4 bg-gold/20 border-gold/40 text-gold-light"
          >
            <Users className="w-3.5 h-3.5" />
            Alumni Network
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Find your <span className="gradient-text-gold">classmates</span>
          </h1>
          <p className="text-lg text-slate-400">
            Reconnect with fellow PRESEC alumni across generations, industries,
            and continents.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by name, profession, or skills..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchAlumni()}
                icon={<Search className="w-4 h-4" />}
                fullWidth
              />
            </div>
            <Button
              onClick={fetchAlumni}
              variant="gradient"
              icon={<Search className="w-4 h-4" />}
            >
              Search
            </Button>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              icon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>
          </div>
        </div>

        {/* FILTERS */}
        {showFilters && (
          <div className="max-w-3xl mx-auto mb-8">
            <GradientCard theme="violet" hover={false}>
              <GradientCardBody className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Graduation Year"
                    type="number"
                    placeholder="2008"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    min="1950"
                    max="2050"
                    fullWidth
                  />
                  <Input
                    label="Industry"
                    type="text"
                    placeholder="e.g. IT"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    fullWidth
                  />
                  <Select
                    label="Programme"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    fullWidth
                  >
                    <option value="">All programmes</option>
                    {PROGRAMMES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mentorshipOnly}
                      onChange={(e) => setMentorshipOnly(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-brand"
                    />
                    <span className="text-sm text-slate-300">
                      Available for mentorship only
                    </span>
                  </label>

                  <div className="flex gap-2">
                    {hasActiveFilters && (
                      <Button
                        onClick={clearFilters}
                        variant="ghost"
                        size="sm"
                        icon={<X className="w-3.5 h-3.5" />}
                      >
                        Clear
                      </Button>
                    )}
                    <Button
                      onClick={fetchAlumni}
                      variant="gradient"
                      size="sm"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </GradientCardBody>
            </GradientCard>
          </div>
        )}

        {/* RESULTS COUNT */}
        {!loading && (
          <div className="text-center mb-8">
            <p className="text-sm text-slate-400">
              <strong className="text-white">{total}</strong> alumni found
            </p>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4" />
            <p className="text-slate-400">Loading alumni...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && alumni.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <Users className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="font-display font-bold text-xl text-white mb-2">
              No alumni found
            </h3>
            <p className="text-slate-400 mb-6">
              {hasActiveFilters
                ? 'Try adjusting your filters'
                : 'Be the first to join the community'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* ALUMNI GRID */}
        {!loading && alumni.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map((person, index) => {
              const themes = [
                'violet',
                'cyan',
                'gold',
                'emerald',
                'sunset',
                'ocean',
              ] as const;
              const theme = themes[index % themes.length];

              const initials =
                `${person.user?.firstName?.[0] || ''}${person.user?.lastName?.[0] || ''}`.toUpperCase() ||
                '?';

              const gradientMap = {
                violet: 'from-violet-500 to-pink-500',
                cyan: 'from-cyan-500 to-blue-500',
                gold: 'from-amber-500 to-orange-500',
                emerald: 'from-emerald-500 to-cyan-500',
                sunset: 'from-orange-500 to-pink-500',
                ocean: 'from-blue-500 to-emerald-500',
              };

              return (
                <Link
                  key={person.id}
                  href={`/alumni/${person.id}`}
                  className="block group"
                >
                  <GradientCard theme={theme} className="h-full">
                    <GradientCardBody className="p-6 h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientMap[theme]} flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold text-lg text-white truncate">
                            {person.user?.firstName} {person.user?.lastName}
                          </h3>
                          {person.graduationYear && (
                            <div className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                              <GraduationCap className="w-3.5 h-3.5" />
                              Class of {person.graduationYear}
                            </div>
                          )}
                        </div>
                      </div>

                      {person.currentProfession && (
                        <div className="text-sm text-slate-300 mb-2 flex items-start gap-2">
                          <Briefcase className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">
                            {person.currentProfession}
                            {person.currentEmployer &&
                              ` at ${person.currentEmployer}`}
                          </span>
                        </div>
                      )}

                      {person.locationCity && (
                        <div className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                          {person.locationCity}
                          {person.locationCountry &&
                            `, ${person.locationCountry}`}
                        </div>
                      )}

                      {person.skills && person.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {person.skills.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                            >
                              {skill}
                            </span>
                          ))}
                          {person.skills.length > 3 && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              +{person.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
                        <div className="flex gap-1.5">
                          {person.verificationStatus === 'verified' && (
                            <Badge color="green" size="sm">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </Badge>
                          )}
                          {person.isAvailableForMentorship && (
                            <Badge color="gold" size="sm">
                              <Award className="w-3 h-3" />
                              Mentor
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-gold group-hover:gap-1.5 flex items-center gap-1 transition-all">
                          View
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </GradientCardBody>
                  </GradientCard>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
