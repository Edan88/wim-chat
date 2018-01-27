<?php

namespace App\Http\Controllers;

use App\Message;
use App\Events\MessageSent;
use App\Events\MessageUpdated;
use App\Events\MessageRemoved;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show chats
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('chat');
    }

    /**
     * Fetch all messages
     *
     * @return Message
     */
    public function fetchMessages()
    {
        return Message::with('user')->get();
    }

    /**
     * Persist message to database
     *
     * @param  Request $request
     * @return Response
     */
    public function sendMessage(Request $request)
    {
        $user = Auth::user();

        $message = $user->messages()->create([
            'message' => $request->input('message')
        ]);

        broadcast(new MessageSent($user, $message))->toOthers();

        return ['status' => 'Bericht verstuurd!', 'message' => $message];
    }

    /**
     * Delete message from database
     *
     * @param  Request $request
     * @return Response
     */
    public function updateMessage(Request $request)
    {
        $user = Auth::user();
        $message = Message::find($request->input('message_id'));
        $message->message = $request->input('message');
        $message->save();

        broadcast(new MessageUpdated($user, $message))->toOthers();

        return ['status' => 'Bericht geüpdatet!'];
    }


    /**
     * Delete message from database
     *
     * @param  Request $request
     * @return Response
     */
    public function removeMessage(Request $request)
    {
        $user = Auth::user();
        $message = Message::find($request->input('message_id'));

        broadcast(new MessageRemoved($user, $message))->toOthers();

        $message->delete();

        return ['status' => 'Bericht verwijdert!'];
    }
}