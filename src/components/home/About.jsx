export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 px-4 md:px-12 pb-16">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-12 space-y-14">

        {/* ===== Page Header ===== */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            About Find Jobs
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
            Learn more about our mission, how we operate, and the policies that guide our platform.
          </p>
        </header>

        {/* ===== Mission ===== */}
        <section id="mission" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            At Find Jobs, our mission is to bridge the gap between talented professionals 
            and forward-thinking companies. We aim to simplify the recruitment process by 
            providing a secure, transparent, and user-friendly platform for both job seekers 
            and employers.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We believe everyone deserves access to meaningful career opportunities, and 
            businesses deserve access to the right talent without unnecessary complexity.
          </p>
        </section>

        {/* ===== Vision ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Our Vision
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We envision a global job marketplace where opportunities are accessible, 
            recruitment is efficient, and professional growth is continuous. 
            Our goal is to become a trusted partner for career development and workforce expansion.
          </p>
        </section>

        {/* ===== Why Choose Us ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Why Choose Find Jobs?
          </h2>
          <ul className="list-disc pl-5 text-gray-600 text-sm md:text-base space-y-2">
            <li>Easy and intuitive job search experience</li>
            <li>Secure data storage and privacy protection</li>
            <li>Dedicated dashboards for users and companies</li>
            <li>Streamlined job posting and application process</li>
            <li>Transparent and reliable platform policies</li>
          </ul>
        </section>

        {/* ===== Privacy Policy ===== */}
        <section id="privacy" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Privacy Policy
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We take your privacy seriously. All personal information collected on our platform 
            is securely stored and used strictly for recruitment-related purposes.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We do not sell or distribute user data to third parties. Information is only 
            shared when required for job application processing or when legally obligated.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            By using our services, you agree to our privacy practices and understand how 
            your data is handled within our secure environment.
          </p>
        </section>

        {/* ===== Terms of Service ===== */}
        <section id="terms" className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Terms of Service
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Our platform is intended solely for legitimate job seeking and recruitment activities. 
            Users must provide accurate and truthful information while using our services.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We reserve the right to suspend or terminate accounts that engage in fraudulent, 
            misleading, or abusive activities.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            By accessing and using Find Jobs, you agree to comply with our terms and 
            all applicable laws and regulations.
          </p>
        </section>

        {/* ===== Contact ===== */}
        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Contact Us
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Have questions or need assistance? Reach out to us at:
          </p>
          <p className="text-gray-700 font-medium">
            support@findjobs.com
          </p>
        </section>

      </div>
    </div>
  );
}