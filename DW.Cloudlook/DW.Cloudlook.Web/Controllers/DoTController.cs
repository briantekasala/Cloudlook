using DW.Cloudlook.Web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace DW.Cloudlook.Web.Controllers
{
    [Route("api/doT")]
    [ApiController]
    public class DoTController : ControllerBase
    {
        [HttpGet]
        [Route("GetMyActiveTeams")]
        public ActionResult<List<Workspace>> GetMyActiveTeams()
        {
            List<Workspace> myActiveTeams = new List<Workspace>();
            myActiveTeams.Add(new Workspace() { Id = "1ffb1e42-eb19-4411-aeef-55267e8331fe", Name = "interschipTeam" });
            myActiveTeams.Add(new Workspace() { Id = "4eb5a020-355d-4469-953d-d32906cf30e9", Name = "MsTeamMeeting" });
            myActiveTeams.Add(new Workspace() { Id = "74f63f9c-86cd-495f-872b-ff493e2ae600", Name = "outlookToCloudlook" });
            myActiveTeams.Add(new Workspace() { Id = "b8b5c653-5c5d-4229-a3b3-00fc07dcbde6", Name = "All Company" });
            myActiveTeams.Add(new Workspace() { Id = "d96e8449-7c23-4a9f-b374-94922bb36a37", Name = "OneDriveTeamMeeting" });
            myActiveTeams.Add(new Workspace() { Id = "ea5c31f7-524e-4fa6-89a9-648d5d0d9a5b", Name = "outlookTeamMeeting" });
            return Ok(myActiveTeams);
        }

        [HttpGet]
        [Route("GetMyPersonalTeams")]
        public ActionResult<List<Workspace>> GetMyPersonalTeams()
        {
            List<Workspace> myPersonalTeams = new List<Workspace>();
            myPersonalTeams.Add(new Workspace() { Id = "1ffb1e42-eb19-4411-aeef-55267e8331fe", Name = "TeamOfIntership" });
            myPersonalTeams.Add(new Workspace() { Id = "4eb5a020-355d-4469-953d-d32906cf30e9", Name = "APmeeting" });
            myPersonalTeams.Add(new Workspace() { Id = "74f63f9c-86cd-495f-872b-ff493e2ae600", Name = "SundayMeeting" });
            myPersonalTeams.Add(new Workspace() { Id = "b8b5c653-5c5d-4229-a3b3-00fc07dcbde6", Name = "All Student" });
            myPersonalTeams.Add(new Workspace() { Id = "d96e8449-7c23-4a9f-b374-94922bb36a37", Name = "WorkingSpace" });
            myPersonalTeams.Add(new Workspace() { Id = "ea5c31f7-524e-4fa6-89a9-648d5d0d9a5b", Name = "Outlook-add-in" });

            return Ok(myPersonalTeams);
        }
    }
}
