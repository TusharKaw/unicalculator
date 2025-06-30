"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function FractionCalculator() {
  const [num1, setNum1] = useState("")
  const [den1, setDen1] = useState("")
  const [num2, setNum2] = useState("")
  const [den2, setDen2] = useState("")
  const [operation, setOperation] = useState("+")
  const [result, setResult] = useState(null)

  // Greatest Common Divisor
  const gcd = (a, b) => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
      let temp = b
      b = a % b
      a = temp
    }
    return a
  }

  // Least Common Multiple
  const lcm = (a, b) => {
    return Math.abs(a * b) / gcd(a, b)
  }

  // Reduce fraction to lowest terms
  const reduceFraction = (numerator, denominator) => {
    if (denominator === 0) {
      return { numerator: 0, denominator: 1, error: "Division by zero" }
    }
    
    const divisor = gcd(numerator, denominator)
    let reducedNum = numerator / divisor
    let reducedDen = denominator / divisor
    
    // Keep denominator positive
    if (reducedDen < 0) {
      reducedNum = -reducedNum
      reducedDen = -reducedDen
    }
    
    return { numerator: reducedNum, denominator: reducedDen }
  }

  // Convert improper fraction to mixed number
  const toMixedNumber = (numerator, denominator) => {
    if (Math.abs(numerator) < Math.abs(denominator)) {
      return { whole: 0, numerator, denominator }
    }
    
    const whole = Math.floor(Math.abs(numerator) / Math.abs(denominator))
    const remainingNum = Math.abs(numerator) % Math.abs(denominator)
    
    return {
      whole: numerator < 0 ? -whole : whole,
      numerator: remainingNum,
      denominator: Math.abs(denominator)
    }
  }

  // Convert decimal to fraction
  const decimalToFraction = (decimal) => {
    if (decimal === 0) return { numerator: 0, denominator: 1 }
    
    const tolerance = 1.0E-6
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1
    let b = decimal
    
    do {
      const a = Math.floor(b)
      let aux = h1
      h1 = a * h1 + h2
      h2 = aux
      aux = k1
      k1 = a * k1 + k2
      k2 = aux
      b = 1 / (b - a)
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance)
    
    return reduceFraction(h1, k1)
  }

  const calculateFraction = () => {
    const n1 = parseInt(num1) || 0
    const d1 = parseInt(den1) || 1
    const n2 = parseInt(num2) || 0
    const d2 = parseInt(den2) || 1

    if (d1 === 0 || d2 === 0) {
      setResult({ error: "Denominator cannot be zero" })
      return
    }

    let resultNum, resultDen

    switch (operation) {
      case "+":
        // a/b + c/d = (ad + bc) / bd
        resultNum = n1 * d2 + n2 * d1
        resultDen = d1 * d2
        break
      case "-":
        // a/b - c/d = (ad - bc) / bd
        resultNum = n1 * d2 - n2 * d1
        resultDen = d1 * d2
        break
      case "×":
        // a/b × c/d = ac / bd
        resultNum = n1 * n2
        resultDen = d1 * d2
        break
      case "÷":
        // a/b ÷ c/d = a/b × d/c = ad / bc
        if (n2 === 0) {
          setResult({ error: "Cannot divide by zero" })
          return
        }
        resultNum = n1 * d2
        resultDen = d1 * n2
        break
      default:
        return
    }

    const reduced = reduceFraction(resultNum, resultDen)
    const mixed = toMixedNumber(reduced.numerator, reduced.denominator)
    const decimal = reduced.numerator / reduced.denominator

    setResult({
      original: { numerator: resultNum, denominator: resultDen },
      reduced,
      mixed,
      decimal: decimal.toFixed(6).replace(/\.?0+$/, ""),
      fraction1: { numerator: n1, denominator: d1 },
      fraction2: { numerator: n2, denominator: d2 },
      operation
    })
  }

  const formatFraction = (num, den) => {
    if (den === 1) return num.toString()
    return `${num}/${den}`
  }

  const formatMixed = (mixed) => {
    if (mixed.whole === 0) {
      if (mixed.numerator === 0) return "0"
      return formatFraction(mixed.numerator, mixed.denominator)
    }
    if (mixed.numerator === 0) return mixed.whole.toString()
    return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`
  }

  const convertDecimal = () => {
    const decimal = parseFloat(document.getElementById('decimalInput').value)
    if (isNaN(decimal)) return
    
    const fraction = decimalToFraction(decimal)
    const mixed = toMixedNumber(fraction.numerator, fraction.denominator)
    
    setResult({
      converted: true,
      decimal: decimal.toString(),
      reduced: fraction,
      mixed
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Fraction Calculator</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fraction Calculator */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Fraction Operations</h2>
              
              <div className="space-y-4">
                {/* First Fraction */}
                <div>
                  <label className="block text-sm font-medium mb-2">First Fraction</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={num1}
                      onChange={(e) => setNum1(e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-center"
                      placeholder="0"
                    />
                    <span className="text-xl">/</span>
                    <input
                      type="number"
                      value={den1}
                      onChange={(e) => setDen1(e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-center"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Operation */}
                <div>
                  <label className="block text-sm font-medium mb-2">Operation</label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="+">Addition (+)</option>
                    <option value="-">Subtraction (−)</option>
                    <option value="×">Multiplication (×)</option>
                    <option value="÷">Division (÷)</option>
                  </select>
                </div>

                {/* Second Fraction */}
                <div>
                  <label className="block text-sm font-medium mb-2">Second Fraction</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={num2}
                      onChange={(e) => setNum2(e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-center"
                      placeholder="0"
                    />
                    <span className="text-xl">/</span>
                    <input
                      type="number"
                      value={den2}
                      onChange={(e) => setDen2(e.target.value)}
                      className="w-20 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-center"
                      placeholder="1"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateFraction}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Calculate
                </button>

                {/* Results */}
                {result && !result.converted && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    {result.error ? (
                      <p className="text-red-600 font-bold">{result.error}</p>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold">Result:</h3>
                        
                        <div className="text-center text-lg">
                          <span className="bg-white px-3 py-2 rounded border">
                            {formatFraction(result.fraction1.numerator, result.fraction1.denominator)}
                          </span>
                          <span className="mx-3 text-xl">{result.operation}</span>
                          <span className="bg-white px-3 py-2 rounded border">
                            {formatFraction(result.fraction2.numerator, result.fraction2.denominator)}
                          </span>
                          <span className="mx-3 text-xl">=</span>
                          <span className="bg-green-100 px-3 py-2 rounded border font-bold">
                            {formatFraction(result.reduced.numerator, result.reduced.denominator)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white p-3 rounded">
                            <p className="font-semibold">Improper Fraction:</p>
                            <p>{formatFraction(result.original.numerator, result.original.denominator)}</p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-semibold">Mixed Number:</p>
                            <p>{formatMixed(result.mixed)}</p>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <p className="font-semibold">Decimal:</p>
                            <p>{result.decimal}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Decimal to Fraction Converter */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Decimal to Fraction Converter</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Decimal Number</label>
                  <input
                    id="decimalInput"
                    type="number"
                    step="any"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter decimal (e.g., 0.75, 1.25)"
                  />
                </div>

                <button
                  onClick={convertDecimal}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Convert to Fraction
                </button>

                {result && result.converted && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-bold mb-3">Conversion Result:</h3>
                    <div className="space-y-2">
                      <p>Decimal: <span className="font-bold">{result.decimal}</span></p>
                      <p>Fraction: <span className="font-bold text-green-600">
                        {formatFraction(result.reduced.numerator, result.reduced.denominator)}
                      </span></p>
                      <p>Mixed Number: <span className="font-bold">
                        {formatMixed(result.mixed)}
                      </span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Examples */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Quick Examples:</h4>
                <div className="text-sm space-y-1">
                  <p>0.5 = 1/2</p>
                  <p>0.75 = 3/4</p>
                  <p>0.333... = 1/3</p>
                  <p>1.25 = 1 1/4</p>
                  <p>2.666... = 2 2/3</p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">How to Use:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Fraction Operations:</h4>
                <ul className="space-y-1">
                  <li>• Enter numerator and denominator for each fraction</li>
                  <li>• Select the operation (+, −, ×, ÷)</li>
                  <li>• Click Calculate to see the result</li>
                  <li>• Results are automatically reduced to lowest terms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Decimal Conversion:</h4>
                <ul className="space-y-1">
                  <li>• Enter any decimal number</li>
                  <li>• Get the equivalent fraction in lowest terms</li>
                  <li>• See both improper and mixed number forms</li>
                  <li>• Works with repeating decimals too</li>
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