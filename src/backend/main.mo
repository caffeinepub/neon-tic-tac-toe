import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";

actor {
  type Score = {
    username : Text;
    wins : Nat;
  };

  module Score {
    public func compare(score1 : Score, score2 : Score) : Order.Order {
      switch (Nat.compare(score2.wins, score1.wins)) {
        case (#equal) { Text.compare(score1.username, score2.username) };
	      case (order) { order };
      };
    };
  };

  let scores = Map.empty<Text, Nat>();

  public shared ({ caller }) func recordWin(username : Text) : async () {
    if (username.isEmpty()) { Runtime.trap("Username cannot be empty.") };
    let currentWins = scores.get(username);
    let updatedWins = switch (currentWins) {
      case (null) { 1 };
      case (?wins) { wins + 1 };
    };
    scores.add(username, updatedWins);
  };

  public query ({ caller }) func getLeaderboard() : async [Score] {
    scores.entries().toArray().map(func((username, wins)) { { username; wins } }).sort();
  };

  public query ({ caller }) func getWins(username : Text) : async Nat {
    switch (scores.get(username)) {
      case (null) { Runtime.trap("Username does not exist") };
      case (?wins) { wins };
    };
  };
};
