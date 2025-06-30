"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function BMICalculator() {
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [unit, setUnit] = useState("metric")
  const [result, setResult] = useState(null)

  const calculateBMI = () => {
    let heightInM, weightInKg

    if (unit === "metric") {
      heightInM = Number.parseFloat(height) / 100
      weightInKg = Number.parseFloat(weight)
    } else {
      heightInM = (Number.parseFloat(height) * 2.54) / 100
      weightInKg = Number.parseFloat(weight) * 0.453592
    }

    const bmi = weightInKg / (heightInM * heightInM)
    let category = ""

    if (bmi < 18.5) category = "Underweight"
    else if (bmi < 25) category = "Normal weight"
    else if (bmi < 30) category = "Overweight"
    else category = "Obese"

    setResult({ bmi: bmi.toFixed(1), category })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">BMI Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
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
              <label className="block text-sm font-medium mb-2">Height ({unit === "metric" ? "cm" : "inches"})</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder={`Enter height in ${unit === "metric" ? "cm" : "inches"}`}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder={`Enter weight in ${unit === "metric" ? "kg" : "lbs"}`}
              />
            </div>

            <button
              onClick={calculateBMI}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate BMI
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Result:</h3>
                <p className="text-xl">
                  BMI: <span className="font-bold">{result.bmi}</span>
                </p>
                <p className="text-lg">
                  Category: <span className="font-bold">{result.category}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}
