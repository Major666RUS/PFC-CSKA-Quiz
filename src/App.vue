<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <v-flex>
          <span>ЦСКА</span>
          <span class="font-weight-light">Викторина</span>
        </v-flex>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
          icon
          href="https://pfc-cska.com/"
          target="_blank"
      >
        <v-img
            :src="require('./assets/logo.svg')"
            contain
            height="50"
        ></v-img>
      </v-btn>
    </v-toolbar>

    <v-content>
      <Quiz/>
    </v-content>
  </v-app>
</template>

<script>
import Quiz from './components/Quiz'

export default {
  name: 'App',
  components: {
    Quiz
  },
  data () {
    return {
      //
    }
  }
}
</script>
