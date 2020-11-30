import {request2} from '@/utils/request'


export function queryUserFileList(data) {
    return request2({
      url:'/userRecord/queryUserFileList',
      method: 'POST',
      data
    })
  }

  export function getMemberFilterResult(data) {
    return request2({
      url:'/filterView/getMemberFilterResult',
      method: 'POST',
      data
    })
  }



  export function queryParticulars(params) {
    return request2({
      url:'/userRecord/queryUserParticulars',
      params
    })
  }

  export function queryEquitiesOverview(params) {
    return request2({
      url:'/userRecord/queryUserEquitiesOverview',
      params
    })
  }

  export function queryOrderRecord(params) {
    return request2({
      url:'/userRecord/queryUserOrderRecord',
      params
    })
  }

  export function queryPurchaseHobby(params) {
    return request2({
      url:'/userRecord/queryUserPurchaseHobby',
      params
    })
  }

  export function queryInteraction(params) {
    return request2({
      url:'/userRecord/queryUserInteraction',
      params
    })
  }

  export function queryUserLabel(params) {
    return request2({
      url:'/userRecord/queryUserUserLabel',
      params
    })
  }

  export function queryNineThree(params) {
    return request2({
      url:'/userRecord/queryUserNineThree',
      params
    })
  }

  export function queryChannel(params) {
    return request2({
      url:'/userRecord/queryUserChannel',
      params
    })
  }

  export function queryIntegralAlteration(params) {
    return request2({
      url:'/userRecord/queryUserIntegralAlteration',
      params
    })
  }

  export function queryGradeAlteration(params) {
    return request2({
      url:'/userRecord/queryUserGradeAlteration',
      params
    })
  }


  export function queryInteractRecord(params) {
    return request2({
      url:'/userRecord/queryUserInteractRecord',
      params
    })
  }

  export function queryEvaluateRecord(params) {
    return request2({
      url:'/userRecord/queryUserEvaluateRecord',
      params
    })
  }

  export function queryDeliveryAddress(params) {
    return request2({
      url:'/userRecord/queryUserDeliveryAddress',
      params
    })
  }


export default {
  queryUserFileList(data) {
    return request2({
      url:'/userRecord/queryUserFileList',
      method: 'POST',
      data
    })
  },


  queryParticulars(params) {
    return request2({
      url:'/userRecord/queryUserParticulars',
      params
    })
  },

  queryEquitiesOverview(params) {
    return request2({
      url:'/userRecord/queryUserEquitiesOverview',
      params
    })
  },

  queryOrderRecord(params) {
    return request2({
      url:'/userRecord/queryUserOrderRecord',
      params
    })
  },

  queryPurchaseHobby(params) {
    return request2({
      url:'/userRecord/queryUserPurchaseHobby',
      params
    })
  },

  queryInteraction(params) {
    return request2({
      url:'/userRecord/queryUserInteraction',
      params
    })
  },

  queryUserLabel(params) {
    return request2({
      url:'/userRecord/queryUserUserLabel',
      params
    })
  },

  queryNineThree(params) {
    return request2({
      url:'/userRecord/queryUserNineThree',
      params
    })
  },

  queryChannel(params) {
    return request2({
      url:'/userRecord/queryUserChannel',
      params
    })
  },

  queryIntegralAlteration(params) {
    return request2({
      url:'/userRecord/queryUserIntegralAlteration',
      params
    })
  },

  queryGradeAlteration(params) {
    return request2({
      url:'/userRecord/queryUserGradeAlteration',
      params
    })
  },


  queryInteractRecord(params) {
    return request2({
      url:'/userRecord/queryUserInteractRecord',
      params
    })
  },

  queryEvaluateRecord(params) {
    return request2({
      url:'/userRecord/queryUserEvaluateRecord',
      params
    })
  },

  queryDeliveryAddress(params) {
    return request2({
      url:'/userRecord/queryUserDeliveryAddress',
      params
    })
  }


}