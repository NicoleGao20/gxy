(function() {
  setTimeout(function() {
    var config = $('.vip-center-component-1').attr('data') ? JSON.parse($('.vip-center-component-1').attr('data')) : {}
    var contentWidth = $('.vip-center-component-1').width()
    // const levelInfo = [
    //   {
    //     'levelShortName': '普卡',
    //     'levelExperiencePoints': 0
    //   },
    //   {
    //     'levelShortName': '砖石',
    //     'levelExperiencePoints': 10000
    //   }
    // ]
    // const Consumptionamount = 1000
    function getData() {
      $.ajax({
        type: 'GET',
        url: '/decorateCenter/memberCenter/getMemberCenterInfo?openId=oykD_svl5eTVbCIzigXlF37iX4mI&brandCode=TS',
        dataType: 'json',
        timeout: 7000,
        success: function(res) {
          renderDom(res.data)
          renderLevel(res.data.levelList, res.data.experiencePoints)
          isShowProgressBar()
        },
        error: function(xhr, type) {
          alert('Ajax error!')
        }
      })
    }
    getData()
    function renderDom(data) {
      // 渲染dom节点数据

      // 头像
      if (data.headImgURL) {
        $('.vip-content-headImg').css({ 'background-image': 'url(' + data.headImgURL + ')' })
      }
      // 名称
      const domName = $('.vip-content-nike-name')
      const domNameWidth = domName.width()
      domName.css('width', 'auto')
      domName.html(data.nickName)
      const domNameDis = domName.width() - domNameWidth
      const backgroundLeft = parseInt($('.vip-content-level-background').css('left'))
      $('.vip-content-level-background').css({ left: backgroundLeft + domNameDis + 'px' })

      const nameLeft = parseInt($('.vip-content-level-name').css('left'))
      $('.vip-content-level-name').css({ left: nameLeft + domNameDis + 'px' })
      $('.vip-content-level-name').html(data.levelName)
      const iconLeft = parseInt($('.vip-content-level-icon').css('left'))
      $('.vip-content-level-icon').css({ left: iconLeft + domNameDis + 'px' })

      $('.vip-content-validAmount').html(data.validAmount)
      $('.vip-content-validateMonth').html(data.validateMonth)

      // 显示消费金额
      const speedMoenyDom = $('.vip-content-speed-moneny')
      speedMoenyDom.css('width', 'auto')
      speedMoenyDom.css('padding', '0 4px')
      speedMoenyDom.html('已消费' + data.experiencePoints + '元')
      // 三角形位置
      const threeDom = $('.vip-content-three')
      threeDom.css({
        'width': 0,
        'height': 0,
        'border-right': '7px solid transparent',
        'border-left': '7px solid transparent',
        'border-top': '7px solid #ffffff',
        'background-color': 'transparent'
      })
    }
    function renderLevel(levelInfo, experiencePoints) {
      const dom = $('.vip-center-levelShort')
      const progressDom = $('.vip-center-progress')
      const progressAll = $('.vip-center-progress-container')
      const progressAllLeft = parseInt(progressAll.css('left'))
      const around = $('.vip-center-progress-around')
      const levelExperiencePoints = levelInfo[levelInfo.length - 1].levelExperiencePoints ? experiencePoints / levelInfo[levelInfo.length - 1].levelExperiencePoints : 0
      const width = parseInt(progressAll.width()) * levelExperiencePoints
      progressDom.css({ width: width + 'px' })
      around.css({ borderRadius: '50%' })
      around.css({ left: width - around.width() / 2 + progressAllLeft + 'px' })
      const threeDom = $('.vip-content-three')
      threeDom.css({ left: progressAllLeft + width - threeDom.width() / 2 + 'px' })
      const speedMoenyDom = $('.vip-content-speed-moneny')
      if (speedMoenyDom.width() / 2 > progressAllLeft) {
        speedMoenyDom.css({ left: '10px' })
      } else if (speedMoenyDom.width() / 2 + progressAllLeft + width > contentWidth) {
        speedMoenyDom.css({ left: contentWidth - speedMoenyDom.width() - 10 + 'px' })
      } else {
        speedMoenyDom.css({ left: progressAllLeft + width - speedMoenyDom.width() / 2 + 'px' })
      }
      var list = ''
      for (let index = 0; index < levelInfo.length; index++) {
        const element = levelInfo[index]
        if (element.isCurrentLevel) {
          list += `<div style="display: flex;color: #fff;flex-direction: column; justify-content: space-between; align-items: center; font-size: 12px;">
            ${element.levelExperiencePoints}元
            <span style="font-size: 13px;margin-top：5px; color: #fff;">
            ${element.levelShortName}
            </span>
          </div>`
        } else {
          list += `<div style="display: flex;flex-direction: column; justify-content: space-between; align-items: center; color: #888888; font-size: 12px;">
          ${element.levelExperiencePoints}元
          <span style="font-size: 13px;margin-top：5px;">
          ${element.levelShortName}
          </span>
        </div>`
        }
      }
      const listDOM = `<div style="display: flex; justify-content: space-between;">
        ${list}
      </div>`
      dom[0].innerHTML = listDOM
    }

    function isShowProgressBar() {
      // 判断是否需要显示进度条
      if (config.progressbar === 'hidden') {
        $('.vip-center-levelShort').hide()
        $('.vip-center-progress-container').hide()
        $('.vip-center-progress-around').hide()
        $('.vip-center-progress').hide()
        $('.vip-content-speed-moneny').hide()
      }
    }
  }, 500)
})()
