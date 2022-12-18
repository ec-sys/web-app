<template>
  <div>
    <h1 class='mt-3 mb-3'>Edit Profile</h1>
    <b-form @submit="onSubmit" @reset="onReset">
      <b-form-group id="input-group-1" label="First Name:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.firstName"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Last Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.lastName"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Avatar:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.avatar"
          required
        ></b-form-input>
        <span class="text-danger">Sample: </span><a href="https://pngtree.com/so/avatar" target="_blank">https://pngtree.com/so/avatar</a>
      </b-form-group>


      <b-button type="submit" variant="primary">Save</b-button>
      <b-button v-if='saving' class='loader-wrapper'>
        <b-spinner small variant="dark" class='loader-icon'></b-spinner>
        <span class="sr-only">Loading...</span>
      </b-button>
    </b-form>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import {userService} from '../_services'

export default {
  data() {
    return {
      form: {
        userId: '',
        firstName: '',
        lastName: '',
        avatar: '',
      },
      saving: false,
    }
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    this.form.firstName = this.account.user.firstName;
    this.form.lastName = this.account.user.lastName;
    this.form.avatar = this.account.user.avatar;
    this.form.userId = this.account.user.userId;
  },
  methods: {
    ...mapActions('account', ['updateProfile']),
    onSubmit(event) {
      event.preventDefault();
      if(this.saving) return;
      this.saving = true;
      userService.update(this.form, this.handleUpdateProfile);
    },
    handleUpdateProfile(response) {
      if(commonUtils.isResponseOK(response)) {
        commonUtils.showToastSaveOK();
        this.updateProfile(this.form);
      } else {
        commonUtils.showToastSaveNG();
      }
      this.saving = false;
    },
    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form.firstName = '';
      this.form.lastName = '';
      this.form.avatar = '';
    }
  }
}
</script>

<style scoped>
</style>
