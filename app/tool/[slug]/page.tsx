import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'

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
      title,
      introParagraph,
      description,
      heroImage,
      toolSpecificSections,
      enableGlobalSections,
      ctaLabel,
      features,
      comparisonTable{
        headline,
        rows,
        bottomText
      },
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
      footerColumns
    }
  }`
  return await sanity.fetch(query, { slug })
}

export default async function ToolPage({ params }: any) {
  const { tool: data, globalSettings } = await getData(params.slug)

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
          <a href="#" className="hover:underline">Contact Sales</a>
          <a href="#" className="hover:underline">Sign in</a>
          <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm">
            {data.ctaLabel || 'Get started'}
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
          <p className="text-lg text-gray-700 mb-6">
            {data.introParagraph || `Everything you ever wanted to know about ${data.title}… but analytics never told you.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-center">
              {data.ctaLabel || 'Get started'}
            </a>
            <a href="/demo" className="border border-blue-600 text-blue-600 px-6 py-3 rounded font-semibold text-center">
              Book a demo
            </a>
          </div>
        </div>
        <div>
          {data.heroImage && data.heroImage.asset ? (
            <img src={urlFor(data.heroImage).width(800).url()} alt={data.title} className="rounded-xl w-full" />
          ) : (
            <div className="bg-gray-100 rounded-xl aspect-[16/10] flex items-center justify-center text-gray-400">
              [Hero image]
            </div>
          )}
        </div>
      </section>

      {/* Logos */}
      <section className="bg-white py-10 px-6 text-center">
        <p className="text-gray-500 mb-6">Trusted by leading teams across Europe</p>
        <div className="flex justify-center gap-8 flex-wrap opacity-60">
          {globalSettings.partnerLogos && globalSettings.partnerLogos.map((logo: any, i: number) => (
            <img
              key={i}
              src={logo && logo.asset ? urlFor(logo).width(160).url() : ''}
              alt=""
              className="h-[50px] w-auto object-contain"
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Why teams love {data.title}</h2>
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
      {data.comparisonTable && (
        <section className="py-20 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">
            {data.comparisonTable.headline || 'How we compare'}
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left border">Feature</th>
                  <th className="p-4 text-center border">{data.title}</th>
                  <th className="p-4 text-center border">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonTable.rows && data.comparisonTable.rows.map((row: any, index: number) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-4 border">{row.feature}</td>
                    <td className="p-4 text-center border">{row.toolValue}</td>
                    <td className="p-4 text-center border">{row.competitorValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {data.comparisonTable.bottomText && (
            <p className="mt-6 text-center text-gray-700">{data.comparisonTable.bottomText}</p>
          )}
        </section>
      )}

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
        <h2 className="text-3xl font-bold mb-4">Start exploring your visitors' behavior today</h2>
        <p className="text-lg mb-6">Try {data.title} free for 14 days — no credit card required.</p>
        <a href="/signup" className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100">
          {data.ctaLabel || 'Get started'}
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
  )
}
