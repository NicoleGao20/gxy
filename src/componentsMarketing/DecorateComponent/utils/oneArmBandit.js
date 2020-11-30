
(function() {
  setTimeout(function() {
    var piclist = [
      'http://172.17.194.111:8080/file/download/CBDEE3B347CBE787AB69E96F02619789417D271B035B51E189E9036DD73FB75E416C518398875B1A08D0F45C6E9C563157B657CB103A465015625323F7665B6E',
      'http://172.17.194.111:8080/file/download/CBDEE3B347CBE787AB69E96F02619789F95CDDDF67EC01F6EF754B7D13491E010D70A83437C28328DF474568F664889D74F8747C907CDCC2A28EBADBA272649B',
      'http://172.17.194.111:8080/file/download/CBDEE3B347CBE787AB69E96F0261978950954824E20C104D90D0240C188ABDCD4AEB491C989848099F8579A74A689B021F7A50F3D8607CBD9E000128FE62D890'
    ]
    var currentTarget = [0, 0, 0]
    var scrollTarget = [1, 2, 0]
    var speed = 200
    var allData = $('.lhj-container').attr('data') ? JSON.parse($('.lhj-container').attr('data')) : ''
    var scrollNum = allData ? parseInt(allData.scrollNum) : 10
    // 获取图片数据
    // $.ajax({
    //   type: 'GET',
    //   url: '/api/one-arm-bandit',
    //   dataType: 'json',
    //   timeout: 300,
    //   success: function(res) {
    setTimeout(function() {
      // piclist = res.data.piclist
      implementDom()
      scorllBtn('lhj-scorll-begin')
    }, 300)

    //   },
    //   error: function(xhr, type) {
    //     alert('Ajax error!')
    //   }
    // })
    // 执行渲染dom
    function implementDom() {
      editDom(piclist, 'lhj-scorll-img-one', scrollTarget[0], currentTarget[0])
      editDom(piclist, 'lhj-scorll-img-two', scrollTarget[1], currentTarget[1])
      editDom(piclist, 'lhj-scorll-img-three', scrollTarget[2], currentTarget[2])
    }
    // 绑定开始抽奖按钮
    function scorllBtn(classname) {
      $('.' + classname).click(function() {
        scorllReward('lhj-scorll-img-one', currentTarget[0], scrollTarget[0])

        setTimeout(function() {
          scorllReward('lhj-scorll-img-two', currentTarget[1], scrollTarget[1])
        }, 800)

        setTimeout(function() {
          scorllReward('lhj-scorll-img-three', currentTarget[2], scrollTarget[2])
        }, 1500)
      })
    }
    // 滚动计算
    function scorllReward(classname, currentTargetNum, scrollTargetNum) {
      var num = $('.' + classname + ' ul li').length
      num -= 1
      var scorllTop = parseFloat($('.' + classname + ' ul li').css('height')) * num
      $('.' + classname + ' ul').animate({ top: -parseFloat(scorllTop) }, num * speed, 'ease-in-out', function() {
        if (classname === 'lhj-scorll-img-three') {
          resulte()
        }
      })
    }
    function resulte() {
      currentTarget = scrollTarget
      scrollTarget = [2, 0, 1]
      implementDom()
      alert('恭喜中奖了')
    }
    // 渲染图片元素
    function editDom(piclist, classname, scrollTargetNum, currentTargetNum) {
      var scorllImg = $('.' + classname)
      var domlist = ''
      var renderDomNum = 0
      renderDom()
      function renderDom(params) {
        renderDomNum += 1
        if (renderDomNum === 1) {
          for (var i = currentTargetNum; i < piclist.length; i++) {
            domlist += `<li><img style="display:block;height:${scorllImg.css('height')}" src="${piclist[i]}"></li>`
          }
        } else if (renderDomNum === scrollNum + 1) {
          for (var i = 0; i < scrollTargetNum + 1; i++) {
            domlist += `<li><img style="display:block;height:${scorllImg.css('height')}" src="${piclist[i]}"></li>`
          }
        } else {
          for (var i = 0; i < piclist.length; i++) {
            domlist += `<li><img style="display:block;height:${scorllImg.css('height')}" src="${piclist[i]}"></li>`
          }
        }

        if (renderDomNum === scrollNum + 1) {
          renderDomNum = 0
        } else {
          renderDom()
        }
      }
      scorllImg.before(`
				<div class="${classname}" id="${classname}" style="
					position: absolute;
					top: ${scorllImg.css('top')};
				 	left: ${scorllImg.css('left')};
				 	width:${scorllImg.css('width')};
				 	height:${scorllImg.css('height')};
				 	overflow: hidden;
				">
					<ul style="
						position: absolute;
					 	top: 0;
					 	left: 0;
					 	width:${scorllImg.css('width')};
					 	height:${piclist.length * scrollNum * parseFloat(scorllImg.css('height')) + 'px'}"
					>
					${domlist}
					</ul>
				</div>
				`)
      scorllImg.remove()
    }
  }, 500)
})();
(function() {
  setTimeout(function() {
    var num = 0
    var oldWinData = [0, 0, 0]
    var currentData = [2, 1, 0]
    var scrollNum = 3
    var speed = 2
    var piclist = [
      '/file/download/CBDEE3B347CBE787AB69E96F02619789417D271B035B51E189E9036DD73FB75E416C518398875B1A08D0F45C6E9C563157B657CB103A465015625323F7665B6E',
      '/file/download/CBDEE3B347CBE787AB69E96F02619789F95CDDDF67EC01F6EF754B7D13491E010D70A83437C28328DF474568F664889D74F8747C907CDCC2A28EBADBA272649B',
      '/file/download/CBDEE3B347CBE787AB69E96F0261978950954824E20C104D90D0240C188ABDCD4AEB491C989848099F8579A74A689B021F7A50F3D8607CBD9E000128FE62D890'
    ]
    var width = parseInt($('.lhj-scorll-img-one').css('width'))
    var height = parseInt($('.lhj-scorll-img-one').css('height'))
    $('body').append(`<canvas id="lhj-draw" style="width:${width}px;height:${piclist.length * height}px " width="${width}" height="${piclist.length * height}"></canvas>`)
    function draw(url, x, y, w, h) {
      // id 为canvas画布id
      // url 为canvas 要绘制的图片地址
      // callback 为绘制完成后的回调函数
      var canvas = document.getElementById('lhj-draw')
      var ctx = canvas.getContext('2d')
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = url
      img.onload = function() {
        ctx.drawImage(img, x, y, w, h)
        num += 1
        console.log(num)
        if (num === piclist.length) {
          onToUrl()
        }
      }
    }
    // 转化成图片
    function onToUrl() {
      var canvas = document.getElementById('lhj-draw')
      var url = canvas.toDataURL()
      $('body').append(`<img src="${url}"/>`)
      $('.lhj-scorll-img-one').css({ background: `url(${url}) 0 0 repeat-y` })
      $('.lhj-scorll-img-two').css({ background: `url(${url}) 0 0 repeat-y` })
      $('.lhj-scorll-img-three').css({ background: `url(${url}) 0 0 repeat-y` })
      $('.lhj-scorll-img-one').css({ transition: `all ${speed}s cubic-bezier(0.71, 0.01, 0.35, 0.98)` })
      $('.lhj-scorll-img-two').css({ transition: `all ${speed}s cubic-bezier(0.71, 0.01, 0.35, 0.98)` })
      $('.lhj-scorll-img-three').css({ transition: `all ${speed}s cubic-bezier(0.71, 0.01, 0.35, 0.98)` })
    }
    // 滚动函数
    function scrollBegin() {

    }
    for (let index = 0; index < piclist.length; index++) {
      const element = piclist[index]
      draw(element, 0, index * height, width, height)
    }
  }, 500)
})()
