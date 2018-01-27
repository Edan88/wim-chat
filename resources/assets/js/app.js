
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
            updated_at: e.message.updated_at,
            edit: false,
            user: e.user
          })
        })
        .listen('MessageRemoved', (e) => {

          for(var i = 0, l = this.messages.length ; i < l ; i++) {
            if(this.messages[i].id === e.message.id) {
              this.messages.splice(i, 1);
            }
          }
        })
        .listen('MessageUpdated', (e) => {
          console.log('updated');
          console.log(e);

          for(var i = 0, l = this.messages.length ; i < l ; i++) {
            if(this.messages[i].id === e.message.id) {
              this.messages[i].message = e.message.message;
              this.messages[i].updated_at = e.message.updated_at;
            }
          }
        });
  },

  methods: {
    fetchMessages() {
      axios.get('/messages').then(response => {
        var messages = response.data;
        for(var i = 0, l = messages.length ; i < l ; i++) {
          messages[i].edit = false;
        }
        this.messages = messages;
      });
    },

    addMessage(message) {
      axios.post('/messages', message).then(response => {
        console.log(response);
        var newMessage = response.data.message;
        newMessage.user = message.user;
        newMessage.edit = false;
        this.messages.push(newMessage);
      });
    },

    updateMessage(e) {
      console.dir(e);
      console.dir(this.messages);

      this.messages[e.index].edit = false;
      this.messages[e.index].message = e.message;

      var updateObject = {
        message: e.message,
        id: e.message_id
      };

      axios.put('/messages', updateObject).then(response => {
        console.log(response.data);
        this.messages[e.index].updated_at = response.data.message.updated_at;
      });
    },

    removeMessage(e) {
      //Refactor: use DELETE
      this.messages.splice(e.index, 1);

      var deleteObject = {
        id: e.message_id
      };
      axios.post('/messagesDelete', deleteObject).then(response => {
        console.log(response.data);
      });
    },

    editMessage(e) {
      console.log(e.index);
      this.messages[e.index].edit = true;
    },
    editMessageCancel(e) {
      this.messages[e.index].edit = false;
    }
  }
});