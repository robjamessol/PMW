#!/usr/bin/env python3
"""Generate an RSS feed from a password-gated WordPress site.

Logs in via wp-login.php, then either reuses the native /feed/ endpoint
(if accessible once authenticated) or scrapes the home page for posts.
Writes RSS 2.0 to --output. Use --watch to poll and print new items as
newline-delimited JSON so you can pipe them into a notifier.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from email.utils import format_datetime, parsedate_to_datetime
from pathlib import Path
from typing import Iterable
from urllib.parse import urljoin, urlparse
from xml.sax.saxutils import escape

import requests
from bs4 import BeautifulSoup

USER_AGENT = "wp-rss-generator/1.0 (+personal-use)"


@dataclass
class Post:
    guid: str
    title: str
    link: str
    description: str
    pub_date: datetime

    def to_rss_item(self) -> str:
        return (
            "<item>"
            f"<title>{escape(self.title)}</title>"
            f"<link>{escape(self.link)}</link>"
            f"<guid isPermaLink=\"false\">{escape(self.guid)}</guid>"
            f"<pubDate>{format_datetime(self.pub_date)}</pubDate>"
            f"<description>{escape(self.description)}</description>"
            "</item>"
        )


def login(session: requests.Session, site: str, username: str, password: str) -> None:
    login_url = urljoin(site, "/wp-login.php")
    session.get(login_url, timeout=30)
    resp = session.post(
        login_url,
        data={
            "log": username,
            "pwd": password,
            "wp-submit": "Log In",
            "redirect_to": site,
            "testcookie": "1",
        },
        timeout=30,
        allow_redirects=True,
    )
    resp.raise_for_status()
    if "wordpress_logged_in" not in " ".join(session.cookies.keys()):
        raise RuntimeError(
            "Login failed: no wordpress_logged_in cookie. Check credentials "
            "or whether the site uses a custom login flow (e.g. Members, MemberPress, Paid Memberships Pro)."
        )


def fetch_native_feed(session: requests.Session, site: str) -> list[Post] | None:
    feed_url = urljoin(site, "/feed/")
    resp = session.get(feed_url, timeout=30)
    if resp.status_code != 200 or "<rss" not in resp.text.lower():
        return None
    soup = BeautifulSoup(resp.text, "xml")
    posts: list[Post] = []
    for item in soup.find_all("item"):
        title = (item.title.text if item.title else "").strip()
        link = (item.link.text if item.link else "").strip()
        guid = (item.guid.text if item.guid else link).strip()
        desc_tag = item.find("description")
        description = desc_tag.text.strip() if desc_tag else ""
        pub_tag = item.find("pubDate")
        try:
            pub_date = parsedate_to_datetime(pub_tag.text) if pub_tag else datetime.now(tz=timezone.utc)
        except (TypeError, ValueError):
            pub_date = datetime.now(tz=timezone.utc)
        if pub_date.tzinfo is None:
            pub_date = pub_date.replace(tzinfo=timezone.utc)
        posts.append(Post(guid=guid, title=title, link=link, description=description, pub_date=pub_date))
    return posts or None


def fetch_via_scrape(session: requests.Session, site: str, selector: str, limit: int) -> list[Post]:
    resp = session.get(site, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    articles = soup.select(selector)[:limit] if selector else soup.find_all("article")[:limit]
    posts: list[Post] = []
    for art in articles:
        link_tag = art.find("a", href=True)
        if not link_tag:
            continue
        link = urljoin(site, link_tag["href"])
        title_tag = art.find(["h1", "h2", "h3"]) or link_tag
        title = title_tag.get_text(strip=True)
        if not title:
            continue
        excerpt_tag = art.find(["p", "div"], class_=re.compile(r"(excerpt|entry-summary|summary)"))
        description = excerpt_tag.get_text(" ", strip=True) if excerpt_tag else ""
        time_tag = art.find("time")
        pub_date = datetime.now(tz=timezone.utc)
        if time_tag and time_tag.get("datetime"):
            try:
                pub_date = datetime.fromisoformat(time_tag["datetime"].replace("Z", "+00:00"))
            except ValueError:
                pass
        guid = hashlib.sha1(link.encode()).hexdigest()
        posts.append(Post(guid=guid, title=title, link=link, description=description, pub_date=pub_date))
    return posts


def build_rss(site: str, title: str, posts: Iterable[Post]) -> str:
    now = format_datetime(datetime.now(tz=timezone.utc))
    items = "".join(p.to_rss_item() for p in posts)
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<rss version="2.0"><channel>'
        f"<title>{escape(title)}</title>"
        f"<link>{escape(site)}</link>"
        f"<description>{escape(title)} (generated)</description>"
        f"<lastBuildDate>{now}</lastBuildDate>"
        f"{items}"
        "</channel></rss>"
    )


def load_seen(path: Path) -> set[str]:
    if not path.exists():
        return set()
    try:
        return set(json.loads(path.read_text()))
    except json.JSONDecodeError:
        return set()


def save_seen(path: Path, guids: set[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(sorted(guids)))


def fetch_posts(session: requests.Session, site: str, selector: str, limit: int) -> list[Post]:
    posts = fetch_native_feed(session, site)
    if posts:
        return posts[:limit]
    return fetch_via_scrape(session, site, selector, limit)


def run_once(args: argparse.Namespace, session: requests.Session) -> list[Post]:
    posts = fetch_posts(session, args.site, args.selector, args.limit)
    if args.output:
        Path(args.output).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output).write_text(build_rss(args.site, args.feed_title, posts))
    return posts


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", default=os.getenv("WP_SITE"), help="Base URL, e.g. https://example.com/")
    parser.add_argument("--username", default=os.getenv("WP_USERNAME"))
    parser.add_argument("--password", default=os.getenv("WP_PASSWORD"))
    parser.add_argument("--output", default=os.getenv("WP_RSS_OUTPUT", "feed.xml"))
    parser.add_argument("--feed-title", default=os.getenv("WP_FEED_TITLE", "WordPress Feed"))
    parser.add_argument("--selector", default=os.getenv("WP_SELECTOR", ""), help="CSS selector for post cards (fallback scraper)")
    parser.add_argument("--limit", type=int, default=int(os.getenv("WP_LIMIT", "20")))
    parser.add_argument("--watch", type=int, default=0, help="Poll every N seconds and print new items as JSONL")
    parser.add_argument("--state", default=os.getenv("WP_STATE", ".seen.json"), help="Path to seen-guids file (for --watch)")
    args = parser.parse_args()

    if not args.site or not args.username or not args.password:
        parser.error("site, username, and password are required (args or WP_SITE/WP_USERNAME/WP_PASSWORD env)")

    parsed = urlparse(args.site)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        parser.error(f"invalid --site URL: {args.site!r}")

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})
    login(session, args.site, args.username, args.password)

    if args.watch <= 0:
        posts = run_once(args, session)
        print(f"Wrote {len(posts)} items to {args.output}", file=sys.stderr)
        return 0

    state_path = Path(args.state)
    seen = load_seen(state_path)
    while True:
        try:
            posts = run_once(args, session)
            new_posts = [p for p in posts if p.guid not in seen]
            for p in new_posts:
                row = asdict(p)
                row["pub_date"] = p.pub_date.isoformat()
                print(json.dumps(row), flush=True)
                seen.add(p.guid)
            if new_posts:
                save_seen(state_path, seen)
        except requests.RequestException as exc:
            print(f"fetch error: {exc}", file=sys.stderr)
        except RuntimeError as exc:
            print(f"auth error: {exc}", file=sys.stderr)
            try:
                login(session, args.site, args.username, args.password)
            except Exception as relog:
                print(f"re-login failed: {relog}", file=sys.stderr)
        time.sleep(args.watch)


if __name__ == "__main__":
    sys.exit(main())
