import vue from 'vue'
import Vuex from 'vuex'
import router, {resetRouter} from "../router";
import createPersistedState from 'vuex-persistedstate';

vue.use(Vuex)

function addNewRoute(menuList) {
    console.log(menuList)
    //这里的let 函数 对标的就是router文件夹下面定义的index数据 route 上面已经import了
    let routes = router.options.routes
    console.log(routes)

    //下面是动态路由的获取方法 ⭐⭐⭐⭐⭐
    //循环获得的路由页面 
    routes.forEach(routeItem => {
        //在进行一次判断  如果routeItem.path == "/Index"  等于找到了这个页面，就往页面里面添加子路由
        if (routeItem.path == "/Index") {
            //这就是子路由
            menuList.forEach(menu => {
                let childRoute = {
                    //menu.menuclick  是后端数据库里面返回的 menuclick 字段
                    path: '/' + menu.menuclick,
                    //menuname 也是数据库的 字段信息 都是直接返回给前端的菜单列表赋值 
                    name: menu.menuname,
                    meta: {
                         //menuname 也是数据库的 字段信息 都是直接返回给前端的菜单列表赋值 
                        title: menu.menuname
                    },
                    //+ menu.menucomponen  也是数据库的 字段信息 页面  
                    component: () => import('../components/' + menu.menucomponent)
                }

                routeItem.children.push(childRoute)
            })
        }
    })

    resetRouter() 
    router.addRoutes(routes)
}

export default new Vuex.Store({
    state: {
        menu: []
    },
    mutations: {
        setMenu(state, menuList) {
            state.menu = menuList

            addNewRoute(menuList)
        }
    },
    getters: {
        getMenu(state) {
            return state.menu
        }
    },
    plugins: [createPersistedState()]
})