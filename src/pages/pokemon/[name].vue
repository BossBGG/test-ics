<script setup lang="ts">
const pokemonStore = usePokemonStore()
const { pokemon, nuni } = storeToRefs(pokemonStore)
const name = useParams('name')
const a = ['1', '2']
const b = ['3', '4']
onMounted(async () => {
  loading.start()
  await pokemonStore.fetchPokemonByName(name.value)
  loading.stop()
})
</script>

<template>
  <div>
    <h1>Pokemon</h1>
    <img
      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`"
    >

    {{ nuni }}
    <h1>
      {{ pokemon.name }}
    </h1>

    ส่วนสูง {{ pokemon.height }} เมตร <br>
    หนัก {{ pokemon.weight }} กิโลกรัม <br>
  </div>
</template>
