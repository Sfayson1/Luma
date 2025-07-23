import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> July 22, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Luma, a personal journaling platform. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li><strong>Account Information:</strong> Email address, name, username</li>
              <li><strong>Profile Information:</strong> Profile photo, bio, preferences</li>
              <li><strong>Journal Content:</strong> Your journal entries, mood tracking, tags, and prompts</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Usage Data:</strong> How you interact with our app</li>
              <li><strong>Device Information:</strong> Browser type, IP address, device identifiers</li>
              <li><strong>Cookies:</strong> For authentication and preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use your information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Provide and maintain the Luma service</li>
              <li>Enable you to create and manage journal entries</li>
              <li>Facilitate social features (sharing public entries)</li>
              <li>Send important service notifications</li>
              <li>Improve our app and user experience</li>
              <li>Ensure security and prevent abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information Sharing</h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">We Never Share</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li>Your private journal entries</li>
              <li>Personal information for marketing purposes</li>
              <li>Data with third parties for profit</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">We May Share When</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Legal Requirements:</strong> Court orders, legal process</li>
              <li><strong>Safety:</strong> To prevent harm to users or others</li>
              <li><strong>Business Transfer:</strong> If ownership changes (with notice)</li>
              <li><strong>Public Content:</strong> Entries you choose to make public</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Privacy Controls</h2>

            <h3 className="text-xl font-medium text-gray-800 mb-3">You Can</h3>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
              <li>Set journal entries to private or public</li>
              <li>Edit or delete your journal entries anytime</li>
              <li>Update your profile information</li>
              <li>Request account deletion</li>
              <li>Download your data</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">Privacy Settings</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Private Entries:</strong> Only visible to you</li>
              <li><strong>Public Entries:</strong> Visible to other Luma users</li>
              <li><strong>Profile Privacy:</strong> Control who can see your profile</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-700 mb-3">We protect your information through:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication systems</li>
              <li>Regular security updates and monitoring</li>
              <li>Limited employee access to personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Retention</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Active Accounts:</strong> We keep your data as long as your account is active</li>
              <li><strong>Deleted Accounts:</strong> Data removed within 30 days of deletion request</li>
              <li><strong>Legal Requirements:</strong> Some data may be retained longer if required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Luma is not intended for children under 13. We do not knowingly collect information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 mb-3">We may update this Privacy Policy. We'll notify you of significant changes by:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Email notification</li>
              <li>In-app notification</li>
              <li>Posting updates on our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-3">If you have questions about this Privacy Policy or your data:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Email:</strong> privacy@luma-app.com</li>
              <li><strong>Address:</strong> [Your Business Address]</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-3">Depending on your location, you may have rights to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your information</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Object to processing</li>
            </ul>
          </section>

          <footer className="border-t pt-6 mt-8">
            <p className="text-gray-500 text-sm">
              <em>Last updated: July 22, 2025</em>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
