<template>
  <div>
    <marketing-report :activity-qs="activityQs"/>
  </div>
</template>
<script>
import marketingReport from './marketingReport/index'
export default {
  components: {
    marketingReport
  },
  data() {
    return {
      activityQs: {
        create_type: 'activity',
        id: 84
      }
    }
  }
}
</script>
