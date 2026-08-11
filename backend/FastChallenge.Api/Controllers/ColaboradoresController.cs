using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FastChallenge.Api.Models;
using FastChallenge.Api.Services;

namespace FastChallenge.Api.Controllers;

[ApiController]
[Route("api/colaboradores")]
[Authorize]
public class ColaboradoresController : ControllerBase
{
    private readonly IColaboradorService _service;

    public ColaboradoresController(IColaboradorService service)
    {
        _service = service;
    }

    // GET /api/colaboradores
    [HttpGet]
    public IActionResult GetAll()
    {
        var colaboradores = _service.GetAll();
        return Ok(colaboradores);
    }

    // GET /api/colaboradores/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var colaborador = _service.GetById(id);
        if (colaborador == null)
        {
            return NotFound();
        }
        return Ok(colaborador);
    }

    // POST /api/colaboradores
    [HttpPost]
    public IActionResult Add([FromBody] Colaborador colaborador)
    {
        try
        {
            var criado = _service.Add(colaborador);
            return CreatedAtAction(nameof(GetById), new { id = criado.Id }, criado);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT /api/colaboradores/{id}
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Colaborador colaborador)
    {
        colaborador.Id = id;

        try
        {
            var atualizado = _service.Update(colaborador);
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

    // DELETE /api/colaboradores/{id}
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
}