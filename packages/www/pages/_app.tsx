import '@/styles/global.scss'

import SEO from '@/components/SEO'
import App from 'next/app'
import Head from 'next/head'

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>

        <SEO />

        <Component {...pageProps} />
      </>
    )
  }
}
