<?php

namespace App\Models\GridTracker;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class processItem extends Model
{
    use HasFactory;
    protected $fillable = [
        'process_id',
        'scan_id',
        'lat',
        'long',
        'results',
        'status',
        
    ];
}
