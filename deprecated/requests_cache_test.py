import requests_cache

session = requests_cache.CachedSession('demo_cache')
for i in range(60):
    session.get('https://httpbin.org/delay/1')
