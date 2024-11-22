const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

/**
 * Converte um objeto Pokémon para um item HTML <li>
 * @param {Object} pokemon - Objeto representando um Pokémon
 * @returns {string} - HTML string do item da lista
 */
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

/**
 * Carrega os itens Pokémon e os adiciona ao DOM
 * @param {number} offset - Posição inicial para carregar os Pokémon
 * @param {number} limit - Quantidade máxima de Pokémon a carregar
 */
function loadPokemonItens(offset, limit) {
    if (offset >= maxRecords) return; // Evita carregamento acima do limite

    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    }).catch(error => {
        console.error("Erro ao carregar os Pokémon:", error);
    });
}

// Carrega os primeiros itens ao iniciar
loadPokemonItens(offset, limit);

/**
 * Evento de clique para carregar mais Pokémon
 */
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        // Remove o botão ao alcançar o máximo de registros
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
