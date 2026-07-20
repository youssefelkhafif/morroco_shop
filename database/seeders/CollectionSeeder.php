<?php

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Collection::query()->delete();

        $collections = [
            [
                'title' => 'Summer Drop',
                'subtitle' => 'Lightweight silhouettes',
                'badge' => 'New edit',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 0,
                'is_active' => true,
            ],
            [
                'title' => 'Essentials',
                'subtitle' => 'Clean daily layers',
                'badge' => 'Core range',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Limited Release',
                'subtitle' => 'Rare editions',
                'badge' => 'Exclusive',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($collections as $collection) {
            Collection::create($collection);
        }
    }
}
