import React from 'react';

function PrivacyPolicy() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-gray-800">
      {/* Page Header */}
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
      
      {/* Privacy Policy Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="leading-relaxed mb-6">
          At Outfit eCommerce, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or make a purchase from us.
        </p>

        <h3 className="text-xl font-semibold mb-2">Information We Collect</h3>
        <p className="leading-relaxed mb-6">
          We may collect personal information such as your name, email address, shipping address, payment details, and browsing activity on our website to improve your shopping experience.
        </p>

        <h3 className="text-xl font-semibold mb-2">How We Use Your Information</h3>
        <p className="leading-relaxed mb-6">
          The information we collect is used to process orders, improve our website, and enhance customer service. We do not share your information with third parties except as necessary to fulfill your order.
        </p>

        <h3 className="text-xl font-semibold mb-2">Your Rights</h3>
        <p className="leading-relaxed">
          You have the right to access, update, or delete your personal information. Please contact us if you wish to exercise these rights.
        </p>
      </section>

      {/* About Us Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">About Us</h2>
        <p className="leading-relaxed">
          Outfit eCommerce is a leading online fashion retailer offering the latest trends in clothing, accessories, and more. We strive to provide a seamless shopping experience with high-quality products and exceptional customer service.
        </p>
      </section>

      {/* Contact Us Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="leading-relaxed mb-4">
          If you have any questions about our Privacy Policy or would like more information, please feel free to contact us at:
        </p>
        <p className="leading-relaxed">
          <strong>Email:</strong> support@outfit-ecommerce.com<br />
          <strong>Phone:</strong> +1 234 567 890<br />
          <strong>Address:</strong> 123 Fashion Street, New York, NY 10001
        </p>
      </section>

      {/* Disclaimer Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
        <p className="leading-relaxed">
          All content on this website is for informational purposes only. While we strive to provide accurate and up-to-date information, we do not make any guarantees regarding the completeness, reliability, or accuracy of the content on this site. We reserve the right to modify this Privacy Policy at any time.
        </p>
      </section>

    </div>
  );
}

export default PrivacyPolicy;
