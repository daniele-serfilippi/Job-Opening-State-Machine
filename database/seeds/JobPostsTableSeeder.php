<?php

use App\JobPost;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class JobPostsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        JobPost::truncate();

        $faker = Faker::create('en_US');

        for ($i = 0; $i < 20; $i++) {
            JobPost::create([
                'title' => $faker->sentence,
                'body' => $faker->paragraph,
                'state' => JobPost::DRAFT
            ]);
        }
    }
}
