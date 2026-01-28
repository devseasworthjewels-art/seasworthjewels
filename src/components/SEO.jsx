import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";

const SEO = ({
  title = "Seasworth Jewels - Luxury Custom Jewelry & Engagement Rings",
  description = "Discover exquisite custom jewelry at Seasworth Jewels. Shop stunning engagement rings, wedding bands, gemstone jewelry, and personalized pieces crafted with moissanite, diamonds, and precious metals.",
  keywords = "Seasworth Jewels, seasworth, jewelry, custom jewelry, engagement rings, wedding rings, moissanite jewelry, diamond jewelry, luxury jewelry, gemstone jewelry, gold jewelry, silver jewelry, customized rings, personalized jewelry, bridal jewelry, fine jewelry",
  canonicalUrl,
  ogType = "website",
  ogImage = "/original.png",
  twitterCard = "summary_large_image",
  structuredData,
  noindex = false,
}) => {
  const baseUrl = "https://seasworthjewels.com";
  const fullCanonicalUrl =
    canonicalUrl || `${baseUrl}${window.location.pathname}`;
  const fullOgImage = ogImage.startsWith("http")
    ? ogImage
    : `${baseUrl}${ogImage}`;

  // Default structured data for organization
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Seasworth Jewels",
    description:
      "Luxury custom jewelry store specializing in engagement rings, wedding bands, and fine jewelry",
    url: baseUrl,
    logo: `${baseUrl}/original.png`,
    image: `${baseUrl}/original.png`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23, Tilak Nagar, Jawahar Road, Amreli",
      addressLocality: "Amreli",
      addressRegion: "Gujarat",
      postalCode: "365601",
      addressCountry: "IN",
    },
    telephone: "+919925990345",
    email: "seasworthjewels@gmail.com",
    sameAs: [
      "https://www.instagram.com/seasworthjewels",
      "https://www.facebook.com/seasworthjewels",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}
      <link rel="canonical" href={fullCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Seasworth Jewels" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional SEO Tags */}
      <meta name="author" content="Seasworth Jewels" />
      <meta name="geo.region" content="IN-GJ" />
      <meta name="geo.placename" content="Amreli" />
      <meta name="geo.position" content="21.6004;71.2183" />
      <meta name="ICBM" content="21.6004, 71.2183" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  twitterCard: PropTypes.string,
  structuredData: PropTypes.object,
  noindex: PropTypes.bool,
};

export default SEO;
