import React from 'react';

// Updated Terms of Service content with markdown formatting
const termsContent = `
# Terms of Service for Endurably Gamic
**Last Updated: August 11, 2025**

Welcome to Endurably Gamic! These Terms of Service ("Terms") govern your use of our website and services (collectively, the "Service"), so please read them carefully. By accessing or using our Service, you agree to be bound by these Terms.

### 1. User Accounts
- **Account Creation:** You must create an account to submit base layouts and access certain features. You agree to provide accurate, current, and complete information during the registration process.
- **Account Responsibility:** You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
- **Age Requirement:** You must be at least 13 years old to use the Service.

### 2. User-Generated Content
- **Your Content:** You are solely responsible for the content you submit, including base layout links, images, titles, and other information ("User Content"). You represent that you have all necessary rights to your User Content and that it does not violate any third-party rights.
- **License to Us:** By submitting User Content, you grant Endurably Gamic a worldwide, non-exclusive, royalty-free, perpetual license to use, host, store, reproduce, modify, display, and distribute your User Content in connection with operating and promoting the Service.
- **Prohibited Content:** You may not submit any content that is illegal, obscene, defamatory, threatening, infringing on intellectual property rights, invasive of privacy, or otherwise injurious to third parties. We reserve the right to remove any User Content at our discretion.

### 3. Prohibited Conduct
You agree not to engage in any of the following prohibited activities:
- Using the Service for any illegal purpose or in violation of any local, state, national, or international law.
- Attempting to interfere with, compromise the system integrity or security of, or decipher any transmissions to or from the servers running the Service.
- Uploading invalid data, viruses, worms, or other software agents through the Service.
- Impersonating another person or otherwise misrepresenting your affiliation with a person or entity.

### 4. Intellectual Property
All materials on the Service, including the logo, design, text, graphics, and other files, are the property of Endurably Gamic and are protected by copyright and other intellectual property laws.

### 5. Termination
We may terminate or suspend your account and access to the Service at our sole discretion, without prior notice or liability, for any reason, including if you breach these Terms.

### 6. Disclaimers and Limitation of Liability
The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Endurably Gamic makes no warranties, express or implied, regarding the Service. In no event shall Endurably Gamic be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Service.

### 7. Governing Law
These Terms shall be governed by the laws of India, without regard to its conflict of law provisions.

### 8. Changes to Terms
We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such change constitutes your acceptance of the new Terms.

### 9. Contact Us
If you have any questions about these Terms, please contact us at our [Discord Server](https://discord.com/invite/CbYradtUeM).
`;

// Updated Privacy Policy content with markdown formatting
const privacyContent = `
# Privacy Policy for Endurably Gamic
**Last Updated: August 11, 2025**

Endurably Gamic ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services (the "Service").

### 1. Information We Collect
We may collect information about you in a variety of ways:
- **Personal Data:** When you register for an account, we collect personally identifiable information, such as your name and email address.
- **User-Generated Content:** We collect the information you provide when you submit base layouts, including titles, links, images, and town hall levels.
- **Automatically Collected Information:** When you access the Service, we may automatically collect certain information, including your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the site.

### 2. How We Use Your Information
We use the information we collect to:
- Create and manage your account.
- Operate and maintain the Service.
- Display your submitted content to other users.
- Respond to your comments and questions.
- Monitor and analyze usage and trends to improve your experience.
- Serve personalized advertisements to you.

### 3. Cookies and Advertising
- **Cookies:** We use cookies to help customize the Service and improve your experience. A cookie is a small file placed on your computer.
- **Google AdSense:** We use Google AdSense to serve advertisements on our site. Google uses cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
- **Opting Out:** Users may opt out of personalized advertising by visiting [Google's Ads Settings](https://www.google.com/settings/ads).

### 4. Sharing Your Information
We do not sell or rent your personal information to third parties. We may share information we have collected about you in certain situations:
- **With Your Consent:** We may share your information with third parties when you give us consent to do so.
- **For Legal Reasons:** We may disclose your information if required to do so by law or in response to valid requests by public authorities.
- **With Service Providers:** We may share your information with third-party vendors and service providers that perform services for us (e.g., hosting, analytics).

### 5. Data Security
We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.

### 6. Children's Privacy
Our Service is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13.

### 7. Changes to This Privacy Policy
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

### 8. Contact Us
If you have any questions about this Privacy Policy, please contact us at our [Discord Server](https://discord.com/invite/CbYradtUeM).
`;

// Improved renderer that handles headings, paragraphs, lists, and links
const MarkdownRenderer = ({ content }) => {
    const renderLine = (line, key) => {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
                parts.push(line.substring(lastIndex, match.index));
            }
            const [fullMatch, text, url] = match;
            parts.push(
                <a key={`${key}-link-${lastIndex}`} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {text}
                </a>
            );
            lastIndex = linkRegex.lastIndex;
        }

        if (lastIndex < line.length) {
            parts.push(line.substring(lastIndex));
        }

        return <>{parts.map((part, i) => <React.Fragment key={i}>{part}</React.Fragment>)}</>;
    };

    const elements = [];
    let listItems = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-2 my-4">
                    {listItems.map((item, index) => <li key={index}>{renderLine(item, index)}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    content.trim().split('\n').forEach((line, index) => {
        if (line.trim() === '') {
            flushList();
            return;
        }
        if (line.startsWith('# ')) {
            flushList();
            elements.push(<h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.substring(2)}</h1>);
        } else if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={index} className="text-xl font-semibold text-gray-200 mt-6 mb-3">{line.substring(4)}</h3>);
        } else if (line.startsWith('- ')) {
            listItems.push(line.substring(2));
        } else if (line.startsWith('**')) {
            flushList();
            elements.push(<p key={index} className="font-bold text-gray-400">{line.replace(/\*\*/g, '')}</p>);
        } else {
            flushList();
            elements.push(<p key={index} className="my-4">{renderLine(line, index)}</p>);
        }
    });

    flushList(); // Flush any remaining list items at the end

    return (
        <div className="prose prose-invert prose-lg max-w-none text-gray-300">
            {elements}
        </div>
    );
};

export const TermsOfServicePage = () => (
    <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-10">
            <MarkdownRenderer content={termsContent} />
        </div>
    </div>
);

export const PrivacyPolicyPage = () => (
    <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 sm:p-10">
            <MarkdownRenderer content={privacyContent} />
        </div>
    </div>
);
