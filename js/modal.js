// 质押
$('.pledge').click(function() { controlModal('pledge') })
$('.extract').click(function() { controlModal('extract') })
$('.modal_head_pledge').click(function(){ controlModal('pledge') })
$('.modal_head_extract').click(function(){ controlModal('extract') })

$('.modal_close').click(function() {
  $('.modal_wrap').hide()
})
function controlModal(key) {
  $(`.modal_head_${key}`).addClass('cur').siblings().removeClass('cur')
  $(`.modal_${key}`).show().siblings().hide()
  $('.modal_wrap').show()
}