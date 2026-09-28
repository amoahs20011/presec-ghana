import Link from 'next/link';
import {
  ArrowRight,
  Users,
  MapPin,
  Calendar,
  Heart,
  Briefcase,
  BookOpen,
  Building2,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Globe,
  Quote,
  Star,
  Award,
  Compass,
  ChevronRight,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/ui/Logo';
import { api } from '@/lib/api';
import type { Announcement, EventItem, Project } from '@/types';

async function getHomeData() {
  try {
    const [events, projects, announcements] = await Promise.all([
      api.get<{ items: EventItem[] }>('/events?time=upcoming&limit=3'),
      api.get<{ items: Project[] }>('/projects?status=active&limit=3'),
      api.get<{ items: Announcement[] }>('/announcements?limit=3'),
    ]);
    return { events, projects, announcements };
  } catch {
    return {
      events: { items: [] },
      projects: { items: [] },
      announcements: { items: [] },
    };
  }
}

export default async function HomePage() {
  const { events, projects, announcements } = await getHomeData();

  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-navy text-white">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-gold/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div
          className="absolute bottom-1/4 -right-40 w-[500px] h-[500px] bg-brand-light/30 rounded-full blur-[120px] animate-pulse-slow"
          style={{ animationDelay: '1.5s' }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

        <div className="container relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT: Content */}
            <div className="max-w-2xl">
              <div className="mb-6 animate-fade-in">
                <Logo size="xl" variant="icon" href={null} />
              </div>

              <Badge
                color="gold"
                size="lg"
                className="mb-6 animate-fade-in bg-gold/20 border-gold/40 text-gold-light backdrop-blur"
              >
                <Sparkles className="w-3.5 h-3.5" />
                PRESEC GHANA
              </Badge>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 animate-slide-up"
                style={{ animationDelay: '50ms' }}
              >
                One Community.
                <br />
                Many Generations.
                <br />
                <span className="gradient-text-gold">One Future.</span>
              </h1>

              <p
                className="text-base sm:text-lg text-gray-200/90 mb-8 max-w-xl leading-relaxed animate-slide-up"
                style={{ animationDelay: '150ms' }}
              >
                The digital home of Presbyterian Secondary School alumni,
                students, teachers, and friends across Ghana&apos;s 16
                regions. Reconnect with classmates, mentor the next
                generation, and give back to the school that shaped us.
              </p>

              <div
                className="flex flex-wrap gap-3 mb-10 animate-slide-up"
                style={{ animationDelay: '250ms' }}
              >
                <ButtonLink
                  href="/register"
                  variant="gradient"
                  size="lg"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Join the Community
                </ButtonLink>
                <ButtonLink
                  href="/alumni"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white hover:text-brand bg-white/5 backdrop-blur"
                >
                  Explore Alumni
                </ButtonLink>
              </div>

              {/* Mini trust indicators */}
              <div
                className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-300 animate-slide-up"
                style={{ animationDelay: '350ms' }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-gradient-gold border-2 border-brand-dark flex items-center justify-center text-2xs font-bold text-brand-dark"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs">
                    <strong className="text-white">500+</strong> alumni
                    joined
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  <span className="text-xs">
                    Trusted by schools across Ghana
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Floating card stack */}
            <div className="relative hidden lg:block">
              <div className="relative h-[520px]">
                {/* Card 1: Stats */}
                <div
                  className="absolute top-0 right-4 w-64 p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl animate-float"
                  style={{ animationDelay: '0s' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-dark" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">500+</div>
                      <div className="text-xs text-gray-300">
                        Active Alumni
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-gold rounded-full" />
                  </div>
                </div>

                {/* Card 2: Event */}
                <div
                  className="absolute top-40 left-0 w-72 p-5 rounded-2xl bg-white text-text shadow-2xl animate-float"
                  style={{ animationDelay: '0.5s' }}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-brand flex flex-col items-center justify-center text-white">
                      <span className="text-lg font-bold leading-none">
                        15
                      </span>
                      <span className="text-2xs uppercase">Dec</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-text-muted mb-0.5">
                        Upcoming Reunion
                      </div>
                      <div className="font-semibold text-sm leading-tight">
                        2008 Year Group Reunion
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
                    <MapPin className="w-3 h-3" />
                    Accra, Ghana
                  </div>
                </div>

                {/* Card 3: Project */}
                <div
                  className="absolute bottom-0 right-0 w-72 p-5 rounded-2xl bg-white text-text shadow-2xl animate-float"
                  style={{ animationDelay: '1s' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">
                        Featured Project
                      </div>
                      <div className="font-semibold text-sm">
                        Computer Lab
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-brand">
                      GH₵ 125,000
                    </span>
                    <span className="text-text-muted">of GH₵ 200,000</span>
                  </div>
                  <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                    <div className="h-full w-[62%] bg-gradient-gold rounded-full" />
                  </div>
                </div>

                {/* Decorative rings */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full border border-white/10" />
                <div className="absolute top-28 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border border-white/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-alt to-transparent" />
      </section>

      {/* ==================== STATS BAR ==================== */}
      <section className="relative -mt-8 z-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              value="500+"
              label="Alumni Members"
              color="blue"
            />
            <StatCard
              icon={<MapPin className="w-5 h-5" />}
              value="16"
              label="Regions Covered"
              color="gold"
            />
            <StatCard
              icon={<Calendar className="w-5 h-5" />}
              value="50+"
              label="Events Hosted"
              color="green"
            />
            <StatCard
              icon={<Heart className="w-5 h-5" />}
              value="24"
              label="Active Projects"
              color="red"
            />
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge color="gold" className="mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              What We Offer
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text mb-5">
              Everything PRESEC, <span className="gradient-text">in one place</span>
            </h2>
            <p className="text-lg text-text-secondary">
              From reconnecting with old friends to giving back to the
              school, PRESEC GHANA is your digital home.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Alumni Directory"
              description="Find classmates by year, profession, location, or industry. Reconnect with the people who shaped your journey."
              href="/alumni"
              gradient="blue"
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Events & Reunions"
              description="Register for reunions, homecomings, and get-togethers. Digital tickets with QR check-in."
              href="/events"
              gradient="gold"
            />
            <FeatureCard
              icon={<Briefcase className="w-6 h-6" />}
              title="Jobs & Opportunities"
              description="Discover jobs, internships, scholarships, and training shared by alumni and partners."
              href="/opportunities"
              gradient="green"
            />
            <FeatureCard
              icon={<Heart className="w-6 h-6" />}
              title="Support Projects"
              description="Fund school projects transparently. See exactly where your contributions go."
              href="/projects"
              gradient="red"
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Mentorship"
              description="Guide younger alumni and current students. Become a mentor or find one in your field."
              href="/mentorship"
              gradient="purple"
            />
            <FeatureCard
              icon={<Compass className="w-6 h-6" />}
              title="Heritage Archive"
              description="Explore our shared history — photos, documents, achievements, and stories across generations."
              href="/heritage"
              gradient="sky"
            />
          </div>
        </div>
      </section>

      {/* ==================== UPCOMING EVENTS ==================== */}
      {events.items.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="container">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <Badge color="blue" className="mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  Upcoming
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text">
                  Events & Reunions
                </h2>
                <p className="text-text-secondary mt-2">
                  Don&apos;t miss what&apos;s coming up next.
                </p>
              </div>
              <ButtonLink
                href="/events"
                variant="outline"
                size="md"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                View All Events
              </ButtonLink>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {events.items.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== FEATURED PROJECTS ==================== */}
      {projects.items.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <Badge color="gold" className="mb-3">
                  <Heart className="w-3.5 h-3.5" />
                  Give Back
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text">
                  Featured Projects
                </h2>
                <p className="text-text-secondary mt-2">
                  Support the growth and future of PRESEC.
                </p>
              </div>
              <ButtonLink
                href="/projects"
                variant="outline"
                size="md"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                View All Projects
              </ButtonLink>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {projects.items.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== NEWS ==================== */}
      {announcements.items.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="container">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
              <div>
                <Badge color="sky" className="mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Latest
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text">
                  News & Updates
                </h2>
                <p className="text-text-secondary mt-2">
                  Stay informed about our growing community.
                </p>
              </div>
              <ButtonLink
                href="/news"
                variant="outline"
                size="md"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                All News
              </ButtonLink>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {announcements.items.slice(0, 3).map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 lg:py-28">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <Badge color="purple" className="mb-4">
              <Quote className="w-3.5 h-3.5" />
              Testimonials
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text mb-5">
              Voices from our <span className="gradient-text">community</span>
            </h2>
            <p className="text-lg text-text-secondary">
              Alumni sharing how PRESEC shaped their lives.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Reconnecting with my 2008 classmates on PRESEC GHANA was incredible. It felt like no time had passed at all."
              name="Kwame Mensah"
              role="Class of 2008"
              profession="Software Engineer"
              initials="KM"
            />
            <TestimonialCard
              quote="The mentorship program connected me with a doctor who guided my journey into medicine. Forever grateful."
              name="Ama Boateng"
              role="Class of 2015"
              profession="Medical Doctor"
              initials="AB"
            />
            <TestimonialCard
              quote="Seeing our classroom project fully funded by alumni was overwhelming. This is what community means."
              name="Kofi Asante"
              role="Class of 1999"
              profession="Entrepreneur"
              initials="KA"
            />
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-navy p-10 md:p-16 text-white">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.05]" />

            <div className="relative max-w-3xl">
              <Badge
                color="gold"
                className="mb-5 bg-gold/20 border-gold/40 text-gold-light backdrop-blur"
              >
                <Award className="w-3.5 h-3.5" />
                Join 500+ Alumni
              </Badge>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-5">
                Ready to reconnect?
              </h2>
              <p className="text-lg text-gray-200 mb-8 max-w-2xl">
                Create your free profile, find your classmates, and become
                part of a community that spans generations and continents.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink
                  href="/register"
                  variant="gradient"
                  size="lg"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Create Free Account
                </ButtonLink>
                <ButtonLink
                  href="/about"
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white hover:text-brand bg-white/5 backdrop-blur"
                >
                  Learn More
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'blue' | 'gold' | 'green' | 'red';
}) {
  const colorMap = {
    blue: 'from-brand to-brand-light',
    gold: 'from-gold to-gold-light',
    green: 'from-success to-emerald-400',
    red: 'from-error to-rose-400',
  };

  return (
    <Card
      variant="elevated"
      hover
      className="bg-surface/90 backdrop-blur"
    >
      <CardBody className="text-center py-6">
        <div
          className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
        <div className="font-display text-3xl font-extrabold text-text mb-1">
          {value}
        </div>
        <div className="text-xs text-text-muted uppercase tracking-wider font-medium">
          {label}
        </div>
      </CardBody>
    </Card>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient: 'blue' | 'gold' | 'green' | 'red' | 'purple' | 'sky';
}) {
  const gradientMap = {
    blue: 'from-brand to-brand-light',
    gold: 'from-gold to-gold-light',
    green: 'from-success to-emerald-400',
    red: 'from-error to-rose-400',
    purple: 'from-purple-500 to-purple-400',
    sky: 'from-info to-sky-400',
  };

  return (
    <Link href={href} className="group block h-full">
      <Card hover className="card-gradient-border h-full">
        <CardBody className="p-6">
          <div
            className={`w-14 h-14 mb-5 rounded-2xl bg-gradient-to-br ${gradientMap[gradient]} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-glow-violet transition-all duration-300`}
          >
            {icon}
          </div>
          <h3 className="font-display font-extrabold text-lg text-black mb-2 group-hover:bg-gradient-neon group-hover:bg-clip-text group-hover:text-transparent transition-all">
            {title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-3 transition-all">
            Learn more
            <ChevronRight className="w-4 h-4" />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

function EventCard({ event }: { event: EventItem }) {
  const d = new Date(event.startDatetime);
  const day = d.getDate();
  const month = d
    .toLocaleDateString('en-GB', { month: 'short' })
    .toUpperCase();

  return (
    <Link href={`/events/${event.id}`} className="block group">
      <Card variant="elevated" hover className="h-full overflow-hidden">
        {/* Cover */}
        <div className="relative h-44 bg-gradient-brand overflow-hidden">
          {event.coverPhotoUrl ? (
            <img
              src={event.coverPhotoUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand to-brand-light">
              <Calendar className="w-16 h-16 text-white/30" />
            </div>
          )}
          {/* Date badge */}
          <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center">
            <span className="text-lg font-extrabold text-brand leading-none">
              {day}
            </span>
            <span className="text-2xs font-semibold text-text-muted">
              {month}
            </span>
          </div>
          {event.eventType && (
            <div className="absolute top-4 right-4">
              <Badge color="gold" size="sm">
                {event.eventType.replace('_', ' ')}
              </Badge>
            </div>
          )}
        </div>

        <CardBody>
          <h3 className="font-display font-bold text-lg text-text mb-2 line-clamp-2 group-hover:text-brand transition-colors">
            {event.title}
          </h3>
          {event.locationName && (
            <div className="flex items-center gap-1.5 text-sm text-text-muted">
              <MapPin className="w-3.5 h-3.5" />
              {event.locationName}
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const raised = Number(project.raisedAmount || 0);
  const target = Number(project.targetAmount || 1);
  const progress = project.computedProgress ?? project.progressPercentage ?? 0;

  return (
    <Link href={`/projects/${project.id}`} className="block group">
      <Card variant="elevated" hover className="h-full overflow-hidden">
        <div className="relative h-40 bg-gradient-navy overflow-hidden">
          {project.coverPhotoUrl ? (
            <img
              src={project.coverPhotoUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white/30" />
            </div>
          )}
          <div className="absolute top-4 right-4">
            <Badge
              color={progress >= 100 ? 'green' : 'gold'}
              size="sm"
              className="bg-white/90 backdrop-blur"
            >
              {Math.round(progress)}% funded
            </Badge>
          </div>
        </div>

        <CardBody>
          <h3 className="font-display font-bold text-lg text-text mb-3 line-clamp-2 group-hover:text-brand transition-colors">
            {project.title}
          </h3>

          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-brand">
              GH₵ {raised.toLocaleString()}
            </span>
            <span className="text-text-muted">
              of GH₵ {target.toLocaleString()}
            </span>
          </div>

          <div className="h-2 bg-surface-alt rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-gold rounded-full transition-all duration-700"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          {project.contributorCount !== undefined && (
            <div className="text-xs text-text-muted">
              {project.contributorCount} contributor
              {project.contributorCount !== 1 ? 's' : ''}
            </div>
          )}
        </CardBody>
      </Card>
    </Link>
  );
}

function NewsCard({ item }: { item: Announcement }) {
  return (
    <Link href={`/news/${item.id}`} className="block group">
      <Card variant="elevated" hover className="h-full">
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Badge color="sky" size="sm">
              {item.type || 'News'}
            </Badge>
            <span className="text-xs text-text-muted">
              {new Date(item.publishedAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <h3 className="font-display font-bold text-lg text-text mb-2 line-clamp-2 group-hover:text-brand transition-colors">
            {item.title}
          </h3>

          {item.content && (
            <p className="text-sm text-text-secondary line-clamp-3 mb-4">
              {item.content}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-3 transition-all">
            Read more
            <ChevronRight className="w-4 h-4" />
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
  profession,
  initials,
}: {
  quote: string;
  name: string;
  role: string;
  profession: string;
  initials: string;
}) {
  return (
    <Card variant="elevated" hover className="h-full">
      <CardBody className="p-6">
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 text-gold fill-gold" />
          ))}
        </div>

        <Quote className="w-8 h-8 text-brand/20 mb-3" />

        <p className="text-sm text-text-secondary leading-relaxed mb-6 italic">
          &ldquo;{quote}&rdquo;
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <div className="w-11 h-11 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold">
            {initials}
          </div>
          <div>
            <div className="font-semibold text-sm text-text">{name}</div>
            <div className="text-xs text-text-muted">
              {role} &middot; {profession}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
