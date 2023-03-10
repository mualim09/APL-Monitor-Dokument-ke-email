<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'no',
        'no_doc',
        'type_doc_id',
        'company_name',
        'first_person_name',
        'second_person_name',
        'start_date',
        'end_date',
        'department_id',
        'pic_name',
        'email',
        'note',
        'document',
        'status',
        'user_id',
        'name',
    ];

    protected $casts = [
        'start_date' => 'datetime:Y-m-d',
        'end_date' => 'datetime:Y-m-d'
    ];

    public const ACTIVE = 0;
    public const UPDATE = 1;
    public const EXPIRED = 2;

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function type()
    {
        return $this->belongsTo(TypeDoc::class, 'type_doc_id');
    }

    public function reminders()
    {
        return $this->hasMany(DocumentReminder::class);
    }

    public function shares()
    {
        return $this->hasMany(DocumentShare::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
