// resources/assets/js/components/ChatMessages.vue

<template>
  <ul class="chat">
    <li class="left clearfix" v-for="(message, index) in messages">
      <div class="chat-body clearfix">
        <div class="header">
          <strong class="primary-font">
            {{ message.user.name }}
          </strong>
        </div>
        <p>
          {{ message.message }}
        </p>

        <small>bijgewerkt: {{ message.updated_at | formatDate }}</small>

        <div v-if="user.id == message.user.id  && !message.edit">
          <button class="btn btn-primary btn-sm" id="btn-chat" @click="editMessage(index)">
            Bewerken
          </button>

          <button class="btn btn-primary btn-sm" id="btn-chat" @click="removeMessage(index, message.id)">
            Verwijder
          </button>
        </div>

        <div v-if="user.id == message.user.id && message.edit">

          <input id="btn-input" type="text" name="message" class="form-control input-sm" placeholder="Pas hier jouw bericht aan..." v-model="newMessage">

          <button class="btn btn-primary btn-sm" id="btn-chat" @click="cancelEditMessage(index)">
            Annuleren
          </button>
          <button class="btn btn-primary btn-sm" id="btn-chat" @click="updateMessage(index, message.id)">
            Updaten
          </button>
        </div>

      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['messages','user'],

    data() {
      return {
        newMessage: ''
      }
    },


    methods: {

      editMessage(index) {
        this.newMessage = this.messages[index].message;
        this.$emit('messageedit', {
          index: index
        });
      },

      cancelEditMessage(index) {
        this.$emit('messageeditcancel', {
          index: index
        });
      },

      updateMessage(index, messageId) {
        this.$emit('messageupdate', {
          user: this.user,
          message: this.newMessage,
          index: index,
          message_id: messageId
        });
      },

      removeMessage(index, messageId) {
        console.log(messageId);
        this.$emit('messagedelete', {
          index: index,
          user: this.user,
          message_id: messageId
        });
      }
    }

  };
</script>