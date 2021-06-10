using DW.Cloudlook.Repository;
using DW.Cloudlook.Repository.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DW.Cloudlook.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("Favorites")]
    public class FavoritesController : ControllerBase
    {
        private readonly CloudlookContext _dbContext;
        public FavoritesController(CloudlookContext favoritesContext)
        {
            _dbContext = favoritesContext;
        }

        [HttpPost]
        [Route("AddFavorite")]
        public async Task<IActionResult> AddFavorites([FromBody] UserFavorite userFavorite)
        {
            _dbContext.Add(new UserFavorite
            {
                UserId = userFavorite.UserId,
                TeamId = userFavorite.TeamId,
                TeamName = userFavorite.TeamName
            });

            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(AddFavorites), new { userFavorite.TeamId }, userFavorite);
        }

        [HttpDelete]
        [Route("DeleteFavorites")]
        public async Task<IActionResult> DeleteFavoirtes([FromQuery] string teamId, string userId)
        {
            var Favorites = _dbContext.UserFavorites.SingleOrDefault(x => x.TeamId == teamId && x.UserId == userId);
            if (Favorites == null)
            {
                return NotFound();
            }
            _dbContext.UserFavorites.Remove(Favorites);
            await _dbContext.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet]
        [Route("GetListOfFavorites")]
        public async Task<List<UserFavorite>> GetListOfFavorites([FromQuery] string userId)
        {
            return await _dbContext.UserFavorites.Where(x => x.UserId == userId).Select(x => new UserFavorite { Id = x.Id, TeamId = x.TeamId, UserId = x.UserId, TeamName = x.TeamName }).ToListAsync();
        }
    }
}
