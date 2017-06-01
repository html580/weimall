const App = getApp()

Page({
    data: {
        canEdit: !1,
        carts: {
            items: []
        },
        prompt: {
            hidden: !0,
            icon: '../../assets/images/iconfont-cart-empty.png',
            title: '购物车空空如也',
            text: '来挑几件好货吧',
            buttons: [
                {
                    text: '随便逛',
                    bindtap: 'bindtap',
                },
            ],
        },
    },
    bindtap: function(e) {
        const index = e.currentTarget.dataset.index
        switch(index) {
            case 0:
                App.WxService.switchTab({
                    url: '/pages/index/index'
                })
                break
            default:
                break
        }
    },
    onLoad() {
    },
    onShow() {
        this.getCarts()
    },
    getCarts() {
      App.HttpService.getData({
        table: 'cart',
        link_table:'content' 
      }).then(data => {
        if (data.code == 0) {
          data.data.forEach(function(n){
             n.path = App.renderImage(n.img);
             n.totalAmount=n.price*n.total;
          });
          this.setData({
            'carts.items': data.data,
            'prompt.hidden': data.total
          });
        }
      });
    },
    onPullDownRefresh() {
        this.getCarts()
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    confirmOrder(e) {
        console.log(e)
        App.WxService.setStorageSync('confirmOrder', this.data.carts.items)
        App.WxService.navigateTo('/pages/order/confirm/index')
    },
    del(e) {
        const id = e.currentTarget.dataset.id

        App.WxService.showModal({
            title: '友情提示', 
            content: '确定要删除这个宝贝吗？', 
        })
        .then(data => {
            if (data.confirm == 1) {
              App.HttpService.delData({
                table: 'cart',
                id: id
              }).then(data => {
                if (data.code == 0) {
                  this.getCarts()
                }
              });
            }
        })
    },
    clear() {
        App.WxService.showModal({
            title: '友情提示', 
            content: '确定要清空购物车吗？', 
        })
        .then(data => {
            if (data.confirm == 1) {
              App.HttpService.delData({
                table: 'cart',
                user_id: App.WxService.getStorageSync('openId')
              }).then(data => {
                if (data.code == 0) {
                  this.getCarts()
                }
              });
            }
        })
    },
    onTapEdit(e) {
        this.setData({
            canEdit: !!e.currentTarget.dataset.value
        })
    },
    showToast(message) {
      App.WxService.showToast({
        title: message,
        icon: 'success',
        duration: 1500,
      })
    },
    changeCartTotal:function(id,total){
      var items = this.data.carts.items;
      items.forEach(function (n) {
           if(n.id==id){
                n.total=total;
                n.totalAmount = n.price * n.total;
           }
      });
      this.setData({
        'carts.items': items        
      });
      App.HttpService.updateData({
        table: 'cart',
        total: total,
        id: id
      }).then(data => {
        if (data.code == 0) {
          this.showToast(data.message);
        }
      });
    },
    bindKeyInput(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.detail.value)
        if (total <= 0 || total > 100 ) return
        this.changeCartTotal(id, total);
        
    },
    decrease(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 1) return
        e.currentTarget.dataset.total = total-1;
        this.changeCartTotal(id, total-1);
    },
    increase(e) {
        const id = e.currentTarget.dataset.id
        const total = Math.abs(e.currentTarget.dataset.total)
        if (total == 100) return
        e.currentTarget.dataset.total = total + 1;
        this.changeCartTotal(id, total + 1);
    },
})