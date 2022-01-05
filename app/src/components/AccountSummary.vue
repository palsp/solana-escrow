<template>
  <div class="account-summary">
    <div class="form-group">
      <label for="token">Token: </label>
      <input
        id="token"
        type="text"
        placeholder="enter token name...."
        :value="searchTerm"
        @input="$emit('search', $event.target.value)"
      />
    </div>
    <table class="table">
      <thead>
        <tr>
          <th class="col-left">TOKEN</th>
          <th>BALANCE</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tokenAccount in displayTokenAccounts"
          :key="tokenAccount.tokenAccountAddress"
        >
          <td class="col-left">
            {{ tokenAccount.symbol }}
          </td>

          <td class="col-right">{{ tokenAccount.balance.toEther() }}</td>
          <!-- <td>{{ tokenAccount.tokenAccountAddress }}</td> -->
        </tr>
      </tbody>
    </table>
    <button v-if="showBtnText" class="btn" @click="triggerShow">
      {{ btnText }}
    </button>
  </div>
</template>
<script setup>
import { computed, ref, toRefs } from "vue";
import { useStore } from "vuex";
import { useDebounce } from "@/composables";
import { getTokenSymbolByMintAddress } from "@/utils";

const props = defineProps({
  searchTerm: String,
});
const store = useStore();
const { searchTerm } = toRefs(props);
const [debounceTerm] = useDebounce(searchTerm, 500);
const showAll = ref(false);

const minimumDisplayTokenAccounts = 5;

const tokenAccounts = computed(() => {
  let _tokenAccounts = store.getters["wallet/tokenAccounts"];
  const items = [];
  const tokenAccountEntries = Object.entries(_tokenAccounts);
  tokenAccountEntries.forEach(([mintAddress, tokenAccount]) => {
    const { symbol } = getTokenSymbolByMintAddress(mintAddress);
    if (symbol.toLowerCase().startsWith(debounceTerm.value.toLowerCase())) {
      items.push({
        ...tokenAccount,
        symbol,
      });
    }
  });
  return items;
});

const displayTokenAccounts = computed(() => {
  if (
    tokenAccounts.value.length > minimumDisplayTokenAccounts &&
    !showAll.value
  ) {
    return tokenAccounts.value.slice(0, minimumDisplayTokenAccounts);
  } else {
    return tokenAccounts.value;
  }
});

const btnText = computed(() => {
  if (tokenAccounts.value.length > displayTokenAccounts.value.length) {
    return "show more";
  } else if (tokenAccounts.value.length <= minimumDisplayTokenAccounts) {
    return "";
  }
  return "show less";
});
const showBtnText = computed(() => btnText.value !== "");

const triggerShow = () => {
  showAll.value = !showAll.value;
};
</script>
<style scoped>
.account-summary {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form-group {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.form-group label,
.form-group input {
  margin: 1rem;
}
.form-group input {
  padding: 0.5rem;
  width: 50%;
}

.table {
  width: 100%;
  margin: 2rem 0;
  border-spacing: 0;
}

th,
td {
  padding: 0.5rem;
  width: 50%;
}

th {
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 1px solid black;
}

.col-left {
  font-weight: bold;
  border-right: 1px solid black;
}

.btn {
  padding: 0.5rem;
  width: 30%;
}

.btn:hover {
  cursor: pointer;
}
</style>
