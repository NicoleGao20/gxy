(function() {
  setTimeout(function() {
    var brandCode = 'TS'
    var data
    var TSList = [
      { name: '普通会员', leveCode: 1, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B50F45491B70E0734A2017E75A0FBE826864AC5885E66352E1A25A9EBDA4BBF56C25DCD58776683499C0F8472078C9B83D3' },
      { name: '金卡会员', leveCode: 2, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B50FF1DD5625A81D9C574AD59281A7D362858D73231C4332BC7E79647905FB7119B3B8D1F5BAF88051C737B4108D177EFFA' },
      { name: '黑卡会员', leveCode: 3, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B50D221E2A8CB363CCE100C9F159DECA097527DC4BB178BED0D85B6E6DAC74B863D47D520B15465FB06E49C628A86B679C3' },
      { name: '砖石会员', leveCode: 4, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B505A82AFB81DE7C5B2B0AE8FC0BABAE40F20B0BBA7FD9982B8894639221E571745F66BD8A809BCDE1CD1B3810EF2771625' },
      { name: '砖石会员', leveCode: 4, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B505A82AFB81DE7C5B2B0AE8FC0BABAE40F20B0BBA7FD9982B8894639221E571745F66BD8A809BCDE1CD1B3810EF2771625' }
    ]
    var BSList = [
      { name: '银卡会员', leveCode: 1, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B50F45491B70E0734A2017E75A0FBE826864AC5885E66352E1A25A9EBDA4BBF56C25DCD58776683499C0F8472078C9B83D3' },
      { name: '金卡会员', leveCode: 2, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B50FF1DD5625A81D9C574AD59281A7D362858D73231C4332BC7E79647905FB7119B3B8D1F5BAF88051C737B4108D177EFFA' },
      { name: '钻卡会员', leveCode: 3, url: 'http://172.17.194.111:8080/file/download/D2237F8D06ADBE3C1634BBE735B54B50D221E2A8CB363CCE100C9F159DECA097527DC4BB178BED0D85B6E6DAC74B863D47D520B15465FB06E49C628A86B679C3' }
    ]
    const proggerDom = $('.vip-grade-progger') // 横线class
    const wordDom = $('.vip-grade-list-word') // 横线class
    const iconDom = $('.vip-grade-list-container') // 横线class
    const tipDom = $('.vip-grade-list-tip') // 横线class

    function getData() {
      $.ajax({
        type: 'GET',
        url: '/decorateCenter/memberCenter/getMemberCenterInfo?openId=oykD_svl5eTVbCIzigXlF37iX4mI&brandCode=TS',
        dataType: 'json',
        timeout: 7000,
        success: function(res) {
          data = res.data
          renderDom(res.data)
          // ongradeList(res.data)
          iconDomRender()
          wordDomRender()
          tipDomRender()
        },
        error: function(xhr, type) {
          alert('Ajax error!')
        }
      })
    }
    getData()
    function renderDom(data) {
      if (data.headImgURL) {
        $('.vip-content-headImg').css({ 'background-image': 'url(' + data.headImgURL + ')' })
      }
      const domName = $('.vip-content-nike-name')
      domName.css('width', 'auto')
      domName.html(data.nickName)
      $('.vip-content-account').html('会 员 账 号:' + data.logonName)
      $('.validAmount').html('我的积分：' + data.validAmount + '分')
    }
    function iconDomRender() { // 渲染图标
      const left = parseInt(proggerDom.css('left'))
      const listData = brandCode === 'TS' ? TSList : BSList
      let list = ''
      for (let index = 0; index < data.levelList.length; index++) {
        const element = data.levelList[index]
        if (element.isCurrentLevel) {
          list += `<img style="position: absolute; top:0;left:${proggerDom.width() / (data.levelList.length - 1) * index + left - 15 + 'px'};display:block;width:30px;height: 30px; transform: scale(1.4);" src="${listData[element.code - 1].url}">`
          list += `<div style="position: absolute;
          bottom:-17px;left:${proggerDom.width() / (data.levelList.length - 1) * index + left - 5 + 'px'};
          border-top: 10px transparent dashed;
          border-left: 5px transparent dashed;
          border-right: 5px transparent dashed;
          border-bottom: 10px #CE9834 solid;">
          </div>
          <div style="position: absolute;
          bottom:-18px;left:${proggerDom.width() / (data.levelList.length - 1) * index + left - 3 + 'px'};
          border-top: 6px transparent dashed;
          border-left: 3px transparent dashed;
          border-right: 3px transparent dashed;
          border-bottom: 11px #000000 solid;"></div>`
        } else {
          list += `<img style="position: absolute; top:0;left:${proggerDom.width() / (data.levelList.length - 1) * index + left - 15 + 'px'};width:29px;height: 29px; " src="${listData[element.code - 1].url}">`
        }
      }
      iconDom[0].innerHTML = `<div>${list}</div>`
    }

    function tipDomRender() {
      const left = parseInt(proggerDom.css('left'))
      var num = 0
      let dec = '再消费' + data.nextLevelNeedExperience + '元即升级 >>'
      for (let index = 0; index < data.levelList.length; index++) {
        const element = data.levelList[index]
        if (element.isCurrentLevel) {
          num = index
          if (index === data.levelList.length - 1) {
            dec = '当前已是最高等级'
          }
          // list += `<div  style="
          // height: 22px;
          // padding: 0 5px;
          // border-radius: 11px;
          // border: 1px solid #CE9834;
          // top:0;
          // left:${proggerDom.width() / (data.levelList.length - 1) * index + left - 15 + 'px'};
          // "> ${dec}</div>`
        }
      }
      tipDom.css({ display: 'flex', color: '#CE9834', 'justify-content': 'center', 'align-items': 'center', width: 'auto', padding: '0 5px', 'border': '1px solid #CE9834', 'border-radius': '11px', height: '22px' })
      tipDom.html(dec)
      const dis = proggerDom.width() / (data.levelList.length - 1) * num + left
      const resulteLeft = num === 0 ? '23px' : num === data.levelList.length - 1 ? iconDom.width() - tipDom.width() - 23 + 'px' : dis - tipDom.width() / 2 + 'px'
      tipDom.css({ left: resulteLeft })
    }

    function wordDomRender() {
      const width = proggerDom.width() + 30
      let list = ''
      for (let index = 0; index < data.levelList.length; index++) {
        const element = data.levelList[index]
        if (element.isCurrentLevel) {
          list += `<li style="padding: 3px; background: #CE9834;color: #000; border-radius:9px;">${element.levelShortName}</li>`
        } else {
          list += `<li style="padding: 3px;color: #666;">${element.levelShortName} </li>`
        }
      }
      wordDom.css({ width: width + 'px', left: parseInt(proggerDom.css('left')) - 15 + 'px' })
      wordDom[0].innerHTML = `<ul style="display: flex;justify-content: space-between; align-items: center;width:${width}px">${list}</ul>`
    }

    // function ongradeList(data) {
    //   const gradeListDom = $('.vip-grade-list-container')
    //   var list = ''
    //   for (let index = 0; index < gradeList.length; index++) {
    //     const element = gradeList[index]
    //     if (index === sle) {
    //       list += `<li style="display: flex;flex-direction: column; justify-content: space-between; align-items: center; color: #888888; font-size: 12px;">
    //         <span style="background:#CE9834; color:#000;border-radius: 6px;">${element.name}</span>
    //         <img style="width:30px;height: 29px; margin-top: 16px;padding:3px; transform: scale(1.4);" src="${element.url}">
    //       </li>`
    //     } else {
    //       list += `<li style="display: flex;flex-direction: column; justify-content: space-between; align-items: center; color: #888888; font-size: 12px;">
    //         <span>${element.name}</span>
    //       <img style="width:29px;height: 29px; margin-top: 16px;" src="${element.url}">
    //     </li>`
    //     }
    //   }

    //   gradeListDom[0].innerHTML = `<ul style="display: flex; justify-content: space-between;">${list}</ul>`
    //   debugger
    // }
  }, 500)
})()
