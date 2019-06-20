/* Services */
import Store from './services/store.service.js';

/* Routes */
const router = new VueRouter({
  routes: [
    { path: '/', component: httpVueLoader('pages/home.page.vue') },
    { path: '/example', component: httpVueLoader('pages/example.page.vue') },
    { path: '*', component: httpVueLoader('pages/404.vue') }
  ]
});

/* Create */
var defInterval;
var t;

function padTime(input) {
  if (input < 10) {
    return '0' + input;
  }
  else {
    return input;
  }
}

window.App = new Vue({
  router,
  el: '#pomodoro',
  data: {
    running: 0,
    sessionLength: 25,
    breakLength: 5,
    title: 'Pomodoro Timer',
    isBreak: false,
    progBar: 100,
    milliseconds: 0,
    pausedMilliseconds: 0,
    hrs: '00',
    mins: '25',
    secs: '00',
    percentage: 0,
    completedSessions: 0
  },
  methods: {
    run: function() {
        if (this.running === 0) {
          this.running = 1;
          var that = this;
          if (this.isBreak === true) {
            if (this.pausedMilliseconds > 0) {
              this.milliseconds = this.pausedMilliseconds;
            }
            else {
              this.milliseconds = this.breakLength * 60000; // minutes to milliseconds
            }
            this.percentage = (100 / (this.breakLength * 60));
          }
          else {
            if (this.pausedMilliseconds > 0) {
              this.milliseconds = this.pausedMilliseconds;
            }
            else {
              this.milliseconds = this.sessionLength * 60000;
            }
            this.percentage = (100 / (this.sessionLength * 60));
          }
          var dateObj = new Date(this.milliseconds);
          var breakAndSesLen = ((Number(this.sessionLength) + Number(this.breakLength)) * 60000);
          var doIt = function() {
            function timeDisp() {
              if (that.milliseconds === 0 && that.isBreak === false) {
                that.milliseconds = that.breakLength * 60000;
                that.title = 'Break';
                document.title = 'Break - Pomodoro Timer';
                that.isBreak = true;
                dateObj.setTime(that.milliseconds);
                that.hrs = padTime(dateObj.getUTCHours());
                that.mins = padTime(dateObj.getUTCMinutes());
                that.secs = padTime(dateObj.getUTCSeconds());
                timer();
                that.percentage = (100 / (that.breakLength * 60));
                that.progBar = 100;
              }
              else if (that.milliseconds === 0 && that.isBreak === true) {
                that.milliseconds = that.sessionLength * 60000;
                that.title = 'Work!';
                document.title = 'Work! - Pomodoro Timer';
                that.isBreak = false;
                dateObj.setTime(that.milliseconds);
                that.hrs = padTime(dateObj.getUTCHours());
                that.mins = padTime(dateObj.getUTCMinutes());
                that.secs = padTime(dateObj.getUTCSeconds());
                timer();
                that.percentage = (100 / (that.sessionLength * 60));
                that.progBar = 100;
              }
              else {
                that.milliseconds -= 1000;
                dateObj.setTime(that.milliseconds);
                that.hrs = padTime(dateObj.getUTCHours());
                that.mins = padTime(dateObj.getUTCMinutes());
                that.secs = padTime(dateObj.getUTCSeconds());
                timer();
                if (that.hrs === '00' && that.mins === '00' && that.secs === '00') {
                  that.progBar = 0;
                  that.completedSessions++;
                }
                else {
                  that.progBar -= that.percentage;
                }
              }
            }

            function timer() {
              t = setTimeout(timeDisp, 1000);
            }

            timer();
          };
          doIt();
          defInterval = setInterval(function() {
            if (that.milliseconds === 0) {
              doIt();
            }
          }, breakAndSesLen);
          if (this.isBreak === true) {
            this.title = 'Break';
            document.title = 'Break - Pomodoro Timer';
          }
          else {
            this.title = 'Work!';
            document.title = 'Work! - Pomodoro Timer';
          }
        }
        else if (this.running === 1) {
          clearTimeout(t);
          clearInterval(defInterval);
          this.pausedMilliseconds = this.milliseconds;
          this.running = 0;
          this.title = 'Paused';
          document.title = '[Paused] - Pomodoro Timer';
        }
    },
    reset: function() {
      clearTimeout(t);
      clearInterval(defInterval);
      this.running = 0;
      this.pausedMilliseconds = 0;
      if (this.sessionLength > 59) {
        this.hrs = padTime(Math.floor(this.sessionLength / 60));
        this.mins = padTime(this.sessionLength % 60);
        this.secs = '00';
      }
      else {
        this.hrs = '00';
        this.mins = padTime(this.sessionLength);
        this.secs = '00';
      }
      this.title = 'Pomodoro Timer';
      document.title = 'Pomodoro Timer';
      this.progBar = 100;
      this.completedSessions = 0;
      this.isBreak = false;
    },
    incSession: function() {
      if (this.running === 0) {
        this.sessionLength++;
        if (this.isBreak === false) {
          if (this.sessionLength > 59) {
            this.hrs = padTime(Math.floor(this.sessionLength / 60));
            this.mins = padTime(this.sessionLength % 60);
            this.secs = '00';
          }
          else {
            this.hrs = '00';
            this.mins = padTime(this.sessionLength);
            this.secs = '00';
          }
          this.pausedMilliseconds = 0;
          this.progBar = 100;
        }
      }
    },
    decSession: function() {
      if (this.running === 0) {
        if (this.sessionLength > 1) {
          this.sessionLength--;
          if (this.isBreak === false) {
            this.pausedMilliseconds = 0;
            this.progBar = 100;
            if (this.sessionLength > 59) {
              this.hrs = padTime(Math.floor(this.sessionLength / 60));
              this.mins = padTime(this.sessionLength % 60);
              this.secs = '00';
            }
            else {
              this.hrs = '00';
              this.mins = padTime(this.sessionLength);
              this.secs = '00';
            }
          }
        }
      }
    },
    incBreak: function() {
      if (this.running === 0) {
        this.breakLength++;
        if (this.isBreak === true) {
          if (this.breakLength > 59) {
            this.hrs = padTime(Math.floor(this.breakLength / 60));
            this.mins = padTime(this.breakLength % 60);
            this.secs = '00';
          }
          else {
            this.hrs = '00';
            this.mins = padTime(this.breakLength);
            this.secs = '00';
          }
          this.pausedMilliseconds = 0;
          this.progBar = 100;
        }
      }
    },
    decBreak: function() {
      if (this.running === 0) {
        if (this.breakLength > 1) {
          this.breakLength--;
          if (this.isBreak === true) {
            if (this.breakLength > 59) {
              this.hrs = padTime(Math.floor(this.breakLength / 60));
              this.mins = padTime(this.breakLength % 60);
              this.secs = '00';
            }
            else {
              this.hrs = '00';
              this.mins = padTime(this.breakLength);
              this.secs = '00';
            }
            this.pausedMilliseconds = 0;
            this.progBar = 100;
          }
        }
      }
    }
  },
  computed: {
    progressBar: function() {
      return this.progBar + '%';
    },
    sessionMinutesLabel: function() {
      if (this.sessionLength === '') {
        return 'Minutes';
      }
      else {
        return '';
      }
    },
    breakMinutesLabel: function() {
      if (this.breakLength === '') {
        return 'Minutes';
      }
      else {
        return '';
      }
    },
  }
});

/* Assign global services */
Object.defineProperty(Vue.prototype, '_store', { value: new Store() });
