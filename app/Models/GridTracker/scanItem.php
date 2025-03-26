<?php

namespace App\Models\GridTracker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class scanItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'keyword',
        'business',
        'autocomplete_search',
        'autocomplete_place_id',
        'autocomplete_lat',
        'autocomplete_lng',
        'distance',
        'distance_type',
        'grid_size',
        'grid_points',
        'status',
        'search_type',
        
    ];
    
}
