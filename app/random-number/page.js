"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function RandomNumberGenerator() {
  const [generatorType, setGeneratorType] = useState("single")
  const [min, setMin] = useState("1")
  const [max, setMax] = useState("100")
  const [count, setCount] = useState("10")
  const [allowDuplicates, setAllowDuplicates] = useState(true)
  const [results, setResults] = useState([])
  const [statistics, setStatistics] = useState(null)

  const generateSingle = () => {
    const minVal = parseInt(min)
    const maxVal = parseInt(max)
    
    if (isNaN(minVal) || isNaN(maxVal) || minVal >= maxVal) {
      setResults([{ error: "Invalid range. Min must be less than Max." }])
      return
    }

    const randomNum = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
    setResults([{ value: randomNum, timestamp: new Date().toLocaleTimeString() }])
    setStatistics(null)
  }

  const generateMultiple = () => {
    const minVal = parseInt(min)
    const maxVal = parseInt(max)
    const countVal = parseInt(count)
    
    if (isNaN(minVal) || isNaN(maxVal) || minVal >= maxVal) {
      setResults([{ error: "Invalid range. Min must be less than Max." }])
      return
    }

    if (isNaN(countVal) || countVal <= 0 || countVal > 10000) {
      setResults([{ error: "Count must be between 1 and 10,000." }])
      return
    }

    if (!allowDuplicates && countVal > (maxVal - minVal + 1)) {
      setResults([{ error: "Cannot generate unique numbers. Count exceeds available range." }])
      return
    }

    const numbers = []
    const used = new Set()

    for (let i = 0; i < countVal; i++) {
      let randomNum
      
      if (allowDuplicates) {
        randomNum = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
      } else {
        do {
          randomNum = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal
        } while (used.has(randomNum))
        used.add(randomNum)
      }
      
      numbers.push({ value: randomNum, index: i + 1 })
    }

    setResults(numbers)
    calculateStatistics(numbers.map(n => n.value))
  }

  const generateSequence = () => {
    const minVal = parseInt(min)
    const maxVal = parseInt(max)
    
    if (isNaN(minVal) || isNaN(maxVal) || minVal >= maxVal) {
      setResults([{ error: "Invalid range. Min must be less than Max." }])
      return
    }

    const numbers = []
    for (let i = minVal; i <= maxVal; i++) {
      numbers.push({ value: i, index: i - minVal + 1 })
    }

    // Shuffle the sequence
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]]
    }

    setResults(numbers)
    calculateStatistics(numbers.map(n => n.value))
  }

  const calculateStatistics = (numbers) => {
    if (numbers.length === 0) return

    const sum = numbers.reduce((a, b) => a + b, 0)
    const mean = sum / numbers.length
    const sorted = [...numbers].sort((a, b) => a - b)
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)]
    
    // Mode calculation
    const frequency = {}
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1
    })
    const maxFreq = Math.max(...Object.values(frequency))
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq).map(Number)

    // Standard deviation
    const variance = numbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / numbers.length
    const stdDev = Math.sqrt(variance)

    setStatistics({
      count: numbers.length,
      sum,
      mean: mean.toFixed(2),
      median,
      mode: modes.length === numbers.length ? 'No mode' : modes.join(', '),
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      range: Math.max(...numbers) - Math.min(...numbers),
      stdDev: stdDev.toFixed(2)
    })
  }

  const generate = () => {
    switch (generatorType) {
      case "single":
        generateSingle()
        break
      case "multiple":
        generateMultiple()
        break
      case "sequence":
        generateSequence()
        break
    }
  }

  const exportResults = () => {
    if (results.length === 0 || results[0].error) return
    
    const numbers = results.map(r => r.value).join('\n')
    const blob = new Blob([numbers], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'random_numbers.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyResults = () => {
    if (results.length === 0 || results[0].error) return
    
    const numbers = results.map(r => r.value).join(', ')
    navigator.clipboard.writeText(numbers)
  }

  const quickPresets = [
    { name: "Dice (1-6)", min: "1", max: "6" },
    { name: "Coin (0-1)", min: "0", max: "1" },
    { name: "Percent (0-100)", min: "0", max: "100" },
    { name: "Lottery (1-49)", min: "1", max: "49" },
    { name: "Card (1-52)", min: "1", max: "52" }
  ]

  const setPreset = (preset) => {
    setMin(preset.min)
    setMax(preset.max)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Random Number Generator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Generator Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Generator Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="single"
                    checked={generatorType === "single"}
                    onChange={(e) => setGeneratorType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Single Number</div>
                    <div className="text-sm text-gray-600">Generate one random number</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="multiple"
                    checked={generatorType === "multiple"}
                    onChange={(e) => setGeneratorType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Multiple Numbers</div>
                    <div className="text-sm text-gray-600">Generate a list of numbers</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="sequence"
                    checked={generatorType === "sequence"}
                    onChange={(e) => setGeneratorType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Shuffled Sequence</div>
                    <div className="text-sm text-gray-600">All numbers in random order</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Range Settings */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Number Range</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Minimum</label>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Maximum</label>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setPreset(preset)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Multiple Numbers Options */}
            {(generatorType === "multiple") && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Count</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full md:w-32 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={allowDuplicates}
                      onChange={(e) => setAllowDuplicates(e.target.checked)}
                      className="mr-2"
                    />
                    Allow duplicate numbers
                  </label>
                </div>
              </div>
            )}

            <button
              onClick={generate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Generate Random Numbers
            </button>

            {/* Results */}
            {results.length > 0 && (
              <div className="mt-6 space-y-4">
                {results[0].error ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-bold">{results[0].error}</p>
                  </div>
                ) : (
                  <>
                    {/* Single Number Result */}
                    {generatorType === "single" && (
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <h3 className="text-lg font-bold mb-2">Generated Number</h3>
                        <p className="text-4xl font-bold text-blue-600">{results[0].value}</p>
                        <p className="text-sm text-gray-600 mt-2">Generated at {results[0].timestamp}</p>
                      </div>
                    )}

                    {/* Multiple Numbers Result */}
                    {(generatorType === "multiple" || generatorType === "sequence") && (
                      <>
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold">Generated Numbers ({results.length})</h3>
                            <div className="space-x-2">
                              <button
                                onClick={copyResults}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Copy
                              </button>
                              <button
                                onClick={exportResults}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                              >
                                Export
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 max-h-64 overflow-y-auto">
                            {results.map((result, index) => (
                              <div
                                key={index}
                                className="bg-white p-2 rounded text-center font-mono text-sm"
                              >
                                {result.value}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Statistics */}
                        {statistics && (
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-3">Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Count</p>
                                <p className="font-bold">{statistics.count}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Sum</p>
                                <p className="font-bold">{statistics.sum.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Mean</p>
                                <p className="font-bold">{statistics.mean}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Median</p>
                                <p className="font-bold">{statistics.median}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Mode</p>
                                <p className="font-bold">{statistics.mode}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Range</p>
                                <p className="font-bold">{statistics.min} - {statistics.max}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Std Dev</p>
                                <p className="font-bold">{statistics.stdDev}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Information */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Random Number Generator Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="space-y-1">
                  <li>• Generate single or multiple numbers</li>
                  <li>• Customizable range (min/max)</li>
                  <li>• Option for unique or duplicate numbers</li>
                  <li>• Statistical analysis of results</li>
                  <li>• Export results to text file</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Use Cases:</h4>
                <ul className="space-y-1">
                  <li>• Random sampling for research</li>
                  <li>• Game mechanics and simulations</li>
                  <li>• Lottery number generation</li>
                  <li>• Password generation bases</li>
                  <li>• Random selection from lists</li>
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