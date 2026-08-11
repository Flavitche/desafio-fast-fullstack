using FastChallenge.Api.Models;
using FastChallenge.Api.Repositories;

namespace FastChallenge.Api.Services;

public class ColaboradorService : IColaboradorService
{
    private readonly IColaboradorRepository _repository;

    // Construtor: recebe o Repository que essa classe vai usar por baixo dos panos
    public ColaboradorService(IColaboradorRepository repository)
    {
        _repository = repository;
    }

    public List<Colaborador> GetAll()
    {
        return _repository.GetAll();
    }

    public Colaborador? GetById(int id)
    {
        return _repository.GetById(id);
    }

    public Colaborador Add(Colaborador colaborador)
    {
        ValidarColaborador(colaborador);

        _repository.Add(colaborador);
        return colaborador;
    }

    public bool Update(Colaborador colaborador)
    {
        ValidarColaborador(colaborador);

        var existente = _repository.GetById(colaborador.Id);
        if (existente == null)
        {
            return false; // não achou o colaborador pra atualizar
        }

        _repository.Update(colaborador);
        return true;
    }

    public bool Delete(int id)
    {
        var existente = _repository.GetById(id);
        if (existente == null)
        {
            return false; // não achou o colaborador pra remover
        }

        _repository.Delete(id);
        return true;
    }

    // Centraliza todas as validações de Colaborador, usadas tanto no Add quanto no Update
    private void ValidarColaborador(Colaborador colaborador)
    {
        if (string.IsNullOrWhiteSpace(colaborador.Nome))
        {
            throw new ArgumentException("O nome do colaborador é obrigatório.");
        }

        if (colaborador.Nome.Length < 2)
        {
            throw new ArgumentException("O nome do colaborador deve ter no mínimo 2 caracteres.");
        }

        if (colaborador.Nome.Length > 100)
        {
            throw new ArgumentException("O nome do colaborador deve ter no máximo 100 caracteres.");
        }
    }
}