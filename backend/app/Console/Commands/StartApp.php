<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class StartApp extends Command
{
     protected $signature = 'app:start';

    protected $description = 'Lancer tous les serveurs en même temps (Serve, Reverb, Queue)';

    public function handle()
    {
        $this->info(' Lancement des moteurs de SafiPulse en parallèle...');

         $commands = [
            ['name' => 'Serveur PHP', 'cmd' => ['php', 'artisan', 'serve']],
            // ['name' => 'Reverb (WS)', 'cmd' => ['php', 'artisan', 'reverb:start']],
            ['name' => 'Queue Worker', 'cmd' => ['php', 'artisan', 'queue:work']],
            ['name' => 'Reverb (WS)', 'cmd' => ['php', 'artisan', 'reverb:start', '--debug']],
         ];

        $processes = [];

         foreach ($commands as $command) {
            $this->line("<info>Démarrage de :</info> {$command['name']}");

             $process = new Process($command['cmd']);
            $process->setTimeout(null);  
            $process->start();

            $processes[] = ['process' => $process, 'name' => $command['name']];
        }

        $this->newLine();
        $this->info(' Tous les services sont en ligne. Appuyez sur Ctrl+C pour tout arrêter.');
        $this->newLine();

         while (true) {
            foreach ($processes as $item) {
                $process = $item['process'];
                $name = $item['name'];

                 if ($output = $process->getIncrementalOutput()) {
                    $this->line("<comment>[{$name}]</comment> " . trim($output));
                }

                 if ($errorOutput = $process->getIncrementalErrorOutput()) {
                    $this->error("[{$name} ERROR] " . trim($errorOutput));
                }
            }
             usleep(200000);
        }
    }
}
