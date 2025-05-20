import crypto from "crypto"

// AES-128 encryption/decryption utility using the specified key
const ENCRYPTION_KEY = process.env.JWT_SECRET || "janzenpogi111" // 16 bytes key for AES-128
const IV_LENGTH = 16 // For AES, this is always 16 bytes

// Pad the key to ensure it's exactly 16 bytes (128 bits)
const padKey = (key: string): Buffer => {
  const buffer = Buffer.alloc(16)
  buffer.fill(0) // Fill with zeros
  buffer.write(key) // Write the key
  return buffer
}

const paddedKey = padKey(ENCRYPTION_KEY)

export const encrypt = (text: string): string => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv("aes-128-cbc", paddedKey, iv)

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    // Return iv + encrypted data in hex format
    return iv.toString("hex") + ":" + encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

export const decrypt = (text: string): string => {
  try {
    const textParts = text.split(":")
    if (textParts.length !== 2) {
      throw new Error("Invalid encrypted text format")
    }

    const iv = Buffer.from(textParts[0], "hex")
    const encryptedText = textParts[1]

    const decipher = crypto.createDecipheriv("aes-128-cbc", paddedKey, iv)

    let decrypted = decipher.update(encryptedText, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

// Verify if an encrypted password matches the provided password
export const verifyPassword = (encryptedPassword: string, password: string): boolean => {
  try {
    const decrypted = decrypt(encryptedPassword)
    return decrypted === password
  } catch (error) {
    console.error("Password verification error:", error)
    return false
  }
}
