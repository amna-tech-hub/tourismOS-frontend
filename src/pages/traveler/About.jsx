import React from "react";
import {
  ArrowRight,
  BookHeart,
  Check,
  Compass,
  Globe2,
  Heart,
  MapPin,
  Plane,
  ShieldCheck,
  Sun,
  Users,
  Utensils,
  CloudSun,
  AlertTriangle,
  Camera,
  CalendarDays,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCompanyProfile } from "../../api/queries/useCompany";

const About = () => {
  const navigate = useNavigate();

  const { data: companyProfile } = useCompanyProfile();

  const company =
    companyProfile?.company ||
    companyProfile?.data ||
    companyProfile ||
    null;

  const companyName =
    company?.name ||
    company?.companyName ||
    "TourismOS";

  const companyDescription =
    company?.description ||
    company?.about ||
    "A smarter way to discover, plan and experience unforgettable journeys.";

  const companyLogo =
    company?.logo ||
    company?.logoUrl ||
    company?.image ||
    null;

  const handleExplore = () => {
    navigate("/");
  };

  const handleJournal = () => {
    navigate("/journal");
  };

  const platformFeatures = [
    {
      icon: Compass,
      title: "Curated Journeys",
      description:
        "Discover carefully crafted tours and destinations from trusted travel companies and local experts.",
    },
    {
      icon: CloudSun,
      title: "Live Travel Intelligence",
      description:
        "Every itinerary can be enhanced with weather information so you can understand what your journey may look like.",
    },
    {
      icon: ShieldCheck,
      title: "Safety Awareness",
      description:
        "Stay informed with destination safety and disaster alerts connected to your itinerary.",
    },
    {
      icon: BookHeart,
      title: "Your Travel Journal",
      description:
        "Keep your journeys, experiences and favorite memories together in one personal travel journal.",
    },
  ];

  const journeySteps = [
    {
      icon: Compass,
      title: "Discover",
      description:
        "Explore destinations and curated tours that match the kind of experience you want.",
    },
    {
      icon: CalendarDays,
      title: "Plan",
      description:
        "Build your journey with itinerary details, useful travel information, weather and safety insights.",
    },
    {
      icon: BookHeart,
      title: "Remember",
      description:
        "After your adventure, preserve the moments that made your journey special in your journal.",
    },
  ];

  const intelligenceItems = [
    {
      icon: CloudSun,
      title: "Weather-aware itineraries",
      text: "Understand weather conditions around the places included in your journey.",
    },
    {
      icon: ShieldCheck,
      title: "Safety insights",
      text: "Get useful safety information and alerts connected to your travel plans.",
    },
    {
      icon: AlertTriangle,
      title: "Destination alerts",
      text: "Be more aware of significant disaster or risk events that may affect destinations.",
    },
  ];

  return (
    <main className="min-h-screen bg-bg-secondary">

      {/* HERO - Updated with Home hero styling */}
    <section className="relative min-h-screen! lg:min-h-[760px] flex items-center">
  <div className="absolute inset-0">
    <img
      src="/v4.jpg"
      alt="Beautiful travel destination"
      className="w-full h-full object-cover "
    />
    <div className="absolute inset-0 bg-black/45" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24">
    <div className="max-w-3xl">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white! leading-[0.95] tracking-tight">
        Your next adventure
        <span className="block text-yellow-400 italic">
          starts here.
        </span>
      </h1>

      <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/85! leading-relaxed max-w-2xl">
        Curated tours, smart travel insights, and a personal journal for your memories.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          type="button"
          onClick={handleExplore}
          className="btn-primary"
        >
          Explore Tours
          <ArrowRight size={18} />
        </button>

        <button
          type="button"
          onClick={handleJournal}
          className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-white/10 backdrop-blur-md border border-white/25 text-white font-semibold text-sm"
        >
          <BookHeart size={18} />
          My Journal
        </button>
      </div>
    </div>
  </div>
</section>

      {/* INTRO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-4">
                <div className="h-56 sm:h-72 rounded-[2rem] overflow-hidden">
                  <img
                    src="/v2.jpg"
                    alt="Travel experience"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-40 sm:h-52 rounded-[2rem] overflow-hidden">
                  <img
                    src="/v3.jpg"
                    alt="Travel destination"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-10">
                <div className="h-40 sm:h-52 rounded-[2rem] overflow-hidden">
                  <img
                    src="/v4.jpg"
                    alt="Nature and adventure"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-56 sm:h-72 rounded-[2rem] overflow-hidden">
                  <img
                    src="/v5.jpg"
                    alt="Beautiful landscape"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05]">
              A better way to
              <span className="block text-yellow-400 italic">
                experience the world.
              </span>
            </h2>

            <p className="mt-6 text-text-secondary leading-7 text-base lg:text-lg">
              TourismOS is designed around one simple idea:
              travel should not end when you book a tour.
            </p>

            <p className="mt-4 text-text-secondary leading-7">
              From discovering a destination to understanding the
              weather, staying aware of safety conditions and finally
              preserving your memories, TourismOS connects the entire
              travel experience in one place.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                "Discover curated experiences",
                "Plan smarter itineraries",
                "Stay informed while travelling",
                "Keep your memories forever",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                    <Check size={15} className="text-yellow-700" />
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="bg-white border-y border-border-subtle py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-4xl sm:text-5xl font-semibold">
              Everything you need for a
              <span className="text-yellow-400 italic"> better journey.</span>
            </h2>
            <p className="section-description text-base leading-7 max-w-2xl">
              TourismOS combines travel discovery with useful intelligence
              and personal memories, so your journey feels easier before,
              during and after the trip.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="card p-8">
                <div className="w-14 h-14 rounded-2xl bg-yellow-50 flex items-center justify-center mb-6">
                  <feature.icon size={28} className="text-yellow-400" />
                </div>

                <h3 className="text-2xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-6">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WEATHER + SAFETY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.05]">
              Don't just know
              <span className="block text-yellow-400 italic">
                where you're going.
              </span>
              Know what to expect.
            </h2>

            <p className="mt-6 text-text-secondary leading-7">
              TourismOS adds intelligence to your itinerary so you can
              make better travel decisions instead of simply following
              a schedule.
            </p>

            <div className="space-y-4 mt-8">
              {intelligenceItems.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-6 mt-1">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2.5rem] overflow-hidden shadow-xl">
              <img
                src="/v9.jpg"
                alt="Travel landscape"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* JOURNAL SECTION */}
      <section className="bg-[#f1ede5] py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative max-w-xl mx-auto">
                <div className="rounded-[2.5rem] overflow-hidden shadow-xl rotate-[-2deg]">
                  <img
                    src="/v4.jpg"
                    alt="Travel memories"
                    className="w-full h-[470px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-4 sm:right-0 w-52 h-64 rounded-[2rem] overflow-hidden border-8 border-[#f1ede5] shadow-xl rotate-[5deg]">
                  <img
                    src="/v9.jpg"
                    alt="Travel journal memory"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl font-semibold leading-[1.05]">
                Every journey becomes a
                <span className="block text-yellow-400 italic">
                  memory worth keeping.
                </span>
              </h2>

              <p className="mt-6 text-text-secondary leading-7">
                TourismOS isn't only about booking your next adventure.
                Your journal gives you a place to keep the story of where
                you've been and what made each journey special.
              </p>

              <div className="space-y-4 mt-8">
                {[
                  {
                    icon: Camera,
                    title: "Save meaningful moments",
                    text: "Keep memories from the places and experiences that matter to you.",
                  },
                  {
                    icon: MapPin,
                    title: "Connect memories with places",
                    text: "Your travel stories can stay connected to the destinations you visited.",
                  },
                  {
                    icon: Heart,
                    title: "Build your personal travel story",
                    text: "Over time, your journal becomes a collection of your adventures.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                      <item.icon size={18} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-text-muted mt-1 leading-6">
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleJournal}
                className="btn-primary mt-8"
              >
                Open My Journal
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-4xl sm:text-5xl font-semibold">
            From first idea to
            <span className="text-yellow-400 italic"> favorite memory.</span>
          </h2>
          <p className="section-description text-base leading-7">
            We connect the important parts of travel into one experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {journeySteps.map((step, index) => (
            <div key={index} className="card p-7 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center mb-6">
                <step.icon size={21} className="text-yellow-400" />
              </div>

              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-sm text-text-muted leading-6">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPANY / TRUSTED PARTNER */}
      {company && (
        <section className="bg-white border-y border-border-subtle py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[auto_1fr_auto] items-center gap-7 lg:gap-10">
              <div className="w-20 h-20 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center overflow-hidden">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 size={30} className="text-yellow-400" />
                )}
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold">
                  {companyName}
                </h2>
                <p className="text-sm text-text-muted leading-6 mt-2 max-w-2xl">
                  {companyDescription}
                </p>
              </div>

              <button
                type="button"
                onClick={handleExplore}
                className="btn-outline"
              >
                Explore Tours
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] min-h-[520px] flex items-center">
          <img
            src="/v10.jpg"
            alt="Beautiful destination"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          <div className="relative z-10 px-7 sm:px-12 lg:px-16 py-16 max-w-3xl">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white! leading-[1.05]">
              Don't just visit a place.
              <span className="block text-yellow-400 italic">
                Experience it.
              </span>
            </h2>

            <p className="text-white! text-base sm:text-lg leading-7 mt-6 max-w-xl">
              Find your next destination, discover meaningful experiences,
              travel with more awareness and keep the memories with you.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                type="button"
                onClick={handleExplore}
                className="btn-primary"
              >
                Start Exploring
                <ArrowRight size={18} />
              </button>

              <button
                type="button"
                onClick={handleJournal}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-white/10 backdrop-blur-md border border-white/25 text-white font-semibold text-sm"
              >
                <BookHeart size={18} />
                View Journal
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default About;