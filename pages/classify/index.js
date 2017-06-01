const App = getApp()

Page({
    data: {
        activeIndex: 0, 
        goods: {},
        catId:0,
        classify: {},
        prompt: {
            hidden: !0,
        },
    },
    onLoad() {
        this.getSystemInfo()
        this.onRefresh()
    },
    initData() {
        this.setData({
            classify: {
                items: [],
                params: {
                  table: 'category',
                  page: 1,
                  limit: 20,
                  order:'id asc'
                }
            }
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    getList() {
        const classify = this.data.classify
        const params = classify.params
        App.HttpService.getData(params).then(data => {
          classify.total = data.total;
          classify.hasNext = classify.params.page < data.totalPage;
          classify.params.page = classify.params.page + 1;
          classify.items = data.data;
          this.setData({
            classify: classify,
            catId: classify.items[0].id,
            'prompt.hidden': classify.hasNext
          });
          this.getGoods()
        });
 
    },
    onRefresh() {
        this.initData()
        this.initGoods()
        this.getList()
    },
    getMore() {
        if (!this.data.classify.hasNext) return
        this.getList()
    },
    changeTab(e) {
        const dataset = e.currentTarget.dataset
        const index = dataset.index
        const id = dataset.id

        this.initGoods();
        this.setData({
            activeIndex: index, 
            catId: id
        })

        this.getGoods()
    },
    initGoods() {
      const category_id = this.data.goods.params && this.data.goods.params.category_id || '1';
      const goods = {
        items: [],
        params: {
          table: 'content',
          page: 1,
          limit: 10
        },
        total: 1
      }

      this.setData({
        goods: goods
      })
    },
    getGoods() {
      const goods = this.data.goods;
      let params = goods.params;
      if (this.data.catId!=1){
        params.category_id = this.data.catId;
      }
      App.HttpService.getData(params).then(data => {
        data.data.forEach(n => n.thumb_url = App.renderImage(n.img));
        goods.total = data.total;
        goods.hasNext = goods.params.page < data.totalPage;
        goods.params.page = goods.params.page + 1;
        goods.items = data.data;
        this.setData({
          goods: goods,
          'prompt.hidden': goods.hasNext
        });
      });
    },
    onRefreshGoods() {
        this.initGoods()
        this.setData({
          'prompt.hidden': !0
        });
        this.getGoods()
    },
    getMoreGoods() {
        if (!this.data.goods.hasNext) return
        this.getGoods()
    },
    getSystemInfo() {
        App.WxService.getSystemInfo().then(data => {
            console.log(data)
            this.setData({
                deviceWidth: data.windowWidth, 
                deviceHeight: data.windowHeight, 
            })
        })
    },
})