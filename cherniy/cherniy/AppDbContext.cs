using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.SqlServer;
using System.Threading.Tasks;

namespace cherniy
{
     class AppDbContext:DbContext
    {
        public DbSet<Cities> Cities { get;set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // Указываем строку подключения для подключения к базе данных SQL Server
            optionsBuilder.UseSqlServer("Server=calculator\\mssqlserver02;Database=Test;Trusted_Connection=True;TrustServerCertificate=True;");
        }

    }
}
