import Head from 'next/head'

const TITLE = "polv's JPTools"
const KEYWORDS = 'japanese,polv,wanikani'

const SEO = ({
  frontmatter,
  excerpt = 'Various tools for Japanese language'
}: {
  frontmatter?: {
    title: string
    tag?: string[]
    image?: string
  }
  excerpt?: string
}) => {
  const description = excerpt

  let title = TITLE
  let keywords = KEYWORDS.split(',')
  let image = ''

  if (frontmatter) {
    title = frontmatter.title + ' - ' + title

    keywords.push(...(frontmatter.tag || []))
    keywords = [...new Set(keywords)]

    image = frontmatter.image || ''
  }

  return (
    <Head>
      <title>{title}</title>

      <meta name="keywords" content={keywords.join(',')} />

      <meta key="description" name="description" content={description} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta
        key="twitter:description"
        property="twitter:description"
        content={description}
      />

      {image ? (
        <>
          <meta key="og:image" property="og:image" content={image} />
          <meta key="twitter:image" property="twitter:image" content={image} />
        </>
      ) : null}
    </Head>
  )
}

export default SEO
