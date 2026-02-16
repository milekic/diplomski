using gis_backend.Data;
using Microsoft.EntityFrameworkCore;
using gis_backend.Repositories;
using gis_backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using gis_backend.Configuration;




var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5174", "http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});



//servis za bazu
builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseNpgsql(
    builder.Configuration.GetConnectionString("DefaultConnection"),
    x => x.UseNetTopologySuite()
    );
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<AuthService>();

//jwt token
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwt = builder.Configuration.GetSection("Jwt");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),

            ClockSkew = TimeSpan.Zero 
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IAreaRepository, AreaRepository>();
builder.Services.AddScoped<IAreaService, AreaService>();

builder.Services.AddScoped<IAreaMonitorRepository, AreaMonitorRepository>();
builder.Services.AddScoped<IAreaMonitorService, AreaMonitorService>();

builder.Services.AddScoped<IEventTypeRepository, EventTypeRepository>();
builder.Services.AddScoped<IEventTypeService, EventTypeService>();



//za staticke podatke
builder.Services.Configure<SpatialOptions>(
    builder.Configuration.GetSection("Spatial")
);





var app = builder.Build();

// global error handler 
//app.UseExceptionHandler("/error");
//app.Map("/error", () => Results.Problem("Došlo je do greške."));

//ispis gresaka, samo za razvoj
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionFeature = context.Features.Get<
            Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();

        var exception = exceptionFeature?.Error;

        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            message = exception?.Message,
            inner = exception?.InnerException?.Message,
            stackTrace = exception?.StackTrace
        });
    });
});


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("ReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
