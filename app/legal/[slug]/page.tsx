const LEGAL_TITLES: Record<string, string> = {
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms and Conditions',
  disclaimer: 'Disclaimer',
  'cookie-policy': 'Cookie Policy',
};

export default function LegalPage({ params }: { params: { slug: string } }) {
  const title = LEGAL_TITLES[params.slug] || 'Legal Information';
  const legalContent: Record<string, string[]> = {
    'privacy-policy': [
      'AGROMIA collects information that you voluntarily provide through enquiries, including your name, contact details, product interest and message.',
      'Submitted information is used to respond to enquiries, provide product support and improve website quality.',
      'We take reasonable measures to protect submitted information. Do not submit sensitive or confidential information through public forms.',
    ],
    terms: [
      'Use of this website and its product information is subject to applicable Indian laws and these terms.',
      'Product specifications, availability and recommendations may change. Always read the official product label and consult a qualified agricultural professional before use.',
    ],
    disclaimer: [
      'Website content is general agricultural information and does not replace product labels, expert advice or applicable instructions.',
      'AGROMIA does not guarantee particular crop outcomes because weather, soil, crop, application method and other factors vary.',
    ],
    'cookie-policy': [
      'This website may use essential browser storage to remember preferences and maintain secure sessions.',
      'Analytics or third-party content, if enabled, may use cookies according to the applicable provider policy.',
    ],
  };
  const paragraphs = legalContent[params.slug] || ['This legal document is being finalized.'];
  return (
    <main className="editorial-section">
      <div className="container-brand">
        <span className="section-label">AGROMIA / LEGAL</span>
        <h1 className="editorial-headline">{title}</h1>
        <div className="editorial-body mt-8 space-y-5">{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </div>
    </main>
  );
}
