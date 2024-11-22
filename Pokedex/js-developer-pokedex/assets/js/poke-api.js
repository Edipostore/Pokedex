const pokeApi = {};

/**
 * Converte os detalhes de um Pokémon da API para um objeto `Pokemon`.
 * Certifique-se de ter definido a classe `Pokemon` anteriormente.
 * @param {Object} pokeDetail - Detalhes de um Pokémon retornados pela API.
 * @returns {Pokemon} - Instância do Pokémon convertido.
 */
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites?.other?.dream_world?.front_default || 
                    pokeDetail.sprites?.front_default || 
                    "default_image_url"; // Define um fallback se não houver imagem.

    return pokemon;
}

/**
 * Obtém os detalhes de um Pokémon a partir de sua URL.
 * @param {Object} pokemon - Objeto contendo a URL do Pokémon.
 * @returns {Promise<Pokemon>} - Uma promessa que resolve com os detalhes do Pokémon.
 */
pokeApi.getPokemonDetail = (pokemon) => {
    if (!pokemon.url) {
        return Promise.reject(new Error("URL inválida para o Pokémon."));
    }

    return fetch(pokemon.url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes: ${response.status}`);
            }
            return response.json();
        })
        .then(convertPokeApiDetailToPokemon)
        .catch((error) => {
            console.error("Erro ao obter detalhes do Pokémon:", error);
            return null; // Retorna null para não interromper o fluxo.
        });
};

/**
 * Obtém uma lista de Pokémon com detalhes adicionais.
 * @param {number} offset - Posição inicial para carregar os Pokémon.
 * @param {number} limit - Quantidade de Pokémon a carregar.
 * @returns {Promise<Array<Pokemon>>} - Uma promessa que resolve com a lista de Pokémon.
 */
pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar lista de Pokémon: ${response.status}`);
            }
            return response.json();
        })
        .then((jsonBody) => jsonBody.results || [])
        .then((pokemons) => {
            // Mapeia e aguarda todas as promessas de detalhes
            const detailRequests = pokemons.map(pokeApi.getPokemonDetail);
            return Promise.all(detailRequests);
        })
        .then((pokemonsDetails) => pokemonsDetails.filter((pokemon) => pokemon !== null)) // Remove entradas nulas.
        .catch((error) => {
            console.error("Erro ao carregar Pokémon:", error);
            return []; // Retorna um array vazio em caso de falha.
        });
};
