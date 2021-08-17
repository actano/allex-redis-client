# allex-redis-client 

This package contains a redis client that is a wrapper around [ioredis](https://github.com/luin/ioredis)

It supports both a direct redis connection and a connection through sentinel.
We use [@rplan/config](https://www.npmjs.com/package/@rplan/config) to configure access to redis.

You need the following properties in your config

When using sentinel
~~~
redis:
  sentinel:
    enabled: true
    masterGroupName: name
    maxRetries: 10
    password: password
    instances: 
      - instance1
      - instance2
~~~

When using redis directly

~~~
redis:
  host: hostname
  port: 80
  maxRetries: 10
  password: password
~~~

## Configuration 
The config `redis:output_stream_key` must be set when using this library. It defines the stream name of the po update stream.
