<?php

namespace App;

use App\User;
use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    protected $fillable = ['title', 'body', 'state'];

    // State Machine
    const DRAFT = 'DRAFT';
    const CANCELLED = 'CANCELLED';
    const POSTED = 'POSTED';
    const PENDING_PROPOSAL = 'PENDING_PROPOSAL';
    const PROPOSED = 'PROPOSED';
    const CONTRACTED = 'CONTRACTED';

    protected $config = [
        'states' => [
            JobPost::DRAFT,
            JobPost::CANCELLED,
            JobPost::POSTED,
            JobPost::PENDING_PROPOSAL,
            JobPost::PROPOSED,
            JobPost::CONTRACTED,
        ],
        'transitions' => [
            'post' => [
                'from' => [JobPost::DRAFT],
                'to' => JobPost::POSTED,
                'userTypesAllowed' => [User::CLIENT]
            ],
            'retract' => [
                'from' => [JobPost::POSTED],
                'to' => JobPost::DRAFT,
                'userTypesAllowed' => [User::CLIENT]
            ],
            'cancel' => [
                'from' => [JobPost::DRAFT],
                'to' => JobPost::CANCELLED,
                'userTypesAllowed' => [User::CLIENT]
            ],
            'accept_request' => [
                'from' => [JobPost::POSTED],
                'to' => JobPost::PENDING_PROPOSAL,
                'userTypesAllowed' => [User::PROVIDER]
            ],
            'propose' => [
                'from' => [JobPost::PENDING_PROPOSAL],
                'to' => JobPost::PROPOSED,
                'userTypesAllowed' => [User::PROVIDER]
            ],
            'reject' => [
                'from' => [JobPost::PROPOSED],
                'to' => JobPost::POSTED,
                'userTypesAllowed' => [User::CLIENT]
            ],
            'accept' => [
                'from' => [JobPost::PROPOSED],
                'to' => JobPost::CONTRACTED,
                'userTypesAllowed' => [User::CLIENT]
            ],
        ]
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }

    public function getState()
    {
        return $this->state;
    }

    public function setState($state)
    {
        if (!in_array($state, $this->config['states'], true)) {
            throw new \Exception(sprintf(
                'State "%s" is not defined', $state
            ));
        }
        $this->state = $state;
        $this->save();
    }

    public function canUserType($transition, $userType)
    {
        if (!isset($this->config['transitions'][$transition])) {
            throw new \Exception(sprintf(
                'Transition "%s" does not exist',
                $transition
            ));
        }

        if (!in_array($userType, $this->config['transitions'][$transition]['userTypesAllowed'], true)) {
            return false;
        }

        return true;
    }

    public function can($transition)
    {
        if (!isset($this->config['transitions'][$transition])) {
            throw new \Exception(sprintf(
                'Transition "%s" does not exist',
                $transition
            ));
        }

        if (!in_array($this->getState(), $this->config['transitions'][$transition]['from'], true)) {
            return false;
        }

        return true;
    }

    public function apply($transition, $userType)
    {
        if (!$this->canUserType($transition, $userType)) {
            throw new \Exception(sprintf(
                'Transition "%s" is not allowed for user type "%s"',
                $transition,
                $userType
            ));
        }

        if (!$this->can($transition)) {
            throw new \Exception(sprintf(
                'Transition "%s" cannot be applied on state "%s". JobPost id: %s',
                $transition,
                $this->getState(),
                $this->id
            ));
        }

        $this->setState($this->config['transitions'][$transition]['to']);

        return true;
    }

}
