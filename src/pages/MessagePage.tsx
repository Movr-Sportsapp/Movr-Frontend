import { UserRound } from "lucide-react";

// TODO: replace with real data once backend supports messaging
type Conversation = {
  id: string;
  username: string;
  profileImage: string | null;
  lastMessage: string;
  timestamp: string;
};

const MOCK_CONVERSATIONS: Conversation[] = [
  // fill in a few fake entries here for the mockup
];

export default function MessagePage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-black uppercase tracking-tight mb-6">
        Your Messages
      </h1>

      {MOCK_CONVERSATIONS.length === 0 ? (
        <p className="text-center text-white/50 py-16">
          You haven't send or recieved any messages yet ... 💌
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-white/10">
          {MOCK_CONVERSATIONS.map((c) => (
            <div key={c.id} className="flex items-center gap-3 py-4">
              {/* TODO: swap for real avatar image */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <UserRound className="text-white/50 w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{c.username}</p>
                <p className="text-sm text-white/60 truncate">{c.lastMessage}</p>
              </div>
              <span className="text-xs text-white/40">{c.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}