using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using System.Threading.Tasks;

namespace DW.Cloudlook.Web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("Auth")]
    public class AuthenticationController : ControllerBase
    {
        private ITokenAcquisition _tokenAcquisition;
        public AuthenticationController(ITokenAcquisition tokenAcquisition)
        {
            _tokenAcquisition = tokenAcquisition;
        }

        [HttpGet]
        [Route("AcquireOboToken")]
        public async Task<ActionResult<string>> AcquireOBOToken(string resource)
        {
            var token = await _tokenAcquisition.GetAccessTokenForUserAsync(new[] { $"{resource.TrimEnd('/')}/.default" });
            return Ok(token);
        }
    }
}
