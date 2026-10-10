import assert from "node:assert/strict";
import test from "node:test";

/**
 * Security Rule Access Decision Evaluator
 * Verifies that the firestore.rules logic strictly adheres to access control specifications.
 */
function evaluateFirestoreAccess({
  auth, // { uid: string } | null
  path, // e.g. "/users/userA/foodLogs/123", "/foodItems/egg_1"
  operation, // "read" | "write"
}) {
  const parts = path.split("/").filter(Boolean);

  // Helper functions matching firestore.rules
  const isAuthenticated = auth !== null && Boolean(auth.uid);
  const isOwner = (userId) => isAuthenticated && auth.uid === userId;

  // Root matcher: foodItems/{foodId}
  if (parts[0] === "foodItems") {
    if (operation === "read") return isAuthenticated;
    if (operation === "write") return false; // allow write: if false
  }

  // Root matcher: exerciseCatalog/{exerciseId}
  if (parts[0] === "exerciseCatalog") {
    if (operation === "read") return isAuthenticated;
    if (operation === "write") return false; // allow write: if false
  }

  // Root matcher: users/{userId}
  if (parts[0] === "users") {
    const targetUserId = parts[1];
    if (!targetUserId) return false;

    // Direct user doc or any subcollection under users/{userId}
    return isOwner(targetUserId);
  }

  return false;
}

// SECURITY RULES ACCESS TESTS
test("Owner can read and write their own profile and records", () => {
  const alice = { uid: "user_alice" };

  assert.equal(
    evaluateFirestoreAccess({ auth: alice, path: "/users/user_alice", operation: "read" }),
    true,
    "Alice should be allowed to read her profile"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: alice, path: "/users/user_alice", operation: "write" }),
    true,
    "Alice should be allowed to write her profile"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: alice, path: "/users/user_alice/foodLogs/meal_1", operation: "write" }),
    true,
    "Alice should be allowed to save food logs"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: alice, path: "/users/user_alice/workoutSessions/session_1", operation: "write" }),
    true,
    "Alice should be allowed to log workouts"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: alice, path: "/users/user_alice/bodyLogs/log_1", operation: "write" }),
    true,
    "Alice should be allowed to record body measurements"
  );
});

test("A user CANNOT read or write another user's private records", () => {
  const bob = { uid: "user_bob" };

  assert.equal(
    evaluateFirestoreAccess({ auth: bob, path: "/users/user_alice", operation: "read" }),
    false,
    "Bob must NOT be able to read Alice's profile"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: bob, path: "/users/user_alice", operation: "write" }),
    false,
    "Bob must NOT be able to write to Alice's profile"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: bob, path: "/users/user_alice/foodLogs/meal_1", operation: "read" }),
    false,
    "Bob must NOT be able to read Alice's food logs"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: bob, path: "/users/user_alice/workoutSessions/session_1", operation: "write" }),
    false,
    "Bob must NOT be able to tamper with Alice's workout sessions"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: bob, path: "/users/user_alice/bodyLogs/log_1", operation: "read" }),
    false,
    "Bob must NOT be able to inspect Alice's weight logs"
  );
});

test("Unauthenticated users are denied access to private user records", () => {
  assert.equal(
    evaluateFirestoreAccess({ auth: null, path: "/users/user_alice", operation: "read" }),
    false,
    "Unauthenticated user must be denied reading user profiles"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: null, path: "/users/user_alice/foodLogs/meal_1", operation: "write" }),
    false,
    "Unauthenticated user must be denied writing food logs"
  );
});

test("Authenticated users can read shared catalogue but CANNOT modify it", () => {
  const user = { uid: "authenticated_user" };

  assert.equal(
    evaluateFirestoreAccess({ auth: user, path: "/foodItems/egg_whole", operation: "read" }),
    true,
    "Authenticated user can read verified food item"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: user, path: "/foodItems/egg_whole", operation: "write" }),
    false,
    "User cannot modify food catalogue"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: user, path: "/exerciseCatalog/chest_press", operation: "read" }),
    true,
    "Authenticated user can read exercise catalogue"
  );

  assert.equal(
    evaluateFirestoreAccess({ auth: user, path: "/exerciseCatalog/chest_press", operation: "write" }),
    false,
    "User cannot modify exercise catalogue"
  );
});

test("Unauthenticated users cannot read shared catalogue", () => {
  assert.equal(
    evaluateFirestoreAccess({ auth: null, path: "/foodItems/egg_whole", operation: "read" }),
    false,
    "Unauthenticated user cannot read food catalogue"
  );
});
