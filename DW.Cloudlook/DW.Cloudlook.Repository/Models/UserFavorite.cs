using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DW.Cloudlook.Repository.Models
{
    public class UserFavorite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(70)]
        public string UserId { get; set; }
        [Required, MaxLength(70)]
        public string TeamId { get; set; }
        [Required, MaxLength(100)]
        public string TeamName { get; set; }
    }
}
