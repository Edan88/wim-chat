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
          {{ message.message }} {{ message }}
        </p>

        <small>bijgewerkt: {{ message.updated_at | formatDate }}</small>
        <p v-if="user.id == message.user.id">
          <button class="btn btn-primary btn-sm" id="btn-chat" @click="editMessage(message.id, message.message)">
            Bewerken
          </button>
          <button class="btn btn-primary btn-sm" id="btn-chat" @click="removeMessage(index, message.id)">
            Verwijder
          </button>
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['messages','user'],

    methods: {

      editMessage(messageId, message) {
        this.$emit('messageupdate', {
          user: this.user,
          message: message,
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