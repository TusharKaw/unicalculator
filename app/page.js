import Header from "./components/Header"
import ScientificCalculator from "./components/ScientificCalculator"
import SearchSection from "./components/SearchSection"
import CategoriesSection from "./components/CategoriesSection"
import AdBanner from "./components/AdBanner"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Ad Banner Top */}
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Calculator */}
          <div className="flex-1 flex justify-center">
            <ScientificCalculator />
          </div>

          {/* Search Section */}
          <div className="lg:w-80">
            <SearchSection />

            {/* Side Ad Banner */}
            <div className="mt-6">
              <AdBanner position="side" />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-12">
          <CategoriesSection />
        </div>

        {/* Bottom Ad Banner */}
        <div className="mt-8">
          <AdBanner position="bottom" />
        </div>

        {/* All Calculators Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
            All Calculators ▶
          </button>
        </div>
      </div>
    </div>
  )
}
