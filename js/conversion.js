// 兑换
$('#usdt').bind('input propertychange', function() {
  $('#ozc').val($('#usdt').val() * 10)
})
$('#ozc').bind('input propertychange', function() {
  $('#usdt').val($('#ozc').val() / 10)
})
$('#conversionBtn').click(function() {
  console.log('usdt=', $('#usdt').val())
  console.log('ozc=', $('#ozc').val())
})