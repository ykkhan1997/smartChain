
import '@/styles/globals.css'
import { Navbar } from '@/Components'
import SmartChainProvider from '@/Context'
export default function App({ Component, pageProps }) {
  return (
    <>
    <Navbar/>
    <SmartChainProvider>
    <Component {...pageProps} />
    </SmartChainProvider>
    </>
  )
}
