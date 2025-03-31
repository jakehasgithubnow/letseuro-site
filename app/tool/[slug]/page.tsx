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
      featureSections,
      comparisonTable{
        headline,
        rows,
        bottomText
      },
      footer{
        headline,
        cta->
      },
      "testimonials": *[_type == "testimonial"]{quote, author},
      "faqs": *[_type == "faq"]{question, answer},
      "cta": *[_type == "ctaBlock"][0]
    },
    "siteSettings": *[_type == "siteSettings"][0]{
      logo,
      partnerLogos,
      euBenefitsHeadline,
      euBenefitsParagraph,
      euBenefitsImage,
      footerColumns
    },
    "globalSections": *[_type == "globalSections"][0]{
      logoSliderText,
      logos,
      euBenefits{
        headline,
        paragraph,
        image
      },
      footerColumns
    }
  }`
  return await sanity.fetch(query, { slug })
}

export default async function ToolPage({ params }: any) {
  const { tool: data, siteSettings, globalSections } = await getData(params.slug)

  // Default CTA text if not provided
  const ctaText = data.ctaLabel || 'Get started'

  return (
    <div className="bg-white text-black">
      {/* Header */}
      <header className="w-full border-b px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-50">
        <div className="flex items-center gap-2">
          {siteSettings.logo?.asset ? (
            <img 
              src={urlFor(siteSettings.logo).width(150).url()} 
              alt="Logo" 
              className="h-10 object-contain" 
            />
          ) : (
            <span className="text-lg font-bold">Letseuro</span>
          )}
        </div>
        <nav className="flex gap-6 text-sm items-center">
          <a href="#" className="hover:underline">Contact Sales</a>
          <a href="#" className="hover:underline">Sign in</a>
          <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm">
            {ctaText}
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
          <p className="text-lg text-gray-700 mb-6">
            {data.introParagraph || `Everything you ever wanted to know about ${data.title.toLowerCase()}… but analytics never told you.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-center">
              {ctaText}
            </a>
            <a href="/demo" className="border border-blue-600 text-blue-600 px-6 py-3 rounded font-semibold text-center">
              Book a demo
            </a>
          </div>
        </div>
        <div>
          {data.heroImage?.asset ? (
            <img 
              src={urlFor(data.heroImage).width(800).url()} 
              alt={data.title} 
              className="rounded-xl w-full" 
            />
          ) : (
            <div className="bg-peach-200 rounded-xl aspect-[16/10] flex items-center justify-center text-gray-400">
              [Hero image placeholder]
            </div>
          )}
        </div>
      </section>

      {/* Logos */}
      <section className="bg-white py-10 px-6 text-center border-y">
        <p className="text-gray-500 mb-6">{globalSections?.logoSliderText || 'Trusted by leading teams across Europe'}</p>
        <div className="flex justify-center gap-8 flex-wrap opacity-60">
          {(globalSections?.logos || siteSettings.partnerLogos)?.map((logo: any, i: number) => (
            <div 
              key={i} 
              className="h-12 w-32 bg-peach-100 rounded-md flex items-center justify-center"
            >
              {logo?.asset ? (
                <img
                  src={urlFor(logo).width(160).url()}
                  alt=""
                  className="h-12 object-contain"
                />
              ) : (
                <span className="text-sm text-gray-400">Logo {i+1}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Why teams love {data.title}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {(data.featureSections || []).map((feature: any, index: number) => (
            <div key={index} className="flex flex-col items-start">
              <div className="w-full h-48 bg-peach-100 rounded-3xl mb-4 flex items-center justify-center">
                {feature.image?.asset ? (
                  <img 
                    src={urlFor(feature.image).width(300).height(200).url()} 
                    alt={feature.headline} 
                    className="object-cover rounded-3xl w-full h-full" 
                  />
                ) : (
                  <span className="text-gray-400">Feature {index + 1} image</span>
                )}
              </div>
              <h4 className="text-lg font-semibold mb-2">{feature.headline}</h4>
              <p className="text-gray-700">{feature.paragraph}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
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
                {(data.comparisonTable.rows || []).map((row: any, index: number) => (
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
      {data.toolSpecificSections && (
        <section className="px-6 py-20 max-w-5xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <PortableText value={data.toolSpecificSections} />
          </div>
        </section>
      )}

      {/* EU Benefits */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            {globalSections?.euBenefits?.headline || siteSettings.euBenefitsHeadline || 'European Benefits'}
          </h2>
          <p className="text-lg text-gray-700">
            {globalSections?.euBenefits?.paragraph || siteSettings.euBenefitsParagraph || 'Our solution offers specific benefits for European businesses.'}
          </p>
        </div>
        <div className="bg-peach-100 rounded-3xl overflow-hidden aspect-square">
          {(globalSections?.euBenefits?.image || siteSettings.euBenefitsImage)?.asset ? (
            <img 
              src={urlFor(globalSections?.euBenefits?.image || siteSettings.euBenefitsImage).width(600).url()} 
              alt="EU Benefits" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              [EU benefits image]
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          {data.footer?.headline || 'Start exploring your visitors' behavior today'}
        </h2>
        <p className="text-lg mb-6">Try {data.title} free for 14 days — no credit card required.</p>
        <a 
          href={data.footer?.cta?.link || "/signup"} 
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
        >
          {data.footer?.cta?.text || ctaText}
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-sm px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            {siteSettings.logo?.asset ? (
              <img 
                src={urlFor(siteSettings.logo).width(150).url()} 
                alt="Logo" 
                className="h-10 object-contain" 
              />
            ) : (
              <span className="text-lg font-bold">Letseuro</span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(globalSections?.footerColumns || siteSettings.footerColumns || []).map((column: any, i: number) => (
              <div key={i} className="prose prose-sm text-gray-700">
                {column.title && <h3 className="font-semibold mb-3">{column.title}</h3>}
                {column.items && Array.isArray(column.items) ? (
                  <ul className="space-y-2">
                    {column.items.map((item: string, idx: number) => (
                      <li key={idx}><a href="#" className="hover:underline">{item}</a></li>
                    ))}
                  </ul>
                ) : (
                  <PortableText value={[column]} />
                )}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}