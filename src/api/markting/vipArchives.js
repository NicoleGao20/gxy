import { request2 } from '@/utils/request'
export function queryMemberFile(data) {
  return request2({
    url: '/memberRecord/queryMemberFile',
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
    url: '/memberRecord/queryMemberParticulars',
    params
  })
}

export function queryOrderRecord(params) {
  return request2({
    url: '/memberRecord/queryMemberOrderRecord',
    params
  })
}

export function queryEvaluationArchives(data) {
  return request2({
    url: '/evaluationArchives/queryEvaluationArchives',
    method: 'POST',
    data
  })
}

export function queryEquitiesOverview(params) {
  return request2({
    url: '/memberRecord/queryMemberEquitiesOverview',
    params
  })
}

export function queryPurchaseHobby(params) {
  return request2({
    url: '/memberRecord/queryMemberPurchaseHobby',
    params
  })
}

export function queryInteraction(params) {
  return request2({
    url: '/memberRecord/queryMemberInteraction',
    params
  })
}

export function queryUserLabel(params) {
  return request2({
    url: '/memberRecord/queryMemberUserLabel',
    params
  })
}

export function queryNineThree(params) {
  return request2({
    url: '/memberRecord/queryMemberNineThree',
    params
  })
}

export function queryChannel(params) {
  return request2({
    url: '/memberRecord/queryMemberChannel',
    params
  })
}

export function queryIntegralAlteration(params) {
  return request2({
    url: '/memberRecord/queryMemberIntegralAlteration',
    params
  })
}

export function queryGradeAlteration(params) {
  return request2({
    url: '/memberRecord/queryMemberGradeAlteration',
    params
  })
}

export function queryInteractRecord(params) {
  return request2({
    url: '/memberRecord/queryMemberInteractRecord',
    params
  })
}

export function queryEvaluateRecord(params) {
  return request2({
    url: '/memberRecord/queryMemberEvaluateRecord',
    params
  })
}

export function queryDeliveryAddress(params) {
  return request2({
    url: '/memberRecord/queryMemberDeliveryAddress',
    params
  })
}

export default {
  queryMemberFile(data) {
    return request2({
      url: '/memberRecord/queryMemberFile',
      method: 'POST',
      data
    })
  },
  
  queryParticulars(params) {
    return request2({
      url: '/memberRecord/queryMemberParticulars',
      params
    })
  },
  
  queryOrderRecord(params) {
    return request2({
      url: '/memberRecord/queryMemberOrderRecord',
      params
    })
  },
  
  queryEvaluationArchives(data) {
    return request2({
      url: '/evaluationArchives/queryEvaluationArchives',
      method: 'POST',
      data
    })
  },
  
  queryEquitiesOverview(params) {
    return request2({
      url: '/memberRecord/queryMemberEquitiesOverview',
      params
    })
  },
  
  queryPurchaseHobby(params) {
    return request2({
      url: '/memberRecord/queryMemberPurchaseHobby',
      params
    })
  },
  
  queryInteraction(params) {
    return request2({
      url: '/memberRecord/queryMemberInteraction',
      params
    })
  },
  
  queryUserLabel(params) {
    return request2({
      url: '/memberRecord/queryMemberUserLabel',
      params
    })
  },
  
  queryNineThree(params) {
    return request2({
      url: '/memberRecord/queryMemberNineThree',
      params
    })
  },
  
  queryChannel(params) {
    return request2({
      url: '/memberRecord/queryMemberChannel',
      params
    })
  },
  
  queryIntegralAlteration(params) {
    return request2({
      url: '/memberRecord/queryMemberIntegralAlteration',
      params
    })
  },
  
  queryGradeAlteration(params) {
    return request2({
      url: '/memberRecord/queryMemberGradeAlteration',
      params
    })
  },
  
  queryInteractRecord(params) {
    return request2({
      url: '/memberRecord/queryMemberInteractRecord',
      params
    })
  },
  
  queryEvaluateRecord(params) {
    return request2({
      url: '/memberRecord/queryMemberEvaluateRecord',
      params
    })
  },
  
  queryDeliveryAddress(params) {
    return request2({
      url: '/memberRecord/queryMemberDeliveryAddress',
      params
    })
  }
  
}