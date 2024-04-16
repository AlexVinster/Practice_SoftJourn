using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class Token2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TokenId1",
                table: "Transactions",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_TokenId1",
                table: "Transactions",
                column: "TokenId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Tokens_TokenId1",
                table: "Transactions",
                column: "TokenId1",
                principalTable: "Tokens",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Tokens_TokenId1",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_TokenId1",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "TokenId1",
                table: "Transactions");
        }
    }
}
