namespace FastChallenge.Api.Models;

public class Colaborador
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty; //Evita que fique null por padrão
}