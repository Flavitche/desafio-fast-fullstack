using FastChallenge.Api.Models;

namespace FastChallenge.Api.Services;

public interface IColaboradorService
{
    List<Colaborador> GetAll();
    Colaborador? GetById(int id);
    Colaborador Add(Colaborador colaborador);
    bool Update(Colaborador colaborador);
    bool Delete(int id);
}