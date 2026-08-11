using FastChallenge.Api.Models;

namespace FastChallenge.Api.Repositories;

public interface IWorkshopRepository
{
    List<Workshop> GetAll();
    Workshop? GetById(int id);
    void Add(Workshop workshop);
    void Update(Workshop workshop);
    void Delete(int id);

    // Métodos extras para gerenciar a presença de colaboradores no workshop
    bool AdicionarColaborador(int workshopId, Colaborador colaborador);
    bool RemoverColaborador(int workshopId, int colaboradorId);
}