using FastChallenge.Api.Models;

namespace FastChallenge.Api.Repositories;

public interface IColaboradorRepository
{
    List<Colaborador> GetAll();
    Colaborador? GetById(int id);
    void Add(Colaborador colaborador);
    void Update(Colaborador colaborador);
    void Delete(int id);
}