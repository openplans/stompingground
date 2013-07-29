import json
import logging
import os
import time
from .config import get_shareabouts_config
from django.shortcuts import render
from django.conf import settings
from django.http import Http404
from django.utils.timezone import now
from django.views.decorators.csrf import ensure_csrf_cookie
from proxy.views import proxy_view


def make_resource_uri(resource, root):
    resource = resource.strip('/')
    root = root.rstrip('/')
    uri = '%s/%s/' % (root, resource)
    return uri


def get_config_settings(instance_slug):
    config_key = instance_slug or 'default'
    try:
        config_dir = settings.SHAREABOUTS[config_key].get('CONFIG', {})
        context = settings.SHAREABOUTS[config_key].get('CONTEXT', {})
    except KeyError:
        raise Http404('No configuration settings for %s were found' % (instance_slug,))

    try:
        config = get_shareabouts_config(config_dir)
    except ValueError:
        raise Http404('No configuration files for %s were found' % (instance_slug,))

    return config, context


def get_dataset_settings(instance_slug):
    config_key = instance_slug or 'default'
    try:
        root = settings.SHAREABOUTS[config_key].get('DATASET_ROOT')
        api_key = settings.SHAREABOUTS[config_key].get('DATASET_KEY')
    except KeyError:
        raise Http404('No dataset settings for %s were found' % (instance_slug,))
    return root, api_key


@ensure_csrf_cookie
def dashboard(request, instance_slug=None):

    # Pull in configuration and any extra context values
    config, context = get_config_settings(instance_slug)

    context['request'] = request
    context['config'] = config
    context['instance'] = instance_slug
    return render(request, 'dashboard.html', context)


@ensure_csrf_cookie
def map_view(request, instance_slug=None):

    # Pull in configuration and any extra context values
    config, context = get_config_settings(instance_slug)

    context['request'] = request
    context['config'] = config
    context['instance'] = instance_slug
    return render(request, 'map.html', context)


@ensure_csrf_cookie
def admin(request, instance_slug=None):

    # Pull in configuration and any extra context values
    config, context = get_config_settings(instance_slug)

    context['request'] = request
    context['config'] = config
    context['instance'] = instance_slug
    return render(request, 'admin.html', context)


def api(request, instance_slug=None, path=''):
    """
    A small proxy for a Shareabouts API server, exposing only
    one configured dataset.
    """
    root, api_key = get_dataset_settings(instance_slug)

    url = make_resource_uri(path, root)
    headers = {'X-Shareabouts-Key': api_key}
    return proxy_view(request, url, requests_args={'headers': headers})


def csv_download(request, instance_slug=None, path=''):
    """
    A small proxy for a Shareabouts API server, exposing only
    one configured dataset.
    """
    root, api_key = get_dataset_settings(instance_slug)

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
