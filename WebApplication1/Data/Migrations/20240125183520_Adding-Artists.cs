using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddingArtists : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artworks_Artists_ArtistsId",
                table: "Artworks");

            migrationBuilder.DropIndex(
                name: "IX_Artworks_ArtistsId",
                table: "Artworks");

            migrationBuilder.DropColumn(
                name: "Artist",
                table: "Artworks");

            migrationBuilder.DropColumn(
                name: "ArtistPic",
                table: "Artworks");

            migrationBuilder.DropColumn(
                name: "ArtistsId",
                table: "Artworks");

            migrationBuilder.CreateIndex(
                name: "IX_Artworks_ArtistId",
                table: "Artworks",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artworks_Artists_ArtistId",
                table: "Artworks",
                column: "ArtistId",
                principalTable: "Artists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artworks_Artists_ArtistId",
                table: "Artworks");

            migrationBuilder.DropIndex(
                name: "IX_Artworks_ArtistId",
                table: "Artworks");

            migrationBuilder.AddColumn<string>(
                name: "Artist",
                table: "Artworks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ArtistPic",
                table: "Artworks",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ArtistsId",
                table: "Artworks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Artworks_ArtistsId",
                table: "Artworks",
                column: "ArtistsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artworks_Artists_ArtistsId",
                table: "Artworks",
                column: "ArtistsId",
                principalTable: "Artists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
