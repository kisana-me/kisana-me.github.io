const generateKey = document.getElementById('generateKey')
const output = document.getElementById('output')
generateKey.addEventListener('click', async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: { name: "SHA-256" },
    },
    true,
    ["sign", "verify"]
  )
  const textArea = document.getElementById("input")
  const inputText = textArea.value
  let data = new TextEncoder().encode(inputText)
  let signature = await window.crypto.subtle.sign(
    {
      name: "RSA-PSS",
      saltLength: 32,
    },
    keyPair.privateKey,
    data
  )
  console.log(signature)
  console.log("署名:", new Uint8Array(signature));
  
  const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)
  const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey)
  output.innerHTML = `Public Key:<br>
    <textarea rows="20" cols="50">${JSON.stringify(publicKeyJwk)}</textarea>
    <br><br>
    Private Key:<br>
    <textarea rows="40" cols="50">${JSON.stringify(privateKeyJwk)}</textarea>`
  async function verify(message, signature, publicKey) {
    const encoder = new TextEncoder();
    const data2 = encoder.encode(message);

    // 署名を解読する
    const signatureBuffer = new Uint8Array(signature);

    // 署名を検証する
    const verified = await crypto.subtle.verify(
      {
      name: 'RSA-PSS',
      saltLength: 32,
      },
      publicKey,
      signatureBuffer,
      data2)

    return verified;
  }
  verify(inputText, signature, keyPair.publicKey)
  .then(result => console.log(result))
  .catch(error => console.error(error))
  // pem
  const publicKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const privateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );
  function arrayBufferToBase64(buffer) {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  function pemEncode(keyData, type) {
    let pem = "";
    let encoded = arrayBufferToBase64(keyData);
    for (let i = 0; i < encoded.length; i += 64) {
      pem += encoded.slice(i, i + 64) + "\n";
    }
    return `-----BEGIN ${type} KEY-----\n${pem}-----END ${type} KEY-----\n`;
  }
  function pkcs8ToPem(pkcs8) {
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
  
    const base64 = arrayBufferToBase64(pkcs8);
    let pem = pemHeader + "\n";
    for (let i = 0; i < base64.length; i += 64) {
      pem += base64.slice(i, i + 64) + "\n";
    }
    pem += pemFooter + "\n";
    return pem;
  }
  
  const publicKeyPem = pemEncode(publicKey, "PUBLIC")
  const privateKeyPem = pkcs8ToPem(privateKey, "PRIVATE")
  console.log(publicKeyPem)
  console.log(privateKeyPem)
/*
  async function importPrivateKey(pem) {
    // PEM形式の秘密鍵をバイト配列に変換
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length).trim();
    const binaryDerString = window.atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }
  
    // 秘密鍵をインポート
    const key = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-PSS",
        hash: "SHA-256"
      },
      true,
      ["sign"]
    );
  
    return key;
  }

  // PEM形式の秘密鍵を読み込む
  const privateKeyOut = await importPrivateKey(privateKeyPem);
  console.log(privateKeyOut)*/
  
  async function importPublicKey(pem) {
    // PEM形式の公開鍵をDER形式に変換
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    const binaryDerString = window.atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
      binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    
    // DER形式の公開鍵をCryptoKeyに変換
    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-PSS",
        hash: { name: "SHA-256" }
      },
      true,
      ["verify"]
    );
    
    return publicKey;
  }
  

  // PEM形式の公開鍵を読み込む
  const publicKeyOut = await importPublicKey(publicKeyPem);
  console.log(publicKeyOut)

  
})