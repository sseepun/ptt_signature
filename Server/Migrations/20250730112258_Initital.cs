using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace email_signature.Server.Migrations
{
    /// <inheritdoc />
    public partial class Initital : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(256)", nullable: false),
                    Template = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTemplates", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<long>(type: "bigint", nullable: true),
                    Department = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    IsAdmin = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Title = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    Prefix = table.Column<string>(type: "nvarchar(64)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(256)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", nullable: false),
                    Avatar = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    AccessToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailTemplates");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
