<script setup lang="ts">
const pokemonStore = usePokemonStore()
const { pokemons } = storeToRefs(pokemonStore)
onMounted(async () => {
  loading.start()
  await pokemonStore.fetchPokemons()
  loading.stop()
})
</script>

<template>
  <div>
    <h1>Pokemon</h1>
    <pre>
  {{ pokemons }}
 </pre>

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
