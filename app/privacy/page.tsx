// app/privacy-policy/page.tsx
export const metadata = {
  title: "Privacy Policy | Chronicles",
  description:
    "Learn how Chronicles collects, uses, and protects your personal information. Understand your privacy rights and how your data is handled safely.",
  keywords: [
    "Chronicles privacy policy",
    "privacy policy",
    "anonymous stories privacy",
    "data protection",
    "user privacy",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Privacy Policy | Chronicles",
    description:
      "Details about how Chronicles collects, processes, and protects user data.",
    url: "https://www.tobehonest.club/privacy-policy",
    siteName: "Chronicles",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Chronicles",
    description:
      "Learn how Chronicles protects your personal information.",
  },
};
export default function page() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy explains how we collect, use, and protect your
        personal information when you use our platform. By accessing or using
        our services, you agree to the practices described in this policy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect the following types of information:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Personal details such as your name, email, and username.</li>
        <li>Account credentials and authentication tokens.</li>
        <li>
          Usage data including interactions, preferences, and content you share.
        </li>
        <li>Device and browser information for security and analytics.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To create and manage your account.</li>
        <li>To personalize your experience and show relevant content.</li>
        <li>To improve our services and detect technical issues.</li>
        <li>To ensure the safety and integrity of the community.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">3. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell or rent your data. We may share limited information with:
      </p>
      <ul className="list-disc pl-6 mb-4">
        <li>Service providers who help us operate our platform.</li>
        <li>
          Legal authorities if required by law or to protect users from harm.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">4. Data Security</h2>
      <p className="mb-4">
        We use industry-standard measures to protect your personal data from
        unauthorized access, disclosure, alteration, or destruction. However, no
        system is 100% secure, and we cannot guarantee absolute protection.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">5. Your Rights</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You can access or update your account information anytime.</li>
        <li>
          You may request deletion of your account and data by contacting
          support.
        </li>
        <li>
          You can withdraw consent for certain types of data processing at any
          time.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-3">6. Changes to This Policy</h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with a new “Last Updated” date.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-3">7. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy,
        please contact us at{" "}
         <a
            href="mailto:chronicleofstrangers@gmail.com"
            className="text-blue-400 underline"
          >
            info@chronicleofstrangers.cl
          </a>.
      </p>

      <p className="mt-8 text-sm text-gray-500">Last Updated: November 2025</p>
    </main>
  );
}
