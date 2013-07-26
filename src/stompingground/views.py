import json
import logging
import os
import time
from .config import get_shareabouts_config
from django.shortcuts import render
from django.conf import settings
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie
from proxy.views import proxy_view


def make_resource_uri(resource, root):
    resource = resource.strip('/')
    root = root.rstrip('/')
    uri = '%s/%s/' % (root, resource)
    return uri


@ensure_csrf_cookie
def dashboard(request):

    # Pull in any extra context values
    config = get_shareabouts_config(settings.SHAREABOUTS.get('CONFIG'))
    context = settings.SHAREABOUTS.get('CONTEXT', {})

    context['request'] = request
    context['config'] = config
    return render(request, 'dashboard.html', context)


@ensure_csrf_cookie
def map_view(request):

    # Pull in any extra context values
    config = get_shareabouts_config(settings.SHAREABOUTS.get('CONFIG'))
    context = settings.SHAREABOUTS.get('CONTEXT', {})

    context['request'] = request
    context['config'] = config
    return render(request, 'map.html', context)


@ensure_csrf_cookie
def admin(request):

    # Pull in any extra context values
    config = get_shareabouts_config(settings.SHAREABOUTS.get('CONFIG'))
    context = settings.SHAREABOUTS.get('CONTEXT', {})

    context['request'] = request
    context['config'] = config

    return render(request, 'admin.html', context)


def api(request, path):
    """
    A small proxy for a Shareabouts API server, exposing only
    one configured dataset.
    """
    root = settings.SHAREABOUTS.get('DATASET_ROOT')
    api_key = settings.SHAREABOUTS.get('DATASET_KEY')

    url = make_resource_uri(path, root)
    headers = {'X-Shareabouts-Key': api_key}
    return proxy_view(request, url, requests_args={'headers': headers})


def csv_download(request, path):
    """
    A small proxy for a Shareabouts API server, exposing only
    one configured dataset.
    """
    root = settings.SHAREABOUTS.get('DATASET_ROOT')
    api_key = settings.SHAREABOUTS.get('DATASET_KEY')

    url = make_resource_uri(path, root)
    headers = {
        'X-Shareabouts-Key': api_key,
        'ACCEPT': 'text/csv'
    }
    response = proxy_view(request, url, requests_args={'headers': headers})

    # Send the csv as a timestamped download
    filename = '.'.join([os.path.split(path)[1],
                        now().strftime('%Y%m%d%H%M%S'),
                        'csv'])
    response['Content-disposition'] = 'attachment; filename=' + filename

    return response
