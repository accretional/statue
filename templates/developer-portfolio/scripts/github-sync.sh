#!/bin/bash

# GitHub Sync Script
# Syncs GitHub user data to site.config.js, repositories.json, and avatar

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Detect if script is in scripts/ folder or project root
if [[ "$(basename "$SCRIPT_DIR")" == "scripts" ]]; then
    ROOT_DIR="$(dirname "$SCRIPT_DIR")"
else
    ROOT_DIR="$SCRIPT_DIR"
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get username from argument or git config
if [ -n "$1" ]; then
    USERNAME="$1"
else
    USERNAME=$(git config --get user.name 2>/dev/null || echo "")
    if [ -z "$USERNAME" ]; then
        # Try to get GitHub username from remote URL
        USERNAME=$(git config --get remote.origin.url 2>/dev/null | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p' || echo "")
    fi
fi

# If still no username, prompt the user
if [ -z "$USERNAME" ]; then
    echo -e "${YELLOW}Could not detect GitHub username automatically.${NC}"
    echo -n -e "${YELLOW}Please enter your GitHub username: ${NC}"
    read USERNAME < /dev/tty

    if [ -z "$USERNAME" ]; then
        echo -e "${RED}Error: GitHub username is required.${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}Syncing GitHub data for: ${GREEN}$USERNAME${NC}"

# GitHub API helper function (uses token if available)
github_api() {
    local url="$1"
    if [ -n "$GITHUB_TOKEN" ]; then
        curl -s -H "Authorization: token $GITHUB_TOKEN" "$url"
    else
        curl -s "$url"
    fi
}

if [ -n "$GITHUB_TOKEN" ]; then
    echo -e "${GREEN}Using GitHub token for higher rate limits${NC}"
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

# Fetch user data from GitHub API
echo -e "${YELLOW}Fetching user profile...${NC}"
USER_DATA=$(github_api "https://api.github.com/users/$USERNAME")

# Check for API rate limit
if echo "$USER_DATA" | jq -e '.message | test("rate limit")' > /dev/null 2>&1; then
    echo -e "${RED}Error: GitHub API rate limit exceeded.${NC}"
    echo -e "${YELLOW}Tip: Wait an hour or use a GitHub token:${NC}"
    echo -e "  export GITHUB_TOKEN=your_token"
    echo -e "  $0 $USERNAME"
    exit 1
fi

# Check if user exists
if echo "$USER_DATA" | jq -e '.message == "Not Found"' > /dev/null 2>&1; then
    echo -e "${RED}Error: GitHub user '$USERNAME' not found.${NC}"
    exit 1
fi

# Extract user info
NAME=$(echo "$USER_DATA" | jq -r '.name // .login')
LOGIN=$(echo "$USER_DATA" | jq -r '.login')
AVATAR_URL=$(echo "$USER_DATA" | jq -r '.avatar_url')
BIO=$(echo "$USER_DATA" | jq -r '.bio // "Software Developer"')
FOLLOWERS=$(echo "$USER_DATA" | jq -r '.followers // 0')
FOLLOWING=$(echo "$USER_DATA" | jq -r '.following // 0')
LOCATION=$(echo "$USER_DATA" | jq -r '.location // ""')
BLOG=$(echo "$USER_DATA" | jq -r '.blog // ""')
COMPANY=$(echo "$USER_DATA" | jq -r '.company // ""')
EMAIL=$(echo "$USER_DATA" | jq -r '.email // ""')
TWITTER=$(echo "$USER_DATA" | jq -r '.twitter_username // ""')

echo -e "  ${GREEN}✓${NC} Found: $NAME (@$LOGIN)"

# Download avatar
echo -e "${YELLOW}Downloading avatar...${NC}"
AVATAR_PATH="$ROOT_DIR/static/avatar.jpg"
curl -sL "$AVATAR_URL" -o "$AVATAR_PATH"
echo -e "  ${GREEN}✓${NC} Avatar saved to static/avatar.jpg"

# Fetch repositories
echo -e "${YELLOW}Fetching repositories...${NC}"
REPOS_DATA=$(github_api "https://api.github.com/users/$USERNAME/repos?sort=updated&per_page=100")

# Process repositories and create JSON
REPOS_JSON=$(echo "$REPOS_DATA" | jq '[
  .[] | {
    name: .name,
    description: (.description // "No description"),
    language: (.language // "Unknown"),
    languageColor: (
      if .language == "JavaScript" then "#f1e05a"
      elif .language == "TypeScript" then "#3178c6"
      elif .language == "Python" then "#3572A5"
      elif .language == "Java" then "#b07219"
      elif .language == "Go" then "#00ADD8"
      elif .language == "Rust" then "#dea584"
      elif .language == "C++" then "#f34b7d"
      elif .language == "C" then "#555555"
      elif .language == "C#" then "#178600"
      elif .language == "Ruby" then "#701516"
      elif .language == "PHP" then "#4F5D95"
      elif .language == "Swift" then "#F05138"
      elif .language == "Kotlin" then "#A97BFF"
      elif .language == "Dart" then "#00B4AB"
      elif .language == "HTML" then "#e34c26"
      elif .language == "CSS" then "#563d7c"
      elif .language == "SCSS" then "#c6538c"
      elif .language == "Vue" then "#41b883"
      elif .language == "Svelte" then "#ff3e00"
      elif .language == "Shell" then "#89e051"
      else "#6e7681"
      end
    ),
    stars: .stargazers_count,
    forks: .forks_count,
    isPublic: (.private | not),
    link: .html_url
  }
] | sort_by(-.stars) | .[0:20]')

REPO_COUNT=$(echo "$REPOS_JSON" | jq 'length')
echo -e "  ${GREEN}✓${NC} Found $REPO_COUNT repositories"

# Save repositories.json
REPOS_PATH="$ROOT_DIR/static/repositories.json"
echo "$REPOS_JSON" | jq '.' > "$REPOS_PATH"
echo -e "  ${GREEN}✓${NC} Saved to static/repositories.json"

# Fetch contribution data
echo -e "${YELLOW}Fetching contribution graph...${NC}"
CONTRIB_RAW=$(curl -s "https://github-contributions-api.jogruber.de/v4/$USERNAME?y=last")

# Check if contribution API returned valid data
if echo "$CONTRIB_RAW" | jq -e '.contributions' > /dev/null 2>&1; then
    # Transform to our format: get last year's total and all contribution days
    CURRENT_YEAR=$(date +%Y)
    CONTRIB_JSON=$(echo "$CONTRIB_RAW" | jq --arg year "$CURRENT_YEAR" '{
        year: ($year | tonumber),
        total: (.total | to_entries | map(.value) | add),
        days: [.contributions[] | {date: .date, count: .count, level: .level}]
    }')

    CONTRIB_TOTAL=$(echo "$CONTRIB_JSON" | jq '.total')
    CONTRIB_PATH="$ROOT_DIR/static/contributions.json"
    echo "$CONTRIB_JSON" | jq '.' > "$CONTRIB_PATH"
    echo -e "  ${GREEN}✓${NC} Found $CONTRIB_TOTAL contributions"
    echo -e "  ${GREEN}✓${NC} Saved to static/contributions.json"
else
    echo -e "  ${YELLOW}⚠${NC} Could not fetch contribution data (API may be unavailable)"
fi

# Update site.config.js
echo -e "${YELLOW}Updating site.config.js...${NC}"
CONFIG_PATH="$ROOT_DIR/site.config.js"

if [ ! -f "$CONFIG_PATH" ]; then
    echo -e "${RED}Error: site.config.js not found at $CONFIG_PATH${NC}"
    exit 1
fi

# Export variables for node
export CONFIG_PATH="$CONFIG_PATH"
export GH_NAME="$NAME"
export GH_LOGIN="$LOGIN"
export GH_BIO="$BIO"
export GH_LOCATION="$LOCATION"
export GH_BLOG="$BLOG"
export GH_COMPANY="$COMPANY"
export GH_EMAIL="$EMAIL"
export GH_TWITTER="$TWITTER"
export GH_FOLLOWERS="$FOLLOWERS"
export GH_FOLLOWING="$FOLLOWING"

# Use node to update the config (more reliable than sed for JS files)
node << 'NODESCRIPT'
const fs = require('fs');
const configPath = process.env.CONFIG_PATH;

// Data from environment
const data = {
    name: process.env.GH_NAME || '',
    username: process.env.GH_LOGIN || '',
    bio: process.env.GH_BIO || '',
    location: process.env.GH_LOCATION || '',
    website: process.env.GH_BLOG || '',
    company: process.env.GH_COMPANY || '',
    email: process.env.GH_EMAIL || '',
    twitter: process.env.GH_TWITTER || '',
    followers: parseInt(process.env.GH_FOLLOWERS) || 0,
    following: parseInt(process.env.GH_FOLLOWING) || 0
};

let content = fs.readFileSync(configPath, 'utf8');

// Helper to update a string field
function updateField(content, field, value) {
    if (value === 'null' || value === null) value = '';
    // Escape backslashes, quotes, and replace newlines with spaces
    const escapedValue = (value || '')
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
    const regex = new RegExp(`(\\s*${field}:\\s*)(['"])[^'"]*\\2`, 'g');
    if (content.match(regex)) {
        return content.replace(regex, `$1'${escapedValue}'`);
    }
    return content;
}

// Helper to update a numeric field
function updateNumericField(content, field, value) {
    const regex = new RegExp(`(\\s*${field}:\\s*)\\d+`, 'g');
    if (content.match(regex)) {
        return content.replace(regex, `$1${value}`);
    }
    return content;
}

// Update profile fields
content = updateField(content, 'name', data.name);
content = updateField(content, 'username', data.username);

// Update navbar siteTitle to match profile name
content = updateField(content, 'siteTitle', data.name);
content = updateField(content, 'bio', data.bio);
content = updateField(content, 'location', data.location);
content = updateField(content, 'website', data.website);
content = updateField(content, 'company', data.company);
content = updateField(content, 'email', data.email);
content = updateField(content, 'twitter', data.twitter);

// Update numeric fields
content = updateNumericField(content, 'followers', data.followers);
content = updateNumericField(content, 'following', data.following);

fs.writeFileSync(configPath, content);
console.log('Config updated successfully');
NODESCRIPT

echo -e "  ${GREEN}✓${NC} Updated site.config.js"

# ========================================
# RANDOM THEME SELECTOR
# Updates the theme in src/lib/index.css
# ========================================
echo -e "${YELLOW}Selecting random theme...${NC}"
INDEX_CSS_PATH="$ROOT_DIR/src/lib/index.css"

# Available themes (from statue-ssg/themes/)
THEMES=(
    "black-red.css"
    "black-white.css"
    "blue.css"
    "charcoal.css"
    "cyan.css"
    "green.css"
    "orange.css"
    "pink.css"
    "purple.css"
    "red.css"
)

# Pick a random theme
RANDOM_INDEX=$((RANDOM % ${#THEMES[@]}))
SELECTED_THEME="${THEMES[$RANDOM_INDEX]}"

# Update line 3 of index.css (the theme import line)
if [ -f "$INDEX_CSS_PATH" ]; then
    # Cross-platform sed: macOS uses -i '', Linux uses -i
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "3s|@import \"statue-ssg/themes/.*\";|@import \"statue-ssg/themes/${SELECTED_THEME}\";|" "$INDEX_CSS_PATH"
    else
        sed -i "3s|@import \"statue-ssg/themes/.*\";|@import \"statue-ssg/themes/${SELECTED_THEME}\";|" "$INDEX_CSS_PATH"
    fi
    echo -e "  ${GREEN}✓${NC} Theme set to: ${BLUE}${SELECTED_THEME%.css}${NC}"
else
    echo -e "  ${YELLOW}⚠${NC} Could not find index.css at $INDEX_CSS_PATH"
fi
# ========================================
# END RANDOM THEME SELECTOR
# ========================================

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  GitHub Sync Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "  ${BLUE}Profile:${NC} $NAME (@$LOGIN)"
echo -e "  ${BLUE}Bio:${NC} $BIO"
echo -e "  ${BLUE}Location:${NC} ${LOCATION:-Not set}"
echo -e "  ${BLUE}Followers:${NC} $FOLLOWERS | ${BLUE}Following:${NC} $FOLLOWING"
echo -e "  ${BLUE}Repos:${NC} $REPO_COUNT (top 20 by stars saved)"
echo -e "  ${BLUE}Contributions:${NC} ${CONTRIB_TOTAL:-N/A}"
echo -e "  ${BLUE}Theme:${NC} ${SELECTED_THEME%.css}"
echo ""
echo -e "  ${YELLOW}Files synced:${NC}"
echo -e "    - site.config.js"
echo -e "    - static/repositories.json"
echo -e "    - static/contributions.json"
echo -e "    - static/avatar.jpg"
echo -e "    - src/lib/index.css (theme)"
echo ""
