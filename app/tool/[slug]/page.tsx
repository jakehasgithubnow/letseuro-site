import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'

type PageProps = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const slugs = await sanity.fetch(`*[_type == "toolPage"]{ slug }`)
  return slugs.map((t: any) => ({ slug: t.slug.current }))
}

async function getData(slug: string) {
  const query = `*[_type == "toolPage" && slug.current == $slug][0]{
    title,
    description,
    toolSpecificSections,
    enableGlobalSections,
    "testimonials": *[_type == "testimonial"]{quote, author},
    "faqs": *[_type == "faq"]{question, answer},
    "cta": *[_type == "ctaBlock"][0]
  }`

  return await sanity.fetch(query, { slug })
}

export default async function ToolPage({ params }: PageProps) {
  const data = await getData(params.slug)

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p className="mb-6">{data.description}</p>

      <PortableText value={data.toolSpecificSections} />

      {data.enableGlobalSections?.showTestimonials && (
        <>
          <h2 className="text-2xl mt-10 mb-4">Testimonials</h2>
          {data.testimonials.map((t: any, i: number) => (
            <blockquote key={i} className="border-l-4 pl-4 italic text-gray-700 mb-4">
              <p>“{t.quote}”</p>
              <footer className="text-sm mt-1">— {t.author}</footer>
            </blockquote>
          ))}
        </>
      )}

      {data.enableGlobalSections?.showFAQs && (
        <>
          <h2 className="text-2xl mt-10 mb-4">FAQs</h2>
          {data.faqs.map((f: any, i: number) => (
            <div key={i} className="mb-4">
              <strong className="block">{f.question}</strong>
              <p>{f.answer}</p>
            </div>
          ))}
        </>
      )}

      {data.enableGlobalSections?.showCTA && data.cta && (
        <div className="bg-blue-100 p-6 mt-10 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">{data.cta.heading}</h3>
          <a
            href={data.cta.buttonUrl}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {data.cta.buttonText}
          </a>
        </div>
      )}
    </main>
  )
}