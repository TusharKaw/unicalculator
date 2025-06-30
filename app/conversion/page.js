"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function ConversionCalculator() {
  const [category, setCategory] = useState("length")
  const [fromUnit, setFromUnit] = useState("")
  const [toUnit, setToUnit] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [result, setResult] = useState(null)

  const conversions = {
    length: {
      name: "Length",
      units: {
        mm: { name: "Millimeters", factor: 1 },
        cm: { name: "Centimeters", factor: 10 },
        m: { name: "Meters", factor: 1000 },
        km: { name: "Kilometers", factor: 1000000 },
        in: { name: "Inches", factor: 25.4 },
        ft: { name: "Feet", factor: 304.8 },
        yd: { name: "Yards", factor: 914.4 },
        mi: { name: "Miles", factor: 1609344 }
      }
    },
    weight: {
      name: "Weight",
      units: {
        mg: { name: "Milligrams", factor: 1 },
        g: { name: "Grams", factor: 1000 },
        kg: { name: "Kilograms", factor: 1000000 },
        oz: { name: "Ounces", factor: 28349.5 },
        lb: { name: "Pounds", factor: 453592 },
        ton: { name: "Tons (metric)", factor: 1000000000 }
      }
    },
    temperature: {
      name: "Temperature",
      units: {
        c: { name: "Celsius" },
        f: { name: "Fahrenheit" },
        k: { name: "Kelvin" },
        r: { name: "Rankine" }
      }
    },
    area: {
      name: "Area",
      units: {
        sqmm: { name: "Square Millimeters", factor: 1 },
        sqcm: { name: "Square Centimeters", factor: 100 },
        sqm: { name: "Square Meters", factor: 1000000 },
        hectare: { name: "Hectares", factor: 10000000000 },
        sqin: { name: "Square Inches", factor: 645.16 },
        sqft: { name: "Square Feet", factor: 92903 },
        sqyd: { name: "Square Yards", factor: 836127 },
        acre: { name: "Acres", factor: 4046856422.4 }
      }
    },
    volume: {
      name: "Volume",
      units: {
        ml: { name: "Milliliters", factor: 1 },
        l: { name: "Liters", factor: 1000 },
        gal: { name: "Gallons (US)", factor: 3785.41 },
        qt: { name: "Quarts (US)", factor: 946.353 },
        pt: { name: "Pints (US)", factor: 473.176 },
        cup: { name: "Cups (US)", factor: 236.588 },
        floz: { name: "Fluid Ounces (US)", factor: 29.5735 },
        tbsp: { name: "Tablespoons", factor: 14.7868 },
        tsp: { name: "Teaspoons", factor: 4.92892 }
      }
    },
    speed: {
      name: "Speed",
      units: {
        mps: { name: "Meters per Second", factor: 1 },
        kph: { name: "Kilometers per Hour", factor: 0.277778 },
        mph: { name: "Miles per Hour", factor: 0.44704 },
        fps: { name: "Feet per Second", factor: 0.3048 },
        knot: { name: "Knots", factor: 0.514444 }
      }
    }
  }

  const convertTemperature = (value, from, to) => {
    // Convert to Celsius first
    let celsius
    switch (from) {
      case "c": celsius = value; break
      case "f": celsius = (value - 32) * 5/9; break
      case "k": celsius = value - 273.15; break
      case "r": celsius = (value - 491.67) * 5/9; break
      default: return 0
    }

    // Convert from Celsius to target
    switch (to) {
      case "c": return celsius
      case "f": return celsius * 9/5 + 32
      case "k": return celsius + 273.15
      case "r": return celsius * 9/5 + 491.67
      default: return 0
    }
  }

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) {
      setResult({ error: "Please enter a valid number" })
      return
    }

    if (!fromUnit || !toUnit) {
      setResult({ error: "Please select both units" })
      return
    }

    let convertedValue

    if (category === "temperature") {
      convertedValue = convertTemperature(value, fromUnit, toUnit)
    } else {
      const fromFactor = conversions[category].units[fromUnit].factor
      const toFactor = conversions[category].units[toUnit].factor
      convertedValue = (value * fromFactor) / toFactor
    }

    setResult({
      original: {
        value,
        unit: conversions[category].units[fromUnit].name
      },
      converted: {
        value: convertedValue,
        unit: conversions[category].units[toUnit].name
      },
      formatted: convertedValue.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6
      })
    })
  }

  const swapUnits = () => {
    const tempFrom = fromUnit
    setFromUnit(toUnit)
    setToUnit(tempFrom)
    
    if (result && !result.error) {
      setInputValue(result.formatted)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Unit Conversion Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Conversion Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setFromUnit("")
                  setToUnit("")
                  setResult(null)
                }}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                {Object.entries(conversions).map(([key, cat]) => (
                  <option key={key} value={key}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Input Value */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Value to Convert</label>
              <input
                type="number"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-lg"
                placeholder="Enter value to convert"
              />
            </div>

            {/* Unit Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">From</label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select unit</option>
                  {Object.entries(conversions[category].units).map(([key, unit]) => (
                    <option key={key} value={key}>{unit.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-center">
                <button
                  onClick={swapUnits}
                  className="bg-gray-200 hover:bg-gray-300 p-2 rounded transition-colors"
                  title="Swap units"
                >
                  ⇄
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To</label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select unit</option>
                  {Object.entries(conversions[category].units).map(([key, unit]) => (
                    <option key={key} value={key}>{unit.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={convert}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Convert
            </button>

            {/* Results */}
            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                {result.error ? (
                  <p className="text-red-600 font-bold">{result.error}</p>
                ) : (
                  <div className="text-center">
                    <p className="text-lg mb-2">
                      <span className="font-bold">{result.original.value.toLocaleString()}</span> {result.original.unit}
                    </p>
                    <p className="text-2xl text-blue-600 font-bold mb-2">=</p>
                    <p className="text-2xl font-bold text-green-600">
                      {result.formatted} {result.converted.unit}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Conversions */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold mb-3">Common {conversions[category].name} Conversions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {category === "length" && (
                  <>
                    <p>1 meter = 3.28084 feet</p>
                    <p>1 inch = 2.54 centimeters</p>
                    <p>1 mile = 1.60934 kilometers</p>
                    <p>1 yard = 0.9144 meters</p>
                  </>
                )}
                {category === "weight" && (
                  <>
                    <p>1 kilogram = 2.20462 pounds</p>
                    <p>1 pound = 16 ounces</p>
                    <p>1 ounce = 28.3495 grams</p>
                    <p>1 ton = 1000 kilograms</p>
                  </>
                )}
                {category === "temperature" && (
                  <>
                    <p>Water freezes: 0°C = 32°F = 273.15K</p>
                    <p>Water boils: 100°C = 212°F = 373.15K</p>
                    <p>Room temperature: ~20°C = ~68°F</p>
                    <p>Body temperature: 37°C = 98.6°F</p>
                  </>
                )}
                {category === "volume" && (
                  <>
                    <p>1 gallon = 3.78541 liters</p>
                    <p>1 liter = 1000 milliliters</p>
                    <p>1 cup = 236.588 milliliters</p>
                    <p>1 tablespoon = 3 teaspoons</p>
                  </>
                )}
                {category === "area" && (
                  <>
                    <p>1 square meter = 10.7639 square feet</p>
                    <p>1 hectare = 10,000 square meters</p>
                    <p>1 acre = 4,047 square meters</p>
                    <p>1 square foot = 144 square inches</p>
                  </>
                )}
                {category === "speed" && (
                  <>
                    <p>1 m/s = 3.6 km/h = 2.237 mph</p>
                    <p>1 mph = 1.609 km/h</p>
                    <p>1 knot = 1.852 km/h</p>
                    <p>Speed of light: 299,792,458 m/s</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}