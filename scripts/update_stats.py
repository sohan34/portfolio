
import json
import os
import urllib.request
from pathlib import Path

username = os.environ.get("LEETCODE_USERNAME", "sohan34")
stats_file = Path("stats.json")

query = """
query userStats($username: String!) {
  matchedUser(username: $username) {
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}
"""

payload = json.dumps({
    "query": query,
    "variables": {"username": username}
}).encode("utf-8")

request = urllib.request.Request(
    "https://leetcode.com/graphql/",
    data=payload,
    headers={
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Referer": f"https://leetcode.com/u/{username}/"
    },
    method="POST"
)

# Any request or parsing failure stops the workflow before stats.json is changed.
with urllib.request.urlopen(request, timeout=30) as response:
    result = json.load(response)

if result.get("errors"):
    raise RuntimeError(f"LeetCode GraphQL errors: {result['errors']}")

user = (result.get("data") or {}).get("matchedUser")
if not user:
    raise RuntimeError(
        "LeetCode returned no matched user. Existing stats were not changed."
    )

submission_data = (user.get("submitStats") or {}).get("acSubmissionNum")
if not isinstance(submission_data, list) or not submission_data:
    raise RuntimeError(
        "LeetCode returned missing or empty submission stats. "
        "Existing stats were not changed."
    )

counts = {}
for item in submission_data:
    difficulty = item.get("difficulty")
    count = item.get("count")

    if difficulty in ("All", "Easy", "Medium", "Hard"):
        if isinstance(count, bool) or not isinstance(count, int) or count < 0:
            raise RuntimeError(
                f"Invalid count for {difficulty}: {count!r}. "
                "Existing stats were not changed."
            )
        counts[difficulty] = count

required = ("All", "Easy", "Medium", "Hard")
missing = [key for key in required if key not in counts]
if missing:
    raise RuntimeError(
        f"LeetCode response is incomplete; missing {missing}. "
        "Existing stats were not changed."
    )

if counts["All"] != counts["Easy"] + counts["Medium"] + counts["Hard"]:
    raise RuntimeError(
        "LeetCode counts failed the consistency check. "
        "Existing stats were not changed."
    )

# Read and validate the existing file before changing any values.
stats = json.loads(stats_file.read_text(encoding="utf-8"))
if not isinstance(stats, dict):
    raise RuntimeError("stats.json must contain a JSON object.")

leetcode = stats.get("leetcode")
if not isinstance(leetcode, dict):
    raise RuntimeError(
        "stats.json has no valid leetcode object. Existing file was not changed."
    )

# Preserve TryHackMe and all other fields.
leetcode.update({
    "solved": counts["All"],
    "easy": counts["Easy"],
    "medium": counts["Medium"],
    "hard": counts["Hard"]
})

stats_file.write_text(
    json.dumps(stats, indent=2) + "\n",
    encoding="utf-8"
)

print(f"LeetCode stats successfully updated for {username}:")
print(json.dumps(leetcode, indent=2))
