const App = getApp()

Page({
    data: {
        address: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-addr-empty.png',
            title: '还没有收货地址呢',
            text: '暂时没有相关数据',
        },
    },
    onLoad() {
        this.address = App.HttpResource('/address/:id', {id: '@id'})
        this.onPullDownRefresh()
    },
    initData() {
        this.setData({
            address: {
                items: [],
                params: {
                    table:'address',
                    user_id: App.WxService.getStorageSync('openId'),
                    page : 1,
                    limit: 10,
                },
                paginate: {}
            }
        })
    },
    toAddressEdit(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/address/edit/index', {
            id: e.currentTarget.dataset.id
        })
    },
    toAddressAdd(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/address/add/index')
    },
    showToast(message) {
      App.WxService.showToast({
        title: message,
        icon: 'success',
        duration: 1500,
      });
    },
    setDefalutAddress(e) {
        const id = e.currentTarget.dataset.id;
        var items = this.data.address.items;
        items.forEach(function (n) {
          if (n.id == id) {
            n.is_def = 1;
          }else{
            n.is_def = 0;
          }
        });
        this.setData({
          'address.items': items
        });

        App.HttpService.updateData({
            table:'address',
            id:id,
            is_def:1
        }).then(data => {
          if (data.code == 0) {
            this.showToast(data.message)
          }
        });
    },
    getList() {
        const address = this.data.address;
        const params = address.params;
        App.HttpService.getData(params).then(data => {
          address.total = data.total;
          address.hasNext = address.params.page <= data.totalPage;
          address.params.page = address.params.page + 1;
          address.items = data.data;
          this.setData({
            address: address,
            'prompt.hidden': address.hasNext
          });
        });

    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData()
        this.getList()
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.address.hasNext) return
        this.getList()
    }
})