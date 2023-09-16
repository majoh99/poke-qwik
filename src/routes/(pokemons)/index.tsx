import { $, component$ } from '@builder.io/qwik';
import  { type DocumentHead, useNavigate } from '@builder.io/qwik-city';

import { PokemonImage } from '../../components/pokemon/pokemon-image';
import { usePokemonGame } from '~/hooks/use-pokemon-game';

export default component$(() => {

  const nav = useNavigate();
  const { 
    isPokemonVisible,
    showBackImage,
    nextPokemon,
    pokemonId,
    prevPokemon,
    toggleFrontBack,
    toggleVisible,
   } = usePokemonGame();

  const goToPokemon = $(( id: number ) => {
    nav(`/pokemon/${id}/`);
  });

  return (
    <>
      <span>Buscador simple</span>

      <span class="text-9xl">{ pokemonId.value }</span>

      <div onClick$={ () => goToPokemon( pokemonId.value )}>
        <PokemonImage 
          id={ pokemonId.value } 
          size={200} 
          backImage={ showBackImage.value } 
          isVisible={ isPokemonVisible.value } 
        />
      </div>
      {/* </Link> */}
      
      <div class="mt-2">
        <button onClick$={ prevPokemon } class="btn btn-primary mr-2">Anterior</button>
        <button onClick$={ nextPokemon } class="btn btn-primary mr-2">Siguiente</button>
        <button onClick$={ toggleFrontBack } class="btn btn-primary mr-2">Voltear</button>
        <button onClick$={ toggleVisible } class="btn btn-primary">Revelar</button>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "PokeQwik",
  meta: [
    {
      name: "description",
      content: "My first Qwik app",
    },
  ],
};
