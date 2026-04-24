# wp-rss-generator

Generate an RSS feed from a password-gated WordPress site. Logs in via
`wp-login.php`, then either reuses the site's native `/feed/` endpoint
(if the site serves it to authenticated users) or falls back to scraping
the home page for post links.

> **Personal use only.** Scraping a paid site may violate its ToS. Use
> only with an account you own, and check the publisher's terms first.
> Some publishers offer official authenticated RSS — prefer that.

## Setup

```bash
cd tools/rss-generator
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env with your real credentials
```

`.env` is gitignored. Never commit real credentials.

## One-shot: generate feed.xml

```bash
set -a && source .env && set +a
python wp_rss.py --output feed.xml
```

Point your RSS reader (or your stock-analysis workflow) at the resulting
`feed.xml`. Host it behind basic auth if you put it on a server.

## Watch mode: stream new items as JSON

Emits one JSON line per new post as it appears. Pipe into anything:

```bash
python wp_rss.py --watch 300 \
  | while read -r line; do
      title=$(echo "$line" | jq -r .title)
      link=$(echo "$line"  | jq -r .link)
      # e.g. macOS notification:
      osascript -e "display notification \"$title\" with title \"Arora\" subtitle \"$link\""
      # or Slack:
      # curl -s -X POST -H 'content-type: application/json' \
      #   --data "{\"text\":\"$title\n$link\"}" "$SLACK_WEBHOOK"
    done
```

State is kept in `.seen.json` so restarts don't re-notify. Delete that
file to backfill notifications for everything currently on the site.

## Options

| Flag / env | Default | Purpose |
| --- | --- | --- |
| `--site` / `WP_SITE` | — | Base URL, e.g. `https://zyxbuyfeed.thearorareport.com/` |
| `--username` / `WP_USERNAME` | — | WP login |
| `--password` / `WP_PASSWORD` | — | WP password |
| `--output` / `WP_RSS_OUTPUT` | `feed.xml` | Path to write RSS |
| `--feed-title` / `WP_FEED_TITLE` | `WordPress Feed` | Channel `<title>` |
| `--selector` / `WP_SELECTOR` | `article` | CSS selector for post cards (fallback scraper only) |
| `--limit` / `WP_LIMIT` | `20` | Max items |
| `--watch` | `0` | Poll interval in seconds (0 = one-shot) |
| `--state` / `WP_STATE` | `.seen.json` | Seen-guids state file |

## Troubleshooting

- **`Login failed: no wordpress_logged_in cookie`** — the site probably
  uses a custom membership plugin (MemberPress, Paid Memberships Pro,
  Members, Restrict Content Pro) that doesn't use `wp-login.php`. Open
  the login page in a browser with devtools → Network, submit the form,
  and check where the POST goes. You'll need to point the script at
  that URL and adjust field names in `login()`.
- **`/feed/` returns a login page** — expected on gated sites. The
  script falls back to scraping. Use `--selector` to target the right
  CSS class if the default `article` matcher picks up nav/sidebar items.
- **Cloudflare / bot challenge** — this script can't solve JS challenges.
  If the site is behind one, use a browser-automation tool like
  Playwright instead.

## Security notes

- Put `.env` on disk with `chmod 600`.
- If running on a shared machine, consider a secrets manager (1Password
  CLI, `pass`, macOS Keychain via `security find-generic-password`).
- Rotate your WordPress password periodically; the script only needs
  read access.
