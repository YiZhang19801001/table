<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColNamesIntoProductAddType extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('oc_product_add_type', function (Blueprint $table) {
            $table->string('name_2');
            $table->string('name_3');
            $table->string('name_4');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('oc_product_add_type', function (Blueprint $table) {
            //
        });
    }
}
