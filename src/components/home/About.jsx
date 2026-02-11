export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-32 p-4 md:p-12">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8 md:p-12 space-y-10">

        {/* ===== Page Header ===== */}
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            About Us
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Learn more about our mission, privacy policy, and terms of service.
          </p>
        </header>

        {/* ===== About Section ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Our Mission
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We are committed to connecting talented individuals with the right companies, 
            providing a seamless job search experience. Our platform is designed to help 
            both job seekers and employers thrive in a transparent, efficient, and secure environment.
          </p>
        </section>

        {/* ===== Privacy Policy Section ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Privacy Policy
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            We take your privacy seriously. All personal data collected on our platform is 
            securely stored and used solely for recruitment purposes. We never share sensitive 
            information with third parties without your consent.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            By using our platform, you agree to our privacy practices and understand how your data 
            is handled. For full details, please refer to our complete privacy policy.
          </p>
        </section>

        {/* ===== Terms of Service Section ===== */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Terms of Service
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Our platform is intended for legitimate job seeking and recruitment activities. 
            Users must provide accurate information and comply with all applicable laws and regulations. 
            We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            By accessing and using our services, you agree to adhere to our terms of service and understand 
            that any misuse may result in account restrictions.
          </p>
        </section>

      </div>
    </div>
  );
}