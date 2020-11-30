export default {
  head: [
    {
      type: 'input',
      name: '营销编号',
      uploadField: 'marketingNo'
    },
    {
      type: 'time',
      name: '品牌',
      uploadField: 'brandCode'
    },
    {
      type: 'select',
      name: '品牌',
      uploadField: 'action',
      componentName: 'AbnormalMemberType'
    }
  ],
  tableDataHeader: [
    {
      prop: 'marketingNo',
      label: '营销编号',
      width: '100px'
    },
    {
      prop: 'marketingTypeName',
      label: '营销类型'
    },
    {
      prop: 'marketingRegion',
      label: '营销区域',
      width: '130px'
    },
    {
      prop: 'marketingPurposeName',
      label: '营销目的'
    },
    {
      prop: 'marketingAction',
      label: '营销动作',
      width: '130px'
    },
    {
      prop: 'marketingName',
      label: '营销名称',
      width: '150px'
    },
    {
      prop: 'marketingDesc',
      label: '营销说明',
      width: '160px'
    },
    {
      label: '营销时间',
      width: '160px'
    },
    {
      prop: 'status',
      label: '营销状态'
    },
    {
      prop: 'createUser',
      label: '创建人'
    },
    {
      prop: 'createTime',
      label: '创建时间'
    },
    {
      prop: 'auditUser',
      label: '审核人'
    },
    {
      prop: 'auditTime',
      label: '审核时间'
    },
    {
      prop: 'updateUser',
      label: '修改人'
    },
    {
      prop: 'updateTime',
      label: '修改时间'
    }
  ],
  dataLink: '/marketing/activity/page'
}
