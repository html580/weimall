const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        order: {},
        prompt: {
            hidden: !0,
            icon: '../../../assets/images/iconfont-order-default.png',
            title: '没有更多相关的订单',
            text: '可以去看看有哪些想买的',
        },
    },
    onLoad() {
       
        this.setData({
            navList: [
                {
                    title: '全部',
                    id: 'all',
                },
                {
                    title: '已提交',
                    id: 'submitted',
                },
                {
                    title: '已确认',
                    id: 'confirmed',
                },
                {
                    title: '已完成',
                    id: 'finished',
                },
                {
                    title: '已取消',
                    id: 'canceled',
                },
            ]
        })
        this.onPullDownRefresh()
    },
    initData() {
       
        this.setData({
            order: {
                items: [],
                params: {
                    table:'order',
                    page : 1,
                    limit: 10
                },
                paginate: {}
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/order/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    getList() {
        const order = this.data.order;
        let params = order.params;
         if(this.data.status){
             params.status = this.data.status;
        }

        App.HttpService.getData(params).then(data => {
          order.total = data.total;
          order.hasNext = order.params.page <= data.totalPage;
          order.params.page = order.params.page + 1;
          data.data.forEach(n =>{
               n.items = App.Tools.fromJson(n.items);
               n.totalAmount = 0;
               n.items.forEach(c => n.totalAmount += c.totalAmount)
          });
           
          order.items = data.data;
          this.setData({
            order: order,
            'prompt.hidden': order.hasNext
          });
        });
 
    },
    onPullDownRefresh() {
        console.info('onPullDownRefresh')
        this.initData();
        this.getList();
    },
    onReachBottom() {
        console.info('onReachBottom')
        if (!this.data.order.hasNext) return
        this.getList()
    },
    onTapTag(e) {
        const id = e.currentTarget.dataset.id
        const index = e.currentTarget.dataset.index
        this.initData()
        this.setData({
            activeIndex: index,
            status: id,
        })
        this.getList()
    },
})