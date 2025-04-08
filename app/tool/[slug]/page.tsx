// test- Does this line appear in vscode

import React from 'react'; // Import React
import { sanity } from '@/lib/sanity'
import { PortableText, PortableTextComponents } from '@portabletext/react' // Import PortableTextComponents type
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
      // heroTitle, // Moved to globalSettings
      heroParagraph,
      heroImage,
      // heroCtaPrimary, // Moved to globalSettings
      // heroCtaSecondary, // Moved to globalSettings
      // comparisonHeadline, // Moved to globalSettings
      comparisonTable{
        headline, // Keep tool-specific headline if needed, or remove if fully global
        rows,
        // bottomText, // Moved to globalSettings
        competitorHeading,
        thisToolHeading
      },
      demoPitch {
        // headline, // Moved to globalSettings
        // subtext, // Moved to globalSettings
        image1,
        // image2 // Moved to globalSettings
      },
      toolSpecificSections,
      // ctaHeadline, // Moved to globalSettings
      // ctaSubtext, // Moved to globalSettings
      // ctaButtonLabel, // Moved to globalSettings
      "testimonials": *[_type == "testimonial"]{quote, author}, // Assuming these remain tool-specific or fetched separately
      "faqs": *[_type == "faq"]{question, answer}, // Assuming these remain tool-specific or fetched separately
      "cta": *[_type == "ctaBlock"][0] // Assuming this remains tool-specific or fetched separately
    },
    "globalSettings": *[_type == "siteSettings"][0]{
      logo,
      partnerLogos,
      euBenefitsHeadline,
      euBenefitsParagraph,
      euBenefitsImage,
      featuresTitle, // Assuming these are global now
      featuresSubtitle, // Assuming these are global now
      features, // Assuming these are global now
      footerColumns,
      "partnerLogoUrls": partnerLogos.asset->url,
      // Added global fields
      heroTitle,
      heroCtaPrimary,
      heroCtaSecondary,
      comparisonHeadline,
      comparisonTableBottomText,
      demoPitchImage2,
      demoPitchHeadline,
      demoPitchSubtext,
      ctaFooterHeadline,
      ctaFooterSubtext,
      ctaFooterButtonLabel
    }
  }`
  console.log('Fetching data from Sanity...');
  try {
    // Fetch data using default caching (suitable for SSG)
    const data = await sanity.fetch(query, { slug });

    // Log the fetched data structure within getData before returning
    console.log('getData fetched data:', JSON.stringify(data, null, 2));

    return {
      tool: data.tool,
      globalSettings: data.globalSettings,
    };
  } catch (error) {
    console.error('Error fetching data from Sanity:', error);
    return { tool: null, globalSettings: null };
  }
}

// Helper function to replace placeholders
function replacePlaceholders(text: string | undefined | null, thisTool?: string, competitorTool?: string): string {
  if (!text) return '';
  let result = text;
  if (thisTool) {
    result = result.replace(/%THIS_TOOL%/g, thisTool); // Use regex with 'g' flag for global replacement
  }
  if (competitorTool) {
    result = result.replace(/%COMPETITOR_TOOL%/g, competitorTool);
  }
  return result;
}

// --- NEW: Custom Portable Text Component for Block Replacement ---
interface PortableTextBlockProps {
  children: React.ReactNode;
  thisTool?: string;
  competitorTool?: string; // Add competitor tool if needed in Portable Text too
}

const PortableTextBlockWithReplacement: React.FC<PortableTextBlockProps> = ({ children, thisTool, competitorTool }) => {
  // Recursively process children to find and replace text nodes
  const processNode = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      return replacePlaceholders(node, thisTool, competitorTool);
    }
    if (React.isValidElement(node) && node.props.children) {
      // Clone element to modify its children
      return React.cloneElement(node, {
        ...node.props,
        children: React.Children.map(node.props.children, processNode),
      });
    }
    // Handle arrays of children (like in paragraphs)
    if (Array.isArray(node)) {
        return node.map(processNode);
    }
    return node; // Return other nodes (like marks, spans without text) as is
  };

  // Apply processing to the top-level children
  const processedChildren = React.Children.map(children, processNode);

  // Render the block with processed children (e.g., inside a paragraph)
  // Adjust the wrapper element (e.g., p, h1, h2) based on the original block style if needed,
  // but for a generic handler, <p> is often a safe default or just render children directly.
  // For simplicity here, we'll just render the processed children.
  // A more robust solution might inspect the original block's style.
  return <>{processedChildren}</>;
};
// --- END NEW COMPONENT ---


// Helper function to apply replacement wrapper consistently for blocks
const applyBlockReplacement = (BlockComponent: React.ElementType, children: React.ReactNode, thisTool: string, competitorTool: string) => (
  <BlockComponent>
    <PortableTextBlockWithReplacement thisTool={thisTool} competitorTool={competitorTool}>
      {children}
    </PortableTextBlockWithReplacement>
  </BlockComponent>
);

// Helper function for list items
const applyListItemReplacement = (children: React.ReactNode, thisTool: string, competitorTool: string) => (
   <li>
      <PortableTextBlockWithReplacement thisTool={thisTool} competitorTool={competitorTool}>
        {children}
      </PortableTextBlockWithReplacement>
    </li>
);


export default async function ToolPage({ params }: { params: { slug: string } }) {
  const { tool: data, globalSettings } = await getData(params.slug);

  if (!data || !globalSettings) {
    return <div>Error: Could not load data for this page.</div>;
  }

  // Get tool names for replacement, ensuring they are always strings
  const thisTool = data.comparisonTable?.thisToolHeading || ''; // Fallback to empty string
  const competitorTool = data.comparisonTable?.competitorHeading || ''; // Fallback to empty string

  // Apply replacements using globalSettings where applicable
  const finalHeroTitle = replacePlaceholders(globalSettings.heroTitle, thisTool, competitorTool); // Use globalSettings
  const finalHeroParagraph = replacePlaceholders(data.heroParagraph, thisTool, competitorTool); // Keep tool data
  const finalComparisonHeadline = replacePlaceholders(globalSettings.comparisonHeadline, thisTool, competitorTool); // Use globalSettings
  const finalComparisonBottomText = replacePlaceholders(globalSettings.comparisonTableBottomText, thisTool, competitorTool); // Use globalSettings
  const finalCtaHeadline = replacePlaceholders(globalSettings.ctaFooterHeadline, thisTool, competitorTool); // Use globalSettings
  const finalCtaSubtext = replacePlaceholders(globalSettings.ctaFooterSubtext, thisTool, competitorTool); // Use globalSettings
  // Demo Pitch replacements (use globalSettings)
  const finalDemoPitchHeadline = replacePlaceholders(globalSettings.demoPitchHeadline, thisTool, competitorTool); // Use globalSettings
  const finalDemoPitchSubtext = replacePlaceholders(globalSettings.demoPitchSubtext, thisTool, competitorTool); // Use globalSettings


  // --- NEW: Define Portable Text components ---
  const portableTextComponents: PortableTextComponents = {
    block: {
      // Use the external helper for standard blocks
      normal: ({ children }) => applyBlockReplacement('p', children, thisTool, competitorTool),
      h1: ({ children }) => applyBlockReplacement('h1', children, thisTool, competitorTool),
      h2: ({ children }) => applyBlockReplacement('h2', children, thisTool, competitorTool),
      h3: ({ children }) => applyBlockReplacement('h3', children, thisTool, competitorTool),
      h4: ({ children }) => applyBlockReplacement('h4', children, thisTool, competitorTool),
      // Add other common block types if needed
      // blockquote: ({ children }) => applyBlockReplacement('blockquote', children, thisTool, competitorTool),
    },
    listItem: {
      // Use the external helper for list item types
      bullet: ({ children }) => applyListItemReplacement(children, thisTool, competitorTool),
      number: ({ children }) => applyListItemReplacement(children, thisTool, competitorTool),
    },
    // --- NEW: Explicitly handle marks to catch placeholders within them ---
    marks: {
       link: ({ children, value }) => {
         const href = value?.href || '';
         // Apply replacement specifically to the link text (children)
         const processedChildren = React.Children.map(children, (child) => {
            if (typeof child === 'string') {
              return replacePlaceholders(child, thisTool, competitorTool);
            }
            // Basic recursion for nested elements within link text (e.g., link containing bold text)
            if (React.isValidElement(child) && child.props.children) {
               return React.cloneElement(child, {
                 ...child.props,
                 children: React.Children.map(child.props.children, (innerChild) =>
                   typeof innerChild === 'string' ? replacePlaceholders(innerChild, thisTool, competitorTool) : innerChild
                 ),
               });
            }
            return child;
         });
         // Render the link with processed text
         return <a href={href} target="_blank" rel="noopener noreferrer">{processedChildren}</a>;
       },
       // Use the wrapper component for simple marks like strong/em
       strong: ({ children }) => <strong><PortableTextBlockWithReplacement thisTool={thisTool} competitorTool={competitorTool}>{children}</PortableTextBlockWithReplacement></strong>,
       em: ({ children }) => <em><PortableTextBlockWithReplacement thisTool={thisTool} competitorTool={competitorTool}>{children}</PortableTextBlockWithReplacement></em>,
       // Add other marks like 'underline', 'code' if needed
     }
     // --- END MARK HANDLING ---
  };
  // --- END NEW COMPONENTS DEFINITION ---


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
            {globalSettings.heroCtaPrimary || 'Get started'} {/* Use globalSettings */}
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-4">{finalHeroTitle}</h1>
          <p className="text-lg text-gray-700 mb-6">
            {finalHeroParagraph || `Everything you ever wanted to know about ${finalHeroTitle}… but analytics never told you.`}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/signup" className="bg-blue-600 text-white px-6 py-3 rounded font-semibold text-center">
              {globalSettings.heroCtaPrimary || 'Get started'} {/* Use globalSettings */}
            </a>
            <a href="/demo" className="border border-blue-600 text-blue-600 px-6 py-3 rounded font-semibold text-center">
              {globalSettings.heroCtaSecondary || 'Book a demo'} {/* Use globalSettings */}
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
        <h2 className="text-3xl font-semibold text-center mb-12">{globalSettings.featuresTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Removed console.log from JSX */}
          {globalSettings.features && globalSettings.features.map((feature: any, index: number) => (
            <div key={index}>
              {feature.image && feature.image.asset && (
                <img src={urlFor(feature.image).width(600).height(400).url()} alt={replacePlaceholders(feature.headline, thisTool, competitorTool)} className="w-full bg-gray-100 mb-4 rounded" />
              )}
              <h4 className="text-lg font-semibold mb-2">{replacePlaceholders(feature.headline, thisTool, competitorTool)}</h4>
              <p>{replacePlaceholders(feature.paragraph, thisTool, competitorTool)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-8">
            {finalComparisonHeadline}
        </h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-0 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider break-words">
                  Feature
                </th>
                <th scope="col" className="px-0 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {data.comparisonTable?.thisToolHeading}
                </th>
                <th scope="col" className="px-0 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {data.comparisonTable?.competitorHeading}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add optional chaining to safely access rows */}
              {data.comparisonTable?.rows?.map((row: any, index: number) => (
                <tr key={index}>
                  <td className="px-0 py-4 text-gray-700 break-words">
                    {row.feature}
                  </td>
                  <td className="px-0 py-4 text-center">
                    {row.thisTool === true ? (
                      <svg className="w-5 h-5 text-green-500 inline-block" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : row.thisTool === false ? (
                      <span className="text-gray-400 inline-block">–</span>
                    ) : (
                      row.thisTool // Fallback for non-boolean
                    )}
                  </td>
                  <td className="px-0 py-4 text-center">
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
        {finalComparisonBottomText && (
          <p className="mt-6 text-center text-gray-700">{finalComparisonBottomText}</p>
        )}
      </section>

      {/* Demo Pitch Section - Updated */}
      {/* Demo Pitch Section - Updated */}
      {data.demoPitch?.image1 && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Image 1 (Larger) - Remains from tool data */}
            <div className="md:col-span-2">
              {data.demoPitch.image1?.asset ? (
                <img
                  src={urlFor(data.demoPitch.image1).width(1000).url()}
                  alt="Demo image 1"
                  className="rounded-3xl w-full h-full object-cover aspect-video md:aspect-[16/10]"
                />
              ) : (
                <div className="bg-gray-100 rounded-3xl aspect-video md:aspect-[16/10] flex items-center justify-center text-gray-400 h-full">
                  [Image 1 Placeholder]
                </div>
              )}
            </div>

            {/* Text/CTA */}
            <div className="flex flex-col justify-between">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{globalSettings.demoPitchHeadline}</h3>
                <p className="text-gray-600 mb-4">{globalSettings.demoPitchSubtext}</p>
                <a href="/demo" className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded font-semibold hover:bg-blue-700 text-sm">
                  {globalSettings.heroCtaPrimary || 'Book a demo'}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* End Demo Pitch Section */}

      {/* Tool-Specific Content */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="prose prose-lg max-w-none">
          {/* --- MODIFIED: Pass components prop --- */}
          {data.toolSpecificSections && <PortableText value={data.toolSpecificSections} components={portableTextComponents} />}
          {/* --- END MODIFICATION --- */}
        </div>
      </section>

      {/* EU Benefits */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-4">{replacePlaceholders(globalSettings.euBenefitsHeadline, thisTool, competitorTool)}</h2>
          <p className="text-lg text-gray-700">{replacePlaceholders(globalSettings.euBenefitsParagraph, thisTool, competitorTool)}</p>
        </div>
        <div>
          {globalSettings.euBenefitsImage && globalSettings.euBenefitsImage.asset && (
            <img src={urlFor(globalSettings.euBenefitsImage).width(600).url()} alt="" className="rounded-xl w-full" />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-20 text-center px-6">
        <h2 className="text-3xl font-bold mb-4">{finalCtaHeadline}</h2> {/* Already uses final variable derived from globalSettings */}
          <p className="text-lg mb-6">{finalCtaSubtext}</p> {/* Already uses final variable derived from globalSettings */}
          <a href="/signup" className="inline-block bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100">
            {globalSettings.ctaFooterButtonLabel} {/* Use globalSettings */}
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

//this is a test
