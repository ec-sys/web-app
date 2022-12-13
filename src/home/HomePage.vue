<template>
  <div>
    <h1>Hi {{ account.user.fullName }}!</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  created() {
  },
  methods: {}
}
</script>
