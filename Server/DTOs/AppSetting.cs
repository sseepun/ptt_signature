using System.Text.Json;

namespace Server.DTOs
{
    public class ResAppConfig
    {
        public required string CaaProjectName { get; set; }
        public required string CaaProjectCode { get; set; }
        public required string CaaUrl { get; set; }
        public required string CaaUsername { get; set; }
        public required string CaaPassword { get; set; }
        public required JsonDocument CaaConfig { get; set; }
    }
}