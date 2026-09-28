## v1.2.58 — Local model connections, improved synchronization, and long-running generation

### English

#### Desktop and Web

- Docker and source deployments now support the `AUTHOR_ALLOW_PRIVATE_NETWORK` switch. When enabled for a deployment used only by you or people you trust (for example, on a NAS), Author can connect to local or LAN-hosted models such as Ollama and LM Studio, as well as WebDAV. It remains disabled by default; do not enable it for publicly reachable instances.
- Added the local model connection guide (`LOCAL_MODELS.md`), covering deployment modes, model-server settings, address configuration, and common errors. The Help page and localized README files now link to it.
- Generation timeouts now measure how long the model has gone without producing output. As long as output continues, generation is not interrupted after two minutes, allowing slower models to finish long responses.
- Improved synchronization: mobile browsers upload pending changes when sent to the background and resume uploading the next time the page opens. Large changes are uploaded in size-based batches instead of failing as one batch.
- Fixed an issue where some settings could remain unsynchronized after restoring from WebDAV, LAN sync, or a snapshot.
- Synchronization failures now explain the cause, such as authentication failure, a missing path, oversized content, or an unreachable server. A missing cloud record is no longer reported as a successful pull.
- Changes that failed to upload before an upgrade are not retried automatically. After upgrading, manually select “Sync to Cloud” (or “Push Local” for WebDAV).
- Thanks to [@inliver233](https://github.com/inliver233) for reporting several security issues and providing fixes.

---

### English

#### Desktop and Web

- Added the `AUTHOR_ALLOW_PRIVATE_NETWORK` switch for Docker and source deployments. When enabled on a deployment only you or people you trust use (e.g. on a NAS), Author can connect to local models (Ollama, LM Studio, …) and WebDAV on the same machine or LAN. It stays off by default; do not enable it on an instance reachable from the internet.
- Added a local model guide (`LOCAL_MODELS_EN.md`) covering deployment layouts, model server settings, API addresses, and common errors, with links from the in-app help and every README.
- Generation timeouts now measure how long the model has been silent. As long as the model keeps producing output, a generation is no longer cut off at 2 minutes, so slower models can finish long passages.
- Improved sync: unsynced changes upload as soon as a mobile browser moves to the background, and continue on the next visit after the page is closed. Large content is uploaded in size-based batches instead of failing as a whole.
- Fixed some lore entries never syncing to the cloud after restoring from WebDAV, LAN, or a snapshot.
- Sync failures now explain the cause (authentication failed, path not found, content too large, server unreachable, …). A pull that finds no cloud data is no longer reported as a success.
- Changes that failed to upload before this update are not re-sent automatically. After updating, click "Sync to Cloud" once (for WebDAV, "Push Local").
- Thanks to [@inliver233](https://github.com/inliver233) for reporting several security issues and proposing fixes.
