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
      description,
      heroImage,
      toolSpecificSections,
      enableGlobalSections,
      "testimonials": *[_type == "testimonial"]{quote, author},
      "faqs": *[_type == "faq"]{question, answer},
      "cta": *[_type == "ctaBlock"][0]
    },
    "logo": *[_type == "siteSettings"][0].logo{
      asset->{
        _id,
        url
      }
    }
  }`
  return await sanity.fetch(query, { slug })
}

export default async function ToolPage({ params }: any) {
  const { tool: data, logo } = await getData(params.slug)

  return (
    <div className="bg-white text-black">
      {/* Nav */}
      <header className="w-full border-b py-4 px-6 flex items-center justify-between sticky top-0 z-50 bg-white">
        <div className="text-lg font-bold flex items-center gap-2">
          {logo?.asset?._ref ? (
            <img
              src={urlFor(logo).height(40).url()}
              alt="Letseuro"
              className="h-10 object-contain"
            />
          ) : (
            <span className="font-bold text-lg">Letseuro</span>
          )}
        </div>
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

      {/* Hero Section */}
      <main className="px-6 py-24 max-w-7xl mx-auto">
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
      </main>

      {/* Features Section (hardcoded) */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Why teams love {data.title}</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h4 className="font-bold mb-2">Instant insights</h4>
              <p>See real-time user behavior to make smarter decisions, faster.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Effortless setup</h4>
              <p>Drop in a single line of code and start learning within minutes.</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Privacy-first</h4>
              <p>Fully GDPR-compliant with built-in anonymization features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tool-specific content */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="prose prose-lg max-w-none">
          <PortableText value={data.toolSpecificSections} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-blue-600 text-white text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">Start exploring your visitors' behavior today</h2>
        <p className="mb-6 text-lg">Try {data.title} free for 14 days — no credit card required.</p>
        <a
          href="https://letseuro.com/signup"
          className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
        >
          Get started
        </a>
      </section>
    </div>
  )
}