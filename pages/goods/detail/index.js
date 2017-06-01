const App = getApp()

Page({
    data: {
        indicatorDots: !0,
        vertical: !1,
        autoplay: !1,
        interval: 3000,
        duration: 1000,
        current: 0,
        goods: {
            item: {}
        }
    },
    swiperchange(e) {
        this.setData({
            current: e.detail.current, 
        })
    },
    onLoad(option) {
        //this.goods = App.HttpResource('/goods/:id', {id: '@id'})
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getDetail(this.data.id)
    },
    addCart(e) {
        const goods = this.data.goods;
        App.HttpService.addData({
           table:'cart',
           link_id: goods.id,
           link_table: 'content',
           user_id: App.WxService.getStorageSync('openId'),
           price: goods.price
        }).then(data => {
          if (data.code == 0) {
            this.showToast(data.message)
          }
        });
    },
    previewImage(e) {
        const urls = this.data.images
        const index = e.currentTarget.dataset.index
        const current = urls[Number(index)]
        
        App.WxService.previewImage({
            current: current, 
            urls: urls, 
        })
    },
    showToast(message) {
        App.WxService.showToast({
            title   : message, 
            icon    : 'success', 
            duration: 1500, 
        })
    },
    getDetail(id) {
      const goods = this.data.goods;
      App.HttpService.getDetail({
        table: 'content',
        id: id,
      }).then(data => {
        let img = App.renderImage(data.img)
        this.setData({
          images: [img, img, img],
          goods: data
        });
      });    	
    }
})