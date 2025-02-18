from celery.schedules import crontab

beat_schedule = {
    'cleanup-logs-every-hour': {
        'task': 'app.cleanup_logs',
        'schedule': crontab(minute=0, hour='*'),
    },
    'system-monitoring-every-day': {
        'task': 'app.system_monitoring',
        'schedule': crontab(minute=0, hour=0),
    },
    'resource-management-every-week': {
        'task': 'app.resource_management',
        'schedule': crontab(minute=0, hour=0, day_of_week='sun'),
    },
}

broker_url = 'redis://localhost:6379/0'
result_backend = 'redis://localhost:6379/0'