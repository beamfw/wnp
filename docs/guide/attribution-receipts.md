# Cryptographic Attribution Receipts

WNP issues cryptographically signed access tokens and attribution receipts (`x-wnp-token`) whenever content is requested under attribution or licensed policies.

## Attribution Receipt Lifecycle

1. **Token Issuance**: When an AI client or crawler requests content, `TokenIssuer` signs a token containing:
   - Node ID (`siteName`, `domain`)
   - Resource Path
   - Timestamp & Expiry
   - Mandatory Attribution String
2. **Verification**: Downstream consumers (e.g. RAG pipelines, training aggregators) verify the receipt using `TokenVerifier.verify()`.
3. **Audit Trail**: Provides verifiable proof of consent and compliance during content ingestion.
