from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns('',
    url(r'^api/(?P<path>.*)$', views.api, name='api_proxy'),
    url(r'^download/(?P<path>.*).csv$', views.csv_download, name='csv_proxy'),
    url(r'^admin/$', views.admin, name='admin'),
    url(r'^$', views.dashboard, name='dashboard'),
    url(r'^map/', views.map_view, name='map'),
)
