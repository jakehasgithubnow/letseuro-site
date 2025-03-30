import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { createClient } from 'next-sanity'

const config = {
  projectId: 'kabpbxao', // ← replace with your actual project ID
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
  const query = `*[_type == "toolPage" && slug.current == $slug][0]{
    title,
    description,
    heroImage,
    toolSpecificSections,
    enableGlobalSections,
    "testimonials": *[_type == "testimonial"]{quote, author},
    "faqs": *[_type == "faq"]{question, answer},
    "cta": *[_type == "ctaBlock"][0]
  }`

  return await sanity.fetch(query, { slug })
}

export default async function ToolPage({ params }: any) {
  const data = await getData(params.slug)

  return (
    <>
      {/* Sticky nav */}
      <header className="w-full border-b py-4 px-6 flex items-center justify-between bg-white text-black sticky top-0 z-50">
        <div className="text-lg font-bold">Letseuro</div>
        <nav className="flex gap-6 text-sm items-center">
          <a href="#" className="hover:underline">Contact Sales</a>
          <a href="#" className="hover:underline">Sign in</a>
          <a
            href="#"
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 text-sm"
          >
            Get started
          </a>
        </nav>
      </header>

      {/* Page content */}
      <main className="bg-white text-black px-6 py-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.title}</h1>
            <h3 className="text-xl font-medium text-gray-700 mb-6">
              Everything you ever wanted to know about {data.title.toLowerCase()}… but analytics never told you.
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://letseuro.com/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded text-center font-semibold hover:bg-blue-700"
              >
                Get started
              </a>
              <a
                href="https://letseuro.com/demo"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded text-center font-semibold hover:bg-blue-50"
              >
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
              <div className="bg-gray-100 rounded-xl aspect-[16/10] flex items-center justify-center text-gray-400">
                [Illustration or Screenshot]
              </div>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="h-16" />

        {/* Tool-specific content */}
        <div className="prose prose-lg max-w-none">
          <PortableText value={data.toolSpecificSections} />
        </div>

        {/* Testimonials */}
        {data.enableGlobalSections?.showTestimonials && (
          <section className="mt-20">
            <h2 className="text-2xl font-semibold mb-6">Testimonials</h2>
            <div className="space-y-4">
              {data.testimonials.map((t: any, i: number) => (
                <blockquote key={i} className="border-l-4 pl-4 italic text-gray-700">
                  <p>“{t.quote}”</p>
                  <footer className="text-sm mt-1 text-gray-500">— {t.author}</footer>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {data.enableGlobalSections?.showFAQs && (
          <section className="mt-20">
            <h2 className="text-2xl font-semibold mb-6">FAQs</h2>
            <div className="space-y-6">
              {data.faqs.map((f: any, i: number) => (
                <div key={i}>
                  <h3 className="font-semibold">{f.question}</h3>
                  <p>{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        {data.enableGlobalSections?.showCTA && data.cta && (
          <section className="mt-20 bg-blue-100 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-4">{data.cta.heading}</h3>
            <a
              href={data.cta.buttonUrl}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              {data.cta.buttonText}
            </a>
          </section>
        )}
      </main>
    </>
  )
}