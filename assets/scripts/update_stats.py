
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
        "User-Agent": "Mozilla/5.0"
    },
    method="POST"
)

with urllib.request.urlopen(request, timeout=30) as response:
    result = json.load(response)

if result.get("errors") or not result.get("data"):
    raise RuntimeError(f"LeetCode API error: {result.get('errors')}")

user = result["data"].get("matchedUser")
if not user:
    raise RuntimeError(f"LeetCode user not found: {username}")

submission_data = user.get("submitStats", {}).get("acSubmissionNum", [])
counts = {
    item["difficulty"]: item["count"]
    for item in submission_data
}

# Do not overwrite stats.json if the existing file is missing or invalid.
stats = json.loads(stats_file.read_text(encoding="utf-8"))
leetcode = stats.setdefault("leetcode", {})

leetcode.update({
    "solved": counts.get("All", 0),
    "easy": counts.get("Easy", 0),
    "medium": counts.get("Medium", 0),
    "hard": counts.get("Hard", 0)
})

stats_file.write_text(
    json.dumps(stats, indent=2) + "\n",
    encoding="utf-8"
)

print(f"Updated LeetCode stats for {username}:")
print(json.dumps(leetcode, indent=2))
