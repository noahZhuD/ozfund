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

$('.page_gif').each(function () {
  let _this = $(this)
  _this.attr('gitTime') ? scrollChange(_this, Number(_this.attr('gitTime'))) : scrollChange(_this)
});
function scrollChange(_this, time = 3) {
  $(document).scroll(function() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var cHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if (scrollTop > _this.offset().top - cHeight) {
      if (_this.attr('src').includes('.gif') || _this.attr('past')) return
      _this.attr('src', _this.attr('src').replace('.png', '.gif')).attr('past', true)
      setTimeout(function() { _this.attr('src', _this.attr('src').replace('.gif', '.png')) }, time * 1000)
    }
  })
}




function setToken (key, value) {
  localStorage.setItem(key, value)
}
function getToken (key) {
  localStorage.getItem(key)
}
function removeToken (key) {
  localStorage.removeItem(key)
}
// 是否已经链接钱包
function linkBtnStatus(v) {
  if (v === 'success') {
    $('.line_wallet').text('已连接').attr('disabled', true)
  } else {
    $('.line_wallet').text('连接钱包').attr('disabled', false)
  }
}

if (window.ethereum) {
  let addr = window.ethereum.request({ method: 'eth_requestAccounts' })
  addr.then(res => {
    console.log(res, '已经链接啦')
    linkBtnStatus('success')
    setToken('META_MASK', res[0])
  }).catch(error => {
    linkBtnStatus('')
    removeToken('META_MASK')
    console.log(error, '没有链接')
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

