"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function BodyFatCalculator() {
  const [method, setMethod] = useState("navy")
  const [gender, setGender] = useState("male")
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [neck, setNeck] = useState("")
  const [waist, setWaist] = useState("")
  const [hip, setHip] = useState("")
  const [unit, setUnit] = useState("metric")
  const [result, setResult] = useState(null)

  const calculateBodyFat = () => {
    let heightInCm, weightInKg, neckInCm, waistInCm, hipInCm
    
    if (unit === "metric") {
      heightInCm = parseFloat(height)
      weightInKg = parseFloat(weight)
      neckInCm = parseFloat(neck)
      waistInCm = parseFloat(waist)
      hipInCm = parseFloat(hip || 0)
    } else {
      heightInCm = parseFloat(height) * 2.54
      weightInKg = parseFloat(weight) * 0.453592
      neckInCm = parseFloat(neck) * 2.54
      waistInCm = parseFloat(waist) * 2.54
      hipInCm = parseFloat(hip || 0) * 2.54
    }

    let bodyFatPercentage = 0

    if (method === "navy") {
      // U.S. Navy Method
      if (gender === "male") {
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistInCm - neckInCm) + 0.15456 * Math.log10(heightInCm)) - 450
      } else {
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistInCm + hipInCm - neckInCm) + 0.22100 * Math.log10(heightInCm)) - 450
      }
    } else if (method === "ymca") {
      // YMCA Method (simplified)
      const bmi = weightInKg / Math.pow(heightInCm / 100, 2)
      const ageNum = parseFloat(age)
      
      if (gender === "male") {
        bodyFatPercentage = 1.61 * bmi + 0.13 * ageNum - 12.1
      } else {
        bodyFatPercentage = 1.48 * bmi + 0.16 * ageNum - 7
      }
    }

    // Determine category
    let category = ""
    if (gender === "male") {
      if (bodyFatPercentage < 6) category = "Essential Fat"
      else if (bodyFatPercentage < 14) category = "Athletes"
      else if (bodyFatPercentage < 18) category = "Fitness"
      else if (bodyFatPercentage < 25) category = "Average"
      else category = "Obese"
    } else {
      if (bodyFatPercentage < 14) category = "Essential Fat"
      else if (bodyFatPercentage < 21) category = "Athletes"
      else if (bodyFatPercentage < 25) category = "Fitness"
      else if (bodyFatPercentage < 32) category = "Average"
      else category = "Obese"
    }

    const fatMass = (bodyFatPercentage / 100) * weightInKg
    const leanMass = weightInKg - fatMass

    setResult({
      bodyFatPercentage: Math.max(0, bodyFatPercentage).toFixed(1),
      category,
      fatMass: fatMass.toFixed(1),
      leanMass: leanMass.toFixed(1)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Body Fat Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Calculation Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="navy">U.S. Navy Method</option>
                  <option value="ymca">YMCA Method</option>
                </select>
              </div>

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

              {method === "ymca" && (
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
              )}

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
                <label className="block text-sm font-medium mb-2">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder={`Enter weight in ${unit === "metric" ? "kg" : "lbs"}`}
                />
              </div>

              {method === "navy" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Neck ({unit === "metric" ? "cm" : "inches"})</label>
                    <input
                      type="number"
                      value={neck}
                      onChange={(e) => setNeck(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder={`Enter neck circumference`}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Waist ({unit === "metric" ? "cm" : "inches"})</label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder={`Enter waist circumference`}
                    />
                  </div>

                  {gender === "female" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Hip ({unit === "metric" ? "cm" : "inches"})</label>
                      <input
                        type="number"
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder={`Enter hip circumference`}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={calculateBodyFat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Body Fat
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Results:</h3>
                <div className="space-y-2">
                  <p className="text-xl">
                    Body Fat Percentage: <span className="font-bold text-blue-600">{result.bodyFatPercentage}%</span>
                  </p>
                  <p>
                    Category: <span className="font-bold">{result.category}</span>
                  </p>
                  <p>
                    Fat Mass: <span className="font-bold">{result.fatMass} {unit === "metric" ? "kg" : "lbs"}</span>
                  </p>
                  <p>
                    Lean Mass: <span className="font-bold">{result.leanMass} {unit === "metric" ? "kg" : "lbs"}</span>
                  </p>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Note:</strong> This is an estimate. For accurate body fat measurement, consider professional testing methods like DEXA scan or hydrostatic weighing.</p>
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