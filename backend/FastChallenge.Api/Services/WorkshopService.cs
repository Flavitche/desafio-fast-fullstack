using FastChallenge.Api.Models;
using FastChallenge.Api.Repositories;

namespace FastChallenge.Api.Services;

public class WorkshopService : IWorkshopService
{
    private readonly IWorkshopRepository _repository;
    private readonly IColaboradorRepository _colaboradorRepository;

    public WorkshopService(IWorkshopRepository repository, IColaboradorRepository colaboradorRepository)
    {
        _repository = repository;
        _colaboradorRepository = colaboradorRepository;
    }

    public List<Workshop> GetAll()
    {
        return _repository.GetAll();
    }

    public Workshop? GetById(int id)
    {
        return _repository.GetById(id);
    }

    public Workshop Add(Workshop workshop)
    {
        ValidarWorkshop(workshop);

        _repository.Add(workshop);
        return workshop;
    }

    public bool Update(Workshop workshop)
    {
        ValidarWorkshop(workshop);

        var existente = _repository.GetById(workshop.Id);
        if (existente == null)
        {
            return false;
        }

        _repository.Update(workshop);
        return true;
    }

    public bool Delete(int id)
    {
        var existente = _repository.GetById(id);
        if (existente == null)
        {
            return false;
        }

        _repository.Delete(id);
        return true;
    }

    // Centraliza todas as validações de Workshop, usadas tanto no Add quanto no Update
    private void ValidarWorkshop(Workshop workshop)
    {
        if (string.IsNullOrWhiteSpace(workshop.Nome))
        {
            throw new ArgumentException("O nome do workshop é obrigatório.");
        }

        if (workshop.Nome.Length < 2)
        {
            throw new ArgumentException("O nome do workshop deve ter no mínimo 2 caracteres.");
        }

        if (workshop.Nome.Length > 100)
        {
            throw new ArgumentException("O nome do workshop deve ter no máximo 100 caracteres.");
        }

        if (workshop.DataRealizacao == default)
        {
            throw new ArgumentException("A data de realização é obrigatória.");
        }
    }

    public bool AdicionarColaborador(int workshopId, Colaborador colaborador)
    {
        // Regra de negócio: o colaborador precisa existir de verdade
        var colaboradorExistente = _colaboradorRepository.GetById(colaborador.Id);
        if (colaboradorExistente == null)
        {
            throw new ArgumentException("Colaborador não encontrado.");
        }

        return _repository.AdicionarColaborador(workshopId, colaboradorExistente);
    }

    public bool RemoverColaborador(int workshopId, int colaboradorId)
    {
        return _repository.RemoverColaborador(workshopId, colaboradorId);
    }
}