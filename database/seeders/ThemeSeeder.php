<?php

namespace Database\Seeders;

use App\Models\Theme;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Theme::query()->delete();

        $themes = [
            [
                'title' => 'Caps',
                'description' => 'The core edit',
                'accent' => 'from-black to-zinc-700',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 0,
                'is_active' => true,
            ],
            [
                'title' => 'Snapbacks',
                'description' => 'Street-ready structure',
                'accent' => 'from-zinc-700 to-zinc-500',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Trucker',
                'description' => 'Layered utility',
                'accent' => 'from-stone-700 to-stone-500',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Beanies',
                'description' => 'Soft essentials',
                'accent' => 'from-stone-600 to-stone-400',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => 'Limited',
                'description' => 'Rare drops',
                'accent' => 'from-neutral-800 to-neutral-600',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'title' => 'Future',
                'description' => 'Built to expand',
                'accent' => 'from-zinc-900 to-zinc-700',
                'image_url' => 'https://dummyimage.com/400x300/000000/000000',
                'sort_order' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($themes as $theme) {
            Theme::create($theme);
        }
    }
}
