function modCulc1() {
  const modNum1 = parseFloat(document.getElementById("mod_num_1").value)
  const modNum2 = parseFloat(document.getElementById("mod_num_2").value)
  const modNum3 = parseFloat(document.getElementById("mod_num_3").value)

  // 数値を掛け算して結果を計算
  const modResult1 = modNum1 % modNum3
  const modResult2 = modNum2 % modNum3
  const modResult3 =  modResult1 === modResult2

  // 結果を表示
  document.getElementById("mod_result1").innerHTML = `結果: ${modResult1}と${modResult2}だから${modResult3}`;
}
function modCulc2() {
  const modNum4 = parseFloat(document.getElementById("mod_num_4").value)
  const modNum5 = parseFloat(document.getElementById("mod_num_5").value)

  // 数値を掛け算して結果を計算
var absNum5 = Math.abs(modNum5)
  // if modNum5絶対値 < modNumの倍数 => 足す
  let i = 0
  while(absNum5 > i){
    i += modNum4
  }
  res = modNum5 + i

   res2 = res === 0

  // 結果を表示
  document.getElementById("mod_result2").innerHTML = `結果: ${res2}`
}