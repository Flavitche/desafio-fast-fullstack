using FastChallenge.Api.Models;

namespace FastChallenge.Api.Services;

public interface IWorkshopService
{
    List<Workshop> GetAll();
    Workshop? GetById(int id);
    Workshop Add(Workshop workshop);
    bool Update(Workshop workshop);
    bool Delete(int id);

    bool AdicionarColaborador(int workshopId, Colaborador colaborador);
    bool RemoverColaborador(int workshopId, int colaboradorId);
}