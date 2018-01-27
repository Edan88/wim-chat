
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import moment from 'moment'
// resources/assets/js/app.js
require('./bootstrap');


window.Vue = require('vue');


Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY HH:mm');
  }
});

Vue.component('chat-messages', require('./components/ChatMessages.vue'));
Vue.component('chat-form', require('./components/ChatForm.vue'));

const app = new Vue({
  el: '#app',

  data: {
    messages: []
  },

  created() {
    this.fetchMessages();
    Echo.private('chat')
        .listen('MessageSent', (e) => {
          console.log(e);
          this.messages.push({
            id: e.message.id,
            message: e.message.message,
            user: e.user
          })
        })
        .listen('MessageRemoved', (e) => {
          console.log('removed');
          console.log(e.message);

          for(var i = 0, l = this.messages.length ; i < l ; i++) {
            if(this.messages[i].id === e.message.id) {
              this.messages.splice(i, 1);
            }
          }
        })
        .listen('MessageUpdated', (e) => {
          console.log('updated');
          console.log(e);
        });
  },

  methods: {
    fetchMessages() {
      axios.get('/messages').then(response => {
        console.log(response);
        this.messages = response.data;
      });
    },

    addMessage(message) {
      console.log(message);
      axios.post('/messages', message).then(response => {
        console.log(response.data);
        var newMessage = response.data.message;
        newMessage.user = message.user;
        this.messages.push(newMessage);
      });
    },

    updateMessage(message) {
      console.dir(message);
      console.dir(this.messages);

      axios.put('/messages', message).then(response => {
        console.log(response.data);
      });
    },

    removeMessage(message) {
      //Refactor: use DELETE
      this.messages.splice(message.index, 1);
      axios.post('/messagesDelete', message).then(response => {
        console.log(response.data);
      });
    }
  }
});