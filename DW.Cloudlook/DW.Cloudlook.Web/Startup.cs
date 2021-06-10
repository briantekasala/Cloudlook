using DW.Cloudlook.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;

namespace DW.Cloudlook.Web
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        private readonly string developCorsPolicy = "developCorsPolicy";
        private readonly string productionCorsPolicy = "productionCorsPolicy";
        private readonly bool isDevelopment;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            isDevelopment = env.IsDevelopment();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Configure Authentication
            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration, Globals.AppSettings.AzureAD)
                .EnableTokenAcquisitionToCallDownstreamApi()
                .AddInMemoryTokenCaches();
            services
                .AddDbContextPool<CloudlookContext>
                (options => options.UseSqlServer(Configuration["databaseConnection"]));

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            // Configure controller routing
            services.AddControllers();
            services.AddCors(c =>
            {
                if (isDevelopment)
                {
                    c.AddPolicy(developCorsPolicy, options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
                }
                else
                {
                    var corsOrigin = Configuration.GetValue<string>(Globals.AppSettings.CorsOriging);
                    c.AddPolicy(productionCorsPolicy, options => options.WithOrigins(corsOrigin));
                }
            });
        }

        public void Configure(IApplicationBuilder app)
        {
            if (isDevelopment)
            {
                app.UseDeveloperExceptionPage();
                app.UseCors(developCorsPolicy);
            }
            else
            {
                app.UseCors(productionCorsPolicy);
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }


            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();            

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (isDevelopment)
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
