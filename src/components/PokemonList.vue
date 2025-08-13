<script setup lang="ts">
const pokemonStore = usePokemonStore()
const { pokemons, nuni } = storeToRefs(pokemonStore)
</script>

<template>
  <div>
    <h1>Pokemon Component</h1>
    {{ nuni }}

    <pre>
      {{ pokemons }}
    </pre>

    <button @click="pokemonStore.seteiei()">
      Eiei
    </button>
    <ul v-for="pokemon in pokemons.results">
      <li>
        <router-link
          :to="{ name: '/pokemon/[name]', params: { name: pokemon.name } }"
        >
          {{ pokemon.name }}
        </router-link>
        <hr>
      </li>
    </ul>
  </div>
</template>
