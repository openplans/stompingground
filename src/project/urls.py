from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

# By default, static assets will be served from Django.  It is recommended that
# you use a better suited server instead.  Consult the documentation on serving
# static files with Django for your deploy platform.
urlpatterns = staticfiles_urlpatterns() + patterns('',
    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),

    url(r'^', include('stompingground.urls')),
)
