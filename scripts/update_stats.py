
import json
import urllib.request
from pathlib import Path

USERNAME = "sohan_34"
API_URL = f"https://alfa-leetcode-api.onrender.com/{USERNAME}/solved"
STATS_FILE = Path("stats.json")


def valid_count(value, field):
    # Reject missing values, booleans, strings, negatives, and invalid data.
    if type(value) is not int or value < 0:
        raise ValueError(f"Invalid {field}: {value!r}")
    return value


# Fetch using the SAME API and field names as the working JavaScript.
request = urllib.request.Request(
    API_URL,
    headers={"User-Agent": "Mozilla/5.0"}
)

with urllib.request.urlopen(request, timeout=45) as response:
    if response.status != 200:
        raise RuntimeError(f"LeetCode API returned HTTP {response.status}")
    data = json.load(response)

if not isinstance(data, dict):
    raise RuntimeError("Unexpected API response. stats.json was not changed.")

# Require all three difficulty fields instead of silently defaulting to zero.
required_fields = ("easySolved", "mediumSolved", "hardSolved")
missing = [key for key in required_fields if key not in data]
if missing:
    raise RuntimeError(
        f"API response is missing {missing}. Existing stats were preserved."
    )

easy = valid_count(data["easySolved"], "easySolved")
medium = valid_count(data["mediumSolved"], "mediumSolved")
hard = valid_count(data["hardSolved"], "hardSolved")

total = data.get("solvedProblem")
if total is None:
    total = easy + medium + hard
else:
    total = valid_count(total, "solvedProblem")

# Never accept an all-zero response from this endpoint.
if total == 0 or easy + medium + hard == 0:
    raise RuntimeError(
        "API returned zero solved problems. Refusing to overwrite saved stats."
    )

# Read the existing file before making any changes.
stats = json.loads(STATS_FILE.read_text(encoding="utf-8"))
if not isinstance(stats, dict) or not isinstance(stats.get("leetcode"), dict):
    raise RuntimeError("Invalid stats.json structure. Existing file was preserved.")

# Additional protection against unexpected drops to zero or lower totals.
old = stats["leetcode"]
old_total = old.get("solved", 0)

if type(old_total) is int and old_total > 0 and total < old_total:
    raise RuntimeError(
        f"API total ({total}) is below saved total ({old_total}). "
        "Refusing to overwrite existing stats."
    )

# Change ONLY LeetCode count fields. Keep TryHackMe and other data unchanged.
stats["leetcode"].update({
    "solved": total,
    "easy": easy,
    "medium": medium,
    "hard": hard
})

STATS_FILE.write_text(
    json.dumps(stats, indent=2) + "\n",
    encoding="utf-8"
)

print("LeetCode stats updated successfully:")
print(json.dumps(stats["leetcode"], indent=2))
