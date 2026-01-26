using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace gis_backend.Migrations
{
    /// <inheritdoc />
    public partial class promjenaNaslova : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Comment",
                newName: "Naslov");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Naslov",
                table: "Comment",
                newName: "Title");
        }
    }
}
