<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent='handleSubmit'>
      <div class='form-group'>
        <label for='firstName'>First Name</label>
        <input v-model='user.firstName' v-validate="'required'"
               :class="{ 'is-invalid': submitted && errors.has('firstName') }" class='form-control' name='firstName'
               type='text' />
        <div v-if="submitted && errors.has('firstName')" class='invalid-feedback'>{{ errors.first('firstName') }}</div>
      </div>
      <div class='form-group'>
        <label for='lastName'>Last Name</label>
        <input v-model='user.lastName' v-validate="'required'"
               :class="{ 'is-invalid': submitted && errors.has('lastName') }" class='form-control' name='lastName'
               type='text' />
        <div v-if="submitted && errors.has('lastName')" class='invalid-feedback'>{{ errors.first('lastName') }}</div>
      </div>
      <div class='form-group'>
        <label for='username'>Username</label>
        <input v-model='user.username' v-validate="'required'"
               :class="{ 'is-invalid': submitted && errors.has('username') }" class='form-control' name='username'
               type='text' />
        <div v-if="submitted && errors.has('username')" class='invalid-feedback'>{{ errors.first('username') }}</div>
      </div>
      <div class='form-group'>
        <label htmlFor='password'>Password</label>
        <input v-model='user.password' v-validate='{ required: true, min: 6 }'
               :class="{ 'is-invalid': submitted && errors.has('password') }" class='form-control'
               name='password' type='password' />
        <div v-if="submitted && errors.has('password')" class='invalid-feedback'>{{ errors.first('password') }}</div>
      </div>
      <div class='form-group'>
        <button :disabled='status.registering' class='btn btn-primary'>Register</button>
        <img v-show='status.registering'
             src='data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==' />
        <router-link class='btn btn-link' to='/login'>Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        username: '',
        password: ''
      },
      submitted: false
    }
  },
  computed: {
    ...mapState('account', ['status'])
  },
  methods: {
    ...mapActions('account', ['register']),
    handleSubmit(e) {
      this.submitted = true
      this.$validator.validate().then(valid => {
        if (valid) {
          this.register(this.user)
        }
      })
    }
  }
}
</script>
