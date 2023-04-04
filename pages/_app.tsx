// import '../../styles/global.js'
import { Header } from '../components/header'
import { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import React from 'react'



export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider  session={pageProps.session}>

      <Header/>
      
      <Component {...pageProps} />
      
    </SessionProvider>
  )
}
