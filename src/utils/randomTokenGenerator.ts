export function generateRandomToken(length: number = 32): string {
  // Create a typed array to hold random bytes
  const randomBytesArray = new Uint8Array(length);
  crypto.getRandomValues(randomBytesArray);

  // Convert bytes to a hex string for a more compact representation
  return randomBytesArray.reduce((token, byte) => {
    return token + byte.toString(16).padStart(2, '0');
  }, '');
}
