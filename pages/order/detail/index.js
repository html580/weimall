const App = getApp()

Page({
    data: {
        order: {
            item: {},
        },
    },
    onLoad(option) {
        
        this.setData({
            id: option.id
        })
    },
    onShow() {
        this.getOrderDetail(this.data.id)
    },
    getOrderDetail(id) {
      App.HttpService.getDetail({
        table: 'order',
        id: id,
      }).then(data => {
          if (data.code == 0) {
          
            data.items = App.Tools.fromJson(data.items);
            data.totalAmount = 0;
            data.items.forEach(c => data.totalAmount += c.totalAmount)
            this.setData({
              'order.item': data
            }); 
            return data;
          } 
        }).then(data => {
          return App.HttpService.getDetail({
              table:'address',
              id:data.address_id
          });
        }).then(data=>{
          this.setData({
            'order.address': data
          })
        });    	
        
    },
})