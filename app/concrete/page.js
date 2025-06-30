"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function ConcreteCalculator() {
  const [shape, setShape] = useState("slab")
  const [unit, setUnit] = useState("feet")
  
  // Dimensions
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [thickness, setThickness] = useState("")
  const [diameter, setDiameter] = useState("")
  const [height, setHeight] = useState("")
  const [steps, setSteps] = useState([{ length: "", width: "", height: "" }])
  
  const [wasteFactor, setWasteFactor] = useState("10")
  const [result, setResult] = useState(null)

  const addStep = () => {
    setSteps([...steps, { length: "", width: "", height: "" }])
  }

  const removeStep = (index) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const updateStep = (index, field, value) => {
    const newSteps = [...steps]
    newSteps[index][field] = value
    setSteps(newSteps)
  }

  const convertToFeet = (value, fromUnit) => {
    const val = parseFloat(value) || 0
    switch (fromUnit) {
      case "inches": return val / 12
      case "feet": return val
      case "yards": return val * 3
      case "meters": return val * 3.28084
      case "centimeters": return val / 30.48
      default: return val
    }
  }

  const calculateVolume = () => {
    let volume = 0

    switch (shape) {
      case "slab":
        const slabLength = convertToFeet(length, unit)
        const slabWidth = convertToFeet(width, unit)
        const slabThickness = convertToFeet(thickness, unit)
        volume = slabLength * slabWidth * slabThickness
        break

      case "footing":
        const footingLength = convertToFeet(length, unit)
        const footingWidth = convertToFeet(width, unit)
        const footingDepth = convertToFeet(thickness, unit)
        volume = footingLength * footingWidth * footingDepth
        break

      case "column":
        const columnDiameter = convertToFeet(diameter, unit)
        const columnHeight = convertToFeet(height, unit)
        const radius = columnDiameter / 2
        volume = Math.PI * radius * radius * columnHeight
        break

      case "stairs":
        steps.forEach(step => {
          const stepLength = convertToFeet(step.length, unit)
          const stepWidth = convertToFeet(step.width, unit)
          const stepHeight = convertToFeet(step.height, unit)
          if (stepLength && stepWidth && stepHeight) {
            volume += stepLength * stepWidth * stepHeight
          }
        })
        break

      case "wall":
        const wallLength = convertToFeet(length, unit)
        const wallHeight = convertToFeet(height, unit)
        const wallThickness = convertToFeet(thickness, unit)
        volume = wallLength * wallHeight * wallThickness
        break
    }

    return volume
  }

  const calculateConcrete = () => {
    const volume = calculateVolume()
    
    if (volume <= 0) {
      setResult({ error: "Please enter valid dimensions" })
      return
    }

    const wastePercent = parseFloat(wasteFactor) / 100
    const volumeWithWaste = volume * (1 + wastePercent)

    // Convert to different units
    const cubicYards = volumeWithWaste / 27
    const cubicMeters = volumeWithWaste * 0.0283168
    const bags60lb = Math.ceil(cubicYards * 60) // 60 lb bags per cubic yard
    const bags80lb = Math.ceil(cubicYards * 45) // 80 lb bags per cubic yard
    const bags40lb = Math.ceil(cubicYards * 90) // 40 lb bags per cubic yard

    // Cost estimates (approximate)
    const costPerCubicYard = 100 // $100 per cubic yard (ready mix)
    const readyMixCost = cubicYards * costPerCubicYard
    const bag60lbCost = bags60lb * 4.50 // $4.50 per 60lb bag
    const bag80lbCost = bags80lb * 5.50 // $5.50 per 80lb bag

    // Weight calculations
    const concreteWeightPerCubicFoot = 150 // lbs per cubic foot
    const totalWeight = volumeWithWaste * concreteWeightPerCubicFoot

    setResult({
      volume: volume.toFixed(2),
      volumeWithWaste: volumeWithWaste.toFixed(2),
      cubicYards: cubicYards.toFixed(2),
      cubicMeters: cubicMeters.toFixed(2),
      bags: {
        "40lb": bags40lb,
        "60lb": bags60lb,
        "80lb": bags80lb
      },
      costs: {
        readyMix: readyMixCost.toFixed(2),
        bags60lb: bag60lbCost.toFixed(2),
        bags80lb: bag80lbCost.toFixed(2)
      },
      weight: {
        lbs: totalWeight.toFixed(0),
        tons: (totalWeight / 2000).toFixed(2)
      },
      wasteFactor,
      shape
    })
  }

  const getShapeInputs = () => {
    switch (shape) {
      case "slab":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Length ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter length"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Width ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter width"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thickness ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter thickness"
              />
            </div>
          </>
        )

      case "footing":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Length ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter length"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Width ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter width"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Depth ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter depth"
              />
            </div>
          </>
        )

      case "column":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Diameter ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter diameter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter height"
              />
            </div>
          </>
        )

      case "wall":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Length ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter length"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter height"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Thickness ({unit})</label>
              <input
                type="number"
                step="0.1"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter thickness"
              />
            </div>
          </>
        )

      case "stairs":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Steps</h3>
              <button
                onClick={addStep}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                + Add Step
              </button>
            </div>
            {steps.map((step, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Step {index + 1}</h4>
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Length ({unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={step.length}
                      onChange={(e) => updateStep(index, 'length', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Length"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width ({unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={step.width}
                      onChange={(e) => updateStep(index, 'width', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height ({unit})</label>
                    <input
                      type="number"
                      step="0.1"
                      value={step.height}
                      onChange={(e) => updateStep(index, 'height', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Height"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Concrete Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Shape/Type</label>
                <select
                  value={shape}
                  onChange={(e) => setShape(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="slab">Concrete Slab</option>
                  <option value="footing">Footing</option>
                  <option value="column">Round Column</option>
                  <option value="wall">Wall</option>
                  <option value="stairs">Stairs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Unit of Measurement</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="feet">Feet</option>
                  <option value="inches">Inches</option>
                  <option value="yards">Yards</option>
                  <option value="meters">Meters</option>
                  <option value="centimeters">Centimeters</option>
                </select>
              </div>
            </div>

            {/* Shape-specific inputs */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Dimensions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getShapeInputs()}
              </div>
            </div>

            {/* Waste Factor */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Waste Factor (%)</label>
              <select
                value={wasteFactor}
                onChange={(e) => setWasteFactor(e.target.value)}
                className="w-full md:w-48 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="5">5% (Minimal waste)</option>
                <option value="10">10% (Standard)</option>
                <option value="15">15% (Complex shapes)</option>
                <option value="20">20% (High waste expected)</option>
              </select>
            </div>

            <button
              onClick={calculateConcrete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Concrete Needed
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
                    {/* Volume Summary */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Volume Required</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Cubic Feet</p>
                          <p className="text-2xl font-bold text-blue-600">{result.volumeWithWaste}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cubic Yards</p>
                          <p className="text-2xl font-bold text-green-600">{result.cubicYards}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cubic Meters</p>
                          <p className="text-2xl font-bold">{result.cubicMeters}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 text-center">
                        Includes {result.wasteFactor}% waste factor
                      </p>
                    </div>

                    {/* Bag Requirements */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Concrete Bags Needed</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">40 lb Bags</p>
                          <p className="text-xl font-bold">{result.bags["40lb"]}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">60 lb Bags</p>
                          <p className="text-xl font-bold">{result.bags["60lb"]}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">80 lb Bags</p>
                          <p className="text-xl font-bold">{result.bags["80lb"]}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cost Estimates */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Cost Estimates</h3>
                      <div className="space-y-2">
                        <p>Ready-Mix Concrete: <span className="font-bold">${result.costs.readyMix}</span></p>
                        <p>60 lb Bags: <span className="font-bold">${result.costs.bags60lb}</span></p>
                        <p>80 lb Bags: <span className="font-bold">${result.costs.bags80lb}</span></p>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        *Prices are estimates and may vary by location and supplier
                      </p>
                    </div>

                    {/* Weight Information */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Weight Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Weight</p>
                          <p className="text-xl font-bold">{result.weight.lbs} lbs</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Weight</p>
                          <p className="text-xl font-bold">{result.weight.tons} tons</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Concrete Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Planning:</h4>
                <ul className="space-y-1">
                  <li>• Always add 5-10% extra for waste</li>
                  <li>• Ready-mix is convenient for large jobs</li>
                  <li>• Bags are better for small projects</li>
                  <li>• Consider delivery costs for ready-mix</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Mixing:</h4>
                <ul className="space-y-1">
                  <li>• 40 lb bag covers ~0.3 sq ft at 4" thick</li>
                  <li>• 60 lb bag covers ~0.45 sq ft at 4" thick</li>
                  <li>• 80 lb bag covers ~0.6 sq ft at 4" thick</li>
                  <li>• Allow 24-48 hours for initial curing</li>
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