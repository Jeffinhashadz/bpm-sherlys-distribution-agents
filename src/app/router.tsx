import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteFooter } from '../components/layout/SiteFooter'
import { SiteHeader } from '../components/layout/SiteHeader'
import { ArchitecturePage } from '../pages/ArchitecturePage'
import { GapsPage } from '../pages/GapsPage'
import { HomePage } from '../pages/HomePage'
import { ModuleDetailPage } from '../pages/ModuleDetailPage'
import { ModulesPage } from '../pages/ModulesPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ProcessMapPage } from '../pages/ProcessMapPage'
import { RoadmapPage } from '../pages/RoadmapPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper text-ink">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gaps" element={<GapsPage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/modules/:slug" element={<ModuleDetailPage />} />
            <Route path="/process-map" element={<ProcessMapPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <SiteFooter />
      </div>
    </BrowserRouter>
  )
}
