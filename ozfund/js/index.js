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
var ozcoinStakeContractAddress = null;
var erc20ContractAbi = null;
var ozcoinExpandAbi = null;
var totoExpandAbi = null;
var ozcoinStakeExpandAbi = null;
var web3 = ethereum ? new Web3(ethereum) : null;
var balance = 0;
var totoBalance = 0;
var busdBalance = 0;
var ozcBalance = 0;
var address = null;
var chainId = null;

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
$(document).ready(function(){ 
  if (window.ethereum) {
    ethereumInit()
  } else {
    console.error('没有安装钱包插件')
  }
});

async function ethereumInit() {
  chainId = await ethereum.request({ method: 'eth_chainId' });
  if (getToken('META_MASK')) {

    startConnect()
    return
  }
  // var isConnectedB = ethereum.isConnected();
}
async function startConnect() {
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
  getERC20Balance(totoContractAddress, $('.toto_number'), 'ether', totoBalance)
  getERC20Balance(ozcoinContractAddress, $('.ozc_number'), 'ether', ozcBalance)
  getERC20Balance(usdtContractAddress, $('.busd_number'), 'mwei', busdBalance);
}
// 获取toto
function getTotoBalance() {
  getERC20Balance(totoContractAddress, $('.toto_number'), 'ether')
  // getOkcoinStake()
}
// toto  to  ozc
// $('.toto_exchange_ozc').click(function() {
//   approveErc20(ozcoinContractAddress, totoContractAddress, $('.toto_exchange_ozc_num').val(), "ether");
// })


// 兑换 start
// 最大限额
$(document).on('click', '.conver_oper', function() {
  if (!address) return alert('请连接钱包')
  if ($('#conversionBtn').attr('converType') === 'b-o') {
    $('#usdt').val($('.busd_number').text())
  }
  if ($('#conversionBtn').attr('converType') === 'o-b') {
    $('#ozc').val($('.ozc_number').text())
  }
  console.log('最大限额')
})
// busd换ozc
$('#conversionBtn').click(function() {
  if ($(this).attr('converType') === 'b-o') {
    busdToOzc()
  }
  if ($(this).attr('converType') === 'o-b') {
    ozcToBusd()
  }
  console.log('usdt=', $('#usdt').val())
  console.log('ozc=', $('#ozc').val())
})
// busd转ozc
async function busdToOzc() {
  if (!address) return alert('请连接钱包')
  if (!$('#usdt').val()) return alert('请输入金额')
  // 授权 
  // await approveErc20(usdtContractAddress, ozcoinContractAddress, $('#usdt').val(), "mwei");
  // 转
  exchangeOZCoin(address, ozcoinContractAddress, $('#usdt').val(), "mwei");
}
// 兑换 end


function ozcToBusd() {
  if (!address) return alert('请连接钱包')
  if (!$('#ozc').val()) return alert('请输入金额')
  reverseExchangeOZCoin(address,ozcoinContractAddress,$('#ozc').val(),"ether");
}


// 获取ERC余额
async function getERC20Balance(contractAddress, dom, unit, balanceVariate) {
  let myContract = new web3.eth.Contract(erc20ContractAbi, contractAddress, {
      from: address, // default from address
  });
  myContract.methods.balanceOf(address).call({from: address}, function(error, result){
      if(!error) {
          let ubalance = web3.utils.fromWei(String(result), unit);
          dom.html(ubalance)
          balanceVariate = ubalance
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
  getOkcoinStake()
}
async function getOkcoinStake() {
  maxFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  maxPriorityFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  gasLimit = 8000000;
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



// 授权
async function approveErc20(contractAddress,spender,amount,unit) {
  maxFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  maxPriorityFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  console.log(maxFeePerGas,1);
  console.log(maxPriorityFeePerGas,2);
  gasLimit = 8000000;
  console.log(address);
  nonce = await web3.eth.getTransactionCount( address , 'pending' );
  amountUint = web3.utils.toWei(String(amount),unit);
  let myContract = new web3.eth.Contract(erc20ContractAbi, contractAddress, {
      from: address, // default from address
      gasLimit: 70000,
      gasPrice: 1000000000 // default gas price in wei, 10 gwei in this case
  });

  var rawTransaction = {
      "from": address,
      "nonce": web3.utils.toHex(nonce),
      //"maxFeePerGas": web3.utils.toHex(maxFeePerGas),
      //"maxPriorityFeePerGas":  web3.utils.toHex(maxPriorityFeePerGas),
      "to": contractAddress,
      "value": "0x0",
      "data": myContract.methods.approve(spender,amountUint).encodeABI(),
      "chainId": chainId
  };
  const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [rawTransaction],
  });
  console.log(txHash, '授权返回的结果')
}
// 转1
async function exchangeOZCoin(exAddress,contractAddress,amount,unit) {
  maxFeePerGas = web3.utils.toWei( '2' , 'gwei' );
  maxPriorityFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  gasLimit = web3.utils.toWei( '200000' , 'wei' );
  console.log(address, '222')
  nonce = await web3.eth.getTransactionCount(address , 'pending' );
  amountUint = web3.utils.toWei(String(amount),unit);
  console.log(123)
  let myContract = new web3.eth.Contract(ozcoinExpandAbi, ozcoinContractAddress, {
      from: address, // default from address
      //gasLimit: 70000,
      //gasPrice: 1000000000 // default gas price in wei, 10 gwei in this case
  });
  console.log(gasLimit)
  console.log(maxFeePerGas);
  console.log(maxPriorityFeePerGas);
  var rawTransaction = {
      "from": address,
      "nonce": web3.utils.toHex(nonce),
      "maxFeePerGas": web3.utils.toHex(maxFeePerGas),
      "maxPriorityFeePerGas":  web3.utils.toHex(maxPriorityFeePerGas),
      "gas": web3.utils.toHex(gasLimit),
      "to": contractAddress,
      "value": "0x0",
      "data": myContract.methods.exchange(exAddress,usdtContractAddress,amountUint).encodeABI(),
      "chainId": chainId
  };
  const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [rawTransaction],
  });
  console.log(txHash, '转返回的额结果')
}
// 转2
async function reverseExchangeOZCoin(exAddress,contractAddress,amount,unit) {
  maxFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  maxPriorityFeePerGas = web3.utils.toWei( '1.5' , 'gwei' );
  gasLimit = 8000000;
  nonce = await web3.eth.getTransactionCount( address , 'pending' );
  amountUint = web3.utils.toWei(String(amount),unit);
  let myContract = new web3.eth.Contract(ozcoinExpandAbi, ozcoinContractAddress, {
      from: address, // default from address
      gasLimit: 70000,
      gasPrice: 1000000000 // default gas price in wei, 10 gwei in this case
  });
  console.log(maxFeePerGas);
  console.log(maxPriorityFeePerGas);
  var rawTransaction = {
      "from": address,
      "nonce": web3.utils.toHex(nonce),
      //"maxFeePerGas": maxFeePerGas,
      //"maxPriorityFeePerGas": maxPriorityFeePerGas,
      "to": contractAddress,
      "value": "0x0",
      "data": myContract.methods.reverseExchange(exAddress,usdtContractAddress,amountUint).encodeABI(),
      "chainId": chainId
  };
  const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [rawTransaction],
  });
  console.log(txHash, '转er')
}

// 质押、提取  start
$(".pledge_input").bind('input propertychange',function(){
  $('.pledge_number').html($(".pledge_input").val())
});
$('.all_pledge_number').click(function() {
  $('.pledge_input').val(ozcBalance)
  $('.pledge_number').html(ozcBalance)
})

$('.pledge_btn').click(function() {
  if (!$('.pledge_input').val()) return alert('请输入数量')
  stake($('.pledge_input').val(), 'ether');
})
$('.extract_btn').click(function() {
  redemption()
})


async function stake(amount,unit) {
  spender = ozcoinStakeContractAddress;
  var timestamp =new Date().getTime();
  deadline = timestamp + 360000;
  value = web3.utils.toWei( amount , unit )
  nonce = await web3.eth.getTransactionCount( address , 'pending' );
  chainIdNumber = web3.utils.hexToNumber(chainId)
  console.log(chainIdNumber,"chainId")
  permitData = signPremit("OZCoin", ozcoinContractAddress, address, spender, value, deadline, chainId, nonce);
  signatureR = await ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [address, permitData],
  });
  let myContract = new web3.eth.Contract(ozcoinStakeExpandAbi, ozcoinStakeContractAddress, {
      from: address, // default from address
      gasLimit: 70000,
      gasPrice: 1000000000 // default gas price in wei, 10 gwei in this case
  });
  console.log(signatureR)
  let r = signatureR.slice(0, 66)
  let s = '0x' + signatureR.slice(66, 130)
  let v = '0x' + signatureR.slice(130, 132)
  // console.log('r', r) //签名的前32个字节
  // console.log('s', s) //签名的后32个字节
  // console.log('v', v)//恢复值+ 27
  // console.log(web3.utils.toDecimal(v));
  permit = [address,spender,value,nonce,deadline]
  console.log(permit,"permit")
  var rawTransaction = {
      "from": address,
      "nonce": web3.utils.toHex(nonce),
      "to": ozcoinStakeContractAddress,
      "value": "0x0",
      "data": myContract.methods.stake(value,nonce,deadline,v,r,s).encodeABI(),
      "chainId": chainId
  };
  const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [rawTransaction],
  });
  console.log(txHash, '质押返回')
}
async function redemption() {
  nonce = await web3.eth.getTransactionCount( address , 'pending' );
  let myContract = new web3.eth.Contract(ozcoinStakeExpandAbi, ozcoinStakeContractAddress, {
      from: address, // default from address
      gasLimit: 70000,
      gasPrice: 1000000000 // default gas price in wei, 10 gwei in this case
  });
  var rawTransaction = {
      "from": address,
      "nonce": web3.utils.toHex(nonce),
      "to": ozcoinStakeContractAddress,
      "value": "0x0",
      "data": myContract.methods.redemption().encodeABI(),
      "chainId": chainId
  };
  const txHash = await ethereum.request({
      method: 'eth_sendTransaction',
      params: [rawTransaction],
  });
  console.log(txHash, '提取返回')
}
// 质押、提取  end





function signPremit(tokenName, verifyAddr, owner, spender, value, deadline, chainid, nonce) {
  let types = {
      EIP712Domain: [
          {
              name: 'name',
              type: 'string'
          },
          {
              name: 'version',
              type: 'string'
          },
          {
              name: 'chainId',
              type: 'uint256'
          },
          {
              name: 'verifyingContract',
              type: 'address'
          },
      ],
      Permit: [
          {
              name: 'owner',
              type: 'address'
          },
          {
              name: 'spender',
              type: 'address'
          },
          {
              name: 'value',
              type: 'uint256'
          },
          {
              name: 'nonce',
              type: 'uint256'
          },
          {
              name: 'deadline',
              type: 'uint256'
          }
      ]
  };

  let primaryType = 'Permit';
  let domain = {
      name: tokenName,
      version: '1',
      chainId: chainid,
      verifyingContract: verifyAddr
  };
  let message = {
      owner,
      spender,
      value,
      nonce,
      deadline
  };
  console.log(message)
  result = JSON.stringify({
      types,
      primaryType,
      domain,
      message
  });
  console.log(result)
  return result;
}