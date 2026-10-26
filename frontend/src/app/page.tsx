import {
  Navbar,
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  ModelsSection,
  PrivacySection,
  FaqSection,
  CtaSection,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ModelsSection />
        <PrivacySection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
