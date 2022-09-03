// 兑换
$('#usdt').bind('input propertychange', function() {
  $('#ozc').val($('#usdt').val())
})
$('#ozc').bind('input propertychange', function() {
  $('#usdt').val($('#ozc').val())
})


// 转换 b-o BUSD->OZC
var boHtml = `
    <div class="conversion_info">
      <div class="conversion_info_top"><p>从</p><span>数量：<i class="busd_number">1999</i>BUSD <i class="conver_oper">最大限度</i></span></div>
      <div class="conversion_info_input">
        <p>BUSD</p>
        <input id="usdt" type="number" placeholder="0">
      </div>
    </div>
    <div class="conversion_icon">
      <img src="/ozfund/images/purchase/icon.png" alt="">
    </div>
    <div class="conversion_info">
      <div class="conversion_info_top"><p>至</p><span>数量：<i class="ozc_number">1999OZC</i></span></div>
      <div class="conversion_info_input">
        <p>Ozcoin</p>
        <input readonly id="ozc" type="number" placeholder="0">
      </div>
    </div>
  `
  var obHtml = `
    <div class="conversion_info">
      <div class="conversion_info_top"><p>从</p><span>数量：<i class="ozc_number">1999OZC</i> <i class="conver_oper">最大限度</i></span></div>
      <div class="conversion_info_input">
        <p>Ozcoin</p>
        <input id="ozc" type="number" placeholder="0">
      </div>
    </div>
    <div class="conversion_icon">
      <img src="/ozfund/images/purchase/icon.png" alt="">
    </div>
    <div class="conversion_info">
      <div class="conversion_info_top"><p>至</p><span>数量：<i class="busd_number">1999</i>BUSD</span></div>
      <div class="conversion_info_input">
        <p>BUSD</p>
        <input readonly id="usdt" type="number" placeholder="0">
      </div>
    </div>
  `
var conversionType = 'b-o'
$('#conversionBtn').attr('converType', conversionType)
$(document).on('click', '.conversion_icon', function() {
  if (conversionType === 'b-o') {
    $('.conversion_top').html(obHtml)
    conversionType = 'o-b'
  } else {
    $('.conversion_top').html(boHtml)
    conversionType = 'b-o'
  }
  $('#conversionBtn').attr('converType', conversionType)
})
