<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>{{ config('app.name', ) }}</title>
    
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#0a0a0a] flex items-center justify-center min-h-screen m-0 selection:bg-gray-800">

    <h1 class="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-xl font-mono tracking-widest uppercase select-none">
        {{ config('app.name', 'Laravel') }} 
    </h1>

</body>
</html>