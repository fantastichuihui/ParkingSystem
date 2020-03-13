import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import AppMain from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = []
const components = {
  '/role': () => import('@/views/a01/role'),
  '/roleAdd': () => import('@/views/a01/roleAdd'),
  '/roleEdit': () => import('@/views/a01/roleEdit'),
  '/group': () => import('@/views/a01/group'),
  '/groupAdd': () => import('@/views/a01/groupAdd'),
  '/groupEdit': () => import('@/views/a01/groupEdit'),
  '/pageres': () => import('@/views/a01/pageres'),
  '/pageresAdd': () => import('@/views/a01/pageresAdd'),
  '/pageresEdit': () => import('@/views/a01/pageresEdit'),
  '/api': () => import('@/views/a01/api'),
  '/apiAdd': () => import('@/views/a01/apiAdd'),
  '/apiEdit': () => import('@/views/a01/apiEdit'),
  '/action': () => import('@/views/a01/action'),
  '/actionAdd': () => import('@/views/a01/actionAdd'),
  '/actionEdit': () => import('@/views/a01/actionEdit'),
  '/service': () => import('@/views/a01/service'),
  '/serviceAdd': () => import('@/views/a01/serviceAdd'),
  '/serviceEdit': () => import('@/views/a01/serviceEdit'),
  '/res': () => import('@/views/a01/res'),
  '/resAdd': () => import('@/views/a01/resAdd'),
  '/resEdit': () => import('@/views/a01/resEdit'),
  '/permission': () => import('@/views/a01/permission'),
  '/permissionAdd': () => import('@/views/a01/permissionAdd'),
  '/permissionEdit': () => import('@/views/a01/permissionEdit'),
  '/Wages': () => import('@/views/a02/Wages'),
  '/WagesAdd': () => import('@/views/a02/WagesAdd'),
  '/WagesUpdate': () => import('@/views/a02/WagesUpdate'),
  '/Wages_grant': () => import('@/views/a02/Wages_grant'),
  '/Wages_grantAdd': () => import('@/views/a02/Wages_grantAdd'),
  '/Wages_grantUpdate': () => import('@/views/a02/Wages_grantUpdate'),
  '/Rewards_punishments': () => import('@/views/a02/Rewards_punishments'),
  '/RewardsPunishmentsAdd': () => import('@/views/a02/RewardsPunishmentsAdd'),
  '/RewardsPunishmentsUpdate': () => import('@/views/a02/RewardsPunishmentsUpdate'),
  '/person': () => import('@/views/a02/person'),
  '/personAdd': () => import('@/views/a02/personAdd'),
  '/personEdit': () => import('@/views/a02/personEdit'),
  '/Attendance': () => import('@/views/a02/Attendance'),
  '/AttendanceAdd': () => import('@/views/a02/AttendanceAdd'),
  '/AttendanceUpdate': () => import('@/views/a02/AttendanceUpdate'),
  '/organization': () => import('@/views/a02/organization'),
  '/organizationAdd': () => import('@/views/a02/organizationAdd'),
  '/organizationEdit': () => import('@/views/a02/organizationEdit'),
  '/organizationTree': () => import('@/views/a02/organizationTree'),
  '/buckerManage': () => import('@/views/a03/buckerManage'),
  '/filePage': () => import('@/views/a03/filePage'),
  '/fileType': () => import('@/views/a03/fileType'),
  '/dataStandard': () => import('@/views/a04/dataStandard'),
  '/dataStandardAdd': () => import('@/views/a04/dataStandardAdd'),
  '/dataStandardEdit': () => import('@/views/a04/dataStandardEdit'),
  '/systemParameter': () => import('@/views/a04/systemParameter'),
  '/systemParameterAdd': () => import('@/views/a04/systemParameterAdd'),
  '/systemParameterEdit': () => import('@/views/a04/systemParameterEdit'),
  '/schedule': () => import('@/views/a05/schedule'),
  '/customer': () => import('@/views/b01/customer'),
  '/customerAdd': () => import('@/views/b01/customerAdd'),
  '/customerUpdate': () => import('@/views/b01/customerUpdate'),
  '/contacts': () => import('@/views/b01/contacts'),
  '/contactsAdd': () => import('@/views/b01/contactsAdd'),
  '/contactsAdd1': () => import('@/views/b01/contactsAdd1'),
  '/contactsUpdate': () => import('@/views/b01/contactsUpdate'),
  '/business': () => import('@/views/b01/business'),
  '/businessAdd': () => import('@/views/b01/businessAdd'),
  '/businessUpdate': () => import('@/views/b01/businessUpdate'),
  '/agreement': () => import('@/views/b01/agreement'),
  '/agreementAdd': () => import('@/views/b01/agreementAdd'),
  '/agreementAddSon': () => import('@/views/b01/agreementAddSon'),
  '/agreementEdit': () => import('@/views/b01/agreementEdit'),
  '/agreementEditSon': () => import('@/views/b01/agreementEditSon'),
  '/agreementSon': () => import('@/views/b01/agreementSon'),
  '/payment': () => import('@/views/b01/payment'),
  '/auditing': () => import('@/views/b01/auditing'),
  '/product': () => import('@/views/b02/product'),
  '/type': () => import('@/views/b02/type'),
  '/steelgrade': () => import('@/views/b02/steelgrade'),
  '/steelgrade_number': () => import('@/views/b02/steelgrade_number'),
  '/product_parameter': () => import('@/views/b02/product_parameter'),
  '/steeltype': () => import('@/views/b02/steeltype'),
  '/steelparam': () => import('@/views/b02/steelparam'),
  '/park': () => import('@/views/b03/park'),
  '/addPark': () => import('@/views/b03/addPark'),
  '/editPark': () => import('@/views/b03/editPark'),
  '/storageroom': () => import('@/views/b03/storageroom'),
  '/addStorageroom': () => import('@/views/b03/addStorageroom'),
  '/editStorageroom': () => import('@/views/b03/editStorageroom'),
  '/roomTypeRef': () => import('@/views/b03/roomTypeRef'),
  '/addRoomTypeRef': () => import('@/views/b03/addRoomTypeRef'),
  '/area': () => import('@/views/b03/area'),
  '/editArea': () => import('@/views/b03/editArea'),
  '/crane': () => import('@/views/b03/crane'),
  '/editCrane': () => import('@/views/b03/editCrane'),
  '/pallet': () => import('@/views/b03/pallet'),
  '/adbility': () => import('@/views/b03/adbility'),
  '/inStore': () => import('@/views/b04/inStore'),
  '/materielInStore': () => import('@/views/b04/materielInStore'),
  '/materielInStoreUpdate': () => import('@/views/b04/materielInStoreUpdate'),
  '/materialSystem': () => import('@/views/b04/materialSystem'),
  '/outPlan': () => import('@/views/b04/outPlan'),
  '/planPallet': () => import('@/views/b04/planPallet'),
  '/cost': () => import('@/views/b04/cost'),
  '/disposeMateriel': () => import('@/views/b04/disposeMateriel'),
  '/deliveryCompany': () => import('@/views/b05/deliveryCompany'),
  '/deliveryCompanyAdd': () => import('@/views/b05/deliveryCompanyAdd'),
  '/deliveryCompanyEdit': () => import('@/views/b05/deliveryCompanyEdit'),
  '/executionOrder': () => import('@/views/b05/executionOrder'),
  '/executionOrderAdd': () => import('@/views/b05/executionOrderAdd'),
  '/executionOrderEdit': () => import('@/views/b05/executionOrderEdit'),
  '/materialDown': () => import('@/views/b05/materialDown'),
  '/materialDetails': () => import('@/views/b05/materialDetails'),
  '/DeliveryPlan': () => import('@/views/b05/DeliveryPlan'),
  '/Print': () => import('@/views/b05/Print'),
  '/DeliveryPlanAdd': () => import('@/views/b05/DeliveryPlanAdd'),
  '/DeliveryPlanCompile': () => import('@/views/b05/DeliveryPlanCompile'),
  '/updateDeliveryPlan': () => import('@/views/b05/updateDeliveryPlan'),
  '/AddMat': () => import('@/views/b05/AddMat'),
  '/DeliveryDetails': () => import('@/views/b05/DeliveryDetails'),
  '/CarAccess': () => import('@/views/b05/CarAccess'),
  '/DriverInfo': () => import('@/views/b05/DriverInfo'),
  '/StanderNode': () => import('@/views/b05/StanderNode'),
  '/CarInfo': () => import('@/views/b05/CarInfo'),
  '/CarAccessReport': () => import('@/views/b06/CarAccessReport'),
  '/cusDeduction': () => import('@/views/b06/cusDeduction'),
  '/pastContract': () => import('@/views/b06/pastContract')
}

const createRouter = () => {
  const routeData = JSON.parse(sessionStorage.getItem('routeData'))
  constantRoutes.splice(0, constantRoutes.length)
  constantRoutes.push({
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '系统主页',
        icon: 'dashboard'
      }
    }
    ]
  })
  if (routeData) {
    // let dynamicRoutes = addDynamicRoutes(routeData)
    //   dynamicRoutes.forEach(element => {
    //   constantRoutes.push(element)
    // });
    addDynamicRoutes(routeData)
  }
  // var temp=new Vue(Router)
  // temp.$router.addRoutes()

  constantRoutes.push({
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  })
  constantRoutes.push({
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  })
  constantRoutes.push({
    path: '*',
    redirect: '/404',
    hidden: true
  })

  return new Router({
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })
}

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes(menuList = []) {
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].url) {
      // 创建路由配置
      const route1 = {
        path: '' + menuList[i].param + '',
        component: Layout,
        name: '' + menuList[i].id + '',
        meta: {
          icon: menuList[i].icon,
          title: menuList[i].displayText
        },
        children: []
      }
      if (menuList[i].children && menuList[i].children.length >= 1) {
        const temp = menuList[i].children
        for (var j = 0; j < temp.length; j++) {
          // console.log('' + temp[j].param + '' + ':() => import(' + '@/views/' + temp[j].url + '' + ')')
          const route2 = {
            path: '' + temp[j].param + '',
            component: components[temp[j].param],
            name: '' + temp[j].tooltipText + '',
            meta: {
              icon: temp[j].icon,
              title: temp[j].displayText
            },
            children: []
          }
          route1.children.push(route2)
          if (temp[j].children && temp[j].children.length >= 1) {
            const temp1 = temp[j].children
            for (var k = 0; k < temp1.length; k++) {
              // console.log('' + temp1[k].param + '' + ':() => import(' + '@/views/' + temp1[k].url + '' + ')')
              const route3 = {
                path: '' + temp1[k].param + '',
                component: components[temp1[k].param],
                name: '' + temp1[k].tooltipText + '',
                hidden: true,
                meta: {
                  icon: temp1[k].icon,
                  title: temp1[k].displayText
                }
              }
              route1.children.push(route3)
            }
          }
        }
      }
      constantRoutes.push(route1)
    }
  }
}

export default router
