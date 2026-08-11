using FastChallenge.Api.Data;
using FastChallenge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FastChallenge.Api.Repositories;

public class WorkshopRepository : IWorkshopRepository
{
    private readonly AppDbContext _context;

    public WorkshopRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<Workshop> GetAll()
    {
        return _context.Workshops
            .Include(w => w.Colaboradores) // traz os colaboradores junto
            .ToList();
    }

    public Workshop? GetById(int id)
    {
        return _context.Workshops
            .Include(w => w.Colaboradores)
            .FirstOrDefault(w => w.Id == id);
    }

    public void Add(Workshop workshop)
    {
        _context.Workshops.Add(workshop);
        _context.SaveChanges();
    }

    public void Update(Workshop workshop)
    {
        var existente = GetById(workshop.Id);
        if (existente != null)
        {
            existente.Nome = workshop.Nome;
            existente.DataRealizacao = workshop.DataRealizacao;
            existente.Descricao = workshop.Descricao;
            _context.SaveChanges();
        }
    }

    public void Delete(int id)
    {
        var existente = GetById(id);
        if (existente != null)
        {
            _context.Workshops.Remove(existente);
            _context.SaveChanges();
        }
    }

    public bool AdicionarColaborador(int workshopId, Colaborador colaborador)
    {
        var workshop = GetById(workshopId);
        if (workshop == null)
        {
            return false;
        }

        var jaPresente = workshop.Colaboradores.Any(c => c.Id == colaborador.Id);
        if (jaPresente)
        {
            return false;
        }

        // Busca o colaborador já rastreado pelo EF, pra não duplicar no banco
        var colaboradorExistente = _context.Colaboradores.Find(colaborador.Id);
        if (colaboradorExistente == null)
        {
            return false;
        }

        workshop.Colaboradores.Add(colaboradorExistente);
        _context.SaveChanges();
        return true;
    }

    public bool RemoverColaborador(int workshopId, int colaboradorId)
    {
        var workshop = GetById(workshopId);
        if (workshop == null)
        {
            return false;
        }

        var colaborador = workshop.Colaboradores.FirstOrDefault(c => c.Id == colaboradorId);
        if (colaborador == null)
        {
            return false;
        }

        workshop.Colaboradores.Remove(colaborador);
        _context.SaveChanges();
        return true;
    }
}