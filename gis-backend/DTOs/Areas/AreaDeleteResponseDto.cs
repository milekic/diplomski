namespace gis_backend.DTOs.Areas
{
    public class AreaDeleteResponseDto
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
