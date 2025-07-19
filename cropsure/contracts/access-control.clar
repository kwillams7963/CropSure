;; CropSure Access Control Contract
;; Version: 1.1 - Hardened security and strict admin control
;; Handles authorization of trusted participants (farmers, coops, oracles)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Storage
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; Contract deployer is the initial admin
(define-data-var admin principal tx-sender)

;; Map of verified entities
(define-map verified-entities principal bool)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Constants
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-VERIFIED u101)
(define-constant ERR-NOT-FOUND u102)
(define-constant ERR-CANNOT-REMOVE-SELF u103)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Private Helpers
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define-private (is-admin)
  (is-eq tx-sender (var-get admin)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Public Functions
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; Verify a new entity (farmer, coop, oracle)
(define-public (add-entity (entity principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-none (map-get? verified-entities entity)) (err ERR-ALREADY-VERIFIED))
    (map-set verified-entities entity true)
    (ok true)
  )
)

;; Remove a verified entity (admin cannot remove self to prevent lock-out)
(define-public (remove-entity (entity principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (is-some (map-get? verified-entities entity)) (err ERR-NOT-FOUND))
    (asserts! (not (is-eq entity tx-sender)) (err ERR-CANNOT-REMOVE-SELF))
    (map-delete verified-entities entity)
    (ok true)
  )
)

;; Admin transfers admin role to another principal
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (print {action: "admin-transfer", from: tx-sender, to: new-admin})
    (var-set admin new-admin)
    (ok true)
  )
)

;; Check verification status (read-only)
(define-read-only (is-verified (entity principal))
  (default-to false (map-get? verified-entities entity)))

;; View current admin (read-only)
(define-read-only (get-admin)
  (ok (var-get admin)))
