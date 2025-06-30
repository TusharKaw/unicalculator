"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function TriangleCalculator() {
  const [inputType, setInputType] = useState("sss")
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const [c, setC] = useState("")
  const [angleA, setAngleA] = useState("")
  const [angleB, setAngleB] = useState("")
  const [angleC, setAngleC] = useState("")
  const [result, setResult] = useState(null)

  const calculateTriangle = () => {
    try {
      let sides = { a: 0, b: 0, c: 0 }
      let angles = { A: 0, B: 0, C: 0 }
      
      const toRadians = (degrees) => degrees * Math.PI / 180
      const toDegrees = (radians) => radians * 180 / Math.PI

      switch (inputType) {
        case "sss": // Three sides
          sides.a = parseFloat(a) || 0
          sides.b = parseFloat(b) || 0
          sides.c = parseFloat(c) || 0
          
          if (sides.a <= 0 || sides.b <= 0 || sides.c <= 0) {
            throw new Error("All sides must be positive")
          }
          
          // Check triangle inequality
          if (sides.a + sides.b <= sides.c || sides.a + sides.c <= sides.b || sides.b + sides.c <= sides.a) {
            throw new Error("Invalid triangle - sides don't satisfy triangle inequality")
          }
          
          // Calculate angles using law of cosines
          angles.A = toDegrees(Math.acos((sides.b * sides.b + sides.c * sides.c - sides.a * sides.a) / (2 * sides.b * sides.c)))
          angles.B = toDegrees(Math.acos((sides.a * sides.a + sides.c * sides.c - sides.b * sides.b) / (2 * sides.a * sides.c)))
          angles.C = 180 - angles.A - angles.B
          break

        case "sas": // Two sides and included angle
          sides.a = parseFloat(a) || 0
          sides.b = parseFloat(b) || 0
          angles.C = parseFloat(angleC) || 0
          
          if (sides.a <= 0 || sides.b <= 0 || angles.C <= 0 || angles.C >= 180) {
            throw new Error("Invalid input values")
          }
          
          // Calculate third side using law of cosines
          sides.c = Math.sqrt(sides.a * sides.a + sides.b * sides.b - 2 * sides.a * sides.b * Math.cos(toRadians(angles.C)))
          
          // Calculate other angles
          angles.A = toDegrees(Math.asin(sides.a * Math.sin(toRadians(angles.C)) / sides.c))
          angles.B = 180 - angles.A - angles.C
          break

        case "asa": // Two angles and included side
          angles.A = parseFloat(angleA) || 0
          angles.B = parseFloat(angleB) || 0
          sides.c = parseFloat(c) || 0
          
          if (angles.A <= 0 || angles.B <= 0 || sides.c <= 0 || angles.A + angles.B >= 180) {
            throw new Error("Invalid input values")
          }
          
          angles.C = 180 - angles.A - angles.B
          
          // Calculate other sides using law of sines
          sides.a = sides.c * Math.sin(toRadians(angles.A)) / Math.sin(toRadians(angles.C))
          sides.b = sides.c * Math.sin(toRadians(angles.B)) / Math.sin(toRadians(angles.C))
          break

        case "aas": // Two angles and non-included side
          angles.A = parseFloat(angleA) || 0
          angles.B = parseFloat(angleB) || 0
          sides.a = parseFloat(a) || 0
          
          if (angles.A <= 0 || angles.B <= 0 || sides.a <= 0 || angles.A + angles.B >= 180) {
            throw new Error("Invalid input values")
          }
          
          angles.C = 180 - angles.A - angles.B
          
          // Calculate other sides using law of sines
          sides.b = sides.a * Math.sin(toRadians(angles.B)) / Math.sin(toRadians(angles.A))
          sides.c = sides.a * Math.sin(toRadians(angles.C)) / Math.sin(toRadians(angles.A))
          break

        default:
          throw new Error("Invalid input type")
      }

      // Calculate area using Heron's formula
      const s = (sides.a + sides.b + sides.c) / 2
      const area = Math.sqrt(s * (s - sides.a) * (s - sides.b) * (s - sides.c))
      
      // Calculate perimeter
      const perimeter = sides.a + sides.b + sides.c
      
      // Calculate other properties
      const inradius = area / s
      const circumradius = (sides.a * sides.b * sides.c) / (4 * area)
      
      // Determine triangle type
      const triangleType = getTriangleType(sides, angles)

      setResult({
        sides: {
          a: sides.a.toFixed(3),
          b: sides.b.toFixed(3),
          c: sides.c.toFixed(3)
        },
        angles: {
          A: angles.A.toFixed(2),
          B: angles.B.toFixed(2),
          C: angles.C.toFixed(2)
        },
        properties: {
          area: area.toFixed(3),
          perimeter: perimeter.toFixed(3),
          inradius: inradius.toFixed(3),
          circumradius: circumradius.toFixed(3)
        },
        triangleType
      })
    } catch (error) {
      setResult({ error: error.message })
    }
  }

  const getTriangleType = (sides, angles) => {
    const types = []
    
    // By angles
    if (Math.abs(angles.A - 90) < 0.01 || Math.abs(angles.B - 90) < 0.01 || Math.abs(angles.C - 90) < 0.01) {
      types.push("Right")
    } else if (angles.A > 90 || angles.B > 90 || angles.C > 90) {
      types.push("Obtuse")
    } else {
      types.push("Acute")
    }
    
    // By sides
    const precision = 0.001
    if (Math.abs(sides.a - sides.b) < precision && Math.abs(sides.b - sides.c) < precision) {
      types.push("Equilateral")
    } else if (Math.abs(sides.a - sides.b) < precision || Math.abs(sides.b - sides.c) < precision || Math.abs(sides.a - sides.c) < precision) {
      types.push("Isosceles")
    } else {
      types.push("Scalene")
    }
    
    return types.join(", ")
  }

  const getInputFields = () => {
    switch (inputType) {
      case "sss":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Side a</label>
              <input
                type="number"
                step="0.001"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Length of side a"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Side b</label>
              <input
                type="number"
                step="0.001"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Length of side b"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Side c</label>
              <input
                type="number"
                step="0.001"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Length of side c"
              />
            </div>
          </>
        )
      
      case "sas":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Side a</label>
              <input
                type="number"
                step="0.001"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Length of side a"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Side b</label>
              <input
                type="number"
                step="0.001"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Length of side b"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Angle C (degrees)</label>
              <input
                type="number"
                step="0.01"
                value={angleC}
                onChange={(e) => setAngleC(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Angle between sides a and b"
              />
            </div>
          </>
        )
      
      case "asa":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Angle A (degrees)</label>
              <input
                type="number"
                step="0.01"
                value={angleA}
                onChange={(e) => setAngleA(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Angle A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Angle B (degrees)</label>
              <input
                type="number"
                step="0.01"
                value={angleB}
                onChange={(e) => setAngleB(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Angle B"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Side c</label>
              <input
                type="number"
                step="0.001"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Side between angles A and B"
              />
            </div>
          </>
        )
      
      case "aas":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Angle A (degrees)</label>
              <input
                type="number"
                step="0.01"
                value={angleA}
                onChange={(e) => setAngleA(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Angle A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Angle B (degrees)</label>
              <input
                type="number"
                step="0.01"
                value={angleB}
                onChange={(e) => setAngleB(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Angle B"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Side a</label>
              <input
                type="number"
                step="0.001"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Side opposite to angle A"
              />
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Triangle Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Input Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">What do you know about the triangle?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="sss"
                    checked={inputType === "sss"}
                    onChange={(e) => setInputType(e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-semibold">SSS</div>
                    <div className="text-xs text-gray-600">Three sides</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="sas"
                    checked={inputType === "sas"}
                    onChange={(e) => setInputType(e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-semibold">SAS</div>
                    <div className="text-xs text-gray-600">Two sides, included angle</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="asa"
                    checked={inputType === "asa"}
                    onChange={(e) => setInputType(e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-semibold">ASA</div>
                    <div className="text-xs text-gray-600">Two angles, included side</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="aas"
                    checked={inputType === "aas"}
                    onChange={(e) => setInputType(e.target.value)}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-semibold">AAS</div>
                    <div className="text-xs text-gray-600">Two angles, non-included side</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Enter Known Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getInputFields()}
              </div>
            </div>

            <button
              onClick={calculateTriangle}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Triangle
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
                    {/* Triangle Type */}
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <h3 className="text-xl font-bold mb-2">Triangle Type</h3>
                      <p className="text-2xl font-bold text-blue-600">{result.triangleType}</p>
                    </div>

                    {/* Sides and Angles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">Sides</h3>
                        <div className="space-y-2">
                          <p>Side a: <span className="font-bold">{result.sides.a}</span></p>
                          <p>Side b: <span className="font-bold">{result.sides.b}</span></p>
                          <p>Side c: <span className="font-bold">{result.sides.c}</span></p>
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">Angles</h3>
                        <div className="space-y-2">
                          <p>Angle A: <span className="font-bold">{result.angles.A}°</span></p>
                          <p>Angle B: <span className="font-bold">{result.angles.B}°</span></p>
                          <p>Angle C: <span className="font-bold">{result.angles.C}°</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Properties */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Properties</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Area</p>
                          <p className="font-bold">{result.properties.area}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Perimeter</p>
                          <p className="font-bold">{result.properties.perimeter}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Inradius</p>
                          <p className="font-bold">{result.properties.inradius}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Circumradius</p>
                          <p className="font-bold">{result.properties.circumradius}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Reference */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Triangle Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Triangle Types by Angles:</h4>
                <ul className="space-y-1">
                  <li><strong>Acute:</strong> All angles &lt 90°</li>
                  <li><strong>Right:</strong> One angle = 90°</li>
                  <li><strong>Obtuse:</strong> One angle &gt 90°</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Triangle Types by Sides:</h4>
                <ul className="space-y-1">
                  <li><strong>Equilateral:</strong> All sides equal</li>
                  <li><strong>Isosceles:</strong> Two sides equal</li>
                  <li><strong>Scalene:</strong> All sides different</li>
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