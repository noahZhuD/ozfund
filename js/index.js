$('.menu').click(function() {
  console.log('dianjile')
  let spans = $(this).children('span')
  if (spans.eq(1).css('display') === 'none') {
    spans.eq(1).show()
    spans.eq(0).css('transform', 'rotateZ(0)').css('top', '0')
    spans.eq(2).css('transform', 'rotateZ(0)').css('top', '0')
    $('.menu_info').css('transform', 'translateX(-100%)')
    $('.menu_info_bg').hide()
  } else {
    spans.eq(1).hide()
    spans.eq(0).css('transform', 'rotateZ(45deg)').css('top', '7px')
    spans.eq(2).css('transform', 'rotateZ(-45deg)').css('top', '4px')
    $('.menu_info').css('transform', 'translateX(0)')
    $('.menu_info_bg').show()
  }
})
$('.menu_info_bg').on('click', function() {
  let spans = $('.menu').children('span')
  spans.eq(1).show()
  spans.eq(0).css('transform', 'rotateZ(0)').css('top', '0')
  spans.eq(2).css('transform', 'rotateZ(0)').css('top', '0')
  $('.menu_info').css('transform', 'translateX(-100%)')
  $('.menu_info_bg').hide()
})

// 判断是否已经链接钱包

if (window.ethereum) {
  let addr = window.ethereum.request({ method: 'eth_requestAccounts' })
  addr.then(res => {
    console.log(res, '已经链接啦')
  }).catch(error => {
    console.log(err, '没有链接')
  })
}
  

// 链接钱包 
$('.line_wallet').click(function(){
  var userAgent = navigator.userAgent;
  if (!userAgent.includes('Chrome')) return alert('请使用Google浏览器')
  if (typeof window.ethereum !== 'undefined') {
    let addr = window.ethereum.request({ method: 'eth_requestAccounts' })
    addr.then(res => {
      // 此处已连接
      console.log(res, 'rrr')
    }).catch(err => {
      if (err.code === -32002) {
        alert('请在MetaMask绑定用户')
        window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')

      }
      console.log(err, 'err')
    })
    
  } else {
    alert('没有安装钱包插件,请安装,安装后请刷新本页面再使用')
    window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')
    // message.error({
    //   content: '',
    //   onClick: () => { window.open('https://metamask.io/') }
    // })
  }
})




if (window.ethereum) {
  ethereum.on('accountsChanged', function(e) {
    console.log(1, e)
  })
  ethereum.on('chainChanged', function(e) {
    console.log(2, e)
  })
}

