namespace FastChallenge.Api.Models;

public class Workshop
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public DateTime DataRealizacao { get; set; }
    public string Descricao { get; set; } = string.Empty;

    // Lista de colaboradores que participaram deste workshop (representa a presença)
    public List<Colaborador> Colaboradores { get; set; } = new();  // O = new(); inicializa a lista já vazia, evitando erro de "lista nula" quando o Workshop é criado
    
}