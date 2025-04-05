//test- Does this line appear in vscode

import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'
import LogoCarousel from './LogoCarousel';

const config = {
  projectId: 'kabpbxao',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01',
}

const builder = imageUrlBuilder(createClient(config))
const urlFor = (source: any) => builder.image(source)

export async function generateStaticParams() {
  const slugs = await sanity.fetch(`*[_type == "toolPage"]{ slug }`)
  return slugs.map((t: any) => ({ slug: t.slug.current }))
}

async function getData(slug: string) {
  const query = `{
    "tool": *[_type == "toolPage" && slug.current == $slug][0]{
      heroTitle,
      heroParagraph,
      heroImage,
      heroCtaPrimary,
      heroCtaSecondary,
      featuresTitle,
      featuresSubtitle,
      features, // ← ensure this line exists
      comparisonHeadline,
      comparisonTable{
        headline,
        rows,
        bottomText,
        competitorHeading,
        thisToolHeading
      },
      toolSpecificSections,
      ctaHeadline,
      ctaSubtext,
      ctaButtonLabel,
      "testimonials": *[_type == "testimonial"]{quote, author},
      "faqs": *[_type == "faq"]{question, answer},
      "cta": *[_type == "ctaBlock"][0]
    },
    "globalSettings": *[_type == "siteSettings"][0]{
      logo,
      partnerLogos,
      euBenefitsHeadline,
      euBenefitsParagraph,
      euBenefitsImage,
      footerColumns,
      "partnerLogoUrls": partnerLogos.asset->url
    }
  }`
  console.log('Fetching data from Sanity...');
  try {
    const data = await sanity.fetch(query, { slug });

    return {
      tool: data.tool,
      globalSettings: data.globalSettings,
    };
  } catch (error) {
    console.error('Error fetching data from Sanity:', error);
    return { tool: null, globalSettings: null };
  }
}

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const { tool: data, globalSettings } = await getData(params.slug);

  if (!data || !globalSettings) {
    return <div>Error: Could not load data for this page.</div>;
  }

  return (
    <div className="bg-white text-black">
      {/* Header */}
      <header className="w-full px-8 py-5 flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          {globalSettings.logo ? (
            <img src={urlFor(globalSettings.logo).width(160).url()} alt="Logo" className="h-10 object-contain" />
          ) : (
            <span className="text-lg font-bold">Letseuro</span>
          )}
        </div>
        <nav className="flex gap-6 text-sm items-center">
          <a href="#" className="hover:underline hide-on-mobile">Contact Sales</a>
          <a href="#" className="hover:underline hide-on-mobile">Sign in</a>
          <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm">
            {data.heroCtaPrimary || 'Get started'}
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-4">{data.heroTitle}</h1>
          <p className="text-lg text-gray-700 mb-6">
            {data.heroParagraph || `Everything you ever wanted to know about ${data.heroTitle}… but analytics never told you.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-center">
              {data.heroCtaPrimary || 'Get started'}
            </a>
            <a href="/demo" className="border border-blue-600 text-blue-600 px-6 py-3 rounded font-semibold text-center">
              {data.heroCtaSecondary || 'Book a demo'}
            </a>
          </div>
        </div>
        <div>
          {data.heroImage && data.heroImage.asset ? (
            <img src={urlFor(data.heroImage).width(800).url()} alt={data.heroTitle} className="rounded-xl w-full" />
          ) : (
            <div className="bg-gray-100 rounded-xl aspect-[16/10] flex items-center justify-center text-gray-400">
              [Hero image]
            </div>
          )}
        </div>
      </section>

      {/* Logos */}
      <section className="bg-white py-2 md:py-5 px-6 text-center">
        <p className="text-gray-500 mb-1 md:mb-3">Trusted by leading teams across Europe</p>
        <div className="max-w-6xl mx-auto">
          <LogoCarousel logos={globalSettings.partnerLogos || []} />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">{data.featuresTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {data.features && data.features.map((feature: any, index: number) => (
            <div key={index}>
              {feature.image && feature.image.asset && (
                <img src={urlFor(feature.image).width(600).height(400).url()} alt={feature.headline} className="w-full bg-gray-100 mb-4 rounded" />
              )}
              <h4 className="text-lg font-semibold mb-2">{feature.headline}</h4>
              <p>{feature.paragraph}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
            {data.comparisonHeadline}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {data.comparisonTable?.thisToolHeading}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {data.comparisonTable?.competitorHeading}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add optional chaining to safely access rows */}
              {data.comparisonTable?.rows?.map((row: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {row.feature}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.thisTool === true ? (
                      <svg className="w-5 h-5 text-green-500 inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : row.thisTool === false ? (
                      <span className="text-gray-400 inline-block">–</span>
                    ) : (
                      row.thisTool // Fallback for non-boolean, though schema defines boolean
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.competitor === true ? (
                      <svg className="w-5 h-5 text-green-500 inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : row.competitor === false ? (
                      <span className="text-gray-400 inline-block">–</span>
                    ) : (
                      row.competitor // Fallback for non-boolean
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.comparisonTable?.bottomText && ( /* Also added optional chaining here for safety */
          <p className="mt-6 text-center text-gray-700">{data.comparisonTable.bottomText}</p>
        )}
      </section>

      {/* Tool-Specific Content */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="prose prose-lg max-w-none">
          {data.toolSpecificSections && <PortableText value={data.toolSpecificSections} />}
        </div>
      </section>

      {/* EU Benefits */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">{globalSettings.euBenefitsHeadline}</h2>
          <p className="text-lg text-gray-700">{globalSettings.euBenefitsParagraph}</p>
        </div>
        <div>
          {globalSettings.euBenefitsImage && globalSettings.euBenefitsImage.asset && (
            <img src={urlFor(globalSettings.euBenefitsImage).width(600).url()} alt="" className="rounded-xl w-full" />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">{data.ctaHeadline}</h2>
          <p className="text-lg mb-6">{data.ctaSubtext}</p>
          <a href="/signup" className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100">
            {data.ctaButtonLabel}
          </a>
        </section>

        {/* Footer */}
        <footer className="bg-gray-100 text-sm px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              {globalSettings.logo ? (
                <img src={urlFor(globalSettings.logo).width(160).url()} alt="Logo" className="h-10 object-contain" />
            ) : (
              <span className="text-lg font-bold">Letseuro</span>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {globalSettings.footerColumns && globalSettings.footerColumns.map((column: any, i: number) => (
              <div key={i}>
                <h4 className="font-semibold mb-2">{column.title}</h4>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {column.items?.map((item: string, j: number) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

//this is a test - local matches github
