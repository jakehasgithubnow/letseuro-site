import { sanity } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'

type Params = {
  slug: string
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

// ✅ FIX HERE: properly type the component props
export default async function ToolPage({ params }: { params: Params }) {
  const data = await getData(params.slug)

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <p>{data.description}</p>

      <PortableText value={data.toolSpecificSections} />

      {data.enableGlobalSections?.showTestimonials && (
        <>
          <h2 className="text-2xl mt-8">Testimonials</h2>
          {data.testimonials.map((t: any, i: number) => (
            <blockquote key={i} className="border-l-4 pl-4 my-4">
              <p>“{t.quote}”</p>
              <footer>— {t.author}</footer>
            </blockquote>
          ))}
        </>
      )}

      {data.enableGlobalSections?.showFAQs && (
        <>
          <h2 className="text-2xl mt-8">FAQs</h2>
          {data.faqs.map((f: any, i: number) => (
            <div key={i} className="mb-2">
              <strong>{f.question}</strong>
              <p>{f.answer}</p>
            </div>
          ))}
        </>
      )}

      {data.enableGlobalSections?.showCTA && (
        <div className="bg-blue-100 p-4 mt-8 rounded">
          <h3>{data.cta.heading}</h3>
          <a href={data.cta.buttonUrl} className="text-blue-700 underline">
            {data.cta.buttonText}
          </a>
        </div>
      )}
    </main>
  )
}