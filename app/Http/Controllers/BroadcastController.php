<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BroadcastController extends Controller
{
    /**
     * Authenticate the user for private channels.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticate(Request $request)
    {
        try {
            // Get the token from the Authorization header
            $authHeader = $request->header('Authorization');
            
            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['error' => 'No valid authorization header'], 401);
            }

            $token = substr($authHeader, 7); // Remove 'Bearer ' prefix

            // Set the token for the request
            $request->headers->set('Authorization', 'Bearer ' . $token);

            // Try to authenticate the user
            $user = auth('api')->setToken($token)->user();

            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $channelName = $request->input('channel_name');
            $socketId = $request->input('socket_id');

            // Verify that the user is trying to access their own channel
            if (strpos($channelName, 'private-user.' . $user->id) !== 0) {
                return response()->json(['error' => 'Forbidden - Cannot access this channel'], 403);
            }

            $pusher = app('pusher');
            $auth = $pusher->socket_auth($channelName, $socketId);

            return response($auth);

        } catch (\Exception $e) {
            \Log::error('Broadcasting auth error: ' . $e->getMessage());
            return response()->json(['error' => 'Authentication failed'], 401);
        }
    }
}
