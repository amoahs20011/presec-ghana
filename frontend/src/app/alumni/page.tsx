'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import type { Alumni, Paginated } from '@/types';
import Link from 'next/link';

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

  async function fetchAlumni() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (graduationYear) params.set('graduationYear', graduationYear);
      if (industry) params.set('industry', industry);
      if (programme) params.set('programme', programme);
      if (mentorshipOnly) params.set('isAvailableForMentorship', 'true');
      params.set('limit', '24');

      const data = await api.get<Paginated<Alumni>>(
        `/alumni/search?${params.toString()}`,
      );
      setAlumni(data.items);
      setTotal(data.total);
    } catch (err) {
      setAlumni([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlumni();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchAlumni();
  }

  function handleReset() {
    setQ('');
    setGraduationYear('');
    setIndustry('');
    setProgramme('');
    setMentorshipOnly(false);
    setTimeout(fetchAlumni, 0);
  }

  return (
    <>
      <section className="bg-presec-blue text-white py-12 lg:py-16">
        <div className="container">
          <Badge color="gold">Alumni Network</Badge>
          <h1 className="mt-4 text-4xl lg:text-5xl font-bold">
            Alumni Directory
          </h1>
          <p className="mt-4 text-lg text-gray-200 max-w-2xl">
            Reconnect with classmates, discover mentors, and grow your
            professional network. {total > 0 && `${total} verified alumni`}{' '}
            and counting.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-presec-bg-alt py-8 border-b border-presec-border">
        <div className="container">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              <Input
                placeholder="Search by name, profession..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Graduation year"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                min={1950}
                max={2100}
              />
              <Input
                placeholder="Industry (e.g. Technology)"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <select
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                className="w-full px-3 py-2 border border-presec-border rounded-md focus:outline-none focus:ring-2 focus:ring-presec-blue"
              >
                <option value="">All Programmes</option>
                {PROGRAMMES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mentorship"
                  checked={mentorshipOnly}
                  onChange={(e) => setMentorshipOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="mentorship" className="text-sm">
                  Mentors only
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                disabled={loading}
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container">
          {loading ? (
            <p className="text-center text-presec-text-muted py-12">
              Loading alumni...
            </p>
          ) : alumni.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-presec-text-muted">
                  No verified alumni match your search.
                </p>
                <p className="mt-2 text-sm text-presec-text-muted">
                  Try adjusting filters, or{' '}
                  <Link
                    href="/register"
                    className="text-presec-blue hover:underline"
                  >
                    invite classmates to join
                  </Link>
                  .
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((person) => (
                <Card key={person.id} hover>
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-presec-blue text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {person.user?.firstName?.charAt(0)}
                        {person.user?.lastName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-presec-blue truncate">
                          {person.user?.firstName} {person.user?.lastName}
                        </h3>
                        {person.currentProfession && (
                          <p className="text-sm text-presec-text-muted truncate">
                            {person.currentProfession}
                          </p>
                        )}
                        {person.currentEmployer && (
                          <p className="text-xs text-presec-text-muted truncate">
                            at {person.currentEmployer}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {person.graduationYear && (
                        <Badge color="blue">
                          Class of {person.graduationYear}
                        </Badge>
                      )}
                      {person.programme && (
                        <Badge color="gray">{person.programme}</Badge>
                      )}
                      {person.isAvailableForMentorship && (
                        <Badge color="green">Mentor</Badge>
                      )}
                    </div>

                    {person.locationCity && (
                      <p className="mt-3 text-sm text-presec-text-muted">
                        📍 {person.locationCity}
                        {person.locationCountry &&
                          `, ${person.locationCountry}`}
                      </p>
                    )}

                    {person.skills && person.skills.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-presec-text-muted">
                          Skills
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {person.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2 py-0.5 bg-presec-bg-alt rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {person.skills.length > 4 && (
                            <span className="text-xs px-2 py-0.5 text-presec-text-muted">
                              +{person.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-presec-border">
                      <Link
                        href={`/alumni/${person.id}`}
                        className="text-sm font-semibold text-presec-blue hover:underline"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
