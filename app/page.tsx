import { sanity } from '@/lib/sanity'
import Link from 'next/link'

async function getData() {
  const query = `*[_type == "homePage"][0]{
    heroTitle,
    heroSubtitle,
    featuredTools[]->{
      title,
      slug,
      description
    }
  }`
  return await sanity.fetch(query)
}

export default async function HomePage() {
  const data = await getData()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{data.heroTitle}</h1>
      <p className="mb-8">{data.heroSubtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.featuredTools?.map((tool: any) => (
          <Link key={tool.slug.current} href={`/tool/${tool.slug.current}`} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{tool.title}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

//content is pulled from github
