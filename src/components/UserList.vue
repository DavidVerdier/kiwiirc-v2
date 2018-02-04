<template>
    <div class="kiwi-userlist">
        <div class="kiwi-userlist-nav">
            <form class="u-form kiwi-channellist-search" @submit.prevent>
                <input v-model="search" :placeholder="$t('do_search')" class="u-input" />
            </form>
        </div>
        <table>
            <tbody>
                <tr v-for="user in filteredList">
                    <td>
                        <span class="kiwi-userlist-users"><i class="fa fa-user" aria-hidden="true"></i></span>
                        <a class="u-link"
                           @click="openQuery(user)"
                           v-bind:style="nickStyle(user.nick)"
                           >{{ user.nick }}</a>
                    </td>
                    <td>{{ user.realname }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import _ from 'lodash';
import state from '@/libs/state';
import * as TextFormatting from '@/helpers/TextFormatting';

export default {
    props: ['network'],
    data: function data() {
        return {
            search: null,
        };
    },
    computed: {
        list: function list() {
            return Object.values(this.network.users) || [];
        },
        filteredList: function filteredList() {
            let list = this.list;

            if (this.search) {
                list = this.list.filter(user => {
                    if (user.nick.toLowerCase().indexOf(this.search) > -1) {
                        return true;
                    }
                    return false;
                });
            }
            return _.sortBy(list, 'nick');
        },
    },
    methods: {
        nickStyle: function nickStyle(nick) {
            let styles = {};
            styles.color = TextFormatting.createNickColour(nick);
            return styles;
        },
        openQuery: function openQuery(user) {
            let buffer = state.addBuffer(this.network.id, user.nick);
            state.setActiveBuffer(buffer.networkid, buffer.name);
        },
    },
};
</script>

<style>
.kiwi-userlist {
    box-sizing: border-box;
}
.kiwi-userlist-pagination a {
    display: inline-block;
    margin: 0 10px;
    cursor: pointer;
}

.kiwi-userlist table {
    border: none;
    border-collapse: collapse;

}
.kiwi-userlist table tbody td {
    padding: 2px 1em;
}
.kiwi-userlist tr td:first-child {
    white-space: nowrap;
}
.kiwi-userlist-users {
    display: inline-block;
}
</style>
