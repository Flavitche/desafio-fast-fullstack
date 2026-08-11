using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FastChallenge.Api.Models;
using FastChallenge.Api.Services;

namespace FastChallenge.Api.Controllers;

[ApiController]
[Route("api/workshops")]
[Authorize]
public class WorkshopsController : ControllerBase
{
    private readonly IWorkshopService _service;

    public WorkshopsController(IWorkshopService service)
    {
        _service = service;
    }

    // GET /api/workshops
    [HttpGet]
    public IActionResult GetAll()
    {
        var workshops = _service.GetAll();
        return Ok(workshops);
    }

    // GET /api/workshops/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var workshop = _service.GetById(id);
        if (workshop == null)
        {
            return NotFound();
        }
        return Ok(workshop);
    }

    // POST /api/workshops
    [HttpPost]
    public IActionResult Add([FromBody] Workshop workshop)
    {
        try
        {
            var criado = _service.Add(workshop);
            return CreatedAtAction(nameof(GetById), new { id = criado.Id }, criado);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT /api/workshops/{id}
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Workshop workshop)
    {
        workshop.Id = id;

        try
        {
            var atualizado = _service.Update(workshop);
            if (!atualizado)
            {
                return NotFound();
            }
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE /api/workshops/{id}
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var deletado = _service.Delete(id);
        if (!deletado)
        {
            return NotFound();
        }
        return NoContent();
    }

    // POST /api/workshops/{id}/colaboradores/{colaboradorId}
    [HttpPost("{id}/colaboradores/{colaboradorId}")]
    public IActionResult AdicionarColaborador(int id, int colaboradorId)
    {
        try
        {
            var colaborador = new Colaborador { Id = colaboradorId };
            var adicionado = _service.AdicionarColaborador(id, colaborador);
            if (!adicionado)
            {
                return BadRequest("Não foi possível adicionar o colaborador (workshop não encontrado ou colaborador já presente).");
            }
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE /api/workshops/{id}/colaboradores/{colaboradorId}
    [HttpDelete("{id}/colaboradores/{colaboradorId}")]
    public IActionResult RemoverColaborador(int id, int colaboradorId)
    {
        var removido = _service.RemoverColaborador(id, colaboradorId);
        if (!removido)
        {
            return NotFound();
        }
        return NoContent();
    }
}