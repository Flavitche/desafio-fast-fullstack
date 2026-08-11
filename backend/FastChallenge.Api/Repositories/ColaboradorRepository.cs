using FastChallenge.Api.Data;
using FastChallenge.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FastChallenge.Api.Repositories;

public class ColaboradorRepository : IColaboradorRepository
{
    private readonly AppDbContext _context;

    public ColaboradorRepository(AppDbContext context)
    {
        _context = context;
    }

    public List<Colaborador> GetAll()
    {
        return _context.Colaboradores.ToList();
    }

    public Colaborador? GetById(int id)
    {
        return _context.Colaboradores.FirstOrDefault(c => c.Id == id);
    }

    public void Add(Colaborador colaborador)
    {
        _context.Colaboradores.Add(colaborador);
        _context.SaveChanges();
    }

    public void Update(Colaborador colaborador)
    {
        var existente = GetById(colaborador.Id);
        if (existente != null)
        {
            existente.Nome = colaborador.Nome;
            _context.SaveChanges();
        }
    }

    public void Delete(int id)
    {
        var existente = GetById(id);
        if (existente != null)
        {
            _context.Colaboradores.Remove(existente);
            _context.SaveChanges();
        }
    }
}