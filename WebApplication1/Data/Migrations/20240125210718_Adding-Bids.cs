using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddingBids : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArtworkId",
                table: "Bids",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Bids_ArtworkId",
                table: "Bids",
                column: "ArtworkId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bids_Artworks_ArtworkId",
                table: "Bids",
                column: "ArtworkId",
                principalTable: "Artworks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bids_Artworks_ArtworkId",
                table: "Bids");

            migrationBuilder.DropIndex(
                name: "IX_Bids_ArtworkId",
                table: "Bids");

            migrationBuilder.DropColumn(
                name: "ArtworkId",
                table: "Bids");
        }
    }
}
