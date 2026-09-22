import React, { useEffect } from 'react';

/**
 * Reusable dynamic SEO component
 * Updates document.title, meta descriptions, canonical URLs, and OpenGraph dynamically per route.
 */
const SEO = ({
  title,
  description,
  keywords,
  image = 'https://marketmaxtradingacademy.com/logo.png',
  url = 'https://marketmaxtradingacademy.com',
  type = 'website'
}) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | MarketMax Trading Academy`
      : 'MarketMax Trading Academy | Trading Education, Live Market Mentorship & Strategy Learning';

    document.title = fullTitle;

    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (selector.startsWith("meta[name='")) {
          const name = selector.match(/meta\[name='([^']+)'\]/)[1];
          element.setAttribute('name', name);
        } else if (selector.startsWith("meta[property='")) {
          const prop = selector.match(/meta\[property='([^']+)'\]/)[1];
          element.setAttribute('property', prop);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    if (description) {
      setMetaTag("meta[name='description']", 'content', description);
      setMetaTag("meta[property='og:description']", 'content', description);
      setMetaTag("meta[property='twitter:description']", 'content', description);
    }

    if (keywords) {
      setMetaTag("meta[name='keywords']", 'content', keywords);
    }

    setMetaTag("meta[property='og:title']", 'content', fullTitle);
    setMetaTag("meta[property='twitter:title']", 'content', fullTitle);
    setMetaTag("meta[property='og:url']", 'content', url);
    setMetaTag("meta[property='og:type']", 'content', type);
    setMetaTag("meta[property='og:image']", 'content', image);
    setMetaTag("meta[property='twitter:image']", 'content', image);

    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, keywords, image, url, type]);

  return null;
};

export default SEO;
