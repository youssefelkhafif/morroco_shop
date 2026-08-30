<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])

        <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
        <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v={{ filemtime(public_path('favicon.ico')) }}">
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}?v={{ filemtime(public_path('favicon.ico')) }}">
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}?v={{ filemtime(public_path('favicon.svg')) }}">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}?v={{ filemtime(public_path('apple-touch-icon.png')) }}">
        <meta name="theme-color" content="#0f0f0f">

        @if(config('services.meta.pixel_id'))
        <!-- Meta Pixel Code -->
        <script>
          (function(f,b,e,v,n,t,s) {
            if(f.fbq) return;
            n = f.fbq = function() {
              if (n.callMethod) {
                n.callMethod.apply(n, arguments);
              } else {
                n.queue.push(arguments);
              }
            };
            if(!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
          })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '{{ config("services.meta.pixel_id") }}');
          fbq('track', 'PageView');
        </script>
        <noscript>
          <img height="1" width="1" style="display:none"
               src="https://www.facebook.com/tr?id={{ config('services.meta.pixel_id') }}&ev=PageView&noscript=1"/>
        </noscript>
        <!-- End Meta Pixel Code -->
        @endif

        @inertiaHead
    </head>

    <body class="antialiased">
        @inertia
    </body>
</html>