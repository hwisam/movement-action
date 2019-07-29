export default class ClassMovementAction {
  constructor ($el) {
    this.$el = $el
    this.scope = 'movemoentaction'
    this._class = 'action-m'
    this.$nodes = $el.querySelectorAll('.' + this._class)
    this.parentNodeAllOffsetTop = []
    this.scopeObj = []
    this.screen = {}
    this.limitTop = -300
    this.acceleration = 1 // data-acc : 스크롤에 따른 가속도
    this.asIsTop = 0
    this.isDestroy = false
  }
}

ClassMovementAction.prototype.init = function () {
  this.setScreen()
  this.buildStructure()
  this.buildScopeObj()
  this.bindEvent()
  this.isDestroy = false
}
ClassMovementAction.prototype.setScreen = function () {
  Object.assign(this.screen, {width: window.screen.width, height: window.screen.height})
}
ClassMovementAction.prototype.buildStructure = function () {
  let cnt = 0

  for (cnt; cnt < this.$nodes.length; cnt++) {
    this.$nodes[cnt].style.transform = 'translateY(0px)'
  }
}
ClassMovementAction.prototype.buildScopeObj = function () {
  let cnt = 0

  for (cnt; cnt < this.$nodes.length; cnt++) {
    let chkParentNode = (function () {
      let height = 0

      return function ($node) {
        var $pNode = $node.parentNode.closest('.action-m')
        if ($pNode) {
          height = height + $pNode.offsetTop
          return chkParentNode($pNode)
        } else {
          return height
        }
      }
    })()

    this.scopeObj.push(this._actionForScrolling(cnt))
    this.parentNodeAllOffsetTop.push(chkParentNode(this.$nodes[cnt]))
  }
}
ClassMovementAction.prototype._actionForScrolling = function (pos) {
  var $nodeListImgs = this.$nodes[pos].querySelectorAll('.action-item')
  // var $imgs = Array.prototype.slice.call($nodeListImgs)
  var $imgs = []

  for (var chCnt = 0; chCnt < $nodeListImgs.length; chCnt++) {
    if (this.$nodes[pos] === $nodeListImgs[chCnt].closest('.action-m')) {
      $imgs.push($nodeListImgs[chCnt])
    }
  }

  var imgsHeight = []
  var imgsWidth = []
  var imgCnt = 0
  var actionItemFlag = false

  for (imgCnt; imgCnt < $imgs.length; imgCnt++) {
    // lazy img 처리
    (function (cnt) {
      $imgs[cnt].onload = function () {
        imgsHeight[cnt] = this.height
        imgsWidth[cnt] = this.width
      }
    })(imgCnt)
    // lazy img 처리
    imgsHeight.push($imgs[imgCnt].clientHeight)
    imgsWidth.push($imgs[imgCnt].clientWidth)
    $imgs[imgCnt].classList.remove('v-hidden')
    // $imgs[imgCnt].style.height = `${imgsHeight[imgCnt]}px`
    // $imgs[imgCnt].style.height = 'auto'
  }
  return function (top, diff) {
    // diff : up (+)
    // diff : down (-)
    if (top > this.$nodes[pos].offsetTop + this.limitTop + this.parentNodeAllOffsetTop[pos]) {
      // var tmp = (this.$nodes[pos].style.transform.replace(/translateY\(/g,'').replace(/px\)/g,''))*1;
      var tmp = this.$nodes[pos].style.transform.replace(/[^-||.||0-9]/gi, '') * 1

      var acc = (this.$nodes[pos].dataset.acc ? (this.$nodes[pos].dataset.acc) * 1 : this.acceleration)
      diff = ((diff * acc).toFixed(2) * 1)

      this.$nodes[pos].style.transform = 'translateY(' + (diff + tmp) + 'px)'
      if (actionItemFlag) {
        for (var _imgCnt = 0; _imgCnt < $imgs.length; _imgCnt++) {
          if ($imgs[_imgCnt].dataset.direction === 'd') {
            $imgs[_imgCnt].style.top = `${this.screen.height}px`
          } else if ($imgs[_imgCnt].dataset.direction === 'u') {
            $imgs[_imgCnt].style.top = `-${(this.screen.height)}px`
          } else if ($imgs[_imgCnt].dataset.direction === 'l') {
            $imgs[_imgCnt].style.left = `-${(this.screen.width + imgsWidth[_imgCnt])}px`
          } else if ($imgs[_imgCnt].dataset.direction === 'r') {
            $imgs[_imgCnt].style.left = `${(this.screen.width + imgsWidth[_imgCnt])}px`
          } else {
            $imgs[_imgCnt].style.height = 0
          }
          $imgs[_imgCnt].style.opacity = 0
        }
        actionItemFlag = false
      }
    } else {
      this.$nodes[pos].style.transform = 'translateY(0px)'
      if (!actionItemFlag) {
        for (var __imgCnt = 0; __imgCnt < $imgs.length; __imgCnt++) {
          if (($imgs[__imgCnt].dataset && $imgs[__imgCnt].dataset.direction === 'd') || ($imgs[__imgCnt].dataset && $imgs[__imgCnt].dataset && $imgs[__imgCnt].dataset.direction === 'u')) {
            $imgs[__imgCnt].style.top = 0
          } else if (($imgs[__imgCnt].dataset && $imgs[__imgCnt].dataset.direction === 'l') || ($imgs[__imgCnt].dataset && $imgs[__imgCnt].dataset && $imgs[__imgCnt].dataset.direction === 'r')) {
            $imgs[__imgCnt].style.left = 0
          } else {
            $imgs[__imgCnt].style.height = `${imgsHeight[0]}px`
          }
          $imgs[__imgCnt].style.opacity = 1
        }
        actionItemFlag = true
      }
    }
  }.bind(this)
}
ClassMovementAction.prototype.actionEvent = function () {
  var top = window.scrollY
  var diff = this.asIsTop - top
  this.asIsTop = top

  for (var cnt = 0; cnt < this.$nodes.length; cnt++) {
    this.scopeObj[cnt](top, diff)
  }
}
ClassMovementAction.prototype.bindEvent = function () {
  this.__fn = this.actionEvent.bind(this)
  window.addEventListener('scroll', this.__fn)
}
ClassMovementAction.prototype.unbindEvent = function () {
  window.removeEventListener('scroll', this.__fn)
}
ClassMovementAction.prototype.destroy = function () {
  this.parentNodeAllOffsetTop = []
  this.scopeObj = []
  this.screen = {}

  var cnt = 0
  for (cnt; cnt < this.$nodes.length; cnt++) {
    this.$nodes[cnt].style.transform = ''
    var $img = this.$nodes[cnt].querySelectorAll('.action-item')
    if ($img.length) {
      for (var _cnt = 0; _cnt < $img.length; _cnt++) {
        $img[_cnt].style.transform = ''
      }
    }
  }
  this.unbindEvent()
  this.isDestroy = true
}
