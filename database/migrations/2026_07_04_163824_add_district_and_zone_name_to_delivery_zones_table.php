<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->string('district', 120)
                ->default('All districts')
                ->after('city');

            $table->string('zone_name', 120)
                ->default('Standard')
                ->after('district');
        });

        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->dropUnique('delivery_zones_city_unique');

            $table->unique(
                ['city', 'district', 'zone_name'],
                'delivery_zones_city_district_zone_name_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->dropUnique(
                'delivery_zones_city_district_zone_name_unique',
            );
        });

        Schema::table('delivery_zones', function (Blueprint $table) {
            $table->dropColumn([
                'district',
                'zone_name',
            ]);

            $table->unique('city', 'delivery_zones_city_unique');
        });
    }
};