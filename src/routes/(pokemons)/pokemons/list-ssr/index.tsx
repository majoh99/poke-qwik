import { component$, useComputed$, $, useSignal, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { type DocumentHead, routeLoader$, useLocation, useNavigate } from '@builder.io/qwik-city';

import { PokemonImage } from '~/components/pokemon/pokemon-image';
import { Modal } from '~/components/shared/modal/modal';
import { getFunFactAboutPokemon } from '~/helpers/get-chat-gpt-response';
import { getSmallPokemons } from '~/helpers/get-small-pokemons';
import type { SmallPokemon } from '~/interfaces'

export const usePokemonList = routeLoader$<SmallPokemon[]>(
  async ({ query, redirect, pathname }) => {
  
  const offset = Number(query.get('offset') || 0);
  if ( offset < 0 ) throw redirect(301, pathname);
  if ( isNaN(offset) ) throw redirect(301, pathname);

  return getSmallPokemons(offset);
});


export default component$(() => {

  const pokemons = usePokemonList();
  const location = useLocation();
  const nav = useNavigate();

  const modalVisible = useSignal(false);
  const modalPokemon = useStore({
    id: '',
    name: '',
  });

  const chatGptPokemonFact = useSignal('');

  // Modal functions
  const showModal = $(( id: string, name: string ) => {
    modalPokemon.id = id;
    modalPokemon.name = name;

    modalVisible.value = true;
  });

  const closeModal = $(() => {
    modalVisible.value = false;
  });

  useVisibleTask$(({track}) => {
    track(() => modalPokemon.name);

    chatGptPokemonFact.value = '';

    if ( modalPokemon.name.length > 0 ) {
      getFunFactAboutPokemon(modalPokemon.name)
        .then( resp => chatGptPokemonFact.value = resp );
    }
  });


  const currentOffset = useComputed$<number>( () => {
    const offsetString = new URLSearchParams(location.url.search);
    return Number(offsetString.get('offset' || 0));
  });

  const onClickNav = $((value: number) => {
    if (currentOffset.value + value < 0) return;
    nav(`/pokemons/list-ssr/?offset=${ currentOffset.value + value }`);
  });

	return (
		<>
			<div class='flex flex-col'>
				<span class='my-5 text-5xl'>Status</span>
				<span>Offset: { currentOffset }</span>
				<span>Está cargando la página: { location.isNavigating ? 'Sí' : 'No' }</span>
			</div>

			<div class='mt-10'>
				<button class='btn btn-primary mr-2'
          onClick$={() => onClickNav(-10)}>Anteriores</button>
				<button class='btn btn-primary mr-2'
          onClick$={() => onClickNav(+10)}>Siguientes</button>
			</div>

			<div class='grid grid-cols-6 mt-5'>
        {
          pokemons.value.map(({ name, id }) => (
            <div key="{ name }" 
              onClick$={() => showModal(id, name)}
              class="m-5 flex flex-col justify-center items-center">
              <PokemonImage id={ id } />
              <span class="capitalize">{ name }</span>
            </div>
          ))
        }
				
			</div>

      <Modal 
        showModal={ modalVisible.value } 
        closeFn={closeModal} 
        persistent
        size='md'
      >
        <div q:slot='title'>{ modalPokemon.name }</div>
        <div q:slot='content' class="flex flex-col justify-center items-center">
          <PokemonImage id={ modalPokemon.id }/>
          <span>{
            chatGptPokemonFact.value === ''
            ? 'Preguntando a ChatGPT...'
            : chatGptPokemonFact.value
            }</span>
        </div>
      </Modal>

    
		</>
	);
});

export const head: DocumentHead = {
	title: 'List SSR',
};
