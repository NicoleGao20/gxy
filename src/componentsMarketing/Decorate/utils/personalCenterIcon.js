(function() {
  setTimeout(() => {
    begin()
  }, 500)
  // 获取url 参数
  var openId = ''
  var ifPremiumLevel = ''
  var loginName = ''
  var isBuyLevel = ''
  var orgCodeLong = ''
  function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }
  function begin() {
    $.ajax({
      type: 'GET',
      url: '/memberCenter/getMemberCenterInfo?openId=ozbAIv4N05YUfQXlwX3xK0JvjAwQ&brandCode=TS',
      dataType: 'json',
      timeout: 7000,
      success: function(res) {
        openId = res.data.openId
        ifPremiumLevel = res.data.ifPremiumLevel
        loginName = res.data.logonName
        isBuyLevel = res.data.ifBuyLevel
        orgCodeLong = res.data.orgCodeLong
        render(res.data)
      },
      error: function(xhr, type) {
        alert('Ajax error!')
      }
    })
  }
  function render(data) {
    var list = [
      { className: 'vip-page-benefit', type: 'benefit' },
      { className: 'vip-page-order', type: 'order' },
      { className: 'vip-page-card', type: 'card' },
      { className: 'vip-page-activity', type: 'activity' },
      { className: 'vip-page-code', type: 'code' },
      { className: 'vip-page-prize', type: 'prize' },
      { className: 'benefitCenter', type: 'benefitCenter' },
      { className: 'allGoods', type: 'allGoods' },
      { className: 'actcenter', type: 'actcenter' },
      { className: 'pocket', type: 'pocket' }
    ]
    for (let index = 0; index < list.length; index++) {
      const element = list[index]
      $('.' + element.className).click(function() {
        btnClick(element.type)
      })
    }
  }
  function btnClick(type) {
    switch (type) {
      case 'actcenter': // 活动中心
        window.location.href = '/f/activity/home.html?brandCode=' + getQueryString('brandCode') + '&shopOrgCode=' + getQueryString('shopOrgCode')
        break
      case 'allGoods': // 积分商城
        // window.location.href = this.contextPath + '/pointshop/home/view.do?brandCode='+this.brandCode+'&openID='+this.openId+'&shopOrgCode='+this.shopOrgCode;
        window.location.href = '/f/mall/mall.html?brandCode=' + getQueryString('brandCode')
        break
      case 'benefitCenter': // 权益中心
        var isVIP = ifPremiumLevel ? 1 : 0
        // this.$router.push({name:'benefitsCenter',query:{brandCode:this.brandCode,shopOrgCode:this.shopOrgCode,loginName:loginName,shareOrgCode:this.shopOrgCode,isVIP:isVIP,orgCodeLong:orgCodeLong,isBuyLevel:isBuyLevel}})
        window.location.href = '/f/wap/#/benefitsCenter?brandCode=' + getQueryString('brandCode') + '&shopOrgCode=' + getQueryString('shopOrgCode') + '&loginName=' + loginName + '&shareOrgCode=' + getQueryString('shopOrgCode') + '&isVIP=' + isVIP + '&orgCodeLong=' + orgCodeLong + '&isBuyLevel=' + isBuyLevel
        break
      case 'benefit':// 我的权益
        var isVIP = ifPremiumLevel ? 1 : 0
        // this.$router.push({name:'benefits',query:{brandCode:getQueryString('brandCode'),shopOrgCode:this.shopOrgCode,isVIP:this.isVIP,loginName:loginName,shareOrgCode:this.shopOrgCode,orgCodeLong:orgCodeLong,isBuyLevel:isBuyLevel}})
        window.location.href = '/f/wap/#/benefits?brandCode=' + getQueryString('brandCode') + '&shopOrgCode=' + getQueryString('shopOrgCode') + '&isVIP=' + isVIP + '&loginName=' + loginName + '&shareOrgCode=' + getQueryString('shopOrgCode') + '&orgCodeLong=' + orgCodeLong + '&isBuyLevel=' + isBuyLevel
        break
      case 'order': // 我的订单
        // _hmt.push(hmtMap['home'][15])
        window.location.href = '/f/wap/#/orderList?shopOrgCode=' + getQueryString('shopOrgCode') + '&brandCode=' + getQueryString('brandCode') + '&entry=99'
        // window.location.href = this.contextPath+'/store/weshop_order_controller/orderList.html?brandCode='+ getQueryString('brandCode') +'&loginName='+loginName+'&shopOrgCode='+this.shopOrgCode+'&openID='+this.openId;
        // this.$router.push({name:'orderList',query:{shopOrgCode:this.shopOrgCode,brandCode:getQueryString('brandCode'),entry:99}})
        break
      case 'card':// 优惠卷
        // _hmt.push(hmtMap['home'][8])
        // window.location.href = this.wcapPath+'/coupon_controllers/view_has_got_coupon.do?openID='+this.openId+'&brandCode='+getQueryString('brandCode')+'&shopOrgCode='+this.shopOrgCode+'&newCouponCount=&loginName='+loginName;
        window.location.href = '/f/wap/#/myCoupon?openID=' + openId + '&brandCode=' + getQueryString('brandCode') + '&shopOrgCode=' + getQueryString('shopOrgCode') + '&loginName=' + loginName
        break
      case 'activity':// 我的活动
        // window.location.href = this.activityUrl;
        window.location.href = '/f/wap/#/myActivity?brandCode=' + getQueryString('brandCode') + '&shopOrgCode=' + getQueryString('shopOrgCode')
        break
      case 'code': // 我的资格码
        // _hmt.push(hmtMap['home'][14])
        window.location.href = '/f/wap/#/limitSaleCodeList?brandCode=' + getQueryString('brandCode')
        break
      case 'prize': // 我的奖品
        window.location.href = '/f/wap/#/myActivity?brandCode=' + getQueryString('brandCode') + '&shopOrgCode=' + getQueryString('shopOrgCode') + '&goMyprize=1'
        break
      case 'pocket': // 卡包
        window.location.href = '/store/myMember_controllers/tm_register.do?openId=' + openId + '&brandCode=' + getQueryString('brandCode')
        break
      default:
        break
    }
  }
})()
