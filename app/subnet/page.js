"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function SubnetCalculator() {
  const [ipAddress, setIpAddress] = useState("192.168.1.0")
  const [subnetMask, setSubnetMask] = useState("24")
  const [inputType, setInputType] = useState("cidr") // cidr or decimal
  const [decimalMask, setDecimalMask] = useState("255.255.255.0")
  const [result, setResult] = useState(null)

  const validateIP = (ip) => {
    const parts = ip.split('.')
    if (parts.length !== 4) return false
    return parts.every(part => {
      const num = parseInt(part, 10)
      return num >= 0 && num <= 255
    })
  }

  const ipToNumber = (ip) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0
  }

  const numberToIP = (num) => {
    return [(num >>> 24), (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join('.')
  }

  const cidrToDecimal = (cidr) => {
    const mask = (0xffffffff << (32 - cidr)) >>> 0
    return numberToIP(mask)
  }

  const decimalToCIDR = (decimal) => {
    const parts = decimal.split('.').map(part => parseInt(part, 10))
    const mask = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
    return 32 - Math.log2((~mask >>> 0) + 1)
  }

  const getIPClass = (ip) => {
    const firstOctet = parseInt(ip.split('.')[0], 10)
    if (firstOctet >= 1 && firstOctet <= 126) return 'A'
    if (firstOctet >= 128 && firstOctet <= 191) return 'B'
    if (firstOctet >= 192 && firstOctet <= 223) return 'C'
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)'
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Reserved)'
    return 'Invalid'
  }

  const isPrivateIP = (ip) => {
    const parts = ip.split('.').map(part => parseInt(part, 10))
    const [a, b, c, d] = parts
    
    // 10.0.0.0/8
    if (a === 10) return true
    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true
    // 192.168.0.0/16
    if (a === 192 && b === 168) return true
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true
    
    return false
  }

  const calculateSubnet = () => {
    if (!validateIP(ipAddress)) {
      setResult({ error: "Invalid IP address format" })
      return
    }

    let cidr
    let mask

    if (inputType === "cidr") {
      cidr = parseInt(subnetMask, 10)
      if (cidr < 0 || cidr > 32) {
        setResult({ error: "CIDR must be between 0 and 32" })
        return
      }
      mask = cidrToDecimal(cidr)
    } else {
      if (!validateIP(decimalMask)) {
        setResult({ error: "Invalid subnet mask format" })
        return
      }
      mask = decimalMask
      cidr = decimalToCIDR(mask)
    }

    const ipNum = ipToNumber(ipAddress)
    const maskNum = ipToNumber(mask)
    const wildcardNum = (~maskNum) >>> 0

    const networkNum = (ipNum & maskNum) >>> 0
    const broadcastNum = (networkNum | wildcardNum) >>> 0

    const networkAddress = numberToIP(networkNum)
    const broadcastAddress = numberToIP(broadcastNum)
    const firstHost = numberToIP(networkNum + 1)
    const lastHost = numberToIP(broadcastNum - 1)

    const totalHosts = Math.pow(2, 32 - cidr)
    const usableHosts = Math.max(0, totalHosts - 2)
    const totalSubnets = Math.pow(2, cidr)

    const ipClass = getIPClass(ipAddress)
    const isPrivate = isPrivateIP(ipAddress)

    // Calculate all possible subnets for the given CIDR
    const allSubnets = []
    const subnetSize = Math.pow(2, 32 - cidr)
    let currentNetwork = ipToNumber("0.0.0.0")
    
    for (let i = 0; i < Math.min(256, totalSubnets); i++) {
      const subnetNetwork = numberToIP(currentNetwork)
      const subnetBroadcast = numberToIP(currentNetwork + subnetSize - 1)
      allSubnets.push({
        network: subnetNetwork,
        broadcast: subnetBroadcast,
        range: `${subnetNetwork} - ${subnetBroadcast}`
      })
      currentNetwork += subnetSize
    }

    setResult({
      input: {
        ipAddress,
        subnetMask: mask,
        cidr
      },
      network: {
        address: networkAddress,
        broadcast: broadcastAddress,
        firstHost,
        lastHost,
        wildcardMask: numberToIP(wildcardNum)
      },
      hosts: {
        total: totalHosts.toLocaleString(),
        usable: usableHosts.toLocaleString()
      },
      info: {
        class: ipClass,
        isPrivate,
        totalSubnets: totalSubnets.toLocaleString()
      },
      subnets: allSubnets.slice(0, 10) // Show first 10 subnets
    })
  }

  const commonSubnets = [
    { name: "/8 (Class A)", cidr: 8, mask: "255.0.0.0", hosts: "16,777,214" },
    { name: "/16 (Class B)", cidr: 16, mask: "255.255.0.0", hosts: "65,534" },
    { name: "/24 (Class C)", cidr: 24, mask: "255.255.255.0", hosts: "254" },
    { name: "/25", cidr: 25, mask: "255.255.255.128", hosts: "126" },
    { name: "/26", cidr: 26, mask: "255.255.255.192", hosts: "62" },
    { name: "/27", cidr: 27, mask: "255.255.255.224", hosts: "30" },
    { name: "/28", cidr: 28, mask: "255.255.255.240", hosts: "14" },
    { name: "/29", cidr: 29, mask: "255.255.255.248", hosts: "6" },
    { name: "/30", cidr: 30, mask: "255.255.255.252", hosts: "2" }
  ]

  const setCommonSubnet = (cidr, mask) => {
    setSubnetMask(cidr.toString())
    setDecimalMask(mask)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Subnet Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Input Section */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">IP Address</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="192.168.1.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subnet Mask Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="cidr"
                      checked={inputType === "cidr"}
                      onChange={(e) => setInputType(e.target.value)}
                      className="mr-2"
                    />
                    CIDR Notation (e.g., /24)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="decimal"
                      checked={inputType === "decimal"}
                      onChange={(e) => setInputType(e.target.value)}
                      className="mr-2"
                    />
                    Decimal Notation (e.g., 255.255.255.0)
                  </label>
                </div>
              </div>

              {inputType === "cidr" ? (
                <div>
                  <label className="block text-sm font-medium mb-2">CIDR (0-32)</label>
                  <input
                    type="number"
                    min="0"
                    max="32"
                    value={subnetMask}
                    onChange={(e) => setSubnetMask(e.target.value)}
                    className="w-full md:w-32 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="24"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Subnet Mask</label>
                  <input
                    type="text"
                    value={decimalMask}
                    onChange={(e) => setDecimalMask(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="255.255.255.0"
                  />
                </div>
              )}
            </div>

            {/* Common Subnets */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Common Subnet Masks</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {commonSubnets.map((subnet, index) => (
                  <button
                    key={index}
                    onClick={() => setCommonSubnet(subnet.cidr, subnet.mask)}
                    className="text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    <div className="font-semibold">{subnet.name}</div>
                    <div className="text-gray-600">{subnet.mask}</div>
                    <div className="text-xs text-gray-500">{subnet.hosts} hosts</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculateSubnet}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Subnet
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
                    {/* Input Summary */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Input Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">IP Address</p>
                          <p className="font-bold">{result.input.ipAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Subnet Mask</p>
                          <p className="font-bold">{result.input.subnetMask}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">CIDR</p>
                          <p className="font-bold">/{result.input.cidr}</p>
                        </div>
                      </div>
                    </div>

                    {/* Network Information */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Network Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Network Address</p>
                          <p className="font-bold text-green-600">{result.network.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Broadcast Address</p>
                          <p className="font-bold text-green-600">{result.network.broadcast}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">First Host</p>
                          <p className="font-bold">{result.network.firstHost}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Last Host</p>
                          <p className="font-bold">{result.network.lastHost}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Wildcard Mask</p>
                          <p className="font-bold">{result.network.wildcardMask}</p>
                        </div>
                      </div>
                    </div>

                    {/* Host Information */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Host Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Hosts</p>
                          <p className="text-2xl font-bold">{result.hosts.total}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Usable Hosts</p>
                          <p className="text-2xl font-bold text-yellow-600">{result.hosts.usable}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">IP Class</p>
                          <p className="text-2xl font-bold">{result.info.class}</p>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-sm">
                          Network Type: <span className="font-bold">
                            {result.info.isPrivate ? 'Private Network' : 'Public Network'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Subnet Examples */}
                    {result.subnets.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-bold mb-3">Sample Subnets (First 10)</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Network</th>
                                <th className="text-left py-2">Broadcast</th>
                                <th className="text-left py-2">Host Range</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.subnets.map((subnet, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-2 font-mono">{subnet.network}</td>
                                  <td className="py-2 font-mono">{subnet.broadcast}</td>
                                  <td className="py-2 font-mono text-xs">{subnet.range}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* IP Classes Reference */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">IP Address Classes Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Public IP Classes:</h4>
                <ul className="space-y-1">
                  <li><strong>Class A:</strong> 1.0.0.0 - 126.255.255.255 (/8)</li>
                  <li><strong>Class B:</strong> 128.0.0.0 - 191.255.255.255 (/16)</li>
                  <li><strong>Class C:</strong> 192.0.0.0 - 223.255.255.255 (/24)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Private IP Ranges:</h4>
                <ul className="space-y-1">
                  <li><strong>Class A:</strong> 10.0.0.0 - 10.255.255.255</li>
                  <li><strong>Class B:</strong> 172.16.0.0 - 172.31.255.255</li>
                  <li><strong>Class C:</strong> 192.168.0.0 - 192.168.255.255</li>
                  <li><strong>Loopback:</strong> 127.0.0.0 - 127.255.255.255</li>
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