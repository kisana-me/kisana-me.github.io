const generateKey = document.getElementById('generateKey')
const output = document.getElementById('output')
generateKey.addEventListener('click', async () => {
// ECDSA秘密鍵の生成
window.crypto.subtle.generateKey(
  {
    name: "ECDSA",
    namedCurve: "P-256"
  },
  true,
  ["sign", "verify"]
)
.then(function(keyPair) {
  // JWK形式のオブジェクトにエクスポート
  return window.crypto.subtle.exportKey("jwk", keyPair.privateKey)
})
.then(function(jwk) {
  // JSON文字列に変換
  var json = JSON.stringify(jwk)
  // Base64エンコード
  var b64 = btoa(json)
  // 64文字に分割
  var output = b64.match(/.{1,64}/g).join("\n")
  console.log(output)
})
.catch(function(error) {
  console.error(error)
})
})