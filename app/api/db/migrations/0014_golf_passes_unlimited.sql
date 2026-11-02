-- This year's Golf Tournament passes are not limited: null quantities mean unlimited bookings. A "N left" note on the card goes back to the pass's default note.
UPDATE "event_passes" SET "total_quantity" = NULL, "available_quantity" = NULL,
  "status_note" = CASE WHEN "status_note" ~ '^[0-9]+ left$' THEN CASE WHEN "includes_spouse" THEN 'You and your spouse' ELSE 'Just you' END ELSE "status_note" END,
  "updated_at" = now()
WHERE "event_name" = 'golf-tournament';
