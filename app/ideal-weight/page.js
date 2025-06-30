"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [unit, setUnit] = useState("metric")
  const [frame, setFrame] = useState("medium")
  const [result, setResult] = useState(null)

  const calculateIdealWeight = () => {
    let heightInCm
    
    if (unit === "metric") {
      heightInCm = parseFloat(height)
    } else {
      heightInCm = parseFloat(height) * 2.54
    }

    const ageNum = parseFloat(age)
    
    // Different formulas for ideal weight calculation
    const results = {}
    
    // Robinson Formula (1983)
    if (gender === "male") {
      results.robinson = heightInCm > 152.4 ? 52 + 1.9 * ((heightInCm - 152.4) / 2.54) : 52
    } else {
      results.robinson = heightInCm > 152.4 ? 49 + 1.7 * ((heightInCm - 152.4) / 2.54) : 49
    }
    
    // Miller Formula (1983)
    if (gender === "male") {
      results.miller = heightInCm > 152.4 ? 56.2 + 1.41 * ((heightInCm - 152.4) / 2.54) : 56.2
    } else {
      results.miller = heightInCm > 152.4 ? 53.1 + 1.36 * ((heightInCm - 152.4) / 2.54) : 53.1
    }
    
    // Devine Formula (1974)
    if (gender === "male") {
      results.devine = heightInCm > 152.4 ? 50 + 2.3 * ((heightInCm - 152.4) / 2.54) : 50
    } else {
      results.devine = heightInCm > 152.4 ? 45.5 + 2.3 * ((heightInCm - 152.4) / 2.54) : 45.5
    }
    
    // Hamwi Formula (1964)
    if (gender === "male") {
      results.hamwi = heightInCm > 152.4 ? 48 + 2.7 * ((heightInCm - 152.4) / 2.54) : 48
    } else {
      results.hamwi = heightInCm > 152.4 ? 45.5 + 2.2 * ((heightInCm - 152.4) / 2.54) : 45.5
    }
    
    // Healthy BMI Range (18.5 - 24.9)
    const heightInM = heightInCm / 100
    const minHealthyWeight = 18.5 * (heightInM * heightInM)
    const maxHealthyWeight = 24.9 * (heightInM * heightInM)
    
    // Adjust for frame size
    const frameAdjustment = {
      small: 0.9,
      medium: 1.0,
      large: 1.1
    }
    
    const adjustment = frameAdjustment[frame]
    
    // Convert to desired unit
    const convertWeight = (weightKg) => {
      if (unit === "metric") {
        return weightKg
      } else {
        return weightKg * 2.20462 // Convert to pounds
      }
    }
    
    // Calculate average and apply frame adjustment
    const weights = Object.values(results)
    const averageWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length
    const adjustedWeight = averageWeight * adjustment
    
    setResult({
      robinson: convertWeight(results.robinson * adjustment).toFixed(1),
      miller: convertWeight(results.miller * adjustment).toFixed(1),
      devine: convertWeight(results.devine * adjustment).toFixed(1),
      hamwi: convertWeight(results.hamwi * adjustment).toFixed(1),
      average: convertWeight(adjustedWeight).toFixed(1),
      healthyRange: {
        min: convertWeight(minHealthyWeight).toFixed(1),
        max: convertWeight(maxHealthyWeight).toFixed(1)
      },
      unit: unit === "metric" ? "kg" : "lbs",
      heightDisplay: unit === "metric" ? `${height} cm` : `${height} inches`,
      gender: gender,
      frame: frame,
      age: ageNum
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Ideal Weight Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Unit System</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="metric">Metric (cm, kg)</option>
                  <option value="imperial">Imperial (inches, lbs)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Height ({unit === "metric" ? "cm" : "inches"})</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder={`Enter height in ${unit === "metric" ? "cm" : "inches"}`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Age (years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter your age"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Body Frame Size</label>
              <select
                value={frame}
                onChange={(e) => setFrame(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="small">Small Frame</option>
                <option value="medium">Medium Frame</option>
                <option value="large">Large Frame</option>
              </select>
              <p className="text-xs text-gray-600 mt-1">
                Frame size affects ideal weight. Small frame: -10%, Large frame: +10%
              </p>
            </div>

            <button
              onClick={calculateIdealWeight}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Ideal Weight
            </button>

            {result && (
              <div className="mt-6 space-y-4">
                {/* Summary */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Your Information</h3>
                  <div className="space-y-1 text-sm">
                    <p>Height: <span className="font-bold">{result.heightDisplay}</span></p>
                    <p>Age: <span className="font-bold">{result.age} years</span></p>
                    <p>Gender: <span className="font-bold capitalize">{result.gender}</span></p>
                    <p>Frame Size: <span className="font-bold capitalize">{result.frame}</span></p>
                  </div>
                </div>

                {/* Recommended Weight */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Recommended Ideal Weight</h3>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    {result.average} {result.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    Based on multiple medical formulas adjusted for your frame size
                  </p>
                </div>

                {/* Healthy Weight Range */}
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Healthy Weight Range (BMI 18.5-24.9)</h3>
                  <p className="text-lg">
                    <span className="font-bold text-yellow-700">
                      {result.healthyRange.min} - {result.healthyRange.max} {result.unit}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Weight range for a healthy BMI based on your height
                  </p>
                </div>

                {/* Different Formula Results */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Results by Formula</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Robinson Formula (1983):</span>
                      <span className="font-bold">{result.robinson} {result.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Miller Formula (1983):</span>
                      <span className="font-bold">{result.miller} {result.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Devine Formula (1974):</span>
                      <span className="font-bold">{result.devine} {result.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hamwi Formula (1964):</span>
                      <span className="font-bold">{result.hamwi} {result.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Important Note */}
                <div className="p-4 bg-blue-100 rounded-lg text-sm">
                  <h4 className="font-semibold mb-2">Important Notes:</h4>
                  <ul className="space-y-1 text-gray-700">
                    <li>• These are estimates based on mathematical formulas</li>
                    <li>• Individual factors like muscle mass, bone density, and health conditions matter</li>
                    <li>• Consult with healthcare professionals for personalized advice</li>
                    <li>• Focus on overall health rather than just weight numbers</li>
                    <li>• Regular exercise and balanced nutrition are key to health</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}