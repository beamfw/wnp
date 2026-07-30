# WNP Protocol Specification v2.0

The Web Node Protocol (WNP v2.0) defines a standardized header interface and status exchange model over HTTP/1.1, HTTP/2, and HTTP/3.

## Standard HTTP Headers

WNP introduces standard custom headers with prefix `x-wnp-`:

### Request Headers

| Header | Type | Description |
|---|---|---|
| `x-wnp-version` | `string` | Protocol version supported by client (e.g. `2.0`). |
| `x-wnp-client-type` | `string` | Client classification (`ai_scraper`, `search_bot`, `human_browser`, `agent`). |
| `x-wnp-token` | `string` | Cryptographic access token issued during handshake. |
| `x-wnp-challenge-response` | `string` | Solution token to a proof-of-work challenge. |

### Response Headers

| Header | Type | Description |
|---|---|---|
| `x-wnp-version` | `string` | Protocol version supported by server (`2.0`). |
| `x-wnp-node-id` | `string` | Unique identification ID of the origin WNP node. |
| `x-wnp-policy` | `string` | Policy type applied (`free`, `attribution`, `rate_limit`, `license`, `non_commercial`). |
| `x-wnp-attribution` | `string` | Mandatory attribution text string to be retained by AI models. |
| `x-wnp-token` | `string` | Cryptographic token granting access. |
| `x-wnp-challenge` | `string` | Proof-of-work puzzle challenge string if rate-limited. |

---

## Status Codes

| Status Code | Meaning | WNP Context |
|---|---|---|
| `200 OK` | Access Granted | Content served with WNP attribution headers. |
| `402 Payment Required` | License / Payment Required | Client must present valid commercial license. |
| `403 Forbidden` | Access Denied | Path or bot classification blocked by creator policy. |
| `429 Too Many Requests` | Rate Limited | Token bucket exhausted; `x-wnp-challenge` header included. |
