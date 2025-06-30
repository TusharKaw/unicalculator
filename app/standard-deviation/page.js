"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function StandardDeviationCalculator() {
  const [inputMethod, setInputMethod] = useState("manual")
  const [dataInput, setDataInput] = useState("")
  const [populationType, setPopulationType] = useState("sample")
  const [result, setResult] = useState(null)

  const parseData = (input) => {
    // Remove extra spaces and split by various delimiters
    const cleanInput = input.trim().replace(/\s+/g, ' ')
    const numbers = cleanInput.split(/[,\s\n\t]+/)
      .map(num => parseFloat(num.trim()))
      .filter(num => !isNaN(num))
    
    return numbers
  }

  const calculateStatistics = () => {
    const data = parseData(dataInput)
    
    if (data.length === 0) {
      setResult({ error: "Please enter valid numbers" })
      return
    }

    if (populationType === "sample" && data.length < 2) {
      setResult({ error: "Sample standard deviation requires at least 2 data points" })
      return
    }

    const n = data.length
    const sum = data.reduce((a, b) => a + b, 0)
    const mean = sum / n

    // Calculate variance
    const squaredDifferences = data.map(x => Math.pow(x - mean, 2))
    const sumSquaredDiff = squaredDifferences.reduce((a, b) => a + b, 0)
    
    // Use n-1 for sample, n for population
    const denominator = populationType === "sample" ? n - 1 : n
    const variance = sumSquaredDiff / denominator
    const standardDeviation = Math.sqrt(variance)

    // Additional statistics
    const sortedData = [...data].sort((a, b) => a - b)
    const min = sortedData[0]
    const max = sortedData[n - 1]
    const range = max - min
    
    // Median
    let median
    if (n % 2 === 0) {
      median = (sortedData[n/2 - 1] + sortedData[n/2]) / 2
    } else {
      median = sortedData[Math.floor(n/2)]
    }

    // Mode
    const frequency = {}
    data.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1
    })
    const maxFreq = Math.max(...Object.values(frequency))
    const modes = Object.keys(frequency)
      .filter(key => frequency[key] === maxFreq)
      .map(Number)

    // Quartiles
    const q1Index = Math.floor(n * 0.25)
    const q3Index = Math.floor(n * 0.75)
    const q1 = sortedData[q1Index]
    const q3 = sortedData[q3Index]
    const iqr = q3 - q1

    // Standard error
    const standardError = standardDeviation / Math.sqrt(n)

    // Coefficient of variation
    const coefficientOfVariation = (standardDeviation / Math.abs(mean)) * 100

    setResult({
      data: data,
      count: n,
      sum: sum.toFixed(4),
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      mode: modes.length === n ? 'No mode' : modes.map(m => m.toFixed(4)).join(', '),
      min: min.toFixed(4),
      max: max.toFixed(4),
      range: range.toFixed(4),
      variance: variance.toFixed(4),
      standardDeviation: standardDeviation.toFixed(4),
      standardError: standardError.toFixed(4),
      coefficientOfVariation: coefficientOfVariation.toFixed(2),
      q1: q1.toFixed(4),
      q3: q3.toFixed(4),
      iqr: iqr.toFixed(4),
      populationType
    })
  }

  const loadSampleData = (type) => {
    const samples = {
      heights: "170, 165, 180, 175, 160, 185, 170, 175, 168, 172",
      scores: "85, 92, 78, 96, 88, 91, 83, 89, 94, 87, 90, 86",
      temperatures: "22.5, 23.1, 21.8, 24.2, 22.9, 23.7, 22.3, 23.5, 22.1, 23.9"
    }
    setDataInput(samples[type])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Standard Deviation Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Population Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Data Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="sample"
                    checked={populationType === "sample"}
                    onChange={(e) => setPopulationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Sample</div>
                    <div className="text-sm text-gray-600">Part of a larger population (uses n-1)</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="population"
                    checked={populationType === "population"}
                    onChange={(e) => setPopulationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Population</div>
                    <div className="text-sm text-gray-600">Complete dataset (uses n)</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Data Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Enter Your Data</label>
              <textarea
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter numbers separated by commas, spaces, or new lines&#10;Example: 1, 2, 3, 4, 5&#10;or&#10;1 2 3 4 5&#10;or one number per line"
              />
              <p className="text-sm text-gray-600 mt-1">
                You can separate numbers with commas, spaces, or new lines
              </p>
            </div>

            {/* Sample Data */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quick Sample Data</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => loadSampleData('heights')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  Heights (cm)
                </button>
                <button
                  onClick={() => loadSampleData('scores')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  Test Scores
                </button>
                <button
                  onClick={() => loadSampleData('temperatures')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  Temperatures (°C)
                </button>
                <button
                  onClick={() => setDataInput('')}
                  className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded text-sm"
                >
                  Clear
                </button>
              </div>
            </div>

            <button
              onClick={calculateStatistics}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Statistics
            </button>

            {/* Results */}
            {result && (
              <div className="mt-6 space-y-4">
                {result.error ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-bold">{result.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Main Results */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">
                        {result.populationType === "sample" ? "Sample" : "Population"} Statistics
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Standard Deviation</p>
                          <p className="text-2xl font-bold text-blue-600">{result.standardDeviation}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Variance</p>
                          <p className="text-2xl font-bold text-green-600">{result.variance}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mean</p>
                          <p className="text-2xl font-bold">{result.mean}</p>
                        </div>
                      </div>
                    </div>

                    {/* Descriptive Statistics */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Descriptive Statistics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Count</p>
                          <p className="font-bold">{result.count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sum</p>
                          <p className="font-bold">{result.sum}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Median</p>
                          <p className="font-bold">{result.median}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mode</p>
                          <p className="font-bold">{result.mode}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Minimum</p>
                          <p className="font-bold">{result.min}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Maximum</p>
                          <p className="font-bold">{result.max}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Range</p>
                          <p className="font-bold">{result.range}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Coeff. of Variation</p>
                          <p className="font-bold">{result.coefficientOfVariation}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Quartiles */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Quartiles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Q1 (25th percentile)</p>
                          <p className="font-bold">{result.q1}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Q2 (Median)</p>
                          <p className="font-bold">{result.median}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Q3 (75th percentile)</p>
                          <p className="font-bold">{result.q3}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">IQR</p>
                          <p className="font-bold">{result.iqr}</p>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Statistics */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Advanced Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Standard Error</p>
                          <p className="font-bold">{result.standardError}</p>
                          <p className="text-xs text-gray-500">σ/√n</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">95% Confidence Interval</p>
                          <p className="font-bold">
                            {(parseFloat(result.mean) - 1.96 * parseFloat(result.standardError)).toFixed(4)} to{' '}
                            {(parseFloat(result.mean) + 1.96 * parseFloat(result.standardError)).toFixed(4)}
                          </p>
                          <p className="text-xs text-gray-500">Approximate for large samples</p>
                        </div>
                      </div>
                    </div>

                    {/* Data Summary */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Data ({result.count} values)</h3>
                      <div className="max-h-32 overflow-y-auto bg-white p-2 rounded border">
                        <p className="text-sm font-mono">
                          {result.data.map(num => num.toFixed(4)).join(', ')}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Information */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Understanding Standard Deviation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">What it measures:</h4>
                <ul className="space-y-1">
                  <li>• How spread out data points are from the mean</li>
                  <li>• Lower values = data closer to mean</li>
                  <li>• Higher values = data more scattered</li>
                  <li>• Zero = all values are identical</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sample vs Population:</h4>
                <ul className="space-y-1">
                  <li>• <strong>Sample:</strong> Uses n-1 (Bessel's correction)</li>
                  <li>• <strong>Population:</strong> Uses n</li>
                  <li>• Use sample when data represents a subset</li>
                  <li>• Use population for complete datasets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}