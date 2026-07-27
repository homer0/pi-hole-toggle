# Pi-hole Toggle

I'm too lazy to log into the Pi-hole admin page, scroll, open the menu, and click the disable button.

## Release workflow

Push normal changes to Forgejo (`origin`). Its Actions workflow runs checks, fast-forwards GitHub (`github`), then publishes the `latest` image to the local registry.

### Manual history rewrites

The workflow never force-pushes to GitHub. If a history rewrite is required, force-push the rewritten branch to GitHub first, then push the same history to Forgejo:

```sh
git push --force-with-lease github main
git push --force-with-lease origin main
```
