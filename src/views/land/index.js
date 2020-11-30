import { V2, userLogout, navBrands } from '@/api/login'
import modifyPassword from '@/components/modifyPassword/modifyPassword.vue'
var defult_404_avata = require('@/assets/404_images/404_defult.png') // 表格默认图片
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
const PLAT_FORM_MAP = { 1: '管理平台', 2: '数据平台', 3: '洞察平台', 4: '营销平台', 6: '互动平台' }
export default {
  name: 'NeoIndex',
  provide() {
    return {
      app: this
    }
  },
  filters: {
    platFormFilter(platformCode) {
      return PLAT_FORM_MAP[platformCode]
    }
  },
  data() {
    return {
      passwordModal: false, // 修改密码弹框
      icon: defult_404_avata,
      curIndex: '',
      nav_brandcode: '',
      user_info: {},
      left_navs: [],
      menuPathArr: [],
      brandList: [],
      value: '',
      isShowBrand: false,
      platFormCode: '',
      show: true
    }
  },
  components: { // 挂载组件
    'modify-password': modifyPassword
  },
  computed: {
    menuOpenIndex() {
      // 没加系统看板时， let rootPath = this.$route.path.split("/")[1];
      const rootPath = this.$route.path.split('/')[2]
      return [rootPath]
    },
    tabs() {
      var routeNaves = this.menuPathArr
      var leftNavs = this.left_navs
      for (var i = 0; i < leftNavs.length; i++) {
        if (leftNavs[i].uri == routeNaves[0]) {
          for (var j = 0; j < leftNavs[i].functionList.length; j++) {
            if (leftNavs[i].functionList[j].uri === routeNaves[1]) {
              return leftNavs[i].functionList[j].subFunctionList
            }
          }
        }
      }
    },
    ...mapGetters(['brandCode', 'brandName']),
    brand_code: {
      get: function() {
        return this.brandCode
      },
      set: function(val) {
        this.$store.dispatch('setBrandCode', val)
      }
    },
    brand_name: {
      get: function() {
        return this.brandName
      },
      set: function(val) {
        this.$store.dispatch('setBrandName', val)
      }
    }
  },
  async created() {
    this.platFormCode = this.$route.query.platformCode || Cookies.get('platformCode') || 1
    if (Number(Cookies.get('platformCode')) === 4) {
      this.show = false
      this.isShowBrand = true
      this.getBrands()
    }

    this.user_info = this.$store.state.userinfo.user_info
    await this.getFunMenu()
    this.setDefaultRouter()
  },
  methods: {
    reloadRouterView() {
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
    help() {
      const newHref = this.$router.resolve({ name: 'help' })
      window.open(newHref.href, '_blank')
    },
    // 修改密码
    openModifyPasswordModal() {
      this.passwordModal = true
    },
    into() {
      this.$router.push({ name: 'index' })
    },
    async getFunMenu() {
      // 从首页看板，点 管理平台之后，带过来的平台code值
      // let res = await V2({},this.$route.query.platformCode);
      const platformCode = this.$route.query.platformCode || Cookies.get('platformCode') || 1
      const res = await V2({}, platformCode)
      this.left_navs = res.body || []
    },
    handleBrandChange(val) {
      const brandName = this.brandList.find(x => x.brandCode === val).brandName
      Cookies.set('brandCode', this.brand_code)
      Cookies.set('brandName', brandName)
      this.brand_name = brandName
      this.reloadRouterView()
    },
    async getBrands() {
      const res = await navBrands()
      this.brandList = res.body || []
      const _brandCode = Cookies.get('brandCode') || this.brandCode
      if (this.brandList && this.brandList.length > 0) {
        if (this.brandList.some(x => x.brandCode === _brandCode)) {
          this.brand_code = _brandCode
          const selected = this.brandList.find(x => x.brandCode === _brandCode)
          this.brand_name = selected.brandName
        } else {
          if (this.brandList.some(x => x.brandCode === 'durex')) {
            const durexInfo = this.brandList.find(x => x.brandCode === 'durex')
            this.brand_code = durexInfo.brandCode
            this.brand_name = durexInfo.brandName
          } else {
            this.brand_code = this.brandList[0].brandCode
            this.brand_name = this.brandList[0].brandName
          }
        }
        Cookies.set('brandCode', this.brand_code)
        Cookies.set('brandName', this.brand_name)
        this.show = true
      }
    },
    goRouter(name) {
      if (name && this.$route.name != name) {
        this.$store.commit('add_is_refresh', true)
        this.$store.commit('add_is_sub_get_func', false)
        let route = { name: name }
        if (this.$route.query && this.$route.query.platformCode) {
          route = { ...route, query: { platformCode: this.$route.query.platformCode }}
        }
        this.$router.push(route)
      }
    },
    /**
     * 刷新页面 设置默认选中路由
     */
    setDefaultRouter() {
      //  没加系统看板时， let childRootPath = this.$route.path.split("/")[2];
      const childRootPath = this.$route.path.split('/')[3]
      if (childRootPath) {
        this.curIndex = childRootPath
        this.menuPathArr = this.$route.path.split('/').slice(1)
      } else {
        var firstNave = this.left_navs[0]
        if (firstNave.functionList && firstNave.functionList.length) {
          if (
            firstNave.functionList[0].subFunctionList &&
            firstNave.functionList[0].subFunctionList.length
          ) {
            this.goRouter(firstNave.functionList[0].subFunctionList[0].name)
            this.curIndex = firstNave.functionList[0].uri
            this.menuPathArr = [firstNave.uri, firstNave.functionList[0].uri]
          } else {
            this.goRouter(firstNave.functionList[0].name)
            this.curIndex = firstNave.functionList[0].uri
          }
        }
      }
    },
    handleSelect(key, menuPathArr) {
      this.menuPathArr = menuPathArr
      var tabs = this.getTabs(menuPathArr)
      console.log(tabs, 99999)
      if (tabs.length) {
        this.goRouter(tabs[0].name)
      } else {
        this.goRouter(key)
      }
    },
    getTabs(routeNaves) {
      var leftNavs = this.left_navs
      for (var i = 0; i < leftNavs.length; i++) {
        if (leftNavs[i].uri == routeNaves[0]) {
          for (var j = 0; j < leftNavs[i].functionList.length; j++) {
            if (leftNavs[i].functionList[j].uri === routeNaves[1]) {
              return leftNavs[i].functionList[j].subFunctionList || []
            }
          }
        }
      }

      return []
    },
    async logout(e) {
      const res = await userLogout({})
      console.log(res,888)
      if (res.code == '0') {
        // this.$utils.selSession("token");
        // this.$utils.selSession("userInfo");
        // this.delAllCookie();
        this.$store.commit('setToken', '')
        this.$store.commit('setUserInfo', {})
        Cookies.remove('brandCode')
        Cookies.remove('brandName')
        this.$router.push({
          name: 'login'
        })
      }
    }
  },
  watch: {
    $route() {
      this.setDefaultRouter()
    }
  }
}
