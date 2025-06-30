"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function PasswordGenerator() {
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(null)
  const [copied, setCopied] = useState(false)

  const generatePassword = () => {
    let charset = ""
    
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz"
    if (includeNumbers) charset += "0123456789"
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, "")
    }
    
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\/\\'"~,;<>.]/g, "")
    }
    
    if (charset === "") {
      alert("Please select at least one character type!")
      return
    }
    
    let generatedPassword = ""
    
    // Ensure at least one character from each selected type
    if (includeUppercase && charset.includes("A")) {
      generatedPassword += getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    }
    if (includeLowercase && charset.includes("a")) {
      generatedPassword += getRandomChar("abcdefghijklmnopqrstuvwxyz")
    }
    if (includeNumbers && charset.includes("0")) {
      generatedPassword += getRandomChar("0123456789")
    }
    if (includeSymbols && charset.includes("!")) {
      generatedPassword += getRandomChar("!@#$%^&*()_+-=[]{}|;:,.<>?")
    }
    
    // Fill the rest randomly
    for (let i = generatedPassword.length; i < length; i++) {
      generatedPassword += getRandomChar(charset)
    }
    
    // Shuffle the password
    generatedPassword = shuffleString(generatedPassword)
    
    setPassword(generatedPassword)
    calculateStrength(generatedPassword)
    setCopied(false)
  }

  const getRandomChar = (str) => {
    return str.charAt(Math.floor(Math.random() * str.length))
  }

  const shuffleString = (str) => {
    return str.split('').sort(() => Math.random() - 0.5).join('')
  }

  const calculateStrength = (pwd) => {
    let score = 0
    let feedback = []
    
    // Length check
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    
    // Additional checks
    if (pwd.length < 8) feedback.push("Use at least 8 characters")
    if (!/[a-z]/.test(pwd)) feedback.push("Add lowercase letters")
    if (!/[A-Z]/.test(pwd)) feedback.push("Add uppercase letters")
    if (!/[0-9]/.test(pwd)) feedback.push("Add numbers")
    if (!/[^A-Za-z0-9]/.test(pwd)) feedback.push("Add symbols")
    
    let strength = "Very Weak"
    let color = "text-red-600"
    
    if (score >= 7) {
      strength = "Very Strong"
      color = "text-green-600"
    } else if (score >= 5) {
      strength = "Strong"
      color = "text-green-500"
    } else if (score >= 4) {
      strength = "Good"
      color = "text-yellow-600"
    } else if (score >= 2) {
      strength = "Weak"
      color = "text-orange-600"
    }
    
    setPasswordStrength({
      score,
      strength,
      color,
      feedback
    })
  }

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const getStrengthWidth = () => {
    if (!passwordStrength) return "0%"
    return `${(passwordStrength.score / 7) * 100}%`
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Password Generator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password Length: {length}</label>
              <div className="flex items-center space-x-4">
                <span className="text-sm">4</span>
                <input
                  type="range"
                  min="4"
                  max="128"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm">128</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Include Characters</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="mr-3"
                  />
                  <span>Uppercase Letters (A-Z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="mr-3"
                  />
                  <span>Lowercase Letters (a-z)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="mr-3"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="mr-3"
                  />
                  <span>Symbols (!@#$%^&*)</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Exclude Characters</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                    className="mr-3"
                  />
                  <span>Similar Characters (i, l, 1, L, o, 0, O)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                    className="mr-3"
                  />
                  <span>Ambiguous Characters (&quot; ' ` ~ , ; &lt; &gt;)</span>
                </label>
              </div>
            </div>

            <button
              onClick={generatePassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Generate Password
            </button>

            {password && (
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Generated Password</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={password}
                      readOnly
                      className="flex-1 p-3 border border-gray-300 rounded-l font-mono text-lg bg-gray-50"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-3 rounded-r font-medium transition-colors ${
                        copied 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {passwordStrength && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Password Strength</span>
                      <span className={`font-bold ${passwordStrength.color}`}>
                        {passwordStrength.strength}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= 6 ? 'bg-green-600' :
                          passwordStrength.score >= 4 ? 'bg-yellow-600' :
                          passwordStrength.score >= 2 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: getStrengthWidth() }}
                      ></div>
                    </div>
                    
                    {passwordStrength.feedback.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Suggestions:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {passwordStrength.feedback.map((suggestion, index) => (
                            <li key={index}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                  <strong>Security Tips:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Use a unique password for each account</li>
                    <li>• Store passwords in a secure password manager</li>
                    <li>• Enable two-factor authentication when available</li>
                    <li>• Never share your passwords with others</li>
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