const App = getApp()

Page({
    data: {
        activeIndex: 0,
        navList: [],
        indicatorDots: !0,
        autoplay: !0,
        current: 0,
        interval: 3000,
        duration: 1000,
        circular: !0,
        catId:1,
        goods: {},
        prompt: {
            hidden: !0,
        },
    },
    showModal(message) {
      App.WxService.showModal({
        title: '友情提示',
        content: message,
        showCancel: !1,
      });
    },
    swiperchange(e) {
        // console.log(e.detail.current)
    },
    onLoad() {
        this.banner = App.HttpResource('/banner/:id', {id: '@id'})
        this.goods = App.HttpResource('/goods/:id', {id: '@id'})
        this.classify = App.HttpResource('/classify/:id', {id: '@id'})

        this.getBanners()
        this.getClassify()
    },
    initData() {
        const catId = this.catId || '1';
        const goods = {
            items: [],
            params: {
              table:'content',
                page : 1,
                limit: 10,
                category_id: catId,
            },
            total:1
        }

        this.setData({
            goods: goods
        })
    },
    navigateTo(e) {
        console.log(e)
        App.WxService.navigateTo('/pages/goods/detail/index', {
            id: e.currentTarget.dataset.id
        })
    },
    search() {
        App.WxService.navigateTo('/pages/search/index')
    },
    getBanners() {
      //调用数据
      App.HttpService.getData({
          table:'banner',
          page:1
      }).then(data=>{
        if(data.code==0){
          data.data.forEach(n => n.path = App.renderImage(n.img));
          this.setData({
            images: data.data
          });
        }else{
          this.showModal(data.message);
        }
      });
    },
    getClassify() {
      const activeIndex = this.activeIndex||0;
      App.HttpService.getData({
        table: 'category',
        pid:1
      }).then(data => {
        this.setData({
          navList: data.data
        });
        this.catId = data.data[activeIndex].id;
        this.onPullDownRefresh();
      });

    },
    getList() {
      const goods = this.data.goods;
      const params = goods.params;
      const total = goods.total;
      App.HttpService.getData(params).then(data => {
        data.data.forEach(n => n.thumb_url = App.renderImage(n.img));
        goods.total = data.total;
        goods.hasNext = goods.params.page <= data.totalPage;
        goods.params.page = goods.params.page+1;
        goods.items = data.data;
        this.setData({
          goods: goods,
          'prompt.hidden': goods.hasNext
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
        if (!this.data.goods.hasNext) return
        this.getList()
    },
    onTapTag(e) {
        const catId = e.currentTarget.dataset.id
        const index = e.currentTarget.dataset.index
        const goods = {
            items: [],
            params: {
                table: 'content',
                page: 1,
                limit: 10,
                category_id: catId,
            },
            total: 1
        }
        this.setData({
            catId: catId,
            activeIndex: index,
            goods: goods,
        })
        this.getList()
    },
})
