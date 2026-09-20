// Single source of truth for rdinnovate.com. Every page reads from here.
// Optional fields: leave them empty ('' or null) and the page simply omits
// that line. Never put a marker like "PLACEHOLDER" here: it would render.

export const business = {
  name: 'R&D Innovate',
  tagline: 'Dare to Dream, Innovate and Disrupt',
  description:
    'R&D Innovate helps businesses maximise their innovation potential through expert guidance and support, from research question to commercialised product.',
  email: 'rd@rdinnovate.com',
  phone: '',          // e.g. '+61 2 ...' — shown only when set
  abn: '',            // shown in the footer only when set
  location: '',       // e.g. 'Sydney, Australia' — shown only when set

  // Contact form. Create a free key at https://web3forms.com with rd@rdinnovate.com,
  // paste it here, commit. Until then the page shows the email address instead
  // of a form. (The key is public by design: it only lets people send you mail.)
  web3formsKey: '',

  // Is this person/firm a registered tax agent with the Tax Practitioners Board?
  // Keep false unless registration is current. The compliance check blocks any
  // page that claims registration while this is false.
  tpbRegistered: false,

  links: {
    blog: 'https://blog.rdinnovate.com',
    blogFeed: 'https://blog.rdinnovate.com/feed.xml',
    software: 'https://blog.rdinnovate.com/workbench/',
  },
};

export const productionUrl = 'https://rdinnovate.com';
