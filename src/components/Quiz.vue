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
    <div>
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
              :key="answer.title"
              :label="answer.title"
              :value="answer.title"
          ></v-radio>
        </v-radio-group>
      </transition>
    </div>

    <div>
      <v-btn v-if="!(questionIndex == (questions.length - 1))" color="success" @click="goNext">Далее<v-icon dark right>arrow_forward</v-icon></v-btn>
      <v-btn v-else color="success" @click="goNext">Завершить<v-icon dark right>check_circle</v-icon></v-btn>
    </div>

  </v-container>
  <v-container v-else>
    <template v-for="(question, questionIndex) in questions">
      <h6 class="title" :key="questionIndex">
        {{ questions[questionIndex].title }}
      </h6>
      <v-radio-group
          :key="question.title"
          :value="selectedAnswers[questionIndex]"
          disabled
      >
        <v-radio
            v-for="answer in questions[questionIndex].answers"
            :key="answer.title"
            :label="answer.title"
            :value="answer.title"
        >
          <template v-slot:label v-if="answer.correct">
            <strong class="success--text">{{ answer.title }}</strong>
          </template>

          <template v-slot:label v-else-if="(answer.title == selectedAnswers[questionIndex]) && !answer.correct">
            <strong class="error--text">{{ answer.title }}</strong>
          </template>

        </v-radio>
      </v-radio-group>
    </template>

    <h2 class="display-1">Итого:
      <strong :class="this.correctAnswersCount == this.questions.length ? 'success--text' : 'error--text'">{{ this.correctAnswersCount }}</strong>
      / {{ this.questions.length }}
    </h2>
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
            answers: [
              {
                title: 'Василий Березуцкий',
                correct: false
              },
              {
                title: 'Алексей Березуцкий',
                correct: true
              },
              {
                title: 'Юрий Жирков',
                correct: false
              },
              {
                title: 'Вагнер Лав',
                correct: false
              }
            ]
          },
          {
            title: 'С клубом из какой страны ЦСКА не играл в плейофф того розыгрыша кубка УЕФА?',
            answers: [
              {
                title: 'Италии',
                correct: false
              },
              {
                title: 'Сербии',
                correct: false
              },
              {
                title: 'Македонии',
                correct: true
              },
              {
                title: 'Франции',
                correct: false
              }
            ]
          },
          {
            title: 'В том розыгрыше кубка УЕФА в плейофф армейцами был выбит еще один португальский клуб, помимо Спортинга. Что за клуб?',
            answers: [
              {
                title: 'Брага',
                correct: false
              },
              {
                title: 'Бенфика',
                correct: true
              },
              {
                title: 'Порту',
                correct: false
              },
              {
                title: 'Насьонал',
                correct: false
              }
            ]
          },
        ],
        answer: null,
        selectedAnswers: [],
        questionIndex: 0,
        isFinished: false,
        time: 15
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
      },
      correctAnswersCount () {
        const $this = this
        return this.selectedAnswers.reduce(function(sum, answer, questionIndex) {
          if (!answer) return sum

          let answerIndex
          $this.questions[questionIndex].answers.some((item, index) => {
            if (item.title == answer) {
              answerIndex = index
              return true
            }
          })
          return $this.questions[questionIndex].answers[answerIndex].correct ? ++sum : sum
        }, 0)
      }
    },
    watch: {
      'answer': {
        handler() {
          this.selectedAnswers[this.questionIndex] = this.answer
        }
      }
    },
    methods: {
      timer () {
        setInterval(() => {
          this.time--
          if (this.time == 0) {
            if (this.questionIndex == this.questions.length - 1) {
              this.isFinished = true
              this.time = 0
              this.questionIndex = null
              this.answer = null
            } else {
              this.time = 15
              this.questionIndex++
              this.$v.answer.$reset()
              this.answer = null
            }
          }
        }, 1000)
      },
      goNext () {
        this.$v.answer.$touch()
        if (this.$v.answer.$invalid) {
          return
        }

        if (this.questionIndex == this.questions.length - 1) {
          this.isFinished = true
          this.time = 0
          this.questionIndex = null
          this.answer = null
        } else {
          this.time = 15
          this.questionIndex++
          this.$v.answer.$reset()
          this.answer = null
        }
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
