import { acceptHMRUpdate, defineStore } from 'pinia'
import axios from 'axios'

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemons = ref({})
  const pokemon = ref({})
  const nuni = ref('hi am nuni')

  async function fetchPokemons() {
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon`)
    pokemons.value = data
  }

  async function fetchNuni() {
    nuni.value = 'eiei'
  }

  async function fetchPokemonByName(name) {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`,
    )
    pokemon.value = data
  }

  return {
    pokemons: computed(() => pokemons.value),
    pokemon: computed(() => pokemon.value),
    nuni: computed(() => nuni.value),

    fetchPokemonByName,
    fetchPokemons,
    fetchNuni,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(usePokemonStore as any, import.meta.hot),
  )
}
