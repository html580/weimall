const App = getApp()

Page({
    data: {
        hidden: !0,
        carts: {},
        address: {
            item: {},
        }
    },
    onLoad(option) {
        console.log(option)
        this.setData({
            address_id: option.id
        })

        const carts = {
            items: App.WxService.getStorageSync('confirmOrder'), 
            totalAmount: 0, 
        }

        carts.items.forEach(n => carts.totalAmount+=n.totalAmount)
        
        this.setData({
            carts: carts
        })

        console.log(this.data.carts)
    },
    onShow() {
        const address_id = this.data.address_id
        if (address_id) {
            this.getAddressDetail(address_id)
        } else {
            this.getDefalutAddress()
        }
    },
    redirectTo(e) {
        console.log(e)
        App.WxService.redirectTo('/pages/address/confirm/index', {
            ret: this.data.address_id
        })
    },
    getDefalutAddress() {
       App.HttpService.getData({
         table:'address',
         is_def:1
         
       }).then(data => {
         if (data.code == 0 && data.total) {
           this.setData({
             address_id: data.data[0].id,
             address: data.data[0],
           })
         } else {
            this.showModal()
         } 
      });
    },
    showModal() {
        App.WxService.showModal({
            title: '友情提示', 
            content: '没有收货地址，请先设置', 
        })
        .then(data => {
            console.log(data)
            if (data.confirm == 1) {
                App.WxService.redirectTo('/pages/address/list/index')
            } else {
                App.WxService.navigateBack()
            }
        })
    },
    getAddressDetail(id) {
      App.HttpService.getData({
        table: 'address',
        id: id

      }).then(data => {
        if (data.code == 0 && data.total) {
          this.setData({
            address_id: data.data[0].id,
            address: data.data[0],
          })
        } else {
          this.showModal()
        }
      });
    },
    addOrder() {
        const address_id = this.data.address_id
        const params = {
            table: 'order',
            items: App.Tools.serializeValue(this.data.carts.items), 
            address_id: address_id,
            user_id: App.WxService.getStorageSync('openId')
        }
        
        App.HttpService.addData(params).then(data => {
          if (data.code == 0) {
            App.WxService.redirectTo('/pages/order/detail/index', {
              id: data.id
            })
          }
        }); 
 
    },
    clear() {
        App.HttpService.clearCartByUser()
        .then(data => {
            console.log(data)
        })
    },
})