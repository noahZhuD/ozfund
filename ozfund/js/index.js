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

const usdtContractAddress = "0xd92e713d051c37ebb2561803a3b5fbabc4962431";
const ozcoinContractAddress = "0x0eaf4e0a126d8cf1faca4c301174175a589b1cea";
const totoContractAddress = "0xf7489804019c767086fa3c11cdf58dc14715e7ba";
var erc20ContractAbi = null;
var ozcoinExpandAbi = null;
var totoExpandAbi = null;
var ozcoinStakeExpandAbi = null;
var web3 = ethereum ? new Web3(ethereum) : null;
var balance = 0;
var address = null;

function setToken (key, value) {
  localStorage.setItem(key, value)
}
function getToken (key) {
  return localStorage.getItem(key)
}
function removeToken (key) {
  localStorage.removeItem(key)
}
// 是否已经链接钱包
function linkBtnStatus(v) {
  if (v === 'success') {
    // $('.line_wallet').text('已连接').attr('disabled',  true)
    $('.line_wallet').text('已连接').attr('disabled', false)
  } else {
    $('.line_wallet').text('连接钱包').attr('disabled', false)
  }
}

initAbi()
$(document).ready(async function(){ 
  if (window.ethereum) {
    ethereumInit()
  } else {
    console.error('没有安装钱包插件')
  }
});

async function ethereumInit() {
  if (getToken('META_MASK')) {
    startConnect()
    return
  }
  // var isConnectedB = ethereum.isConnected();
}
async function startConnect() {
  console.log(1)
  let addr = await window.ethereum.request({ method: 'eth_requestAccounts' })
  console.log(addr, 'addr')
  if (addr) { // 
    setToken('META_MASK', addr[0])
    address = addr[0]
    linkBtnStatus('success')
    getBalance(getToken('META_MASK'))
    getTotoBalance()
  } else {
    linkBtnStatus('')
    removeToken('META_MASK')
  }
}
// 获取余额
async function getBalance(account) {
  let balanceHex = await ethereum.request({ method: 'eth_getBalance', params: [account,"latest"] });
  balance = web3.utils.fromWei(String(BigInt(balanceHex)),'ether');
  getERC20Balance(totoContractAddress, $('.toto_number'), 'ether')
  getERC20Balance(ozcoinContractAddress, $('.ozc_number'), 'ether')
  getERC20Balance(usdtContractAddress, $('.busd_number'), 'mwei');
}
// 获取toto
function getTotoBalance() {
  getERC20Balance(totoContractAddress, $('.toto_number'), 'ether')
  // getOkcoinStake()
}

// 获取ERC余额
async function getERC20Balance(contractAddress, dom, unit) {
  let myContract = new web3.eth.Contract(erc20ContractAbi, contractAddress, {
      from: address, // default from address
  });
  console.log(myContract.methods.balanceOf(address), 'myContract')
  myContract.methods.balanceOf(address).call({from: address}, function(error, result){
    console.log(error, result, 'error result')
      if(!error) {
          let ubalance = web3.utils.fromWei(String(result), unit);
          dom.html(ubalance)
      } else {
          console.log(error);
      }
  });
}
      
        
// 断开链接
function endConnect() {
  ethereum.on('disconnect', handler = (error) => {
    console.log(error, '断开链接')
  });
}
  

// 链接钱包按钮
$('.line_wallet').click(function(){
  var userAgent = navigator.userAgent;
  if (!userAgent.includes('Chrome')) return alert('请使用Google浏览器')
  if (typeof window.ethereum !== 'undefined') {
    startConnect()
    // let addr = window.ethereum.request({ method: 'eth_requestAccounts' })
    // addr.then(res => {
    //   // 此处已连接
    //   console.log(res, 'rrr')
    // }).catch(err => {
    //   if (err.code === -32002) {
    //     alert('请在MetaMask绑定用户')
    //     window.open('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/home.html#initialize/welcome')

    //   }
    //   console.log(err, 'err')
    // })
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
    console.log(1, e, '112323')
  })
  ethereum.on('chainChanged', function(e) {
    console.log(2, e)
  })
}

// 请求文件
function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.onload = function () {
          if (this.status >= 200 && this.status < 300) {
              resolve(xhr.response);
          } else {
              reject({
                  status: this.status,
                  statusText: xhr.statusText
              });
          }
      };
      xhr.onerror = function () {
          reject({
              status: this.status,
              statusText: xhr.statusText
          });
      };
      xhr.send();
  });
}

// 初始化abi
async function initAbi() {
  jsonStr = await makeRequest("GET", "/ozfund/json/erc20Abi.json");
  erc20ContractAbi = JSON.parse(jsonStr);
  jsonStr = await makeRequest("GET", "/ozfund/json/ozcoinExpandAbi.json");
  ozcoinExpandAbi = JSON.parse(jsonStr);
  jsonStr = await makeRequest("GET", "/ozfund/json/totoExpandAbi.json");
  totoExpandAbi = JSON.parse(jsonStr);
  jsonStr = await makeRequest("GET", "/ozfund/json/ozcoinStakeExpandAbi.json");
  ozcoinStakeExpandAbi = JSON.parse(jsonStr);
}
async function getOkcoinStake() {
  maxFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  maxPriorityFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  gasLimit = 8000000;
  console.log(totoExpandAbi, 'totoExpandAbi');
  let myContract = new web3.eth.Contract(totoExpandAbi, totoContractAddress, {
      from: address, // default from address
      gasLimit: 70000,
      gasPrice: 1000000000 // default gas price in wei, 10 gwei in this case
  });
  myContract.methods.ozcoinStake().call({from: address}, function(error, result){
      if(!error) {
          ozcoinStakeContractAddress = String(result)
          console.log(ozcoinStakeContractAddress, "ozcoinStakeContractAddress")
      } else {
          console.log(error);
      }
  });
}