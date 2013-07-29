from django.conf.urls import patterns, include, url
from django.conf.urls.i18n import i18n_patterns
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# By default, static assets will be served from Django.  It is recommended that
# you use a better suited server instead.  Consult the documentation on serving
# static files with Django for your deploy platform.

urls = (
    url(r'^(?P<instance_slug>[^/]+)/', include('stompingground.urls')),
    url(r'^$', 'stompingground.views.portal', name='portal'),
)

urlpatterns = (
    # Use either the language-prefixed paths or the non-prefixed paths.
    # Without the prefixes, Django will default to the browser-configured
    # language settings.
    i18n_patterns('', *urls) +
    patterns('', *urls)
)
