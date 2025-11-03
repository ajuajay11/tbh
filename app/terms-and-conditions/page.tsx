// app/terms/page.tsx
"use client";

 
export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-white">
        Terms & Conditions
      </h1>

      <p className="text-sm text-gray-400 mb-10">
        Last updated: October 30, 2025
      </p>

      <section className="space-y-6 leading-relaxed">
        <p>
          Welcome to <strong>Chronicles</strong>. By accessing or using our
          platform, you agree to the following Terms and Conditions. Please read
          them carefully before using the site.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          1. About the Service
        </h2>
        <p>
          Chronicles allows users to share real-life stories anonymously. Posts,
          likes, and comments are public but linked to your profile internally
          for moderation and safety. We do not reveal your identity publicly
          unless required by law.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          2. Eligibility
        </h2>
        <p>
          You must be at least 16 years old to use this platform. By using the
          Service, you confirm that you meet this requirement.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          3. Content Ownership
        </h2>
        <p>
          You own the content you post. By submitting a story or comment, you
          grant Chronicles a license to host and display it publicly. You can
          delete your content anytime, though backups may persist briefly.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          4. Prohibited Content
        </h2>
        <ul className="list-disc pl-8">
          <li>Illegal or harmful content (hate speech, threats, harassment)</li>
          <li>Personal data of others (addresses, IDs)</li>
          <li>Spam, scams, or deceptive links</li>
          <li>Copyright-infringing material</li>
        </ul>

        <h2 className="text-2xl font-semibold text-white mt-8">
          5. Moderation
        </h2>
        <p>
          We may remove or hide content that violates our policies. Users can
          report posts for review. Repeat violations may lead to suspension or
          permanent bans.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          6. Anonymity & Data
        </h2>
        <p>
          While stories are posted anonymously, we may store metadata such as IP
          addresses and device information for security and abuse prevention.
          For more details, see our{" "}
          <a href="/privacy" className="text-blue-400 underline">
            Privacy Policy
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          7. Limitation of Liability
        </h2>
        <p>
          We provide Chronicles &quot;as is&quot; without warranties. We are not liable
          for damages arising from user content or third-party services.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          8. Changes to Terms
        </h2>
        <p>
          We may update these Terms periodically. Continued use of the platform
          after updates means you accept the new Terms.
        </p>

        <h2 className="text-2xl font-semibold text-white mt-8">
          9. Contact
        </h2>
        <p>
          For questions or reports, please contact us at{" "}
          <a
            href="mailto:contact@chronicles.app"
            className="text-blue-400 underline"
          >
            contact@chronicles.app
          </a>
          .
        </p>
      </section>
    </main>
  );
}
