<template>
  <div>
    <div class='mb-5'>
      <b-form @submit="onSubmit" @reset="onClear">
        <b-form-group id="input-group-1" label="Room name:" label-for="input-1">
          <b-form-input id="input-1" v-model="search.roomName" type="input"></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" label="Members:" label-for="input-1">
          <b-form-input id="input-2" v-model="search.memberIds" type="input"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">Search</b-button>
        <b-button type="reset" variant="danger">Clear</b-button>
      </b-form>
    </div>
    <div class='overflow-auto mt-3'>
      <b-table id='tbl-rooms' :bordered='true' :items='items' :per-page='perPage' :current-page='currentPage'></b-table>
      <b-pagination v-model='currentPage' :total-rows='rows' :per-page='perPage' aria-controls='tbl-rooms' align='center'></b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      perPage: 3,
      currentPage: 1,
      items: [
        { id: 1, first_name: 'Fred', last_name: 'Flintstone' },
        { id: 2, first_name: 'Wilma', last_name: 'Flintstone' },
        { id: 3, first_name: 'Barney', last_name: 'Rubble' },
        { id: 4, first_name: 'Betty', last_name: 'Rubble' },
        { id: 5, first_name: 'Pebbles', last_name: 'Flintstone' },
        { id: 6, first_name: 'Bamm Bamm', last_name: 'Rubble' },
        { id: 7, first_name: 'The Great', last_name: 'Gazzoo' },
        { id: 8, first_name: 'Rockhead', last_name: 'Slate' },
        { id: 9, first_name: 'Pearl', last_name: 'Slaghoople' }
      ],
      search: {
        roomName: '',
        memberIds: ''
      }
    }
  },
  computed: {
    rows() {
      return this.items.length
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      alert(JSON.stringify(this.search));
    },
    onClear(event) {
      event.preventDefault();
      this.search.roomName = '';
      this.search.memberIds = '';
    }
  }
}
</script>


<style scoped>

</style>
