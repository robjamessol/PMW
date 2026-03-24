# Project Instructions

## Deployment

After pushing any changes to the feature branch, ALWAYS also deploy to gh-pages:
1. `git checkout gh-pages`
2. Copy changed files from the feature branch: `git checkout <feature-branch> -- <changed-files>`
3. If files live under `website/` on the feature branch but at root on gh-pages, copy accordingly (e.g. `cp website/styles.css styles.css`)
4. Stage, commit, and push to gh-pages
5. Switch back to the feature branch
6. Restore any files that show as deleted after the branch switch (`git restore <file>`)

This ensures every change goes live immediately.
