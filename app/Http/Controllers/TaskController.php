<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Events\TaskCreated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the authenticated user's tasks.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $user = auth('api')->user();
            
            $query = $user->tasks();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by priority
            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            // Search by title
            if ($request->has('search')) {
                $query->where('title', 'like', '%' . $request->search . '%');
            }

            // Sort by
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $tasks = $query->paginate($perPage);

            return response()->json([
                'status' => 'success',
                'message' => 'Tasks retrieved successfully',
                'data' => [
                    'tasks' => $tasks->items(),
                    'pagination' => [
                        'current_page' => $tasks->currentPage(),
                        'last_page' => $tasks->lastPage(),
                        'per_page' => $tasks->perPage(),
                        'total' => $tasks->total(),
                        'from' => $tasks->firstItem(),
                        'to' => $tasks->lastItem(),
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve tasks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created task.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|in:pending,in_progress,completed,cancelled',
            'priority' => 'nullable|in:low,medium,high',
            'due_date' => 'nullable|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth('api')->user();
            
            $task = $user->tasks()->create([
                'title' => $request->title,
                'description' => $request->description,
                'status' => $request->status ?? 'pending',
                'priority' => $request->priority ?? 'medium',
                'due_date' => $request->due_date,
            ]);

            event(new TaskCreated($task));

            return response()->json([
                'status' => 'success',
                'message' => 'Task created successfully',
                'data' => [
                    'task' => $task
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified task.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $user = auth('api')->user();
            $task = $user->tasks()->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Task retrieved successfully',
                'data' => [
                    'task' => $task
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Task not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified task.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|in:pending,in_progress,completed,cancelled',
            'priority' => 'sometimes|in:low,medium,high',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = auth('api')->user();
            $task = $user->tasks()->findOrFail($id);

            $task->update($request->only([
                'title', 'description', 'status', 'priority', 'due_date'
            ]));

            return response()->json([
                'status' => 'success',
                'message' => 'Task updated successfully',
                'data' => [
                    'task' => $task
                ]
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Task not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update task',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified task.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $user = auth('api')->user();
            $task = $user->tasks()->findOrFail($id);

            $task->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Task deleted successfully'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Task not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete task',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
