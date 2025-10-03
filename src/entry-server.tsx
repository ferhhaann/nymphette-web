import './ssr-polyfills'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from "@/components/ui/tooltip"
import { Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Packages from "./pages/Packages"
import GroupTours from "./pages/GroupTours"
import GroupTourDetail from "./pages/GroupTourDetail"
import AboutUs from "./pages/AboutUs"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"
import Asia from "./pages/regions/Asia"
import Europe from "./pages/regions/Europe"
import Africa from "./pages/regions/Africa"
import Americas from "./pages/regions/Americas"
import PacificIslands from "./pages/regions/PacificIslands"
import MiddleEast from "./pages/regions/MiddleEast"
import CountryDetail from "./pages/country/CountryDetail"
import PackageDetail from "./pages/PackageDetail"
import AdminDashboard from "./pages/admin/AdminDashboard"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import TermsOfService from "./pages/TermsOfService"
import CookiePolicy from "./pages/CookiePolicy"
import ScrollToTop from "@/components/ScrollToTop"

const AppRoutes = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/group-tours" element={<GroupTours />} />
      <Route path="/group-tours/:tourId" element={<GroupTourDetail />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/package/:packageId" element={<PackageDetail />} />
      <Route path="/regions/:region/country/:country" element={<CountryDetail />} />
      <Route path="/regions/asia" element={<Asia />} />
      <Route path="/regions/europe" element={<Europe />} />
      <Route path="/regions/africa" element={<Africa />} />
      <Route path="/regions/americas" element={<Americas />} />
      <Route path="/regions/pacific-islands" element={<PacificIslands />} />
      <Route path="/regions/middle-east" element={<MiddleEast />} />
      <Route path="/packages/region/asia" element={<Asia />} />
      <Route path="/packages/region/europe" element={<Europe />} />
      <Route path="/packages/region/africa" element={<Africa />} />
      <Route path="/packages/region/americas" element={<Americas />} />
      <Route path="/packages/region/pacific-islands" element={<PacificIslands />} />
      <Route path="/packages/region/middle-east" element={<MiddleEast />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </>
)

export function render(url: string, context: any = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false, // Disable retries during SSR
      },
    },
  })

  const helmetContext = {}

  const html = renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <StaticRouter location={url}>
              <AppRoutes />
            </StaticRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  )

  return { html, context: helmetContext, queryClient }
}