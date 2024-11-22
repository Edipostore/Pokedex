class Pokemon {
    constructor(number = 0, name = "", type = "", types = [], photo = "") {
        this.number = number;  // Número do Pokémon (ex: ID na PokéAPI)
        this.name = name;      // Nome do Pokémon
        this.type = type;      // Tipo principal do Pokémon
        this.types = types;    // Todos os tipos do Pokémon
        this.photo = photo;    // URL da foto do Pokémon
    }
}
