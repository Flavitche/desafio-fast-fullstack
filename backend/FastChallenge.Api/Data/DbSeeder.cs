using FastChallenge.Api.Models;

namespace FastChallenge.Api.Data;

public static class DbSeeder
{
    public static void Popular(AppDbContext context)
    {
        // Só popula se o banco ainda não tiver nenhum workshop cadastrado,
        // evitando duplicar dados toda vez que a aplicação é reiniciada
        if (context.Workshops.Any())
        {
            return;
        }

        var colaboradores = new List<Colaborador>
        {
            new Colaborador { Nome = "Ana Beatriz Souza" },
            new Colaborador { Nome = "Bruno Carvalho" },
            new Colaborador { Nome = "Carla Mendes" },
            new Colaborador { Nome = "Diego Ferreira" },
            new Colaborador { Nome = "Elisa Rocha" },
            new Colaborador { Nome = "Fábio Nascimento" },
            new Colaborador { Nome = "Gabriela Lima" },
            new Colaborador { Nome = "Henrique Almeida" },
            new Colaborador { Nome = "Isabela Martins" },
            new Colaborador { Nome = "João Pedro Santos" }
        };

        context.Colaboradores.AddRange(colaboradores);
        context.SaveChanges();

        var workshops = new List<Workshop>
        {
            new Workshop
            {
                Nome = "Introdução ao Clean Code",
                DataRealizacao = new DateTime(2025, 3, 13, 16, 0, 0),
                Descricao = "Workshop sobre boas práticas de código limpo e legibilidade.",
                Colaboradores = new List<Colaborador>
                {
                    colaboradores[0], colaboradores[1], colaboradores[3], colaboradores[6]
                }
            },
            new Workshop
            {
                Nome = "Testes Automatizados na Prática",
                DataRealizacao = new DateTime(2025, 6, 12, 16, 0, 0),
                Descricao = "Introdução a testes unitários e de integração.",
                Colaboradores = new List<Colaborador>
                {
                    colaboradores[1], colaboradores[2], colaboradores[4], colaboradores[7], colaboradores[9]
                }
            },
            new Workshop
            {
                Nome = "APIs REST e Boas Práticas",
                DataRealizacao = new DateTime(2025, 9, 11, 16, 0, 0),
                Descricao = "Como projetar APIs REST escaláveis e bem documentadas.",
                Colaboradores = new List<Colaborador>
                {
                    colaboradores[0], colaboradores[2], colaboradores[3], colaboradores[4], colaboradores[8]
                }
            },
            new Workshop
            {
                Nome = "Fundamentos de Bancos de Dados Relacionais",
                DataRealizacao = new DateTime(2025, 12, 11, 16, 0, 0),
                Descricao = "Modelagem de dados, normalização e boas práticas com SQL.",
                Colaboradores = new List<Colaborador>
                {
                    colaboradores[1], colaboradores[5], colaboradores[6], colaboradores[9]
                }
            },
            new Workshop
            {
                Nome = "Introdução a Testes de Segurança em APIs",
                DataRealizacao = new DateTime(2026, 3, 12, 16, 0, 0),
                Descricao = "Conceitos básicos de autenticação, autorização e vulnerabilidades comuns.",
                Colaboradores = new List<Colaborador>
                {
                    colaboradores[0], colaboradores[3], colaboradores[5], colaboradores[7], colaboradores[8]
                }
            },
            new Workshop
            {
                Nome = "Design de Componentes Reutilizáveis",
                DataRealizacao = new DateTime(2026, 6, 11, 16, 0, 0),
                Descricao = "Boas práticas de componentização no desenvolvimento frontend.",
                Colaboradores = new List<Colaborador>
                {
                    colaboradores[2], colaboradores[4], colaboradores[6], colaboradores[9]
                }
            }
        };

        context.Workshops.AddRange(workshops);
        context.SaveChanges();
    }
}