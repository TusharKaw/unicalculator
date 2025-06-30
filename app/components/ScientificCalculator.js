"use client"

import { useState } from "react"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0")
  const [isRad, setIsRad] = useState(false)

  const handleButtonClick = (value) => {
    if (value === "AC") {
      setDisplay("0")
    } else if (value === "Back") {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"))
    } else if (value === "=") {
      try {
        const result = eval(display.replace("×", "*").replace("÷", "/"))
        setDisplay(result.toString())
      } catch {
        setDisplay("Error")
      }
    } else if (display === "0" && !isNaN(value)) {
      setDisplay(value)
    } else {
      setDisplay((prev) => prev + value)
    }
  }

  const toggleRadDeg = () => {
    setIsRad(!isRad)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
      {/* Display */}
      <div className="bg-blue-800 text-white p-4 rounded mb-4 text-right text-xl font-mono">{display}</div>

      {/* Button Grid */}
      <div className="grid grid-cols-6 gap-1 text-sm">
        {/* Row 1 */}
        <button onClick={() => handleButtonClick("sin")} className="calculator-function p-2 rounded">
          sin
        </button>
        <button onClick={() => handleButtonClick("cos")} className="calculator-function p-2 rounded">
          cos
        </button>
        <button onClick={() => handleButtonClick("tan")} className="calculator-function p-2 rounded">
          tan
        </button>
        <button onClick={toggleRadDeg} className="calculator-function p-2 rounded">
          {isRad ? "Rad" : "Deg"}
        </button>
        <button onClick={() => handleButtonClick("7")} className="calculator-number p-2 rounded">
          7
        </button>
        <button onClick={() => handleButtonClick("Back")} className="calculator-button p-2 rounded">
          Back
        </button>

        {/* Row 2 */}
        <button onClick={() => handleButtonClick("sin⁻¹")} className="calculator-function p-2 rounded">
          sin⁻¹
        </button>
        <button onClick={() => handleButtonClick("cos⁻¹")} className="calculator-function p-2 rounded">
          cos⁻¹
        </button>
        <button onClick={() => handleButtonClick("tan⁻¹")} className="calculator-function p-2 rounded">
          tan⁻¹
        </button>
        <button onClick={() => handleButtonClick("π")} className="calculator-function p-2 rounded">
          π
        </button>
        <button onClick={() => handleButtonClick("4")} className="calculator-number p-2 rounded">
          4
        </button>
        <button onClick={() => handleButtonClick("Ans")} className="calculator-button p-2 rounded">
          Ans
        </button>

        {/* Row 3 */}
        <button onClick={() => handleButtonClick("x^y")} className="calculator-function p-2 rounded">
          x^y
        </button>
        <button onClick={() => handleButtonClick("x³")} className="calculator-function p-2 rounded">
          x³
        </button>
        <button onClick={() => handleButtonClick("x²")} className="calculator-function p-2 rounded">
          x²
        </button>
        <button onClick={() => handleButtonClick("e^x")} className="calculator-function p-2 rounded">
          e^x
        </button>
        <button onClick={() => handleButtonClick("1")} className="calculator-number p-2 rounded">
          1
        </button>
        <button onClick={() => handleButtonClick("M+")} className="calculator-button p-2 rounded">
          M+
        </button>

        {/* Row 4 */}
        <button onClick={() => handleButtonClick("y/x")} className="calculator-function p-2 rounded">
          y/x
        </button>
        <button onClick={() => handleButtonClick("³√x")} className="calculator-function p-2 rounded">
          ³√x
        </button>
        <button onClick={() => handleButtonClick("√x")} className="calculator-function p-2 rounded">
          √x
        </button>
        <button onClick={() => handleButtonClick("ln")} className="calculator-function p-2 rounded">
          ln
        </button>
        <button onClick={() => handleButtonClick("0")} className="calculator-number p-2 rounded">
          0
        </button>
        <button onClick={() => handleButtonClick("M-")} className="calculator-button p-2 rounded">
          M-
        </button>

        {/* Row 5 */}
        <button onClick={() => handleButtonClick("(")} className="calculator-button p-2 rounded">
          (
        </button>
        <button onClick={() => handleButtonClick(")")} className="calculator-button p-2 rounded">
          )
        </button>
        <button onClick={() => handleButtonClick("1/x")} className="calculator-function p-2 rounded">
          1/x
        </button>
        <button onClick={() => handleButtonClick("%")} className="calculator-function p-2 rounded">
          %
        </button>
        <button onClick={() => handleButtonClick(".")} className="calculator-number p-2 rounded">
          .
        </button>
        <button onClick={() => handleButtonClick("MR")} className="calculator-button p-2 rounded">
          MR
        </button>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-6 gap-1 mt-1">
        <button onClick={() => handleButtonClick("8")} className="calculator-number p-2 rounded">
          8
        </button>
        <button onClick={() => handleButtonClick("9")} className="calculator-number p-2 rounded">
          9
        </button>
        <button onClick={() => handleButtonClick("+")} className="calculator-operator p-2 rounded">
          +
        </button>
        <button onClick={() => handleButtonClick("5")} className="calculator-number p-2 rounded">
          5
        </button>
        <button onClick={() => handleButtonClick("6")} className="calculator-number p-2 rounded">
          6
        </button>
        <button onClick={() => handleButtonClick("-")} className="calculator-operator p-2 rounded">
          -
        </button>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-1">
        <button onClick={() => handleButtonClick("2")} className="calculator-number p-2 rounded">
          2
        </button>
        <button onClick={() => handleButtonClick("3")} className="calculator-number p-2 rounded">
          3
        </button>
        <button onClick={() => handleButtonClick("×")} className="calculator-operator p-2 rounded">
          ×
        </button>
        <button onClick={() => handleButtonClick("log")} className="calculator-function p-2 rounded">
          log
        </button>
        <button onClick={() => handleButtonClick("10^x")} className="calculator-function p-2 rounded">
          10^x
        </button>
        <button onClick={() => handleButtonClick("÷")} className="calculator-operator p-2 rounded">
          ÷
        </button>
      </div>

      <div className="grid grid-cols-6 gap-1 mt-1">
        <button onClick={() => handleButtonClick("n!")} className="calculator-function p-2 rounded">
          n!
        </button>
        <button onClick={() => handleButtonClick("±")} className="calculator-button p-2 rounded">
          ±
        </button>
        <button onClick={() => handleButtonClick("RND")} className="calculator-button p-2 rounded">
          RND
        </button>
        <button onClick={() => handleButtonClick("AC")} className="calculator-button p-2 rounded">
          AC
        </button>
        <button onClick={() => handleButtonClick("=")} className="calculator-operator p-2 rounded">
          =
        </button>
        <button onClick={() => handleButtonClick("EXP")} className="calculator-function p-2 rounded">
          EXP
        </button>
      </div>
    </div>
  )
}
