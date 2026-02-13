namespace gis_backend.DTOs.EventTypes
{
    public class EventTypeListItemDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Unit { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
