worker_processes 2

listen 80, :tcp_nopush => true

listen '/tmp/unicorn.sock'
pid '/tmp/unicorn.pid'

stderr_path File.expand_path('log/unicorn.log')
stdout_path File.expand_path('log/unicorn.log')

preload_app true