"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [memory, setMemory] = useState(0)
  const [angleMode, setAngleMode] = useState("deg") // deg or rad
  const [history, setHistory] = useState([])

  const inputNumber = (num) => {
    if (waitingForNewValue) {
      setDisplay(String(num))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === "0" ? String(num) : display + num)
    }
  }

  const inputDot = () => {
    if (waitingForNewValue) {
      setDisplay("0.")
      setWaitingForNewValue(false)
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".")
    }
  }

  const clear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
  }

  const clearEntry = () => {
    setDisplay("0")
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)
      
      setDisplay(String(newValue))
      addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`)
      setPreviousValue(newValue)
    }
    
    setWaitingForNewValue(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue
      case "-":
        return firstValue - secondValue
      case "×":
        return firstValue * secondValue
      case "÷":
        return secondValue !== 0 ? firstValue / secondValue : 0
      case "^":
        return Math.pow(firstValue, secondValue)
      case "mod":
        return firstValue % secondValue
      default:
        return secondValue
    }
  }

  const performFunction = (func) => {
    const inputValue = parseFloat(display)
    let result

    switch (func) {
      case "sin":
        result = angleMode === "deg" ? Math.sin(inputValue * Math.PI / 180) : Math.sin(inputValue)
        break
      case "cos":
        result = angleMode === "deg" ? Math.cos(inputValue * Math.PI / 180) : Math.cos(inputValue)
        break
      case "tan":
        result = angleMode === "deg" ? Math.tan(inputValue * Math.PI / 180) : Math.tan(inputValue)
        break
      case "asin":
        result = angleMode === "deg" ? Math.asin(inputValue) * 180 / Math.PI : Math.asin(inputValue)
        break
      case "acos":
        result = angleMode === "deg" ? Math.acos(inputValue) * 180 / Math.PI : Math.acos(inputValue)
        break
      case "atan":
        result = angleMode === "deg" ? Math.atan(inputValue) * 180 / Math.PI : Math.atan(inputValue)
        break
      case "log":
        result = Math.log10(inputValue)
        break
      case "ln":
        result = Math.log(inputValue)
        break
      case "sqrt":
        result = Math.sqrt(inputValue)
        break
      case "square":
        result = inputValue * inputValue
        break
      case "cube":
        result = inputValue * inputValue * inputValue
        break
      case "factorial":
        result = factorial(inputValue)
        break
      case "1/x":
        result = 1 / inputValue
        break
      case "abs":
        result = Math.abs(inputValue)
        break
      case "+/-":
        result = -inputValue
        break
      case "π":
        result = Math.PI
        break
      case "e":
        result = Math.E
        break
      default:
        return
    }

    setDisplay(String(result))
    addToHistory(`${func}(${inputValue}) = ${result}`)
    setWaitingForNewValue(true)
  }

  const factorial = (n) => {
    if (n < 0 || n !== Math.floor(n)) return NaN
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }

  const memoryOperation = (op) => {
    const inputValue = parseFloat(display)
    
    switch (op) {
      case "MC":
        setMemory(0)
        break
      case "MR":
        setDisplay(String(memory))
        setWaitingForNewValue(true)
        break
      case "MS":
        setMemory(inputValue)
        break
      case "M+":
        setMemory(memory + inputValue)
        break
      case "M-":
        setMemory(memory - inputValue)
        break
    }
  }

  const addToHistory = (calculation) => {
    setHistory(prev => [calculation, ...prev.slice(0, 9)]) // Keep last 10 calculations
  }

  const Button = ({ onClick, className = "", children, wide = false }) => (
    <button
      onClick={onClick}
      className={`
        h-12 rounded-lg font-medium transition-colors
        ${wide ? 'col-span-2' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Scientific Calculator</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calculator */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              {/* Display */}
              <div className="mb-4">
                <div className="bg-gray-900 text-white p-4 rounded-lg text-right text-2xl font-mono min-h-[60px] flex items-center justify-end">
                  {display}
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                  <div>Memory: {memory !== 0 ? memory : "Empty"}</div>
                  <div>
                    <button
                      onClick={() => setAngleMode(angleMode === "deg" ? "rad" : "deg")}
                      className="bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {angleMode.toUpperCase()}
                    </button>
                  </div>
                </div>
              </div>

              {/* Scientific Functions */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <Button onClick={() => performFunction("sin")} className="bg-purple-100 hover:bg-purple-200 text-purple-700">sin</Button>
                <Button onClick={() => performFunction("cos")} className="bg-purple-100 hover:bg-purple-200 text-purple-700">cos</Button>
                <Button onClick={() => performFunction("tan")} className="bg-purple-100 hover:bg-purple-200 text-purple-700">tan</Button>
                <Button onClick={() => performFunction("log")} className="bg-purple-100 hover:bg-purple-200 text-purple-700">log</Button>
                <Button onClick={() => performFunction("ln")} className="bg-purple-100 hover:bg-purple-200 text-purple-700">ln</Button>
                <Button onClick={() => performOperation("^")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">x^y</Button>
                <Button onClick={() => performFunction("sqrt")} className="bg-purple-100 hover:bg-purple-200 text-purple-700">√</Button>
                <Button onClick={() => performFunction("factorial")} className="bg-purple-100 hover:bg-purple-200 text-purple-700">n!</Button>
              </div>

              <div className="grid grid-cols-8 gap-2 mb-4">
                <Button onClick={() => performFunction("asin")} className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs">asin</Button>
                <Button onClick={() => performFunction("acos")} className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs">acos</Button>
                <Button onClick={() => performFunction("atan")} className="bg-purple-100 hover:bg-purple-200 text-purple-700 text-xs">atan</Button>
                <Button onClick={() => performFunction("π")} className="bg-green-100 hover:bg-green-200 text-green-700">π</Button>
                <Button onClick={() => performFunction("e")} className="bg-green-100 hover:bg-green-200 text-green-700">e</Button>
                <Button onClick={() => performFunction("square")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">x²</Button>
                <Button onClick={() => performFunction("cube")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">x³</Button>
                <Button onClick={() => performFunction("1/x")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">1/x</Button>
              </div>

              {/* Memory Functions */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                <Button onClick={() => memoryOperation("MC")} className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm">MC</Button>
                <Button onClick={() => memoryOperation("MR")} className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm">MR</Button>
                <Button onClick={() => memoryOperation("MS")} className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm">MS</Button>
                <Button onClick={() => memoryOperation("M+")} className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm">M+</Button>
                <Button onClick={() => memoryOperation("M-")} className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm">M-</Button>
              </div>

              {/* Main Calculator */}
              <div className="grid grid-cols-4 gap-2">
                <Button onClick={clear} className="bg-red-100 hover:bg-red-200 text-red-700">C</Button>
                <Button onClick={clearEntry} className="bg-red-100 hover:bg-red-200 text-red-700">CE</Button>
                <Button onClick={() => performFunction("+/-")} className="bg-gray-100 hover:bg-gray-200 text-gray-700">±</Button>
                <Button onClick={() => performOperation("÷")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">÷</Button>

                <Button onClick={() => inputNumber(7)} className="bg-gray-50 hover:bg-gray-100">7</Button>
                <Button onClick={() => inputNumber(8)} className="bg-gray-50 hover:bg-gray-100">8</Button>
                <Button onClick={() => inputNumber(9)} className="bg-gray-50 hover:bg-gray-100">9</Button>
                <Button onClick={() => performOperation("×")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">×</Button>

                <Button onClick={() => inputNumber(4)} className="bg-gray-50 hover:bg-gray-100">4</Button>
                <Button onClick={() => inputNumber(5)} className="bg-gray-50 hover:bg-gray-100">5</Button>
                <Button onClick={() => inputNumber(6)} className="bg-gray-50 hover:bg-gray-100">6</Button>
                <Button onClick={() => performOperation("-")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">−</Button>

                <Button onClick={() => inputNumber(1)} className="bg-gray-50 hover:bg-gray-100">1</Button>
                <Button onClick={() => inputNumber(2)} className="bg-gray-50 hover:bg-gray-100">2</Button>
                <Button onClick={() => inputNumber(3)} className="bg-gray-50 hover:bg-gray-100">3</Button>
                <Button onClick={() => performOperation("+")} className="bg-orange-100 hover:bg-orange-200 text-orange-700">+</Button>

                <Button onClick={() => inputNumber(0)} className="bg-gray-50 hover:bg-gray-100" wide>0</Button>
                <Button onClick={inputDot} className="bg-gray-50 hover:bg-gray-100">.</Button>
                <Button onClick={() => performOperation("=")} className="bg-blue-600 hover:bg-blue-700 text-white">=</Button>
              </div>
            </div>

            {/* History Panel */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">History</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.length > 0 ? (
                  history.map((calc, index) => (
                    <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                      {calc}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No calculations yet</p>
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg text-sm">
            <h4 className="font-semibold mb-2">Functions Guide:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Trigonometric:</strong> sin, cos, tan, asin, acos, atan</p>
                <p><strong>Logarithmic:</strong> log (base 10), ln (natural log)</p>
                <p><strong>Power:</strong> x², x³, x^y, √, 1/x</p>
              </div>
              <div>
                <p><strong>Constants:</strong> π (pi), e (Euler's number)</p>
                <p><strong>Memory:</strong> MC (clear), MR (recall), MS (store), M+, M-</p>
                <p><strong>Angle Mode:</strong> Toggle between degrees and radians</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}