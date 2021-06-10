using DW.Cloudlook.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DW.Cloudlook.Repository
{
    public class CloudlookContext : DbContext
    {
        public CloudlookContext(DbContextOptions<CloudlookContext> options) : base(options) { }
        public DbSet<UserFavorite> UserFavorites { get; set; }
    }
}
