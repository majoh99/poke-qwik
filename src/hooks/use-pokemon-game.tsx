import { useComputed$, useContext, $ } from '@builder.io/qwik';
import { pokemonGameContext } from '~/context';


export const usePokemonGame = () => {

  const pokemonGame = useContext( pokemonGameContext );

  const changePokemonId = $((value: number) => {
    if( (pokemonGame.pokemonId + value) <= 0 ) return;

    pokemonGame.pokemonId += value;
  });

  const toggleFrontBack = $(() => {
    pokemonGame.showBackImage = !pokemonGame.showBackImage;
  });

  const toggleVisible = $(() => {
    pokemonGame.isPokemonVisible = !pokemonGame.isPokemonVisible;
  });

  return{
    pokemonId       : useComputed$(() => pokemonGame.pokemonId),
    showBackImage   : useComputed$(() => pokemonGame.showBackImage),
    isPokemonVisible: useComputed$(() => pokemonGame.isPokemonVisible),


    nextPokemon: $(() => changePokemonId(+1)),
    prevPokemon: $(() => changePokemonId(-1)),

    toggleFrontBack: toggleFrontBack,
    toggleVisible  : toggleVisible,
  }
};