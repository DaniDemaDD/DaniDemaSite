// Corrected TOTP implementation using proper RFC 6238 algorithm
export async function generateTOTP(secret: string, timeStep = 30): Promise<string> {
  const time = Math.floor(Date.now() / 1000 / timeStep)
  const key = base32ToBytes(secret)
  const timeBytes = new ArrayBuffer(8)
  const timeView = new DataView(timeBytes)
  timeView.setUint32(4, time, false) // Big-endian

  const hmac = await generateHMAC(key, new Uint8Array(timeBytes))

  const offset = hmac[hmac.length - 1] & 0xf
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return (code % 1000000).toString().padStart(6, "0")
}

function base32ToBytes(base32: string): Uint8Array {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let bits = ""

  // Remove padding and convert to uppercase
  base32 = base32.replace(/=/g, "").toUpperCase()

  for (const char of base32) {
    const index = alphabet.indexOf(char)
    if (index === -1) continue
    bits += index.toString(2).padStart(5, "0")
  }

  const bytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(bits.substr(i * 8, 8), 2)
  }

  return bytes
}

async function generateHMAC(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, data)
  return new Uint8Array(signature)
}

export async function verifyTOTP(token: string, secret: string, window = 1): Promise<boolean> {
  const currentTime = Math.floor(Date.now() / 1000 / 30)

  for (let i = -window; i <= window; i++) {
    const time = currentTime + i
    const expectedToken = await generateTOTPForTime(secret, time)
    if (token === expectedToken) {
      return true
    }
  }

  return false
}

async function generateTOTPForTime(secret: string, time: number): Promise<string> {
  const key = base32ToBytes(secret)
  const timeBytes = new ArrayBuffer(8)
  const timeView = new DataView(timeBytes)
  timeView.setUint32(4, time, false) // Big-endian

  const hmac = await generateHMAC(key, new Uint8Array(timeBytes))

  const offset = hmac[hmac.length - 1] & 0xf
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  return (code % 1000000).toString().padStart(6, "0")
}
