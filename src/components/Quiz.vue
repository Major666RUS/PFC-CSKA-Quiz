<template>
  <v-container v-if="!isFinished">
    <v-toolbar dark color="success">
      <transition name="slide-fade" mode="out-in">
        <h6 class="title" :key="questionIndex">
          {{ questions[questionIndex].title }}
        </h6>
      </transition>
      <v-spacer></v-spacer>
      <span class="title ml-4" right>{{ timeRemaining }}</span>
    </v-toolbar>
    <transition name="slide-fade" mode="out-in">
      <v-radio-group
          :key="questionIndex"
          v-model="answer"
          :error-messages="answerErrors"
          @change="$v.answer.$reset()"
          required
      >
        <v-radio
            v-for="answer in questions[questionIndex].answers"
            :key="answer"
            :label="answer"
            :value="answer"
        ></v-radio>
      </v-radio-group>
    </transition>
    <div>
      <v-btn v-if="!(questionIndex == (questions.length - 1))" color="success" @click="goNext">Далее<v-icon dark right>arrow_forward</v-icon></v-btn>
      <v-btn v-else color="success" @click="goNext">Завершить<v-icon dark right>check_circle</v-icon></v-btn>
    </div>

  </v-container>
  <v-container v-else>
    <h2 class="display-3">Как бы Вы Евгений не отвечали, все равно ни х** не знаете про Великий московский клуб!</h2>
    <v-treeview :items="correctAnswers" class="mt-4"></v-treeview>
  </v-container>
</template>

<script>
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    name: 'Quiz',
    mixins: [validationMixin],
    validations: {
      answer: {
        required
      }
    },
    data() {
      return {
        questions: [
          {
            title: 'Кто забил первый гол в финале кубка УЕФА 2005 года в матче ЦСКА - Спортинг?',
            answers: ['Василий Березуцкий', 'Алексей Березуцкий', 'Юрий Жирков', 'Вагнер Лав']
          },
          {
            title: 'С клубом из какой страны ЦСКА не играл в плейофф того розыгрыша кубка УЕФА?',
            answers: ['Италии', 'Сербии', 'Македонии', 'Франции']
          },
          {
            title: 'В том розыгрыше кубка УЕФА в плейофф армейцами был выбит еще один португальский клуб, помимо Спортинга. Что за клуб?',
            answers: ['Брага', 'Бенфика', 'Порту', 'Насьонал']
          },
        ],
        answer: null,
        answers: [],
        correctAnswers: [
          {
            id: 1,
            name: 'Правильные ответы',
            children: [
              { id: 2, name: '1) Алешка Березуцкий' },
              { id: 3, name: '2) Ну, конечно, Македонии' },
              { id: 4, name: '3) Бенфика, of course' }
            ]
          }
        ],
        questionIndex: 0,
        isFinished: false,
        time: 10
      }
    },
    computed: {
      timeRemaining () {
        return this.time < 10 ? `00:0${this.time}` : `00:${this.time}`
      },
      answerErrors () {
        const errors = []
        if (!this.$v.answer.$dirty) return errors
        !this.$v.answer.checked && errors.push('Выберите один из представленых вариантов!')
        return errors
      }
    },
    watch: {
      'answer': {
        handler() {
          this.answers[this.questionIndex] = this.answer
        }
      }
    },
    methods: {
      timer () {
        setInterval(() => {
          this.time--
          if (this.time == 0) {
            if (this.questionIndex == this.questions.length - 1) return this.isFinished = true

            this.questionIndex++
            this.time = 10
            this.$v.answer.$reset()
            this.answer = null
          }
        }, 1000)
      },
      goNext () {
        this.$v.answer.$touch()
        if (this.$v.answer.$invalid) {
          return
        }

        if (this.questionIndex == this.questions.length - 1) return this.isFinished = true

        this.time = 10
        this.questionIndex++
        this.$v.answer.$reset()
        this.answer = null
      }
    },
    mounted() {
      this.timer()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .success {
    background: linear-gradient(to right, red 50%, blue 50%);
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active до версии 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
