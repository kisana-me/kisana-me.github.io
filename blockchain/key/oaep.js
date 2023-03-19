const generateKey = document.getElementById('generateKey')
const output = document.getElementById('output')
generateKey.addEventListener('click', async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  )
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)
  const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey)
  output.innerHTML = `Public Key:<br>
    <textarea rows="20" cols="50">${JSON.stringify(publicKeyJwk)}</textarea>
    <br><br>
    Private Key:<br>
    <textarea rows="40" cols="50">${JSON.stringify(privateKeyJwk)}</textarea>`
})