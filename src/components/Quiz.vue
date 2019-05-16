<template>
  <v-container v-if="!isFinished">
    <v-card dark color="success">
      <v-card-text class="d-flex align-center">
        <transition name="slide-fade" mode="out-in">
          <h6 class="title" :key="questionIndex">
            {{ questions[questionIndex].title }}
          </h6>
        </transition>
        <v-flex class="progress ml-4">
          <v-progress-circular
              :rotate="360"
              :size="80"
              :width="10"
              :value="time / 30 * 100"
              color="white"
          >
            {{ timeRemaining }}
          </v-progress-circular>
        </v-flex>

        <!--<span class="title ml-4" right>{{ timeRemaining }}</span>-->
      </v-card-text>
    </v-card>
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
            title: 'Кому принадлежит фраза: «Занял денег у Василия Березуцкого и не отдаю. Теперь их стало проще различать. Тот, кто не просит вернуть деньги – Алексей»?',
            answers: [
              {
                title: 'Виктор Ганчаренко',
                correct: false
              },
              {
                title: 'Леонид Слуцкий',
                correct: true
              },
              {
                title: 'Понтус Вернблум',
                correct: false
              },
              {
                title: 'Сергей Игнашевич',
                correct: false
              }
            ]
          },
          {
            title: 'Кому принадлежит фраза: «Мы проводим сборы в одном и том же отеле уже семь лет подряд. Мне кажется, что суммарно я провел здесь почти год своей жизни, аж тошнит уже. Здесь тихо, не так и плохо, но мы тренируемся, как свиньи, и сохранять позитивный настрой непросто»?',
            answers: [
              {
                title: 'Василий Березуцкий',
                correct: false
              },
              {
                title: 'Алексей Березуцкий',
                correct: false
              },
              {
                title: 'Зоран Тошич',
                correct: false
              },
              {
                title: 'Понтус Вернблум',
                correct: true
              }
            ]
          },
          {
            title: 'Кому принадлежит фраза: «Только я могу заменить Путина, но я занят»?',
            answers: [
              {
                title: 'Василий Березуцкий',
                correct: true
              },
              {
                title: 'Сергей Игнашевич',
                correct: false
              },
              {
                title: 'Алексей Березуцкий',
                correct: false
              },
              {
                title: 'Понтус Вернблум',
                correct: false
              }
            ]
          },
          {
            title: 'Кому принадлежит фраза: «Считаю, что Игорь – один из величайших вратарей в истории российского футбола. А то, что, как вы говорите, он пропускает так много в Лиге чемпионов, это вина всей команды и, в первую очередь, Василия Березуцкого»?',
            answers: [
              {
                title: 'Леонид Слуцкий',
                correct: false
              },
              {
                title: 'Георгий Щенников',
                correct: false
              },
              {
                title: 'Понтус Вернблум',
                correct: true
              },
              {
                title: 'Кирилл Набабкин',
                correct: false
              }
            ]
          }
        ],
        answer: null,
        selectedAnswers: [],
        questionIndex: 0,
        isFinished: false,
        time: 30
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
              this.time = 30
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
          this.time = 30
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
  .progress {
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
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
