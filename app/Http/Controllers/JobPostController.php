<?php

namespace App\Http\Controllers;

use App\JobPost;
use Illuminate\Http\Request;

class JobPostController extends Controller
{
    public function index(Request $request)
    {
        $userType = $request->header('userType');
        switch ($userType) {
            case 'client':
                return JobPost::orderBy('created_at', 'DESC')->get();
                break;
            case 'provider':
                return JobPost::
                    where([
                        ['state', '<>', JobPost::DRAFT],
                        ['state', '<>', JobPost::CANCELLED]
                    ])
                    ->orderBy('created_at', 'DESC')->get();
                break;
        }
    }

    public function show($id)
    {
        return JobPost::find($id)->toJson();
    }

    public function store(Request $request)
    {
        $userType = $request->header('userType');

        if (!$userType == 'client') {
            throw new \Exception(sprintf(
                'User type "%s" is not allowed to create a job opening', $userType
            ));
        }

        $jobPostData = array_merge($request->all(), ['state' => JobPost::DRAFT]);
        $jobPost = JobPost::create($jobPostData);

        return response()->json($jobPost);
    }

    public function update(Request $request, JobPost $jobPost)
    {
        $userType = $request->header('userType');

        if (!$userType == 'client') {
            throw new \Exception(sprintf(
                'User type "%s" is not allowed to update a job opening', $userType
            ));
        }

        $jobPost->update($request->all());

        return response()->json($jobPost);
    }

    /*
    public function delete(JobPost $jobPost)
    {
        $jobPost->delete();

        return response()->json(null, 204);
    }
    */

    public function stateTransition(Request $request, $id) {
        $req_data = $request->all();
        $transition = $req_data['transition'];
        $userType = $request->header('userType');
        $jobPost = JobPost::find($id);
        if (!$jobPost) {
            throw new \Exception(sprintf(
                'Unable to find Job Post with id "%s"', $id
            ));
        }
        $jobPost->apply($transition, $userType);
        return response()->json($jobPost);
    }
}
